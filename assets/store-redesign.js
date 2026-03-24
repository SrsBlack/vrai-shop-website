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
    const thumbs = page.querySelectorAll('[data-vrai-thumb]');

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
        featuredImage.srcset = '';
        var trigger = page.querySelector('[data-vrai-open-zoom]');
        if (trigger) {
          trigger.setAttribute('data-vrai-zoom-src', variant.featured_image.src);
        }
      }

      if (thumbs.length) {
        thumbs.forEach(function (thumb) {
          thumb.classList.remove('is-active');
          thumb.setAttribute('aria-pressed', 'false');
        });
      }
    });
  }

  function initProductGalleryUI() {
    var page = document.querySelector('.vrai-product-page');
    if (!page) return;

    var featuredImage = page.querySelector('.vrai-product__featured');
    var featuredTrigger = page.querySelector('[data-vrai-open-zoom]');
    var thumbs = page.querySelectorAll('[data-vrai-thumb]');
    var modal = page.querySelector('[data-vrai-image-modal]');
    var modalImage = page.querySelector('[data-vrai-modal-image]');
    var closeButton = page.querySelector('[data-vrai-close-zoom]');
    var lastFocused = null;

    if (!featuredImage) return;
    if (page.dataset.vraiGalleryInit === 'true') return;
    page.dataset.vraiGalleryInit = 'true';

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var fullSrc = thumb.getAttribute('data-vrai-thumb-full');
        var zoomSrc = thumb.getAttribute('data-vrai-thumb-zoom');
        var imageAlt = thumb.getAttribute('data-vrai-thumb-alt') || featuredImage.alt || '';

        if (fullSrc) {
          featuredImage.src = fullSrc;
          featuredImage.srcset = '';
        }

        featuredImage.alt = imageAlt;

        if (zoomSrc && featuredTrigger) {
          featuredTrigger.setAttribute('data-vrai-zoom-src', zoomSrc);
        }

        thumbs.forEach(function (candidate) {
          candidate.classList.remove('is-active');
          candidate.setAttribute('aria-pressed', 'false');
        });
        thumb.classList.add('is-active');
        thumb.setAttribute('aria-pressed', 'true');
      });
    });

    function openModal() {
      if (!modal || !modalImage) return;
      lastFocused = document.activeElement;
      var zoomSrc = (featuredTrigger && featuredTrigger.getAttribute('data-vrai-zoom-src')) || featuredImage.currentSrc || featuredImage.src;
      modalImage.src = zoomSrc;
      modalImage.alt = featuredImage.alt || '';
      modal.hidden = false;
      requestAnimationFrame(function () { modal.classList.add('is-visible'); });
      document.body.classList.add('vrai-no-scroll');
      if (closeButton) {
        closeButton.focus();
      }
    }

    function closeModal() {
      if (!modal || !modalImage) return;
      modal.classList.remove('is-visible');
      modal.hidden = true;
      modalImage.removeAttribute('src');
      document.body.classList.remove('vrai-no-scroll');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    if (featuredTrigger) {
      featuredTrigger.addEventListener('click', openModal);
    }

    if (closeButton) {
      closeButton.addEventListener('click', closeModal);
    }

    if (modal) {
      modal.addEventListener('click', function (event) {
        if (event.target === modal) {
          closeModal();
        }
      });
    }

    page.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal && !modal.hidden) {
        closeModal();
      }

      if (event.key === 'Tab' && modal && !modal.hidden && closeButton) {
        event.preventDefault();
        closeButton.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initProductVariantUI();
      initProductGalleryUI();
      initScrollReveal();
    });
  } else {
    initProductVariantUI();
    initProductGalleryUI();
    initScrollReveal();
  }
})();