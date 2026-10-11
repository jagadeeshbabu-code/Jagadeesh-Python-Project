(function () {
  const year = document.querySelector('#displayYear');
  if (year) year.textContent = new Date().getFullYear();

  const csrf = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || '';
  const cartCount = document.querySelector('#cart-count');
  const cartList = document.querySelector('#cart-items-list');
  const cartTotal = document.querySelector('#cart-total');
  const money = value => `₹${Number(value).toLocaleString('en-IN')}`;
  const toast = message => {
    let node = document.querySelector('.site-toast');
    if (!node) { node = document.createElement('div'); node.className = 'site-toast'; node.setAttribute('role', 'status'); document.body.appendChild(node); }
    node.textContent = message; node.classList.add('is-visible');
    clearTimeout(node.hideTimer); node.hideTimer = setTimeout(() => node.classList.remove('is-visible'), 2600);
  };

  async function loadCart() {
    if (!cartList) return;
    try {
      const response = await fetch('/get-cart-items/');
      if (!response.ok) throw new Error('Cart could not be loaded');
      const data = await response.json();
      const items = data.items || [];
      cartList.replaceChildren();
      let total = 0, count = 0;
      if (!items.length) {
        const empty = document.createElement('li'); empty.className = 'cart-empty'; empty.textContent = 'Your cart is waiting for something delicious.'; cartList.appendChild(empty);
      }
      items.forEach(item => {
        total += Number(item.total) || 0; count += Number(item.quantity) || 0;
        const row = document.createElement('li'); row.className = 'cart-row';
        const label = document.createElement('span'); label.className = 'cart-row-label'; label.textContent = item.name;
        const controls = document.createElement('div'); controls.className = 'cart-row-controls';
        const minus = document.createElement('button'); minus.type = 'button'; minus.className = 'cart-action cart-quantity'; minus.dataset.itemId = item.id; minus.dataset.action = 'decrease'; minus.textContent = '−'; minus.setAttribute('aria-label', `Remove one ${item.name}`);
        const quantity = document.createElement('span'); quantity.textContent = item.quantity;
        const plus = document.createElement('button'); plus.type = 'button'; plus.className = 'cart-action cart-quantity'; plus.dataset.itemId = item.id; plus.dataset.action = 'increase'; plus.textContent = '+'; plus.setAttribute('aria-label', `Add one ${item.name}`);
        const amount = document.createElement('strong'); amount.className = 'cart-row-total'; amount.textContent = money(item.total);
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'cart-action cart-remove'; remove.dataset.itemId = item.id; remove.dataset.action = 'remove'; remove.textContent = 'Remove';
        controls.append(minus, quantity, plus, amount, remove); row.append(label, controls); cartList.appendChild(row);
      });
      if (cartCount) cartCount.textContent = count;
      if (cartTotal) cartTotal.textContent = `Total: ${money(total)}`;
    } catch (error) { toast(error.message); }
  }
  if (cartList) {
    loadCart();
    document.querySelector('#cart-button')?.addEventListener('click', loadCart);
    document.querySelector('#clear-cart')?.addEventListener('click', () => changeCart('', 'clear'));
  }

  async function changeCart(itemId, action) {
    try {
      const response = await fetch('/update-cart/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': csrf }, body: new URLSearchParams({ item_id: itemId, action }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Cart could not be updated');
      await loadCart();
    } catch (error) { toast(error.message); }
  }

  document.addEventListener('click', async event => {
    const cartAction = event.target.closest('.cart-action');
    if (cartAction) { await changeCart(cartAction.dataset.itemId, cartAction.dataset.action); return; }
    const button = event.target.closest('.add-to-cart');
    if (!button) return;
    button.disabled = true;
    try {
      const body = new URLSearchParams({ item_id: button.dataset.itemId });
      const response = await fetch('/add-to-cart/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': csrf }, body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not add that dish.');
      toast(`${button.dataset.itemName || 'Dish'} added to your cart`);
      await loadCart();
    } catch (error) { toast(error.message); }
    finally { button.disabled = false; }
  });

  const cards = [...document.querySelectorAll('.menu-card')];
  const search = document.querySelector('#menu-search');
  let selectedCategory = '*';
  function filterMenu() {
    const query = (search?.value || '').trim().toLowerCase(); let visible = 0;
    cards.forEach(card => {
      const matchesCategory = selectedCategory === '*' || card.dataset.category === selectedCategory;
      const matchesQuery = `${card.dataset.name} ${card.dataset.description}`.includes(query);
      card.hidden = !(matchesCategory && matchesQuery); if (!card.hidden) visible++;
    });
    const count = document.querySelector('#menu-result-count'); if (count) count.textContent = `${visible} ${visible === 1 ? 'dish' : 'dishes'}`;
    const empty = document.querySelector('#menu-empty'); if (empty) empty.hidden = visible !== 0;
  }
  search?.addEventListener('input', filterMenu);
  document.querySelectorAll('.filters_menu li').forEach(option => option.addEventListener('click', () => {
    document.querySelectorAll('.filters_menu li').forEach(item => item.classList.remove('active'));
    option.classList.add('active'); selectedCategory = option.dataset.category || '*'; filterMenu();
  }));
  if (cards.length) filterMenu();

})();
