'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
  isVisible: boolean;
}

export default function Notification({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  isVisible
}: NotificationProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const typeClasses = {
    success: 'bg-green-500 text-[#0E3A41]',
    error: 'bg-red-500 text-[#F3E4C8]',
    warning: 'bg-yellow-500 text-[#0E3A41]',
    info: 'bg-[#5ED3D0] text-[#0E3A41]'
  };

  return (
    <div
      className={cn(
        'toast',
        show ? 'show' : '',
        typeClasses[type]
      )}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <span className="text-lg">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
          {type === 'info' && 'ℹ'}
        </span>

        {/* Message */}
        <p className="flex-1 text-sm font-medium">
          {message}
        </p>

        {/* Close button */}
        <button
          onClick={() => {
            setShow(false);
            onClose?.();
          }}
          className="text-[#F3E4C8]/50 hover:text-[#F3E4C8] transition-colors p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Notification item type
type NotificationItem = {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
};

// Global notification manager
export class NotificationManager {
  private static instance: NotificationManager;
  private notifications: NotificationItem[] = [];
  private listeners: ((notifications: NotificationItem[]) => void)[] = [];
  private container: HTMLElement | null = null;

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
      NotificationManager.instance.init();
    }
    return NotificationManager.instance;
  }

  private init() {
    if (typeof window !== 'undefined') {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.className = 'fixed top-4 right-4 z-[9999] space-y-2';
      document.body.appendChild(this.container);
    }
  }

  subscribe(listener: (notifications: NotificationItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(message: string, type: NotificationType = 'info', duration?: number) {
    const id = Date.now().toString();
    const notification = { id, message, type, duration };
    this.notifications = [...this.notifications, notification];
    this.notifyListeners();

    if (duration !== 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration || 5000);
    }

    return id;
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
}
