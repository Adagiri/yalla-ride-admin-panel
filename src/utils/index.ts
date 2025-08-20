export const formatCurrency = (
  amount: number,
  currency: string = 'NGN'
): string => {
  const symbol = currency === 'NGN' ? '₦' : '$';
  return `${symbol}${amount.toLocaleString()}`;
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    active: 'success',
    approved: 'success',
    completed: 'success',
    pending: 'processing',
    in_progress: 'processing',
    searching: 'warning',
    expired: 'error',
    failed: 'error',
    cancelled: 'error',
    rejected: 'error',
    inactive: 'default',
  };
  return statusColors[status.toLowerCase()] || 'default';
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
