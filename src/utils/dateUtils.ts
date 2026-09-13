import { parseISO, differenceInCalendarDays } from 'date-fns';

export interface DueStatusInfo {
  type: 'overdue' | 'today' | 'soon';
  label: string;
  badgeClass: string;
  daysDiff: number;
}

export const getDueDateInfo = (dateStr: string, status: string): DueStatusInfo | null => {
  if (status === 'paid') return null;

  try {
    const targetDate = parseISO(dateStr);
    const today = new Date();
    // Normalize to start of day for comparison
    today.setHours(0, 0, 0, 0);

    const diffDays = differenceInCalendarDays(targetDate, today);

    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      return {
        type: 'overdue',
        label: absDays === 1 ? 'Vencida ontem' : `Vencida há ${absDays}d`,
        badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
        daysDiff: diffDays,
      };
    } else if (diffDays === 0) {
      return {
        type: 'today',
        label: 'Vence Hoje!',
        badgeClass: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30 font-bold',
        daysDiff: diffDays,
      };
    } else if (diffDays <= 3) {
      return {
        type: 'soon',
        label: diffDays === 1 ? 'Vence amanhã' : `Vence em ${diffDays}d`,
        badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
        daysDiff: diffDays,
      };
    }
  } catch (e) {
    console.error('Error parsing date for due date info:', e);
  }

  return null;
};
