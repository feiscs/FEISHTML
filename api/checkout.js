const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.APP_URL;
    if (!secretKey || !appUrl) {
      return res.status(500).json({ error: 'Missing Stripe configuration on server.' });
    }

    const stripe = new Stripe(secretKey);
    const items = Array.isArray(req.body?.items) ? req.body.items : [];

    if (!items.length) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: String(item.name || 'Producto FORMA') },
        unit_amount: Math.max(1, Math.round(Number(item.price || 0) * 100)),
      },
      quantity: Math.max(1, Number(item.quantity || 1)),
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${appUrl}/?paid=1`,
      cancel_url: `${appUrl}/?paid=0`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Checkout failed.' });
  }
};
