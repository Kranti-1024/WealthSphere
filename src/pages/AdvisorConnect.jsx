import React from 'react';
import FadeIn from '../components/FadeIn';
import { Calendar, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdvisorConnect = () => {
  const handleBooking = (time) => {
    toast.success(`Meeting successfully scheduled with Vikram for ${time}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white transition-colors">Advisor Connect</h1>
        <p className="text-gray-400 mt-1">Schedule a portfolio review or get tailored financial advice.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeIn delay={100}>
          <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5">
            <div className="flex items-start gap-4">
              <img 
                src="https://i.pravatar.cc/150?img=59"
                alt="Relationship Manager"
                className="w-20 h-20 rounded-full border-2 border-gray-100 dark:border-gray-800 shadow-lg shadow-black/20"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-100">Vikram Singh</h2>
                <p className="text-sm text-gray-400 font-medium">Senior Wealth Manager</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">IDBI Wealth Management</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Phone size={16} />
                </div>
                <span className="font-medium text-gray-100 font-number">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Mail size={16} />
                </div>
                <span className="font-medium text-gray-100">vikram.singh@idbi.com</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <h3 className="text-sm font-semibold text-gray-100 mb-4">Upcoming Availability</h3>
              <div className="space-y-3">
                {['Tomorrow, 10:00 AM', 'Tomorrow, 02:30 PM', 'Thursday, 11:00 AM'].map((time, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg hover:border-blue-550 dark:hover:border-blue-400 transition-colors group cursor-pointer" onClick={() => handleBooking(time)}>
                     <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <Clock size={16} />
                      <span>{time}</span>
                    </div>
                    <button className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded">
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5 h-full">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-(--color-accent)" />
              Request a specific time
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input type="date" className="w-full p-2.5 bg-gray-50 dark:bg-(--color-background-app) text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Preference</label>
                <select className="w-full p-2.5 bg-gray-50 dark:bg-(--color-background-app) text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option>Morning (10 AM - 12 PM)</option>
                  <option>Afternoon (1 PM - 4 PM)</option>
                  <option>Evening (4 PM - 6 PM)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic of Discussion</label>
                <textarea rows="3" placeholder="E.g., Reviewing my SIP performance..." className="w-full p-2.5 bg-gray-50 dark:bg-(--color-background-app) text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
              </div>
              <button 
                onClick={() => handleBooking('your requested time')}
                className="w-full py-3 bg-(--color-primary) dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-black/20"
              >
                Send Request
              </button>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default AdvisorConnect;
