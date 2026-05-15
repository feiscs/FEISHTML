const crypto = require('crypto');


const MAX_TIMESTAMP_TOLERANCE_SECONDS = 300;

function isTimestampFresh(timestamp) {
  const parsed = Number.parseInt(String(timestamp || ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return Math.abs(nowSeconds - parsed) <= MAX_TIMESTAMP_TOLERANCE_SECONDS;
}

function parseStripeSignature(signatureHeader) {
  return String(signatureHeader || '')
    .split(',')
    .map((entry) => entry.trim())
    .reduce((acc, pair) => {
      const [key, value] = pair.split('=');
      if (!key || !value) return acc;
      if (key === 'v1') {
        acc.v1.push(value);
      } else if (key === 't') {
        acc.t = value;
      }
      return acc;
    }, { t: '', v1: [] });
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
  const signatures = parsedSig.v1;
  if (!timestamp || !signatures.length) {
    return res.status(400).json({ ok: false, error: 'Malformed Stripe-Signature header' });
  }

  if (!isTimestampFresh(timestamp)) {
    return res.status(400).json({ ok: false, error: 'Stale signature timestamp' });
  }

  const payload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');

  const hasValidSignature = signatures.some((signature) => secureCompare(signature, expected));
  if (!hasValidSignature) {
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
