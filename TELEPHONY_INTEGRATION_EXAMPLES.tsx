// Example: Using the Telephony Provider System

import React from 'react';
import { useTelephony } from './context';
import { TelephonyProviderBadge, ProviderSwitcher } from './components/Providers';

/**
 * Example 1: Display current provider status
 */
export function ProviderStatusExample() {
  const { provider, isReady, error } = useTelephony();
  
  return (
    <div>
      <h3>Current Provider: {provider}</h3>
      <p>Status: {isReady ? 'Ready' : 'Initializing...'}</p>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

/**
 * Example 2: Make a call using current provider
 */
export function MakeCallExample() {
  const { providerInstance } = useTelephony();
  
  const handleCall = async () => {
    try {
      const call = await providerInstance?.makeCall('+1234567890');
      console.log('Call initiated:', call);
      
      // Listen for call events
      call?.on('accept', () => {
        console.log('Call accepted');
      });
      
      call?.on('disconnect', () => {
        console.log('Call ended');
      });
    } catch (error) {
      console.error('Call failed:', error);
    }
  };
  
  return <button onClick={handleCall}>Make Call</button>;
}

/**
 * Example 3: Switch providers programmatically
 */
export function ProviderSwitchExample() {
  const { provider, switchProvider } = useTelephony();
  
  const handleSwitch = async () => {
    const newProvider = provider === 'twilio' ? 'zadarma' : 'twilio';
    await switchProvider(newProvider);
    console.log(`Switched to ${newProvider}`);
  };
  
  return <button onClick={handleSwitch}>Switch Provider</button>;
}

/**
 * Example 4: Complete Dialer Footer Integration
 */
export function DialerFooterExample() {
  const { provider, switchProvider, isReady } = useTelephony();
  const [isCallActive, setIsCallActive] = React.useState(false);
  
  return (
    <div className="h-16 border-t border-slate-50 flex items-center justify-between px-8 bg-slate-50/30">
      {/* Left: Provider Status */}
      <TelephonyProviderBadge
        provider={provider}
        isOnline={true}
        isReady={isReady}
      />
      
      {/* Right: Provider Switcher */}
      <ProviderSwitcher
        currentProvider={provider}
        onSwitch={switchProvider}
        isCallActive={isCallActive}
      />
    </div>
  );
}

/**
 * Example 5: Send SMS using current provider
 */
export function SendSMSExample() {
  const { providerInstance } = useTelephony();
  const [message, setMessage] = React.useState('');
  
  const handleSend = async () => {
    try {
      const result = await providerInstance?.sendSMS(
        '+1234567890',
        message
      );
      
      if (result?.success) {
        console.log('SMS sent:', result.messageId);
      } else {
        console.error('SMS failed:', result?.error);
      }
    } catch (error) {
      console.error('SMS error:', error);
    }
  };
  
  return (
    <div>
      <textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={handleSend}>Send SMS</button>
    </div>
  );
}

/**
 * Example 6: Fetch call logs from current provider
 */
export function CallLogsExample() {
  const { providerInstance } = useTelephony();
  const [logs, setLogs] = React.useState([]);
  
  const fetchLogs = async () => {
    const callLogs = await providerInstance?.getCallLogs({
      startDate: new Date('2026-01-01'),
      endDate: new Date(),
      limit: 50
    });
    
    setLogs(callLogs || []);
  };
  
  React.useEffect(() => {
    fetchLogs();
  }, []);
  
  return (
    <div>
      <h3>Call History</h3>
      {logs.map((log: any) => (
        <div key={log.id}>
          {log.from} → {log.to} ({log.duration}s) [{log.provider}]
        </div>
      ))}
    </div>
  );
}

/**
 * Example 7: Validate phone number
 */
export function ValidateNumberExample() {
  const { providerInstance } = useTelephony();
  const [number, setNumber] = React.useState('');
  const [validation, setValidation] = React.useState<any>(null);
  
  const handleValidate = async () => {
    const result = await providerInstance?.validatePhoneNumber(number);
    setValidation(result);
  };
  
  return (
    <div>
      <input 
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Enter phone number"
      />
      <button onClick={handleValidate}>Validate</button>
      
      {validation && (
        <div>
          <p>Valid: {validation.isValid ? 'Yes' : 'No'}</p>
          <p>Formatted: {validation.formattedNumber}</p>
          <p>Can Call: {validation.canCall ? 'Yes' : 'No'}</p>
          <p>Can SMS: {validation.canSMS ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 8: App-level provider wrapper
 */
import { TelephonyProviderWrapper } from './context';

export function AppWithProviders({ children }: { children: React.ReactNode }) {
  return (
    <TelephonyProviderWrapper>
      {children}
    </TelephonyProviderWrapper>
  );
}

// Usage in App.tsx:
// import { AppWithProviders } from './examples/telephony-integration';
// 
// function App() {
//   return (
//     <AppWithProviders>
//       {/* your app code */}
//     </AppWithProviders>
//   );
// }
