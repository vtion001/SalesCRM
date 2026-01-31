// Zadarma reject call endpoint

import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    const { callId } = req.body;

    if (!callId) {
      return res.status(400).json({ error: 'callId is required' });
    }

    // Note: Zadarma callback method doesn't provide explicit reject API
    // Calls are rejected from the phone/SIP device directly
    // This endpoint acknowledges the reject request
    
    console.log('🚫 Reject acknowledged for Zadarma call:', callId);

    return res.status(200).json({
      success: true,
      callId,
      message: 'Reject acknowledged'
    });
  } catch (error: any) {
    console.error('❌ Zadarma reject error:', error);
    return res.status(500).json({
      error: 'Failed to reject call',
      message: error.message
    });
  }
}
