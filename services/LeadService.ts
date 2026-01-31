/**
 * LeadService - Domain Service for Lead Business Logic
 * Handles lead-specific operations and business rules
 */

import { Lead, Contact } from '../types';

export class LeadService {
  /**
   * Determines if an entity ID belongs to a contact
   * @param id - Entity ID to check
   * @param contacts - Array of contacts to check against
   * @returns true if the ID is a contact
   */
  static isContact(id: string, contacts: Contact[]): boolean {
    return contacts.some(c => c.id === id);
  }

  /**
   * Converts a contact to a lead entity (for unified pipeline view)
   * @param contact - Contact to normalize
   * @returns Lead-compatible object
   */
  static normalizeContactToLead(contact: Contact): Lead {
    return {
      id: contact.id,
      name: contact.name,
      role: contact.role,
      company: contact.company,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`,
      status: 'New Lead',
      lastActivityTime: contact.lastContacted || 'Just now',
      email: contact.email,
      phone: contact.phone,
      isOnline: false,
      dealValue: 0,
      probability: 0,
      lastContactDate: contact.lastContacted || 'Never'
    };
  }

  /**
   * Converts lead updates to contact format when needed
   * @param updates - Lead update fields
   * @returns Contact-compatible update object
   */
  static leadUpdatesToContactUpdates(updates: Partial<Lead>): Partial<Contact> & { status: 'Active' | 'Inactive' } {
    return {
      ...updates,
      status: updates.status === 'Closed' ? 'Inactive' : 'Active'
    };
  }

  /**
   * Creates a contact from lead data (for cascading operations)
   * @param leadData - Lead data to convert
   * @returns Contact object ready for insertion
   */
  static createContactFromLead(leadData: Omit<Lead, 'id'>): Omit<Contact, 'id'> {
    return {
      name: leadData.name,
      role: leadData.role,
      company: leadData.company,
      email: leadData.email,
      phone: leadData.phone,
      lastContacted: 'Just now',
      status: 'Active'
    };
  }
}
