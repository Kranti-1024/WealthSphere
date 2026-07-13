import React from 'react';
import FadeIn from '../components/FadeIn';
import { Download, FileText, Calculator, Landmark } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MaskedAmount from '../components/MaskedAmount';

const TaxCenter = () => {
  const taxDocs = [
    { id: 1, name: 'Form 16 (FY 2024-25)', type: 'PDF', size: '1.2 MB', date: '15 May 2025' },
    { id: 2, name: 'Capital Gains Statement', type: 'PDF', size: '0.8 MB', date: '10 May 2025' },
    { id: 3, name: 'Interest Certificate', type: 'PDF', size: '0.5 MB', date: '01 Apr 2025' },
    { id: 4, name: 'TDS Summary', type: 'PDF', size: '0.9 MB', date: '31 Mar 2025' }
  ];

  const handleDownload = (docName) => {
    toast.success(`Downloading ${docName}...`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white transition-colors">Tax Center</h1>
        <p className="text-gray-400 mt-1">Manage your tax liabilities and download important documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Tax Summary Widget */}
        <FadeIn delay={100} className="lg:col-span-1">
          <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-white dark:text-blue-400">
                <Calculator size={20} />
              </div>
              <h2 className="text-lg font-semibold text-white">Tax Summary</h2>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <p className="text-sm text-gray-400 mb-1">Estimated Tax Liability</p>
                <div className="text-2xl font-bold text-gray-100">
                   <MaskedAmount amount={125000} className="font-number" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Deductions Claimed</p>
                <div className="text-xl font-medium text-green-600 dark:text-green-400">
                   <MaskedAmount amount={150000} className="font-number" />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5">
              <button onClick={() => toast.success('Redirecting to payment gateway...')} className="w-full py-2.5 bg-(--color-primary) dark:bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors">
                Pay Advance Tax
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Documents List */}
        <FadeIn delay={200} className="lg:col-span-2">
          <div className="bg-[#0A111A] rounded-xl shadow-lg shadow-black/20 border border-white/5 h-full overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Landmark size={20} className="text-(--color-accent)" />
                Tax Documents
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Document Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--color-border)">
                  {taxDocs.map((doc, idx) => (
                    <tr key={doc.id} className={`transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/30 ${idx % 2 === 0 ? 'bg-[#0A111A]' : 'bg-gray-50/30 dark:bg-slate-900/20'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-100">{doc.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-450">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{doc.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => handleDownload(doc.name)}
                          className="p-2 text-blue-650 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default TaxCenter;
