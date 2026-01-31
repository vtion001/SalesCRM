// Zadarma make call endpoint using callback API

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { zadarmaRequest, ZADARMA_CONFIG } from './config';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, from, predicted } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Destination number (to) is required' });
    }

    // Use Zadarma callback API to initiate call
    // This will call the 'from' number first, then connect to 'to' number
    const params: Record<string, any> = {
      from: from || ZADARMA_CONFIG.SIP_NUMBER,
      to: to
    };

    // Add optional predicted flag (calls 'to' first, only connects if answered)
    if (predicted) {
      params.predicted = 'y';
    }

    console.log('📞 Initiating Zadarma callback:', params);

    const result = await zadarmaRequest('/request/callback/', params, 'GET');

    if (result.status === 'error') {
      throw new Error(result.message || 'Zadarma callback request failed');
    }

    console.log('✅ Zadarma callback initiated:', result);

    return res.status(200).json({
      success: true,
      callId: result.call_id || `zadarma_${result.time || Date.now()}`,
      from: params.from,
      to: params.to,
      time: result.time,
      provider: 'zadarma'
    });
  } catch (error: any) {
    console.error('❌ Zadarma make call error:', error);
    return res.status(500).json({
      error: 'Failed to make call',
      message: error.message
    });
  }
}
