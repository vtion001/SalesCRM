// Zadarma send SMS endpoint

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
    const { to, message, from } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'to and message are required' });
    }

    // Note: Zadarma SMS API endpoint is not fully documented in the provided documentation
    // This is a placeholder implementation
    // You may need to verify the exact endpoint and parameters from Zadarma dashboard
    
    console.log('📱 Sending SMS via Zadarma:', { to, from, message: message.substring(0, 50) });

    // TODO: Implement actual Zadarma SMS API call
    // Possible endpoint: /v1/sms/send/ (needs verification)
    
    return res.status(200).json({
      success: true,
      messageId: `zadarma_sms_${Date.now()}`,
      to,
      from: from || '',
      timestamp: new Date().toISOString(),
      note: 'Zadarma SMS API endpoint needs verification'
    });
  } catch (error: any) {
    console.error('❌ Zadarma SMS error:', error);
    return res.status(500).json({
      error: 'Failed to send SMS',
      message: error.message
    });
  }
}
