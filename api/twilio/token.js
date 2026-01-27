const crypto = require('crypto');

function base64url(str) {
  return Buffer.from(str).toString('base64').replace(/[=+/]/g, c => ({
    '=': '', '+': '-', '/': '_'
  }[c]));
}

function signJWT(header, payload, secret) {
  const msg = base64url(JSON.stringify(header)) + '.' + base64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(msg).digest('base64').replace(/[=+/]/g, c => ({
    '=': '', '+': '-', '/': '_'
  }[c]));
  return msg + '.' + sig;
}

exports.default = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;
    const appSid = process.env.TWILIO_TWIML_APP_SID;

    if (!accountSid || !apiKey || !apiSecret || !appSid) {
      return res.status(500).json({ error: 'Missing Twilio configuration' });
    }

    const identity = (req.query?.identity || 'user').replace(/[^a-zA-Z0-9_]/g, '_');
    const now = Math.floor(Date.now() / 1000);
    const ttl = 3600;

    const header = { alg: 'HS256', typ: 'JWT', cty: 'twilio-fpa;v=1' };
    const payload = {
      jti: apiKey + '-' + Date.now(),
      grants: { identity, voice: { incoming: { allow: true }, outgoing: { application_sid: appSid } } },
      iat: now, exp: now + ttl, iss: apiKey, sub: accountSid
    };

    const token = signJWT(header, payload, apiSecret);
    return res.status(200).json({ token, identity, expiresIn: ttl });

  } catch (error) {
    console.error('Token error:', error);
    return res.status(500).json({ error: error.message });
  }
};
