import { Lead, Deal } from '../types';

/**
 * Filter leads by status
 */
export const filterLeadsByStatus = (
  leads: Lead[],
  status: string
): Lead[] => {
  return leads.filter((lead) => lead.status === status);
};

/**
 * Get recent leads (sorted by date)
 */
export const getRecentLeads = (leads: Lead[], limit = 5): Lead[] => {
  return [...leads].sort((a, b) => {
    const dateA = new Date(a.lastActivityTime || 0).getTime();
    const dateB = new Date(b.lastActivityTime || 0).getTime();
    return dateB - dateA;
  }).slice(0, limit);
};

/**
 * Search leads by name or company
 */
export const searchLeads = (leads: Lead[], query: string): Lead[] => {
  const lowerQuery = query.toLowerCase();
  return leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(lowerQuery) ||
      lead.company.toLowerCase().includes(lowerQuery) ||
      lead.email.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Calculate total lead value
 */
export const calculateTotalLeadValue = (leads: Lead[]): number => {
  return leads.reduce((sum, lead) => sum + lead.dealValue, 0);
};

/**
 * Get deals by stage
 */
export const getDealsByStage = (
  deals: Deal[],
  stage: string
): Deal[] => {
  return deals.filter((deal) => deal.stage === stage);
};

/**
 * Calculate pipeline value (excluding closed deals)
 */
export const calculatePipelineValue = (deals: Deal[]): number => {
  return deals
    .filter((d) => d.stage !== 'Closed')
    .reduce((sum, d) => sum + d.value, 0);
};

/**
 * Calculate total revenue (closed deals)
 */
export const calculateTotalRevenue = (deals: Deal[]): number => {
  return deals
    .filter((d) => d.stage === 'Closed')
    .reduce((sum, d) => sum + d.value, 0);
};

/**
 * Calculate win rate percentage
 */
export const calculateWinRate = (deals: Deal[]): number => {
  if (deals.length === 0) return 0;
  const wonDeals = deals.filter((d) => d.stage === 'Closed').length;
  return Math.round((wonDeals / deals.length) * 100);
};
