# 🦙 VÉRTICE — Moda Masculina Contemporánea (AW26)

<div align="center">
  <p align="center">
    <strong>Probador Virtual Reactivo · Sastrería Andina de Lujo · Checkout Directo con Yape QR</strong>
  </p>

  <p align="center">
    <a href="https://frankusqabant.github.io/vertice-moda/">
      <img src="https://img.shields.io/badge/🌐_Demo_en_Vivo-GitHub_Pages-2A8C5A?style=for-the-badge&logo=github&logoColor=white" alt="Demo en Vivo" />
    </a>
    <img src="https://img.shields.io/badge/Yape-Pagos_Instantáneos-720e9e?style=for-the-badge" alt="Yape" />
    <img src="https://img.shields.io/badge/Database-Supabase_Free_Tier-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Imágenes-100%25%20WebP%20Optimizado-f39c12?style=for-the-badge" alt="WebP" />
  </p>

  <br />

  <a href="https://frankusqabant.github.io/vertice-moda/">
    <img src="imagenes/readme/preview-vertice.webp" alt="Vista previa de VÉRTICE" width="880" style="border-radius: 14px; box-shadow: 0 12px 36px rgba(0,0,0,0.6);" />
  </a>

  <br><br>
</div>

---

## 🏔️ Sobre el Proyecto

**VÉRTICE** es una plataforma e-commerce de moda masculina de vanguardia inspirada en la cordillera y el ecosistema altoandino de **Cajamarca, Perú** (a más de 3,000 m.s.n.m.).

Combina la artesanía tradicional andina (100% fibra de Alpaca Baby, lino orgánico y cuero con curtido vegetal) con una experiencia interactiva digital que incluye:
- **Probador Virtual Interactivo (*Wardrobe Switcher*):** El modelo se viste en tiempo real con la prenda seleccionada.
- **Pasarela de Pago con Yape:** Generación de QR dinámico y confirmación inmediata sin comisiones bancarias.
- **Persistencia en Supabase:** Registro de pedidos y catálogo en la nube.
- **100% WebP:** Máximo rendimiento con imágenes ultraligeras.

> 🔗 **Explorar en producción:** [frankusqabant.github.io/vertice-moda](https://frankusqabant.github.io/vertice-moda/)

---

## ✨ Módulos Implementados

| Módulo | Descripción Técnica |
|---|---|
| 👕 **Probador Virtual en Vivo** | Selector reactivo donde el usuario elige entre Chompa Baby Alpaca, Chaqueta de Cuero, Blazer de Lino o Pantalón y el modelo cambia de atuendo al instante con transición suave. |
| 🟣 **Checkout Yape QR** | Panel lateral deslizable con código QR escaneable, número `976 000 000` y confirmación de pago. |
| 🎛️ **Catálogo Bento "Andean Modernism"** | Rejilla asimétrica con precios en Soles (`S/.`), selectores de talla y badges de material noble. |
| ⚡ **Supabase Free Tier (`js/supabase-client.js`)** | Conexión con Supabase para almacenamiento de órdenes con fallback a LocalStorage. |
| 📸 **Lookbook & Origen Andino** | Galería fotográfica editorial y documental de artesanos cajamarquinos. |
| 📐 **Guía de Tallas & FAQ** | Tabla de medidas y acordeón interactivo de envíos a todo el Perú (24-48h). |

---

## 🚀 Ejecución en Entorno Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/FrankUsqAbant/vertice-moda.git

# 2. Entrar al directorio
cd vertice-moda

# 3. Iniciar servidor local
python -m http.server 3001
# o
npx serve -l 3001 .
```

Abre tu navegador en `http://localhost:3001`.

---

<div align="center">
  <sub>© 2026 VÉRTICE · Cajamarca, Perú · Desarrollado por <strong>Frank Abanto</strong></sub>
</div>