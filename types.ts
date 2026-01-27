export interface Lead {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  status: 'New Lead' | 'Follow-up' | 'Closed';
  lastActivityTime: string;
  email: string;
  phone: string;
  isOnline?: boolean;
  dealValue: number;
  probability: number;
  lastContactDate: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting';
  title: string;
  description: string;
  timestamp: string;
  duration?: string;
}

export interface Note {
  id: string;
  content: string;
  isPinned: boolean;
  author: string;
  leadId?: string;
  userId?: string;
  createdAt?: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  lastContacted: string;
  status: 'Active' | 'Inactive';
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  company: string;
  stage: 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed';
  owner: string;
  closingDate: string;
}

export interface CurrentUser {
  name: string;
  email: string;
  role: string;
  avatar: string;
}