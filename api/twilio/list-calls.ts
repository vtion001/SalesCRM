import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

/**
 * Fetch call logs from Twilio REST API
 * GET /api/twilio/list-calls
 * 
 * Query params:
 * - to: Filter by destination number
 * - from: Filter by source number
 * - limit: Number of records to return (default 20)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();

  if (!accountSid || !authToken) {
    return res.status(500).json({ error: 'Twilio credentials not configured' });
  }

  const client = twilio(accountSid, authToken);

  try {
    const { to, from, limit = '20' } = req.query;

    const filter: any = {};
    if (to) filter.to = to;
    if (from) filter.from = from;

    const calls = await client.calls.list({
      ...filter,
      limit: parseInt(limit as string, 10),
    });

    // Map to a cleaner format for frontend
    const formattedCalls = calls.map(call => ({
      sid: call.sid,
      from: call.from,
      to: call.to,
      status: call.status,
      startTime: call.startTime,
      endTime: call.endTime,
      duration: call.duration,
      direction: call.direction,
      price: call.price,
      priceUnit: call.priceUnit,
    }));

    return res.status(200).json({ calls: formattedCalls });
  } catch (error: any) {
    console.error('Error fetching Twilio call logs:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch call logs' });
  }
}
