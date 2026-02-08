/**
 * Status to color mapping
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'New Lead':
      return 'bg-brand-50 text-brand-700';
    case 'Follow-up':
      return 'bg-accent-50 text-accent-700';
    case 'Closed':
      return 'bg-slate-100 text-slate-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

/**
 * Deal stage to color mapping
 */
export const getStageColor = (stage: string): string => {
  switch (stage) {
    case 'Qualified':
      return 'bg-brand-50 text-brand-700';
    case 'Proposal':
      return 'bg-slate-100 text-slate-700';
    case 'Negotiation':
      return 'bg-accent-50 text-accent-700';
    case 'Closed':
      return 'bg-slate-100 text-slate-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

/**
 * Activity type to color mapping
 */
export const getActivityTypeColor = (type: string): string => {
  switch (type) {
    case 'call':
      return 'bg-brand-50 text-brand-600';
    case 'email':
      return 'bg-slate-100 text-slate-600';
    case 'meeting':
      return 'bg-accent-50 text-accent-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

/**
 * Combine Tailwind class conditions
 */
export const combineClasses = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};
