export function timeAgo(isoDate: string | undefined): string {
  if (!isoDate) return '';

  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return '';

  const seconds = Math.floor((Date.now() - then) / 1000);

  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

/**
 * Formats a future ISO date as a countdown string, e.g. "in 3h", "in 2d".
 * Returns "Expired" if the date is in the past.
 */
export function timeUntil(isoDate: string | null | undefined): string {
  if (!isoDate) return '';

  const target = new Date(isoDate).getTime();
  if (Number.isNaN(target)) return '';

  const seconds = Math.floor((target - Date.now()) / 1000);
  if (seconds <= 0) return 'Expired';

  if (seconds < 60) return `in ${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `in ${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `in ${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `in ${days}d`;

  const months = Math.floor(days / 30);
  if (months < 12) return `in ${months}mo`;

  const years = Math.floor(months / 12);
  return `in ${years}y`;
}