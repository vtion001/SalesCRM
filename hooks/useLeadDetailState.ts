/**
 * useLeadDetailState - Centralized State Management for LeadDetail
 * Uses useReducer to manage complex edit states
 */

import { useReducer, useEffect } from 'react';
import { Lead } from '../types';

export type EditMode = 'idle' | 'profile' | 'note' | 'dealValue' | 'probability';

export interface LeadDetailState {
  mode: EditMode;
  editData: Partial<Lead>;
  tempStatValue: number;
  newNoteContent: string;
  activityFilter: 'all' | 'calls' | 'sms' | 'notes';
  showOptions: boolean;
}

type Action =
  | { type: 'START_PROFILE_EDIT'; payload: Partial<Lead> }
  | { type: 'START_STAT_EDIT'; payload: { stat: 'dealValue' | 'probability'; value: number } }
  | { type: 'START_NOTE_ADD' }
  | { type: 'CANCEL_EDIT' }
  | { type: 'UPDATE_EDIT_FIELD'; payload: { field: string; value: any } }
  | { type: 'UPDATE_TEMP_STAT'; payload: number }
  | { type: 'UPDATE_NOTE_CONTENT'; payload: string }
  | { type: 'SET_ACTIVITY_FILTER'; payload: 'all' | 'calls' | 'sms' | 'notes' }
  | { type: 'TOGGLE_OPTIONS' }
  | { type: 'RESET' };

const initialState: LeadDetailState = {
  mode: 'idle',
  editData: {},
  tempStatValue: 0,
  newNoteContent: '',
  activityFilter: 'all',
  showOptions: false
};

const reducer = (state: LeadDetailState, action: Action): LeadDetailState => {
  switch (action.type) {
    case 'START_PROFILE_EDIT':
      return {
        ...state,
        mode: 'profile',
        editData: action.payload,
        showOptions: false
      };

    case 'START_STAT_EDIT':
      return {
        ...state,
        mode: action.payload.stat,
        tempStatValue: action.payload.value
      };

    case 'START_NOTE_ADD':
      return {
        ...state,
        mode: 'note',
        showOptions: false
      };

    case 'CANCEL_EDIT':
      return {
        ...state,
        mode: 'idle',
        editData: {},
        tempStatValue: 0,
        newNoteContent: ''
      };

    case 'UPDATE_EDIT_FIELD':
      return {
        ...state,
        editData: {
          ...state.editData,
          [action.payload.field]: action.payload.value
        }
      };

    case 'UPDATE_TEMP_STAT':
      return {
        ...state,
        tempStatValue: action.payload
      };

    case 'UPDATE_NOTE_CONTENT':
      return {
        ...state,
        newNoteContent: action.payload
      };

    case 'SET_ACTIVITY_FILTER':
      return {
        ...state,
        activityFilter: action.payload
      };

    case 'TOGGLE_OPTIONS':
      return {
        ...state,
        showOptions: !state.showOptions
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
};

export const useLeadDetailState = (leadId: string | undefined) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Reset state when lead changes
  useEffect(() => {
    dispatch({ type: 'RESET' });
  }, [leadId]);

  return { state, dispatch };
};
