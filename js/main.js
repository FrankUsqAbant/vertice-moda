/**
 * VÉRTICE — Armario Digital & Probador Virtual en Vivo
 * Cajamarca, Perú
 * 
 * Funcionalidades:
 * - Consola Vértice Fit: Selección de prendas y cambio de atuendo en vivo sobre el modelo.
 * - Carrusel de productos derecho con flechas y paginación.
 * - Catálogo Bento con 6 productos y vista previa.
 * - Acordeón interactivo de Guía de Tallas (Abrigos y Pantalones).
 * - Modal de Pago Yape con QR oficial de Franquer Vidal Usquiza Abanto.
 * - Integración con Supabase y fallback a almacenamiento local seguro.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Catálogo del Armario
  // --------------------------------------------------------------------------
  const coleccionArmario = [
    {
      id: 'alpaca-coat',
      name: 'Abrigo Texturizado Andes',
      categoria: 'Abrigo de Alpaca',
      etiqueta: 'MARRÓN PROFUNDO',
      precio: 1450,
      imagen: 'imagenes/outfit-leather-jacket.webp',
      miniatura: 'imagenes/leather-jacket.webp'
    },
    {
      id: 'terracotta-sweater',
      name: 'Chompa The Cumbre Baby Alpaca',
      categoria: 'Chompa Baby Alpaca',
      etiqueta: 'ÁMBAR NATURAL',
      precio: 680,
      imagen: 'imagenes/outfit-terracotta-knit.webp',
      miniatura: 'imagenes/alpaca-knit.webp'
    },
    {
      id: 'wool-trousers',
      name: 'Pantalón Sastre de Lana',
      categoria: 'Pantalón de Lana',
      etiqueta: 'OBSIDIANA PURA',
      precio: 1600,
      imagen: 'imagenes/outfit-wool-trousers.webp',
      miniatura: 'imagenes/wool-trousers.webp'
    },
    {
      id: 'linen-blazer',
      name: 'Pantalón Slim Lima',
      categoria: 'Pantalón Slim',
      etiqueta: 'TIERRA ANDINA',
      precio: 820,
      imagen: 'imagenes/outfit-linen-blazer.webp',
      miniatura: 'imagenes/linen-blazer.webp'
    },
    {
      id: 'leather-boots',
      name: 'Botas de Cuero Desert',
      categoria: 'Botas de Cuero',
      etiqueta: 'CURTIDO VEGETAL',
      precio: 920,
      imagen: 'imagenes/outfit-leather-jacket.webp',
      miniatura: 'imagenes/vertice-boots.webp'
    }
  ];

  let indiceActivo = 1; // Por defecto: Chompa Baby Alpaca
  let carrito = [
    {
      id: 'terracotta-sweater',
      name: 'Chompa The Cumbre Baby Alpaca',
      precio: 680,
      imagen: 'imagenes/alpaca-knit.webp',
      cantidad: 1
    }
  ];

  // --------------------------------------------------------------------------
  // 2. Elementos del DOM
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

  // Acordeón de Ayuda y Tallas
  const accordionItems = document.querySelectorAll('.help-accordion-item');

  // --------------------------------------------------------------------------
  // 3. Actualizar Prenda en el Modelo y Carrusel
  // --------------------------------------------------------------------------
  function cambiarPrenda(indice) {
    if (indice < 0) indice = coleccionArmario.length - 1;
    if (indice >= coleccionArmario.length) indice = 0;
    indiceActivo = indice;

    const item = coleccionArmario[indiceActivo];

    // Animación fluida sobre el modelo
    if (mainFittingModelImg) {
      mainFittingModelImg.style.opacity = '0.35';
      mainFittingModelImg.style.transform = 'scale(0.98)';
      setTimeout(() => {
        mainFittingModelImg.src = item.imagen;
        mainFittingModelImg.style.opacity = '1';
        mainFittingModelImg.style.transform = 'scale(1)';
      }, 150);
    }

    // Actualizar tarjeta del carrusel flotante
    if (carouselCardImg) {
      carouselCardImg.style.opacity = '0.3';
      setTimeout(() => {
        carouselCardImg.src = item.miniatura;
        carouselCardImg.style.opacity = '1';
      }, 150);
    }

    // Actualizar botones de selector
    outfitPillBtns.forEach((pill, idx) => {
      if (idx === indiceActivo) pill.classList.add('active');
      else pill.classList.remove('active');
    });

    // Actualizar prendas seleccionadas
    selectedItemCards.forEach((card, idx) => {
      if (idx === indiceActivo % 3) card.classList.add('active');
      else card.classList.remove('active');
    });

    // Actualizar precio en botón y modal
    if (btnTryOnThisLook) {
      btnTryOnThisLook.textContent = `PROBAR ESTE LOOK (S/. ${item.precio.toLocaleString('es-PE')})`;
    }
    if (yapeModalAmount) {
      yapeModalAmount.textContent = `MONTO A PAGAR: S/. ${item.precio.toLocaleString('es-PE')}.00`;
    }
  }

  // Controles de Carrusel
  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', () => {
      cambiarPrenda(indiceActivo - 1);
      mostrarNotificacion(`Prenda: ${coleccionArmario[indiceActivo].name}`);
    });
  }

  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', () => {
      cambiarPrenda(indiceActivo + 1);
      mostrarNotificacion(`Prenda: ${coleccionArmario[indiceActivo].name}`);
    });
  }

  // Píldoras de Selector de Prenda
  outfitPillBtns.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      cambiarPrenda(idx);
      mostrarNotificacion(`Seleccionado: ${coleccionArmario[indiceActivo].name}`);
    });
  });

  // Clic en Prendas Seleccionadas
  selectedItemCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      cambiarPrenda(idx);
      mostrarNotificacion(`Visualizando: ${coleccionArmario[indiceActivo].name}`);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Modal de Pago con Yape QR
  // --------------------------------------------------------------------------
  function toggleModalYape(abrir = true) {
    if (!yapeModalBackdrop) return;
    if (abrir) {
      yapeModalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      yapeModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (btnTryOnThisLook) {
    btnTryOnThisLook.addEventListener('click', () => {
      const item = coleccionArmario[indiceActivo];
      carrito = [{ ...item, cantidad: 1 }];
      if (yapeModalAmount) {
        yapeModalAmount.textContent = `MONTO A PAGAR: S/. ${item.precio.toLocaleString('es-PE')}.00`;
      }
      toggleModalYape(true);
    });
  }

  if (cartToggleNav) {
    cartToggleNav.addEventListener('click', () => toggleModalYape(true));
  }

  if (btnCloseYapeModal) {
    btnCloseYapeModal.addEventListener('click', () => toggleModalYape(false));
  }

  if (yapeModalBackdrop) {
    yapeModalBackdrop.addEventListener('click', (e) => {
      if (e.target === yapeModalBackdrop) toggleModalYape(false);
    });
  }

  if (btnConfirmPaymentAction) {
    btnConfirmPaymentAction.addEventListener('click', async () => {
      const item = coleccionArmario[indiceActivo];
      btnConfirmPaymentAction.textContent = 'Guardando pedido en Supabase...';
      btnConfirmPaymentAction.style.background = '#2A8C5A';

      if (window.verticeDB) {
        await window.verticeDB.saveYapeOrder({
          clientName: 'Cliente VÉRTICE Cajamarca',
          phone: '976000000',
          total: item.precio,
          items: carrito
        });
      }

      setTimeout(() => {
        alert(`🎉 ¡Pago con Yape Registrado con Éxito!\n\nPrenda: ${item.name}\nMonto: S/. ${item.precio.toLocaleString('es-PE')}.00\nTitular: Franquer Vidal Usquiza Abanto\n\nTu pedido ha sido guardado exitosamente.`);
        toggleModalYape(false);
        btnConfirmPaymentAction.textContent = 'CONFIRMAR PAGO';
        btnConfirmPaymentAction.style.background = '';
      }, 900);
    });
  }

  // --------------------------------------------------------------------------
  // 5. Acordeón de Guía de Tallas y Preguntas Frecuentes
  // --------------------------------------------------------------------------
  accordionItems.forEach(item => {
    const header = item.querySelector('.help-accordion-header');
    const icon = item.querySelector('.help-accordion-icon');
    if (header) {
      header.addEventListener('click', () => {
        const estaAbierto = item.classList.contains('active');
        accordionItems.forEach(i => {
          i.classList.remove('active');
          const ic = i.querySelector('.help-accordion-icon');
          if (ic) ic.textContent = '+';
        });
        if (!estaAbierto) {
          item.classList.add('active');
          if (icon) icon.textContent = '−';
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 6. Clic en Productos del Catálogo Bento
  // --------------------------------------------------------------------------
  document.querySelectorAll('.bento-product-card').forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (idx < coleccionArmario.length) {
        cambiarPrenda(idx);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        mostrarNotificacion(`👗 Probando en el modelo: ${coleccionArmario[idx].name}`);
      }
    });
  });

  // Notificaciones Toast
  function mostrarNotificacion(mensaje) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> <span>${mensaje}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Inicialización
  cambiarPrenda(1);
});
