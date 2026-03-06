export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    politics: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200',
    business: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200',
    technology: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200',
    investigations: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200',
    culture: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200',
    sports: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200',
  };
  return colors[category] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200';
}
