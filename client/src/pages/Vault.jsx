import React, { useState, useRef } from 'react';
import { Shield, Upload, FileText, Trash2, Download, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAPI } from '../hooks/useAPI';
import toast from 'react-hot-toast';
import FadeIn from '../components/FadeIn';

const documentTypes = [
  { id: 'PAN', label: 'PAN Card' },
  { id: 'Aadhar', label: 'Aadhar Card' },
  { id: 'Tax Return', label: 'ITR / Tax Return' },
  { id: 'Insurance', label: 'Insurance Policy' },
  { id: 'Other', label: 'Other Document' }
];

const Vault = () => {
  const { documents, refreshData } = useData();
  const { request, loading: isDeleting } = useAPI();
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('PAN');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Please select a file to upload");
    if (!title) return toast.error("Please enter a document title");

    setIsUploading(true);
    
    // We cannot use useAPI for FormData easily since useAPI assumes JSON
    // We will use native fetch for this multipart/form-data request
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('documentType', docType);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Document safely stored in Vault");
        setSelectedFile(null);
        setTitle('');
        setDocType('PAN');
        if (fileInputRef.current) fileInputRef.current.value = "";
        refreshData();
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Network error during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this document?")) {
      try {
        await request(`/documents/${id}`, 'DELETE');
        toast.success("Document deleted");
        refreshData();
      } catch (e) {
        toast.error("Failed to delete document");
      }
    }
  };

  const handleDownload = (fileUrl, fileName) => {
    // Construct the full URL
    const url = `/api${fileUrl}`;
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // Try to force download
    a.target = '_blank'; // Fallback to opening in new tab
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Shield className="text-[var(--positive)]" size={28} />
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Secure Vault</h1>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">Military-grade encryption for your essential financial documents.</p>
          </div>
          <div className="flex items-center gap-2 bg-[var(--positive)]/10 text-[var(--positive)] px-4 py-2 rounded-lg text-sm font-semibold border border-[var(--positive)]/20">
            <CheckCircle size={16} />
            DigiLocker Synced
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Section */}
        <FadeIn delay={100} className="lg:col-span-1">
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] sticky top-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Upload size={18} />
              Upload Document
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Document Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. My PAN Card"
                  className="w-full px-4 py-2.5 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Document Type</label>
                <select 
                  value={docType}
                  onChange={e => setDocType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors appearance-none"
                >
                  {documentTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  dragActive ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border-color)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-app)]'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="text-[var(--accent)]" size={32} />
                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 break-all px-2">{selectedFile.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{formatFileSize(selectedFile.size)}</p>
                    <button 
                      type="button" 
                      onClick={() => setSelectedFile(null)}
                      className="text-xs text-[var(--negative)] mt-2 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center gap-3 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-app)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)]">
                      <Upload size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">Click to upload or drag & drop</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">PDF, JPG, PNG (Max 10MB)</p>
                    </div>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={!selectedFile || !title || isUploading}
                className="w-full py-3 bg-[var(--accent)] hover:bg-[#009688] text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                {isUploading ? 'Encrypting & Uploading...' : 'Secure Upload'}
              </button>
            </form>
          </div>
        </FadeIn>

        {/* Document List */}
        <FadeIn delay={200} className="lg:col-span-2">
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] h-full">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <FileText size={18} />
              Your Documents
            </h2>

            {documents && documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-[var(--border-color)] rounded-xl p-4 hover:border-[var(--accent)]/50 transition-colors group flex flex-col justify-between h-full bg-[var(--bg-app)]/50">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          {doc.documentType}
                        </div>
                        <div className="flex items-center gap-1 text-[var(--positive)] text-xs font-medium">
                          <CheckCircle size={12} />
                          Verified
                        </div>
                      </div>
                      <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-1">{doc.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mb-4">{new Date(doc.uploadDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-color)]">
                      <span className="text-xs text-[var(--text-secondary)] font-number">
                        {formatFileSize(doc.fileSize)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDownload(doc.fileUrl, doc.fileName)}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          disabled={isDeleting}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--negative)] hover:bg-[var(--negative)]/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-[var(--border-color)] rounded-xl">
                <Shield className="text-[var(--text-secondary)] opacity-50 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">Vault is empty</h3>
                <p className="text-[var(--text-secondary)] text-sm mt-1 max-w-xs">Upload your PAN, Aadhar, and other essential documents to keep them secure.</p>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Vault;