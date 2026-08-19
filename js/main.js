/**
 * VÉRTICE — Digital Wardrobe & Virtual Fitting Room
 * Interactivity:
 * - Vértice Fit Console (Selected Items & Outfit Switcher)
 * - Model Live Fitting Viewport with architectural studio lighting
 * - Floating Product Carousel Card (Next/Prev buttons & pagination dots)
 * - Bento Grid Catalog (6 products with quick add)
 * - Help & Guidance Accordion with Coats & Trousers size tables
 * - Yape QR Checkout Modal & Supabase integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Colección de Prendas del Probador
  // --------------------------------------------------------------------------
  const wardrobeCollection = [
    {
      id: 'alpaca-coat',
      name: 'Andes Textured Coat',
      category: 'Alpaca Blend Coat',
      tag: 'DEEP BROWN',
      price: 1450,
      image: 'imagenes/outfit-leather-jacket.webp',
      thumb: 'imagenes/leather-jacket.webp'
    },
    {
      id: 'terracotta-sweater',
      name: 'The Cumbre | Baby Alpaca Pullover',
      category: 'Cashmere Sweater',
      tag: 'RAW AMBER',
      price: 680,
      image: 'imagenes/outfit-terracotta-knit.webp',
      thumb: 'imagenes/alpaca-knit.webp'
    },
    {
      id: 'wool-trousers',
      name: 'Andes Tailored Trousers',
      category: 'Wool Trousers',
      tag: 'DEEP OBSIDIAN',
      price: 1600,
      image: 'imagenes/outfit-wool-trousers.webp',
      thumb: 'imagenes/wool-trousers.webp'
    },
    {
      id: 'linen-blazer',
      name: 'Raw Natural Linen Blazer',
      category: 'Linen Blazers',
      tag: 'EARTH BROWN',
      price: 820,
      image: 'imagenes/outfit-linen-blazer.webp',
      thumb: 'imagenes/linen-blazer.webp'
    },
    {
      id: 'leather-boots',
      name: 'Vértice Heritage Desert Boots',
      category: 'Leather Boots',
      tag: 'VEG TANNED',
      price: 920,
      image: 'imagenes/outfit-leather-jacket.webp',
      thumb: 'imagenes/vertice-boots.webp'
    }
  ];

  let activeIndex = 1; // Default: Terracotta Baby Alpaca Sweater
  let cart = [
    {
      id: 'terracotta-sweater',
      name: 'The Cumbre | Baby Alpaca Pullover',
      price: 680,
      image: 'imagenes/alpaca-knit.webp',
      quantity: 1
    }
  ];

  // --------------------------------------------------------------------------
  // 2. Elementos DOM
  // --------------------------------------------------------------------------
  const mainFittingModelImg = document.getElementById('mainFittingModelImg');
  const carouselCardImg = document.getElementById('carouselCardImg');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');
  const btnTryOnThisLook = document.getElementById('btnTryOnThisLook');
  const outfitPillBtns = document.querySelectorAll('.outfit-pill-btn');
  const selectedItemCards = document.querySelectorAll('.selected-item-card');

  // Modal Yape
  const yapeModalBackdrop = document.getElementById('yapeModalBackdrop');
  const btnCloseYapeModal = document.getElementById('btnCloseYapeModal');
  const btnConfirmPaymentAction = document.getElementById('btnConfirmPaymentAction');
  const yapeModalAmount = document.getElementById('yapeModalAmount');
  const cartToggleNav = document.getElementById('cartToggleNav');
  const toastContainer = document.getElementById('toastContainer');

  // Accordion Help & Guidance
  const accordionItems = document.querySelectorAll('.help-accordion-item');

  // --------------------------------------------------------------------------
  // 3. Actualizar Prenda en el Modelo y Carrusel
  // --------------------------------------------------------------------------
  function setGarment(index) {
    if (index < 0) index = wardrobeCollection.length - 1;
    if (index >= wardrobeCollection.length) index = 0;
    activeIndex = index;

    const item = wardrobeCollection[activeIndex];

    // Animación suave del modelo central
    if (mainFittingModelImg) {
      mainFittingModelImg.style.opacity = '0.35';
      mainFittingModelImg.style.transform = 'scale(0.98)';
      setTimeout(() => {
        mainFittingModelImg.src = item.image;
        mainFittingModelImg.style.opacity = '1';
        mainFittingModelImg.style.transform = 'scale(1)';
      }, 150);
    }

    // Actualizar tarjeta flotante del carrusel derecho
    if (carouselCardImg) {
      carouselCardImg.style.opacity = '0.3';
      setTimeout(() => {
        carouselCardImg.src = item.thumb;
        carouselCardImg.style.opacity = '1';
      }, 150);
    }

    // Actualizar píldoras activas
    outfitPillBtns.forEach((pill, idx) => {
      if (idx === activeIndex) pill.classList.add('active');
      else pill.classList.remove('active');
    });

    // Actualizar items seleccionados
    selectedItemCards.forEach((card, idx) => {
      if (idx === activeIndex % 3) card.classList.add('active');
      else card.classList.remove('active');
    });

    // Actualizar monto en el botón y modal
    if (btnTryOnThisLook) {
      btnTryOnThisLook.textContent = `TRY ON THIS LOOK (S/. ${item.price.toLocaleString('es-PE')})`;
    }
    if (yapeModalAmount) {
      yapeModalAmount.textContent = `AMOUNT: S/. ${item.price.toLocaleString('es-PE')}.00`;
    }
  }

  // Controles de Carrusel
  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', () => {
      setGarment(activeIndex - 1);
      showToast(`Prenda anterior: ${wardrobeCollection[activeIndex].name}`);
    });
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', () => {
      setGarment(activeIndex + 1);
      showToast(`Siguiente prenda: ${wardrobeCollection[activeIndex].name}`);
    });
  }

  // Outfit Switcher Pills
  outfitPillBtns.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      setGarment(idx);
      showToast(`Seleccionado: ${wardrobeCollection[activeIndex].name}`);
    });
  });

  // Selected Items Click
  selectedItemCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      setGarment(idx);
      showToast(`Visualizando: ${wardrobeCollection[activeIndex].name}`);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Modal Yape QR Checkout
  // --------------------------------------------------------------------------
  function toggleYapeModal(open = true) {
    if (!yapeModalBackdrop) return;
    if (open) {
      yapeModalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      yapeModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (btnTryOnThisLook) {
    btnTryOnThisLook.addEventListener('click', () => {
      const item = wardrobeCollection[activeIndex];
      cart = [{ ...item, quantity: 1 }];
      if (yapeModalAmount) {
        yapeModalAmount.textContent = `AMOUNT: S/. ${item.price.toLocaleString('es-PE')}.00`;
      }
      toggleYapeModal(true);
    });
  }

  if (cartToggleNav) {
    cartToggleNav.addEventListener('click', () => toggleYapeModal(true));
  }

  if (btnCloseYapeModal) {
    btnCloseYapeModal.addEventListener('click', () => toggleYapeModal(false));
  }

  if (yapeModalBackdrop) {
    yapeModalBackdrop.addEventListener('click', (e) => {
      if (e.target === yapeModalBackdrop) toggleYapeModal(false);
    });
  }

  if (btnConfirmPaymentAction) {
    btnConfirmPaymentAction.addEventListener('click', async () => {
      const item = wardrobeCollection[activeIndex];
      btnConfirmPaymentAction.textContent = 'Guardando en Supabase...';
      btnConfirmPaymentAction.style.background = '#2A8C5A';

      if (window.verticeDB) {
        await window.verticeDB.saveYapeOrder({
          clientName: 'Cliente VÉRTICE',
          phone: '976000000',
          total: item.price,
          items: cart
        });
      }

      setTimeout(() => {
        alert(`🎉 ¡Pago con Yape Registrado con Éxito!\n\nPrenda: ${item.name}\nMonto: S/. ${item.price.toLocaleString('es-PE')}.00\nNúmero: 976 000 000 (Frank Abanto - VÉRTICE)\n\nTu pedido ha sido guardado en Supabase.`);
        toggleYapeModal(false);
        btnConfirmPaymentAction.textContent = 'CONFIRM PAYMENT';
        btnConfirmPaymentAction.style.background = '';
      }, 900);
    });
  }

  // --------------------------------------------------------------------------
  // 5. Help & Guidance Accordion
  // --------------------------------------------------------------------------
  accordionItems.forEach(item => {
    const header = item.querySelector('.help-accordion-header');
    const icon = item.querySelector('.help-accordion-icon');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        accordionItems.forEach(i => {
          i.classList.remove('active');
          const ic = i.querySelector('.help-accordion-icon');
          if (ic) ic.textContent = '+';
        });
        if (!isOpen) {
          item.classList.add('active');
          if (icon) icon.textContent = '−';
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 6. Bento Grid Quick Click
  // --------------------------------------------------------------------------
  document.querySelectorAll('.bento-product-card').forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (idx < wardrobeCollection.length) {
        setGarment(idx);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`👗 Probando en el modelo: ${wardrobeCollection[idx].name}`);
      }
    });
  });

  // Toast
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

  // Inicialización
  setGarment(1);
});
