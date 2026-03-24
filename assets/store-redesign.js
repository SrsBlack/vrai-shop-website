(function () {
  'use strict';

  /* ── Scroll-reveal animation ── */
  function initScrollReveal() {
    var els = document.querySelectorAll('.vrai-reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('vrai-reveal--visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('vrai-reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  function formatMoneyFromExistingDisplay(cents, fallbackDisplay) {
    if (!fallbackDisplay) return '';
    const digits = fallbackDisplay.replace(/\d+[\d,.]*/g, '').trim();
    const value = (Number(cents) / 100).toFixed(2);
    return digits ? `${digits} ${value}` : `$${value}`;
  }

  function initProductVariantUI() {
    const page = document.querySelector('.vrai-product-page');
    if (!page) return;

    const variantSelect = page.querySelector('[data-vrai-variant-select]');
    const variantsNode = document.querySelector('[data-vrai-variants]');
    const priceNode = page.querySelector('[data-vrai-price]');
    const compareNode = page.querySelector('[data-vrai-compare]');
    const submitButton = page.querySelector('[data-vrai-submit]');
    const featuredImage = page.querySelector('.vrai-product__featured');

    if (!variantSelect || !variantsNode || !priceNode || !submitButton) return;

    let variants = [];
    try {
      variants = JSON.parse(variantsNode.textContent || '[]');
    } catch {
      return;
    }

    const initialPrice = priceNode.textContent.trim();

    variantSelect.addEventListener('change', function () {
      const selectedId = Number(variantSelect.value);
      const variant = variants.find(function (v) {
        return v.id === selectedId;
      });

      if (!variant) return;

      const formattedPrice = formatMoneyFromExistingDisplay(variant.price, initialPrice);
      if (formattedPrice) {
        priceNode.textContent = formattedPrice;
      }

      if (compareNode) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          compareNode.hidden = false;
          compareNode.textContent = formatMoneyFromExistingDisplay(variant.compare_at_price, initialPrice);
        } else {
          compareNode.hidden = true;
          compareNode.textContent = '';
        }
      }

      if (variant.available) {
        submitButton.disabled = false;
        submitButton.textContent = 'Add to cart';
      } else {
        submitButton.disabled = true;
        submitButton.textContent = 'Sold out';
      }

      if (featuredImage && variant.featured_image && variant.featured_image.src) {
        featuredImage.src = variant.featured_image.src;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initProductVariantUI();
      initScrollReveal();
    });
  } else {
    initProductVariantUI();
    initScrollReveal();
  }
})();