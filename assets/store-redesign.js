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

  function initRelatedCarousel() {
    var carousel = document.querySelector('[data-vrai-carousel]');
    if (!carousel) return;

    var track = carousel.querySelector('[data-vrai-carousel-track]');
    var prevBtn = carousel.querySelector('[data-vrai-carousel-prev]');
    var nextBtn = carousel.querySelector('[data-vrai-carousel-next]');

    if (!track || !prevBtn || !nextBtn) return;

    function updateButtons() {
      var scrollLeft = track.scrollLeft;
      var maxScroll = track.scrollWidth - track.clientWidth;

      prevBtn.disabled = scrollLeft <= 10;
      nextBtn.disabled = scrollLeft >= maxScroll - 10;
    }

    function scrollBy(amount) {
      track.scrollBy({ left: amount, behavior: 'smooth' });
      setTimeout(updateButtons, 400);
    }

    prevBtn.addEventListener('click', function () {
      scrollBy(-320);
    });

    nextBtn.addEventListener('click', function () {
      scrollBy(320);
    });

    track.addEventListener('scroll', updateButtons);
    updateButtons();
  }

  function initStickyAddToCart() {
    var page = document.querySelector('.vrai-product-page');
    if (!page) return;

    var stickyBar = page.querySelector('[data-vrai-sticky-atc]');
    var mainSubmit = page.querySelector('[data-vrai-submit]');
    var stickySubmit = page.querySelector('[data-vrai-sticky-submit]');
    var stickyPrice = page.querySelector('[data-vrai-sticky-price]');
    var mainPrice = page.querySelector('[data-vrai-price]');
    var form = page.querySelector('.vrai-product__form');

    if (!stickyBar || !mainSubmit || !stickySubmit || window.innerWidth > 780) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          stickyBar.hidden = true;
        } else {
          stickyBar.hidden = false;
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 100px 0px' });

    observer.observe(mainSubmit);

    stickySubmit.addEventListener('click', function () {
      if (form) {
        var formData = new FormData(form);
        fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        })
        .then(function (res) { return res.json(); })
        .then(function () {
          window.location.href = '/cart';
        })
        .catch(function (err) {
          console.error('Cart add error:', err);
        });
      }
    });

    var variantSelect = page.querySelector('[data-vrai-variant-select]');
    if (variantSelect && stickyPrice && mainPrice) {
      variantSelect.addEventListener('change', function () {
        setTimeout(function () {
          if (stickyPrice && mainPrice) {
            stickyPrice.textContent = mainPrice.textContent;
          }
        }, 50);
      });
    }
  }

  function initTouchSwipe() {
    var page = document.querySelector('.vrai-product-page');
    if (!page || window.innerWidth > 780) return;

    var featuredImage = page.querySelector('.vrai-product__featured');
    var thumbs = Array.from(page.querySelectorAll('[data-vrai-thumb]'));
    var swipeHint = page.querySelector('[data-vrai-swipe-hint]');

    if (!featuredImage || thumbs.length < 2) return;

    var startX = 0;
    var currentIndex = 0;
    var hasInteracted = false;

    if (swipeHint && !sessionStorage.getItem('vrai_swipe_hint_seen')) {
      setTimeout(function () {
        swipeHint.hidden = false;
        setTimeout(function () {
          swipeHint.hidden = true;
          sessionStorage.setItem('vrai_swipe_hint_seen', 'true');
        }, 3000);
      }, 1500);
    }

    featuredImage.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      hasInteracted = true;
      if (swipeHint && !swipeHint.hidden) swipeHint.hidden = true;
    }, { passive: true });

    featuredImage.addEventListener('touchend', function (e) {
      if (!hasInteracted) return;
      var endX = e.changedTouches[0].clientX;
      var diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < thumbs.length - 1) {
          currentIndex++;
        } else if (diff < 0 && currentIndex > 0) {
          currentIndex--;
        }
        var targetThumb = thumbs[currentIndex];
        if (targetThumb) targetThumb.click();
      }
    }, { passive: true });
  }

  function initQuickView() {
    var modal = document.querySelector('[data-vrai-quickview-modal]');
    if (!modal) return;

    var buttons = document.querySelectorAll('[data-vrai-quickview]');
    var closeBtn = modal.querySelector('[data-vrai-quickview-close]');
    var image = modal.querySelector('[data-vrai-quickview-image]');
    var title = modal.querySelector('[data-vrai-quickview-title]');
    var vendor = modal.querySelector('[data-vrai-quickview-vendor]');
    var price = modal.querySelector('[data-vrai-quickview-price]');
    var link = modal.querySelector('[data-vrai-quickview-link]');
    var availability = modal.querySelector('[data-vrai-quickview-availability]');

    function openModal(btn) {
      var productId = btn.getAttribute('data-product-id');
      var productUrl = btn.getAttribute('data-product-url');
      var productTitle = btn.getAttribute('data-product-title');
      var productVendor = btn.getAttribute('data-product-vendor');
      var productPrice = btn.getAttribute('data-product-price');
      var productImage = btn.getAttribute('data-product-image');
      var productAvailable = btn.getAttribute('data-product-available') === 'true';

      if (image) image.src = productImage;
      if (title) title.textContent = productTitle;
      if (vendor) vendor.textContent = productVendor;
      if (price) price.textContent = productPrice;
      if (link) link.href = productUrl;
      if (availability) {
        availability.textContent = productAvailable ? 'In Stock' : 'Out of Stock';
        availability.className = 'vrai-quickview__availability ' + (productAvailable ? 'is-available' : 'is-unavailable');
      }

      modal.hidden = false;
      requestAnimationFrame(function () {
        modal.classList.add('is-visible');
      });
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-visible');
      setTimeout(function () {
        modal.hidden = true;
        document.body.style.overflow = '';
      }, 200);
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(btn);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  function initSizeGuide() {
    var modal = document.querySelector('[data-vrai-size-guide-modal]');
    if (!modal) return;

    var openBtn = document.querySelector('[data-vrai-size-guide-open]');
    var closeBtn = modal.querySelector('[data-vrai-size-guide-close]');
    var tabs = modal.querySelectorAll('[data-tab]');
    var tabContents = modal.querySelectorAll('[data-tab-content]');

    function openModal() {
      modal.hidden = false;
      requestAnimationFrame(function () {
        modal.classList.add('is-visible');
      });
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove('is-visible');
      setTimeout(function () {
        modal.hidden = true;
        document.body.style.overflow = '';
      }, 200);
    }

    if (openBtn) {
      openBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetTab = tab.getAttribute('data-tab');
        
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');

        tabContents.forEach(function (content) {
          if (content.getAttribute('data-tab-content') === targetTab) {
            content.hidden = false;
          } else {
            content.hidden = true;
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initProductVariantUI();
      initProductGalleryUI();
      initScrollReveal();
      initRelatedCarousel();
      initStickyAddToCart();
      initTouchSwipe();
      initQuickView();
      initSizeGuide();
    });
  } else {
    initProductVariantUI();
    initProductGalleryUI();
    initScrollReveal();
    initRelatedCarousel();
    initStickyAddToCart();
    initTouchSwipe();
    initQuickView();
    initSizeGuide();
  }
})();