// Zadarma device initialization endpoint

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
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // For Zadarma, we don't need to initialize a WebRTC device
    // Calls are made via callback API, incoming calls come through webhooks
    // This endpoint just confirms the provider is ready
    
    return res.status(200).json({
      success: true,
      provider: 'zadarma',
      message: 'Zadarma provider ready for callback-based calling',
      userId
    });
  } catch (error: any) {
    console.error('❌ Zadarma initialization error:', error);
    return res.status(500).json({ 
      error: 'Failed to initialize Zadarma provider',
      message: error.message 
    });
  }
}
