import React from 'react';
import FadeIn from '../components/FadeIn';
import { Download, FileText, UploadCloud, FolderLock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DocumentVault = () => {
  const docs = [
    { id: 1, name: 'PAN Card', type: 'PDF', size: '1.2 MB', date: '15 May 2025' },
    { id: 2, name: 'Aadhaar Card', type: 'PDF', size: '2.1 MB', date: '10 May 2025' },
    { id: 3, name: 'Cancelled Cheque', type: 'JPG', size: '0.8 MB', date: '01 Apr 2025' },
    { id: 4, name: 'Demat Account Statement', type: 'PDF', size: '3.4 MB', date: '31 Mar 2025' }
  ];

  const handleDownload = (docName) => {
    toast.success(`Downloading ${docName}...`);
  };

  const handleUpload = () => {
    toast('Opening file picker...', {
      icon: '📂',
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white transition-colors">Document Vault</h1>
          <p className="text-gray-400 mt-1">Securely store and manage your KYC and banking documents.</p>
        </div>
        <button 
          onClick={handleUpload}
          className="flex items-center gap-2 bg-(--color-primary) dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-black/20"
        >
          <UploadCloud size={20} />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {docs.map((doc, idx) => (
          <FadeIn key={doc.id} delay={100 * (idx + 1)}>
            <div className="bg-[#0A111A] p-5 rounded-xl shadow-lg shadow-black/20 border border-white/5 flex flex-col justify-between h-full transition-all hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-white dark:text-blue-400">
                    {doc.id === 3 ? <FileText size={24} /> : <FolderLock size={24} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-100">{doc.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{doc.type} • {doc.size}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500 font-medium">Updated: {doc.date}</span>
                <button 
                  onClick={() => handleDownload(doc.name)}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default DocumentVault;
