// Shared types for telephony providers (Twilio, Zadarma, etc.)

export type TelephonyProvider = 'twilio' | 'zadarma';

export interface CallSession {
  id: string;
  status: CallStatus;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  duration: number;
  isMuted: boolean;
  isOnHold: boolean;
  provider: TelephonyProvider;
}

export type CallStatus = 
  | 'idle'
  | 'connecting'
  | 'ringing'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'busy'
  | 'no-answer';

export interface DeviceStatus {
  isOnline: boolean;
  isReady: boolean;
  provider: TelephonyProvider;
  error?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId: string;
  to: string;
  from: string;
  timestamp: Date;
  error?: string;
}

export interface CallLog {
  id: string;
  callId: string;
  from: string;
  to: string;
  direction: 'inbound' | 'outbound';
  status: CallStatus;
  duration: number;
  cost?: number;
  currency?: string;
  timestamp: Date;
  recordingUrl?: string;
  provider: TelephonyProvider;
}

export interface NumberValidation {
  isValid: boolean;
  formattedNumber: string;
  canCall: boolean;
  canSMS: boolean;
  numberType?: 'mobile' | 'landline' | 'toll-free' | 'premium' | 'unknown';
  country?: string;
  errorMessage?: string;
}

export interface ProviderConfig {
  provider: TelephonyProvider;
  apiKey?: string;
  apiSecret?: string;
  accountSid?: string;
  authToken?: string;
  phoneNumber?: string;
  sipNumber?: string;
}

export interface IncomingCallData {
  callId: string;
  from: string;
  to: string;
  callerName?: string;
  callerCompany?: string;
  callerAvatar?: string;
  timestamp: Date;
  provider: TelephonyProvider;
}

export interface TelephonyDevice {
  on(event: 'incoming', handler: (call: IncomingCallData) => void): void;
  on(event: 'ready', handler: () => void): void;
  on(event: 'error', handler: (error: Error) => void): void;
  on(event: 'offline', handler: () => void): void;
  off(event: string, handler?: Function): void;
  destroy(): Promise<void>;
  state: 'connecting' | 'registered' | 'offline' | 'error';
}

export interface CallInstance {
  accept(): Promise<void>;
  reject(): Promise<void>;
  disconnect(): Promise<void>;
  mute(muted: boolean): void;
  hold(hold: boolean): void;
  on(event: 'accept' | 'disconnect' | 'error', handler: (data?: any) => void): void;
  parameters: {
    CallSid: string;
    From: string;
    To: string;
  };
}
