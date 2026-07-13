import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Mail, Phone, MessageSquare } from 'lucide-react';

const HelpCenterModal = ({ isOpen, onClose }) => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: 'How do I update my KYC details?',
      answer: 'To update your KYC details, navigate to the Document Vault in the sidebar. Click on "Upload Document" and submit your latest PAN or Aadhaar card. Your Relationship Manager will verify it within 24 hours.'
    },
    {
      question: 'How is my Risk Profile assessed?',
      answer: 'Your risk profile is dynamically calculated based on the answers you provide in the Assessment section. It evaluates your investment horizon, financial goals, and tolerance for market volatility to suggest an optimal asset allocation.'
    },
    {
      question: 'What are the charges for mutual fund SIPs?',
      answer: 'WealthSphere operates on a zero-commission model for all direct mutual funds. There are no entry loads or hidden brokerage fees. You only pay the standard expense ratio charged by the AMC.'
    },
    {
      question: 'How do I contact my Relationship Manager?',
      answer: 'You can contact your RM directly from the Advisor Connect page. There, you will find their phone number, email address, and an interface to book a 1-on-1 portfolio review session.'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0A111A] w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-zoom-in border border-gray-100 dark:border-white/5 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">Help Center</h2>
            <p className="text-sm text-gray-400 mt-1">Frequently asked questions and support</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-base font-semibold text-gray-100 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-white/5 rounded-lg overflow-hidden">
                <button 
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors text-left"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                >
                  <span className="font-medium text-gray-100">{faq.question}</span>
                  {openFaq === idx ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-[#0A111A] text-sm text-gray-400 leading-relaxed border-t border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3 className="text-base font-semibold text-gray-100 mt-8 mb-4">Contact Support</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 border border-white/5 rounded-xl text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                <Phone size={20} />
              </div>
              <h4 className="font-medium text-gray-100 text-sm">Call Us</h4>
              <p className="text-xs text-gray-400 mt-1">1800-425-4444</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border border-white/5 rounded-xl text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                <Mail size={20} />
              </div>
              <h4 className="font-medium text-gray-100 text-sm">Email Us</h4>
              <p className="text-xs text-gray-400 mt-1">support@idbiwealth.com</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border border-white/5 rounded-xl text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                <MessageSquare size={20} />
              </div>
              <h4 className="font-medium text-gray-100 text-sm">Live Chat</h4>
              <p className="text-xs text-gray-400 mt-1">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterModal;
