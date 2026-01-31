/**
 * PipelineService - Domain Service for Pipeline Operations
 * Handles cross-entity operations and unified pipeline views
 */

import { Lead, Contact } from '../types';
import { LeadService } from './LeadService';

export class PipelineService {
  /**
   * Merges leads and contacts into a unified pipeline view
   * Filters out contacts that already exist as leads to prevent duplicates
   * 
   * @param leads - Array of lead entities
   * @param contacts - Array of contact entities
   * @returns Unified array of pipeline items (Lead format)
   */
  static mergePipelineItems(leads: Lead[], contacts: Contact[]): Lead[] {
    // Normalize contacts to lead format
    const normalizedContacts: Lead[] = contacts.map(c => 
      LeadService.normalizeContactToLead(c)
    );

    // Get set of lead IDs for efficient lookup
    const leadIds = new Set(leads.map(l => l.id));

    // Filter out contacts that already exist as leads
    const filteredContacts = normalizedContacts.filter(c => !leadIds.has(c.id));

    // Return leads first, then unique contacts
    return [...leads, ...filteredContacts];
  }

  /**
   * Finds a specific item in the pipeline by ID
   * 
   * @param allPipelineItems - Unified pipeline items
   * @param selectedId - ID to search for
   * @returns Found item or undefined
   */
  static findPipelineItem(allPipelineItems: Lead[], selectedId: string | null): Lead | undefined {
    if (!selectedId) return undefined;
    return allPipelineItems.find(item => item.id === selectedId);
  }
}
