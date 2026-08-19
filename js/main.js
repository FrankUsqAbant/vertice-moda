/**
 * VÉRTICE — Walk-in Closet & Live Model Atelier (Higgsfield Level)
 * Interactive logic:
 * 1. Physical closet cabinet on the right with brass-hanging luxury garments.
 * 2. Clicking any garment:
 *    - Model immediately dresses with that piece in full studio resolution.
 *    - Closet folds/hides smoothly into the floating "Abrir Armario" trigger.
 *    - The customizer dock directly under the model updates colors, sizes, and price.
 * 3. Clicking any color swatch under the model live-tints the garment.
 * 4. Clicking "Abrir Armario / Cambiar Prenda" unfolds the walk-in closet instantly.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Colección del Armario
  // --------------------------------------------------------------------------
  const closetDatabase = {
    'alpaca-sweater': {
      id: 'alpaca-sweater',
      name: 'The Cumbre | Baby Alpaca Pullover',
      category: 'Punto Fino Cajamarquino',
      price: 1480,
      material: '100% Baby Alpaca de Alta Montaña · Hilado a Mano',
      image: 'imagenes/outfit-terracotta-knit.webp',
      thumb: 'imagenes/alpaca-knit.webp',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Terracota Andino', hex: '#c4734a', filter: 'none' },
        { name: 'Negro Obsidiana', hex: '#16151a', filter: 'grayscale(1) brightness(0.68) contrast(1.2)' },
        { name: 'Camel Arena', hex: '#b38363', filter: 'sepia(0.6) saturate(1.2) hue-rotate(-15deg)' },
        { name: 'Gris Alpaca', hex: '#7a7671', filter: 'grayscale(0.85) brightness(1.05)' },
        { name: 'Azul Cordillera', hex: '#223249', filter: 'hue-rotate(180deg) saturate(1.1) brightness(0.85)' }
      ]
    },
    'leather-jacket': {
      id: 'leather-jacket',
      name: 'Obsidian | Minimalist Moto Jacket',
      category: 'Cuero Genuino',
      price: 2800,
      material: 'Cuero Vacuno Curtido Vegetal · Níquel Satinado',
      image: 'imagenes/outfit-leather-jacket.webp',
      thumb: 'imagenes/leather-jacket.webp',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Negro Obsidiana', hex: '#121115', filter: 'none' },
        { name: 'Café Roble', hex: '#543625', filter: 'sepia(0.8) hue-rotate(-20deg) brightness(0.9)' },
        { name: 'Terracota Rust', hex: '#9c4d28', filter: 'sepia(0.9) hue-rotate(-10deg) saturate(1.4)' }
      ]
    },
    'linen-blazer': {
      id: 'linen-blazer',
      name: 'Arena | Raw Natural Linen Blazer',
      category: 'Sastrería Desestructurada',
      price: 1150,
      material: '100% Lino Orgánico sin Hombreras',
      image: 'imagenes/outfit-linen-blazer.webp',
      thumb: 'imagenes/linen-blazer.webp',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Arena Natural', hex: '#d6cdbd', filter: 'none' },
        { name: 'Blanco Crudo', hex: '#f0ebe1', filter: 'brightness(1.15) contrast(0.95)' },
        { name: 'Verde Salvia', hex: '#5f6f65', filter: 'sepia(0.6) hue-rotate(60deg) saturate(0.8)' }
      ]
    },
    'wool-trousers': {
      id: 'wool-trousers',
      name: 'Andes | Tailored Wool Trousers',
      category: 'Pantalón Sastre',
      price: 750,
      material: 'Lana Andina con Pinzas Suaves',
      image: 'imagenes/outfit-wool-trousers.webp',
      thumb: 'imagenes/wool-trousers.webp',
      sizes: ['38', '40', '42', '44'],
      colors: [
        { name: 'Gris Carbón', hex: '#343338', filter: 'none' },
        { name: 'Negro Azabache', hex: '#111013', filter: 'brightness(0.6)' },
        { name: 'Marrón Nogal', hex: '#4a382a', filter: 'sepia(0.8) hue-rotate(-15deg)' }
      ]
    },
    'vertice-boots': {
      id: 'vertice-boots',
      name: 'Heritage | Vértice Goodyear Boots',
      category: 'Calzado Artesanal',
      price: 980,
      material: 'Construcción Goodyear Welt & Cuero Vacuno',
      image: 'imagenes/outfit-leather-jacket.webp',
      thumb: 'imagenes/vertice-boots.webp',
      sizes: ['39', '40', '41', '42', '43'],
      colors: [
        { name: 'Cuero Negro', hex: '#1a191d', filter: 'none' },
        { name: 'Cuero Caoba', hex: '#592918', filter: 'sepia(0.9) hue-rotate(-15deg)' }
      ]
    }
  };

  // Estado
  let currentSelection = {
    garmentId: 'alpaca-sweater',
    colorIdx: 0,
    size: 'M',
    closetOpen: true
  };

  // Carrito inicial
  let cart = [
    {
      id: 'alpaca-sweater-Terracota Andino-M',
      name: 'The Cumbre | Baby Alpaca Pullover',
      color: 'Terracota Andino',
      size: 'M',
      price: 1480,
      image: 'imagenes/alpaca-knit.webp',
      quantity: 1
    }
  ];

  // --------------------------------------------------------------------------
  // 2. Elementos DOM
  // --------------------------------------------------------------------------
  const modelFittingImg = document.getElementById('modelFittingImg');
  const stageGarmentTitle = document.getElementById('stageGarmentTitle');
  const stageGarmentCraft = document.getElementById('stageGarmentCraft');
  const stageGarmentPrice = document.getElementById('stageGarmentPrice');
  const pillActiveGarment = document.getElementById('pillActiveGarment');
  const pillActiveColor = document.getElementById('pillActiveColor');
  const pillActiveSize = document.getElementById('pillActiveSize');

  // Armario Cabinet
  const walkinClosetCabinet = document.getElementById('walkinClosetCabinet');
  const closetHangersRail = document.getElementById('closetHangersRail');
  const btnFoldCloset = document.getElementById('btnFoldCloset');
  const btnReopenCloset = document.getElementById('btnReopenCloset');
  const btnHeaderToggleCloset = document.getElementById('btnHeaderToggleCloset');

  // Dock debajo del Modelo
  const dockColorLabel = document.getElementById('dockColorLabel');
  const dockColorsPalette = document.getElementById('dockColorsPalette');
  const dockSizesPalette = document.getElementById('dockSizesPalette');
  const dockTailoringNote = document.getElementById('dockTailoringNote');
  const btnDockBuyYape = document.getElementById('btnDockBuyYape');

  // Carrito / Drawer
  const cartToggleBtn = document.getElementById('cartToggle');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCart');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartBadge = document.getElementById('cartBadge');
  const cartTotalAmount = document.getElementById('cartTotalAmount');
  const btnConfirmYape = document.getElementById('btnConfirmYape');
  const toastContainer = document.getElementById('toastContainer');

  // --------------------------------------------------------------------------
  // 3. Renderizar Armario Físico con Perchas de Latón
  // --------------------------------------------------------------------------
  function renderWalkinCloset() {
    if (!closetHangersRail) return;
    closetHangersRail.innerHTML = '';

    Object.values(closetDatabase).forEach(item => {
      const isSelected = item.id === currentSelection.garmentId;
      const card = document.createElement('div');
      card.className = `luxury-hanger-card ${isSelected ? 'active-in-model' : ''}`;
      card.setAttribute('data-id', item.id);

      card.innerHTML = `
        <div class="brass-hanger-hook">🪝</div>
        <div class="hanger-item-preview">
          <img src="${item.thumb}" alt="${item.name}">
        </div>
        <div class="hanger-item-info">
          <span class="hanger-category-tag">${item.category}</span>
          <h4 class="hanger-garment-title">${item.name}</h4>
          <div class="hanger-garment-price">S/. ${item.price.toLocaleString('es-PE')}.00</div>
          <div class="hanger-action-indicator">${isSelected ? 'PUESTO EN EL MODELO ✓' : 'COLGAR EN EL MODELO &rarr;'}</div>
        </div>
      `;

      card.addEventListener('click', () => {
        currentSelection.garmentId = item.id;
        currentSelection.colorIdx = 0;
        currentSelection.size = item.sizes[1] || item.sizes[0];

        updateModelAndDock();
        
        // Auto-guardar armario suavemente
        setClosetState(false);

        showToast(`✨ Modelo vestido con: ${item.name}`);
      });

      closetHangersRail.appendChild(card);
    });
  }

  function setClosetState(open = true) {
    currentSelection.closetOpen = open;
    if (!walkinClosetCabinet) return;

    if (open) {
      walkinClosetCabinet.style.display = 'flex';
      if (btnReopenCloset) btnReopenCloset.style.display = 'none';
      if (btnHeaderToggleCloset) btnHeaderToggleCloset.innerHTML = `<span>🚪 Guardar Armario</span>`;
    } else {
      walkinClosetCabinet.style.display = 'none';
      if (btnReopenCloset) btnReopenCloset.style.display = 'inline-flex';
      if (btnHeaderToggleCloset) btnHeaderToggleCloset.innerHTML = `<span>🚪 Abrir Armario / Cambiar Prenda</span>`;
    }
    renderWalkinCloset();
  }

  if (btnFoldCloset) btnFoldCloset.addEventListener('click', () => setClosetState(false));
  if (btnReopenCloset) btnReopenCloset.addEventListener('click', () => setClosetState(true));
  if (btnHeaderToggleCloset) btnHeaderToggleCloset.addEventListener('click', () => setClosetState(!currentSelection.closetOpen));

  // --------------------------------------------------------------------------
  // 4. Actualizar Modelo en Escenario y Dock de Opciones Inferiores
  // --------------------------------------------------------------------------
  function updateModelAndDock() {
    const garment = closetDatabase[currentSelection.garmentId];
    if (!garment) return;

    const currentColor = garment.colors[currentSelection.colorIdx] || garment.colors[0];

    // 1. Vestir al modelo con animación suave y filtro
    if (modelFittingImg) {
      modelFittingImg.style.opacity = '0.25';
      modelFittingImg.style.transform = 'scale(0.98)';
      setTimeout(() => {
        modelFittingImg.src = garment.image;
        modelFittingImg.style.filter = currentColor.filter || 'none';
        modelFittingImg.style.opacity = '1';
        modelFittingImg.style.transform = 'scale(1)';
      }, 150);
    }

    // 2. Actualizar Textos y Badges
    if (stageGarmentTitle) stageGarmentTitle.textContent = garment.name;
    if (stageGarmentCraft) stageGarmentCraft.textContent = garment.material;
    if (stageGarmentPrice) stageGarmentPrice.textContent = `S/. ${garment.price.toLocaleString('es-PE')}.00`;
    if (pillActiveGarment) pillActiveGarment.textContent = garment.name;
    if (pillActiveColor) {
      pillActiveColor.innerHTML = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${currentColor.hex};margin-right:6px;border:1px solid rgba(255,255,255,0.4);"></span> ${currentColor.name}`;
    }
    if (pillActiveSize) pillActiveSize.textContent = `Talla ${currentSelection.size}`;

    // 3. Renderizar Colores DEBAJO del Modelo
    if (dockColorsPalette) {
      dockColorsPalette.innerHTML = '';
      if (dockColorLabel) dockColorLabel.textContent = currentColor.name;

      garment.colors.forEach((col, idx) => {
        const disc = document.createElement('button');
        disc.className = `dock-color-disc ${idx === currentSelection.colorIdx ? 'active' : ''}`;
        disc.style.backgroundColor = col.hex;
        disc.title = col.name;
        disc.setAttribute('aria-label', col.name);

        disc.addEventListener('click', () => {
          currentSelection.colorIdx = idx;
          updateModelAndDock();
          showToast(`🎨 Tono aplicado: ${col.name}`);
        });

        const tip = document.createElement('span');
        tip.className = 'color-hover-tooltip';
        tip.textContent = col.name;
        disc.appendChild(tip);

        dockColorsPalette.appendChild(disc);
      });
    }

    // 4. Renderizar Tallas DEBAJO del Modelo
    if (dockSizesPalette) {
      dockSizesPalette.innerHTML = '';
      garment.sizes.forEach(sz => {
        const btn = document.createElement('button');
        btn.className = `dock-size-pill ${sz === currentSelection.size ? 'active' : ''}`;
        btn.textContent = sz;

        btn.addEventListener('click', () => {
          currentSelection.size = sz;
          updateModelAndDock();
          showToast(`📏 Talla seleccionada: ${sz}`);
        });

        dockSizesPalette.appendChild(btn);
      });
    }

    if (dockTailoringNote) {
      dockTailoringNote.textContent = `Talla ${currentSelection.size} activa · Patronaje contemporáneo a 3,000 m.s.n.m. · Cajamarca.`;
    }
  }

  // --------------------------------------------------------------------------
  // 5. Botón Añadir a la Bolsa desde el Dock
  // --------------------------------------------------------------------------
  if (btnDockBuyYape) {
    btnDockBuyYape.addEventListener('click', () => {
      const garment = closetDatabase[currentSelection.garmentId];
      const col = garment.colors[currentSelection.colorIdx];
      
      addToCart({
        id: `${garment.id}-${col.name}-${currentSelection.size}`,
        name: garment.name,
        color: col.name,
        size: currentSelection.size,
        price: garment.price,
        image: garment.thumb
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Carrito y Checkout Yape
  // --------------------------------------------------------------------------
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function toggleCart(open = true) {
    if (!cartOverlay) return;
    if (open) {
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      cartOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (cartToggleBtn) cartToggleBtn.addEventListener('click', () => toggleCart(true));
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) toggleCart(false);
    });
  }

  function renderCart() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align:center; padding: 32px 10px; color: var(--text-dim);">
          <p style="font-size: 2rem; margin-bottom: 8px;">🛍️</p>
          <p style="font-weight: 700; color: #fff; font-size: 0.9rem;">Tu bolsa está vacía</p>
          <p style="font-size: 0.75rem; margin-top: 4px;">Abre el armario para probarte y añadir prendas.</p>
        </div>
      `;
      if (cartBadge) cartBadge.textContent = '0';
      if (cartTotalAmount) cartTotalAmount.textContent = 'S/. 0.00';
      return;
    }

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      count += item.quantity;

      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">Color: <strong>${item.color}</strong> · Talla: <strong>${item.size}</strong> · Cant: ${item.quantity}</div>
          <div class="cart-item-cost">S/. ${(item.price * item.quantity).toLocaleString('es-PE')}.00</div>
        </div>
        <button class="cart-delete-btn" data-index="${index}" title="Eliminar">&times;</button>
      `;
      cartItemsList.appendChild(row);
    });

    if (cartBadge) cartBadge.textContent = count.toString();
    if (cartTotalAmount) cartTotalAmount.textContent = `S/. ${total.toLocaleString('es-PE')}.00`;

    document.querySelectorAll('.cart-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const removed = cart.splice(idx, 1)[0];
        renderCart();
        showToast(`Eliminado: ${removed.name}`);
      });
    });
  }

  function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    renderCart();
    toggleCart(true);
    showToast(`¡Añadido del Armario! ${product.name} (${product.color} / ${product.size})`);
  }

  // Quick Add from Catalog
  document.querySelectorAll('.btn-add-quick').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.bento-catalog-card');
      const id = e.currentTarget.getAttribute('data-id') || 'item-1';
      const name = e.currentTarget.getAttribute('data-name') || 'Prenda Vértice';
      const price = parseFloat(e.currentTarget.getAttribute('data-price') || '1200');
      const image = e.currentTarget.getAttribute('data-image') || 'imagenes/alpaca-knit.webp';
      
      const activeSize = card ? card.querySelector('.size-btn.active') : null;
      const size = activeSize ? activeSize.textContent.trim() : 'M';

      addToCart({
        id: `${id}-${size}`,
        name: name,
        color: 'Color de Catálogo',
        size: size,
        price: price,
        image: image
      });
    });
  });

  // Size buttons in Catalog
  document.querySelectorAll('.size-selector-group').forEach(grp => {
    grp.querySelectorAll('.size-btn').forEach(b => {
      b.addEventListener('click', () => {
        grp.querySelectorAll('.size-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
    });
  });

  // Confirmar Pago Yape
  if (btnConfirmYape) {
    btnConfirmYape.addEventListener('click', async () => {
      if (cart.length === 0) {
        showToast('Tu bolsa está vacía.');
        return;
      }

      const clientName = document.getElementById('clientNameInput')?.value || 'Cliente Vértice';
      const clientPhone = document.getElementById('clientPhoneInput')?.value || '976000000';
      const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

      btnConfirmYape.textContent = 'Guardando en Supabase...';
      btnConfirmYape.style.background = '#2A8C5A';

      if (window.verticeDB) {
        await window.verticeDB.saveYapeOrder({
          clientName,
          phone: clientPhone,
          total: total,
          items: cart
        });
      }

      setTimeout(() => {
        alert(`🎉 ¡Pedido con Yape Registrado con Éxito!\n\nMonto: S/. ${total.toLocaleString('es-PE')}.00\nTitular: Frank Abanto (VÉRTICE)\nNúmero Yape: 976 000 000\n\nTu orden personalizada ha sido guardada en Supabase.`);
        cart = [];
        renderCart();
        toggleCart(false);
        btnConfirmYape.textContent = 'CONFIRMAR PAGO CON YAPE';
        btnConfirmYape.style.background = '';
      }, 1000);
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const head = item.querySelector('.faq-head');
    if (head) {
      head.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
      });
    }
  });

  // Inicialización
  renderWalkinCloset();
  updateModelAndDock();
  renderCart();
});
