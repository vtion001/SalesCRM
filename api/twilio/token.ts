import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !authToken || !twimlAppSid) {
      return res.status(500).json({ 
        error: 'Missing Twilio configuration',
        debug: { accountSid: !!accountSid, authToken: !!authToken, twimlAppSid: !!twimlAppSid }
      });
    }

    const identity = String(req.query?.identity || 'user').replace(/[^a-zA-Z0-9_]/g, '_');

    // Create JWT payload with Twilio Voice grants
    const payload = {
      grants: {
        identity: identity,
        voice: {
          outgoing: { application_sid: twimlAppSid },
          incoming: { allow: true }
        }
      }
    };

    // Sign JWT using Auth Token (correct method for Twilio Access Tokens)
    // issuer and subject should both be the account SID
    const token = jwt.sign(payload, authToken, {
      algorithm: 'HS256',
      issuer: accountSid,
      subject: accountSid,
      expiresIn: 3600,
      header: {
        cty: 'twilio-fpa;v=1'
      }
    });

    return res.status(200).json({ 
      token: token, 
      identity: identity,
      expiresIn: 3600
    });

  } catch (error: any) {
    console.error('Token error:', error.message);
    return res.status(500).json({ 
      error: error.message || 'Token generation failed'
    });
  }
}
