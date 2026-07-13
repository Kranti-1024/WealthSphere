import React, { useContext } from 'react';
import { X, Moon, Sun, Bell, Shield, Globe } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { PrivacyContext } from '../context/PrivacyContext';

const SettingsModal = ({ isOpen, onClose }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { isPrivacyMode, togglePrivacy } = useContext(PrivacyContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0A111A] w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-zoom-in border border-gray-100 dark:border-white/5">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-605 dark:text-gray-300">
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-100">Dark Mode</h3>
                <p className="text-xs text-gray-400">Toggle dark/light theme</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleTheme} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-(--color-accent)"></div>
            </label>
          </div>

          {/* Privacy Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-650 dark:text-gray-300">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-100">Privacy Mode</h3>
                <p className="text-xs text-gray-400">Mask financial balances</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isPrivacyMode} onChange={togglePrivacy} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-(--color-accent)"></div>
            </label>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-805 flex items-center justify-center text-gray-605 dark:text-gray-300">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-100">Email Notifications</h3>
                <p className="text-xs text-gray-400">Receive daily summaries</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-(--color-accent)"></div>
            </label>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-650 dark:text-gray-300">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-100">Language</h3>
                <p className="text-xs text-gray-400">English (IN)</p>
              </div>
            </div>
            <button className="text-sm font-medium text-(--color-accent) hover:text-(--color-accent)/80">
              Change
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-gray-50 dark:bg-(--color-background-app)">
          <button onClick={onClose} className="w-full py-2.5 bg-(--color-primary) dark:bg-blue-650 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-xl transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
