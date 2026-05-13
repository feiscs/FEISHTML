(function attachFormaIntegrations() {
  const emptyConfig = {
    shopify: {},
    supabase: {},
    chatbase: {},
    githubAgent: {},
  };

  function getConfig() {
    return { ...emptyConfig, ...(window.FORMA_CONFIG || {}) };
  }

  function hasSupabase() {
    const { supabase } = getConfig();
    return Boolean(supabase?.url && supabase?.anonKey);
  }

  async function supabaseInsert(tableName, payload) {
    const { supabase } = getConfig();
    if (!hasSupabase() || !tableName) return { skipped: true };

    const response = await fetch(`${supabase.url.replace(/\/$/, '')}/rest/v1/${tableName}`, {
      method: 'POST',
      headers: {
        apikey: supabase.anonKey,
        Authorization: `Bearer ${supabase.anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Supabase insert failed: ${response.status}`);
    }

    return { ok: true };
  }

  async function trackEvent(eventName, payload = {}) {
    const { supabase } = getConfig();
    try {
      return await supabaseInsert(supabase.eventsTable, {
        event_name: eventName,
        payload,
        page_path: window.location.pathname,
        user_agent: window.navigator.userAgent,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('[FORMA] Event tracking skipped:', error.message);
      return { skipped: true, error };
    }
  }

  async function saveNewsletter(email) {
    const { supabase } = getConfig();
    try {
      return await supabaseInsert(supabase.newsletterTable, {
        email,
        source: 'forma-storefront',
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('[FORMA] Newsletter sync skipped:', error.message);
      return { skipped: true, error };
    }
  }

  function loadChatbase() {
    const { chatbase } = getConfig();
    if (!chatbase?.enabled || !chatbase?.botId || document.querySelector('[data-chatbase-loader]')) {
      return false;
    }

    window.embeddedChatbotConfig = { chatbotId: chatbase.botId, domain: 'www.chatbase.co' };
    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.id = chatbase.botId;
    script.setAttribute('chatbotId', chatbase.botId);
    script.setAttribute('domain', 'www.chatbase.co');
    script.dataset.chatbaseLoader = 'true';
    script.defer = true;
    document.body.appendChild(script);
    return true;
  }

  function hasShopify() {
    const { shopify } = getConfig();
    return Boolean(shopify?.domain && shopify?.storefrontToken && shopify?.enableRemoteProducts);
  }

  async function fetchShopifyProducts() {
    const { shopify } = getConfig();
    if (!hasShopify()) return [];

    const endpoint = `https://${shopify.domain}/api/${shopify.apiVersion || '2026-01'}/graphql.json`;
    const query = `
      query FormaProducts($first: Int!) {
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              title
              productType
              createdAt
              description
              tags
              featuredImage { url altText }
              variants(first: 20) {
                edges {
                  node {
                    id
                    title
                    price { amount currencyCode }
                    compareAtPrice { amount currencyCode }
                    selectedOptions { name value }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': shopify.storefrontToken,
      },
      body: JSON.stringify({ query, variables: { first: 12 } }),
    });

    if (!response.ok) {
      throw new Error(`Shopify request failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors.map((error) => error.message).join(', '));
    }

    return data.data.products.edges.map(({ node }, index) => {
      const firstVariant = node.variants.edges[0]?.node;
      const price = Number(firstVariant?.price?.amount || 0);
      const oldPrice = Number(firstVariant?.compareAtPrice?.amount || 0) || null;
      const colorValues = new Set();
      const sizeValues = new Set();

      node.variants.edges.forEach(({ node: variant }) => {
        variant.selectedOptions.forEach((option) => {
          if (/color/i.test(option.name)) colorValues.add(option.value);
          if (/size|talla/i.test(option.name)) sizeValues.add(option.value);
        });
      });

      return {
        id: node.id,
        shopifyVariantId: firstVariant?.id,
        name: node.title,
        category: node.productType || 'Shopify',
        price,
        oldPrice,
        rating: 4.8,
        badge: node.tags[0] || 'Shopify',
        createdAt: 100 + index,
        description: node.description || 'Producto sincronizado desde Shopify.',
        colors: [...colorValues].length ? [...colorValues] : ['Default'],
        sizes: [...sizeValues].length ? [...sizeValues] : ['Única'],
        bg: '#eadfd0',
        gradient: 'linear-gradient(145deg, #fff8ec, #c89b77)',
        shape: '1.2rem',
        image: node.featuredImage?.url,
      };
    });
  }

  window.FormaIntegrations = {
    fetchShopifyProducts,
    getConfig,
    hasShopify,
    hasSupabase,
    loadChatbase,
    saveNewsletter,
    trackEvent,
  };
})();
