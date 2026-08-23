import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const formatDistanceToNow = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }
    setIsOpen(false);
    navigate('/dashboard');
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="relative flex items-center justify-center p-2 rounded-full hover:bg-surface-container transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-surface-container-high rounded-xl shadow-2xl border border-white/10 z-50 flex flex-col">
          <div className="sticky top-0 bg-surface-container-high border-b border-white/5 p-4 flex justify-between items-center z-10">
            <h3 className="font-bold text-on-surface">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-label-sm text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="flex flex-col">
            {loading ? (
              <div className="p-4 text-center text-on-surface-variant text-body-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[32px] opacity-50">notifications_paused</span>
                <p className="text-body-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-4 border-b border-white/5 transition-colors cursor-pointer ${
                    notification.isRead ? 'bg-transparent' : 'bg-primary/5 hover:bg-primary/10'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className={`text-label-md ${notification.isRead ? 'text-on-surface' : 'text-primary font-bold'}`}>
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification._id); }}
                        className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"
                        title="Mark as read"
                      />
                    )}
                  </div>
                  <p className="text-body-sm text-on-surface-variant mb-2">
                    {notification.message}
                  </p>
                  <span className="text-[10px] text-outline font-medium">
                    {formatDistanceToNow(new Date(notification.createdAt))}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
