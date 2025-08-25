export interface Notification {
  id: string;
  isRead: boolean;
  message: string;
  senderName: string;
  timestamp: string;
  type?: 'message' | 'system' | 'job' | 'dayOff' | 'payroll';
  icon?: React.ReactNode;
  data?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: Notification['type'];
  startDate?: string;
  endDate?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: Record<string, number>;
}
