import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

// Define the Notification type locally to avoid import issues
interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { removeNotification } = useNotifications();

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  };

  const iconColors = {
    success: 'bg-green-100 text-green-600',
    error: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };
  return (
    <div className={`
      flex items-start p-4 rounded-lg border
      ${bgColors[notification.type]}
      animate-slide-in transform transition-all duration-300 shadow-sm
    `}>
      <div className={`flex-shrink-0 mr-3 p-2 rounded-lg ${iconColors[notification.type]}`}>
        {icons[notification.type]}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-semibold ${textColors[notification.type]}`}>
          {notification.title}
        </h4>
        {notification.message && (
          <p className="mt-1 text-sm text-gray-600">
            {notification.message}
          </p>
        )}
      </div>
      
      <button
        onClick={() => removeNotification(notification.id)}
        className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-opacity-30 hover:bg-gray-200 transition-colors"
      >
        <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};