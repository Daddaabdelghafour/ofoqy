import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface NotificationProps {
  notification: {
    show: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  };
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification.show) return null;

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
      notification.type === 'success' ? 'bg-primary-1000 text-white' :
      notification.type === 'error' ? 'bg-red-500 text-white' :
      'bg-yellow-500 text-white'
    }`}>
      {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
      {notification.type === 'error' && <XCircle className="w-5 h-5" />}
      {notification.type === 'warning' && <AlertCircle className="w-5 h-5" />}
      <div>
        <div className="font-semibold">{notification.title}</div>
        <div className="text-sm">{notification.message}</div>
      </div>
    </div>
  );
};

export default Notification;
