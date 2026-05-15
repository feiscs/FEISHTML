const crypto = require('crypto');

function badRequest(message) {
  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: false, error: message }),
  };
}

function parseStripeSignature(signatureHeader) {
  return String(signatureHeader || '')
    .split(',')
    .map((entry) => entry.trim())
    .reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {});
}

function secureCompare(a, b) {
  const first = Buffer.from(String(a || ''), 'utf8');
  const second = Buffer.from(String(b || ''), 'utf8');
  if (first.length !== second.length) return false;
  return crypto.timingSafeEqual(first, second);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).json({ ok: false, error: 'Missing STRIPE_WEBHOOK_SECRET' });
  }

  const signatureHeader = req.headers['stripe-signature'];
  if (!signatureHeader) {
    return res.status(400).json({ ok: false, error: 'Missing Stripe-Signature header' });
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString('utf8');

  const parsedSig = parseStripeSignature(signatureHeader);
  const timestamp = parsedSig.t;
  const signature = parsedSig.v1;
  if (!timestamp || !signature) {
    return res.status(400).json({ ok: false, error: 'Malformed Stripe-Signature header' });
  }

  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');

  if (!secureCompare(signature, expected)) {
    return res.status(400).json({ ok: false, error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (error) {
    return res.status(400).json({ ok: false, error: 'Invalid JSON payload' });
  }

  console.log('[stripe-webhook] verified event', {
    id: event.id,
    type: event.type,
    livemode: event.livemode,
  });

  return res.status(200).json({ ok: true, received: true });
};
