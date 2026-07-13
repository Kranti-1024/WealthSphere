import { useData } from '../context/DataContext';
import React from 'react';

import FadeIn from '../components/FadeIn';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useData();
  return (
    <FadeIn className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-(--color-accent) flex items-center justify-center overflow-hidden border-4 border-white dark:border-white/5 shadow-lg">
          <span className="text-3xl text-white font-bold">
            {user.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white transition-colors">{user.name}</h1>
          <p className="text-gray-400 mt-1">{user.accountType}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-[#0A111A] rounded-xl shadow-lg shadow-black/20 border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="font-medium text-gray-100">kranti.d@idbi.com</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Phone</p>
              <p className="font-medium text-gray-100 font-number">+91 98765 43210</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Address</p>
              <p className="font-medium text-gray-100">IDBI Tower, WTC Complex, Cuffe Parade, Mumbai</p>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-[#0A111A] rounded-xl shadow-lg shadow-black/20 border border-white/5 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Account Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Customer ID</p>
              <p className="font-medium text-gray-100 font-number">IDBI847593</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Primary Account</p>
              <p className="font-medium text-gray-100 font-number">XXXX XXXX 1234</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Last Login</p>
              <p className="font-medium text-gray-100">
                {new Date(user.lastLogin).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Security & Preferences */}
        <div className="bg-[#0A111A] rounded-xl shadow-lg shadow-black/20 border border-white/5 p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Security & Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg">
              <div>
                <p className="font-medium text-gray-100">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Enabled via SMS</p>
              </div>
              <button onClick={() => toast.success('Security settings unlocked.')} className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white font-medium">
                Manage
              </button>
            </div>
            <div className="flex items-center justify-between p-4 border border-white/5 rounded-lg">
              <div>
                <p className="font-medium text-gray-100">Risk Profile</p>
                <p className="text-sm text-gray-400">{user.riskProfile || 'Moderate'}</p>
              </div>
              <Link to="/assessment" className="px-4 py-2 text-sm bg-(--color-accent) hover:bg-teal-600 text-white rounded-md transition-colors font-medium">
                Retake Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default UserProfile;
