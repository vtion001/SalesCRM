/**
 * Status to color mapping
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'New Lead':
      return 'bg-blue-100 text-blue-700';
    case 'Follow-up':
      return 'bg-yellow-100 text-yellow-700';
    case 'Closed':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Deal stage to color mapping
 */
export const getStageColor = (stage: string): string => {
  switch (stage) {
    case 'Qualified':
      return 'bg-blue-100 text-blue-700';
    case 'Proposal':
      return 'bg-purple-100 text-purple-700';
    case 'Negotiation':
      return 'bg-yellow-100 text-yellow-700';
    case 'Closed':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Activity type to color mapping
 */
export const getActivityTypeColor = (type: string): string => {
  switch (type) {
    case 'call':
      return 'bg-blue-100 text-blue-600';
    case 'email':
      return 'bg-purple-100 text-purple-600';
    case 'meeting':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

/**
 * Combine Tailwind class conditions
 */
export const combineClasses = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};
