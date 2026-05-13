export function productCard(product) {
  return `<article class="card"><strong>${product.name}</strong><span>${product.category}</span><b>$${product.price}</b></article>`;
}

export function pageShell({ title, body }) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head><body>${body}</body></html>`;
}
