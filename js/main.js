/**
 * VÉRTICE — Probador Virtual Interactivo & Checkout Yape
 * Lógica fiel a la maqueta oficial (ver-diseno.html):
 * - Selección de prendas en el armario interactivo (viste al modelo en vivo).
 * - Selector de color reactivo con filtro CSS en el modelo.
 * - Selector de tallas (S, M, L, XL).
 * - Checkout directo con Yape QR & Supabase.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Base de Datos de Prendas del Probador
  // --------------------------------------------------------------------------
  const closetDatabase = {
    'alpaca-sweater': {
      id: 'alpaca-sweater',
      name: 'The Cumbre | Baby Alpaca Pullover',
      category: 'Punto Fino · Cajamarca',
      price: 1480,
      material: '100% Baby Alpaca cajamarquina · Hilado tradicional a mano',
      desc: 'Fibra noble termorreguladora de alta montaña a 3,000 m.s.n.m. Textura ultraligera, suave y sin sensación de picor.',
      image: 'imagenes/outfit-terracotta-knit.webp',
      thumb: 'imagenes/alpaca-knit.webp',
      sizes: ['S', 'M', 'L', 'XL'],
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
      category: 'Cuero Genuino · Curtido Vegetal',
      price: 2800,
      material: '100% Cuero Vacuno de Grano Completo · Herrajes en Níquel',
      desc: 'Corte anatómico moderno tratado con extractos botánicos libres de cromo. Forro térmico de seda transpirable.',
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
      material: '100% Lino Orgánico Europeo sin Hombreras',
      desc: 'Silueta fluida con caída relajada para clima templado. Textura rústica refinada con botones de cuerno natural reciclado.',
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
      category: 'Pantalón Sastre · Lana Andina',
      price: 750,
      material: 'Lana Andina Peinada con Pinzas Suaves',
      desc: 'Patronaje cónico contemporáneo con ajuste perfecto en cintura y caída limpia sobre el calzado.',
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
      category: 'Calzado Artesanal · Goodyear Welt',
      price: 980,
      material: 'Construcción Goodyear Welt & Suela de Caucho Natural',
      desc: 'Cosido a mano para máxima durabilidad y resistencia al agua en senderos andinos y asfalto urbano.',
      image: 'imagenes/outfit-leather-jacket.webp',
      thumb: 'imagenes/vertice-boots.webp',
      sizes: ['39', '40', '41', '42', '43'],
      colors: [
        { name: 'Cuero Negro', hex: '#1a191d', filter: 'none' },
        { name: 'Cuero Caoba', hex: '#592918', filter: 'sepia(0.9) hue-rotate(-15deg)' }
      ]
    }
  };

  // Estado del Probador
  let currentSelection = {
    garmentId: 'alpaca-sweater',
    colorIdx: 0,
    size: 'M'
  };

  // Carrito de compras inicial
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
  // 2. Elementos del DOM
  // --------------------------------------------------------------------------
  const modelFittingImg = document.getElementById('modelFittingImg');
  const modelTitleDisplay = document.getElementById('modelTitleDisplay');
  const modelCraftDisplay = document.getElementById('modelCraftDisplay');
  const modelPriceDisplay = document.getElementById('modelPriceDisplay');

  // Panel derecho de personalización
  const customizerTag = document.getElementById('customizerTag');
  const customizerTitle = document.getElementById('customizerTitle');
  const customizerPrice = document.getElementById('customizerPrice');
  const customizerDesc = document.getElementById('customizerDesc');
  const wardrobeThumbnails = document.getElementById('wardrobeThumbnails');
  const colorSwatchesContainer = document.getElementById('colorSwatchesContainer');
  const colorLabelDisplay = document.getElementById('colorLabelDisplay');
  const sizePillsContainer = document.getElementById('sizePillsContainer');
  const btnBuyWithYape = document.getElementById('btnBuyWithYape');

  // Carrito / Drawer Yape
  const cartToggleBtn = document.getElementById('cartToggle');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCart');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartBadge = document.getElementById('cartBadge');
  const cartTotalAmount = document.getElementById('cartTotalAmount');
  const btnConfirmYape = document.getElementById('btnConfirmYape');
  const toastContainer = document.getElementById('toastContainer');

  // --------------------------------------------------------------------------
  // 3. Renderizar Thumbnails del Armario
  // --------------------------------------------------------------------------
  function renderWardrobeThumbs() {
    if (!wardrobeThumbnails) return;
    wardrobeThumbnails.innerHTML = '';

    Object.values(closetDatabase).forEach(item => {
      const isSelected = item.id === currentSelection.garmentId;
      const btn = document.createElement('button');
      btn.className = `wardrobe-thumb-btn ${isSelected ? 'active' : ''}`;
      btn.setAttribute('data-id', item.id);

      btn.innerHTML = `
        <div class="wardrobe-thumb-img">
          <img src="${item.thumb}" alt="${item.name}">
        </div>
        <span class="wardrobe-thumb-name">${item.name.split('|')[0].trim()}</span>
      `;

      btn.addEventListener('click', () => {
        currentSelection.garmentId = item.id;
        currentSelection.colorIdx = 0;
        currentSelection.size = item.sizes[1] || item.sizes[0];
        updateModelAndCustomizer();
        renderWardrobeThumbs();
        showToast(`✨ Probador: ${item.name}`);
      });

      wardrobeThumbnails.appendChild(btn);
    });
  }

  // --------------------------------------------------------------------------
  // 4. Actualizar Vista del Modelo & Controles
  // --------------------------------------------------------------------------
  function updateModelAndCustomizer() {
    const item = closetDatabase[currentSelection.garmentId];
    if (!item) return;

    const activeColor = item.colors[currentSelection.colorIdx] || item.colors[0];

    // 1. Vestir al modelo con animación suave y filtro de color
    if (modelFittingImg) {
      modelFittingImg.style.opacity = '0.3';
      modelFittingImg.style.transform = 'scale(0.98)';
      setTimeout(() => {
        modelFittingImg.src = item.image;
        modelFittingImg.style.filter = activeColor.filter || 'none';
        modelFittingImg.style.opacity = '1';
        modelFittingImg.style.transform = 'scale(1)';
      }, 150);
    }

    // 2. Actualizar Textos
    if (modelTitleDisplay) modelTitleDisplay.textContent = item.name;
    if (modelCraftDisplay) modelCraftDisplay.textContent = item.material;
    if (modelPriceDisplay) modelPriceDisplay.textContent = `S/. ${item.price.toLocaleString('es-PE')}.00`;

    if (customizerTag) customizerTag.textContent = item.category;
    if (customizerTitle) customizerTitle.textContent = item.name;
    if (customizerPrice) customizerPrice.textContent = `S/. ${item.price.toLocaleString('es-PE')}.00`;
    if (customizerDesc) customizerDesc.textContent = item.desc;
    if (colorLabelDisplay) colorLabelDisplay.textContent = activeColor.name;

    // 3. Renderizar Muestras de Color
    if (colorSwatchesContainer) {
      colorSwatchesContainer.innerHTML = '';
      item.colors.forEach((col, idx) => {
        const swatch = document.createElement('button');
        swatch.className = `swatch-circle-btn ${idx === currentSelection.colorIdx ? 'active' : ''}`;
        swatch.style.backgroundColor = col.hex;
        swatch.title = col.name;
        swatch.setAttribute('aria-label', col.name);

        swatch.addEventListener('click', () => {
          currentSelection.colorIdx = idx;
          updateModelAndCustomizer();
          showToast(`🎨 Color aplicado: ${col.name}`);
        });

        colorSwatchesContainer.appendChild(swatch);
      });
    }

    // 4. Renderizar Tallas
    if (sizePillsContainer) {
      sizePillsContainer.innerHTML = '';
      item.sizes.forEach(sz => {
        const pill = document.createElement('button');
        pill.className = `size-pill-btn ${sz === currentSelection.size ? 'active' : ''}`;
        pill.textContent = sz;

        pill.addEventListener('click', () => {
          currentSelection.size = sz;
          updateModelAndCustomizer();
          showToast(`📏 Talla: ${sz}`);
        });

        sizePillsContainer.appendChild(pill);
      });
    }

    // 5. Actualizar Botón CTA
    if (btnBuyWithYape) {
      btnBuyWithYape.innerHTML = `<span>COMPRAR AHORA CON YAPE (S/. ${item.price.toLocaleString('es-PE')}.00)</span> <span>⚡</span>`;
    }
  }

  // --------------------------------------------------------------------------
  // 5. Botón de Compra Directa con Yape
  // --------------------------------------------------------------------------
  if (btnBuyWithYape) {
    btnBuyWithYape.addEventListener('click', () => {
      const item = closetDatabase[currentSelection.garmentId];
      const col = item.colors[currentSelection.colorIdx];
      
      addToCart({
        id: `${item.id}-${col.name}-${currentSelection.size}`,
        name: item.name,
        color: col.name,
        size: currentSelection.size,
        price: item.price,
        image: item.thumb
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Carrito / Drawer & Checkout Yape
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
          <p style="font-size: 0.75rem; margin-top: 4px;">Selecciona prendas del probador virtual para añadirlas.</p>
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
    showToast(`¡Añadido! ${product.name} (${product.color} / ${product.size})`);
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

  // Confirmar Pago Yape con Supabase
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
  renderWardrobeThumbs();
  updateModelAndCustomizer();
  renderCart();
});
