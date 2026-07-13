import { useData } from '../context/DataContext';
import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle2, AlertCircle, TrendingUp, ShieldAlert } from 'lucide-react';


const NotificationCenter = () => {
  const { mockData } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'FD Maturing Soon', desc: 'Your IDBI FD of ₹3,000,000 matures in 7 days.', type: 'alert', read: false },
    { id: 2, title: 'Salary Credited', desc: '₹85,000 credited to account XX-8821.', type: 'success', read: false },
    { id: 3, title: 'SIP Processed', desc: '₹20,000 invested in HDFC Flexi Cap.', type: 'info', read: false },
    { id: 4, title: 'Goal Milestone', desc: 'You reached 30% of your House Downpayment goal!', type: 'success', read: true },
    { id: 5, title: 'Unusual Spending', desc: 'Dining spend is 42% higher this month.', type: 'warning', read: true }
  ]);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-(--color-positive)" />;
      case 'warning': return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-(--color-negative)" />;
      default: return <TrendingUp className="w-5 h-5 text-(--color-accent)" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-(--color-negative) rounded-full ring-2 ring-white dark:ring-(--color-card-surface)"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0A111A] rounded-xl shadow-xl border border-white/5 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/30">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs font-medium text-(--color-accent) hover:underline">
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 border-b border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
              >
                <div className="shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${!notif.read ? 'text-white' : 'text-gray-100'}`}>
                    {notif.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {notif.desc}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 bg-(--color-accent) rounded-full shrink-0 ml-auto mt-1"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-3 text-center border-t border-white/5 bg-gray-50/50 dark:bg-slate-800/30">
            <button className="text-sm font-medium text-gray-400 hover:text-white dark:hover:text-white transition-colors">
              View all activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
