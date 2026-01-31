// Zadarma phone number validation endpoint

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { zadarmaRequest } from './config';

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
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'phoneNumber is required' });
    }

    // Basic client-side validation first
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    if (cleanNumber.length < 7) {
      return res.status(200).json({
        isValid: false,
        formattedNumber: phoneNumber,
        canCall: false,
        canSMS: false,
        errorMessage: 'Phone number too short'
      });
    }

    // For now, accept the number as valid
    // Zadarma's checknumber API requires caller_id, code, and lang parameters
    // which are meant for phone verification, not validation
    // We'll implement basic validation here
    
    const isInternational = cleanNumber.startsWith('+');
    const formattedNumber = isInternational ? cleanNumber : `+${cleanNumber}`;

    return res.status(200).json({
      isValid: true,
      formattedNumber,
      canCall: true,
      canSMS: true,
      numberType: 'unknown',
      country: undefined
    });
  } catch (error: any) {
    console.error('❌ Zadarma validation error:', error);
    return res.status(500).json({
      error: 'Validation failed',
      message: error.message
    });
  }
}
