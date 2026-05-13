(function formaTheme() {
  document.documentElement.classList.add('forma-js');

  document.addEventListener('submit', function handleAjaxCart(event) {
    var form = event.target.closest('form[action*="/cart/add"]');
    if (!form || !window.fetch) return;

    event.preventDefault();

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    })
      .then(function parse(response) { return response.json(); })
      .then(function notify(item) {
        document.dispatchEvent(new CustomEvent('forma:cart:add', { detail: item }));
        form.querySelector('[data-add-label]').textContent = 'Agregado';
      })
      .catch(function fallback() { form.submit(); });
  });
})();
