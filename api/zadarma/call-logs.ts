// Zadarma call logs endpoint

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { start, end, limit, skip } = req.query;

    const params: Record<string, any> = {};

    if (start) {
      params.start = start;
    }
    if (end) {
      params.end = end;
    }
    if (limit) {
      params.limit = limit;
    }
    if (skip) {
      params.skip = skip;
    }

    console.log('📊 Fetching Zadarma PBX statistics:', params);

    // Fetch PBX statistics from Zadarma
    const result = await zadarmaRequest('/statistics/pbx/', params, 'GET');

    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to fetch call logs');
    }

    // Normalize response to match expected format
    const calls = (result.stats || []).map((stat: any) => ({
      id: stat.call_id || stat.id,
      call_id: stat.call_id,
      from: stat.clid || stat.from || 'Unknown',
      to: stat.destination || stat.to || '',
      direction: stat.callstart ? 'inbound' : 'outbound', // Heuristic
      disposition: stat.disposition,
      billseconds: stat.seconds || 0,
      callstart: stat.callstart,
      is_recorded: stat.is_recorded,
      pbx_call_id: stat.pbx_call_id
    }));

    console.log(`✅ Retrieved ${calls.length} Zadarma call logs`);

    return res.status(200).json({
      success: true,
      calls,
      start: result.start,
      end: result.end
    });
  } catch (error: any) {
    console.error('❌ Zadarma call logs error:', error);
    return res.status(500).json({
      error: 'Failed to fetch call logs',
      message: error.message
    });
  }
}
