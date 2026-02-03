import { Lead, Contact } from '../../types';

export interface CallerInfo {
  name?: string;
  company?: string;
  avatar?: string;
  leadId?: string;
}

/**
 * CallerIdentificationService - Identifies callers from leads and contacts database
 * Responsibility: Lookup caller information by phone number
 */
export class CallerIdentificationService {
  /**
   * Identify caller from phone number by searching leads and contacts
   */
  async identifyCaller(
    phoneNumber: string,
    leads: Lead[],
    contacts: Contact[]
  ): Promise<CallerInfo> {
    try {
      // Check leads first
      const matchingLead = leads.find(l => l.phone === phoneNumber);
      if (matchingLead) {
        return {
          name: matchingLead.name,
          company: matchingLead.company,
          avatar: matchingLead.avatar,
          leadId: matchingLead.id
        };
      }

      // Check contacts
      const matchingContact = contacts.find(c => c.phone === phoneNumber);
      if (matchingContact) {
        return {
          name: matchingContact.name,
          company: matchingContact.company,
          leadId: undefined
        };
      }

      return { name: 'Unknown Caller' };
    } catch (error) {
      console.error('Error identifying caller:', error);
      return { name: 'Unknown Caller' };
    }
  }

  /**
   * Format caller display name
   */
  formatCallerName(callerInfo: CallerInfo): string {
    if (callerInfo.name && callerInfo.name !== 'Unknown Caller') {
      return callerInfo.name;
    }
    return 'Unknown Caller';
  }

  /**
   * Get caller initials for avatar fallback
   */
  getCallerInitials(callerInfo: CallerInfo): string {
    if (callerInfo.name && callerInfo.name !== 'Unknown Caller') {
      return callerInfo.name.charAt(0).toUpperCase();
    }
    return '?';
  }
}

// Singleton instance
export const callerIdentificationService = new CallerIdentificationService();
