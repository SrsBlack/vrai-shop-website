/* ============================================
   VRAI - Core JavaScript
   Wishlist, Size Guide, Cart, UI
   ============================================ */

(function () {
  'use strict';

  /* ---------- Utilities ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function sanitizeText(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Header ---------- */
  const Header = {
    init() {
      this.header = $('.header');
      if (!this.header) return;
      this.lastScroll = 0;
      this.menuToggle = $('.header__menu-toggle');
      this.mobileNav = $('.mobile-nav');

      window.addEventListener('scroll', () => this.onScroll(), { passive: true });

      if (this.menuToggle) {
        this.menuToggle.addEventListener('click', () => this.toggleMobileNav());
      }
    },

    onScroll() {
      const scrollY = window.scrollY;
      if (scrollY > 100 && scrollY > this.lastScroll) {
        this.header.classList.add('header--hidden');
      } else {
        this.header.classList.remove('header--hidden');
      }
      this.lastScroll = scrollY;
    },

    toggleMobileNav() {
      const isOpen = this.menuToggle.getAttribute('aria-expanded') === 'true';
      this.menuToggle.setAttribute('aria-expanded', String(!isOpen));
      this.mobileNav.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    }
  };

  /* ---------- Wishlist ---------- */
  const Wishlist = {
    STORAGE_KEY: 'vrai_wishlist',

    init() {
      this.items = this.load();
      this.updateAllUI();
      this.bindEvents();
    },

    load() {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
      } catch {
        return [];
      }
    },

    save() {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
      } catch {
        // Storage full or unavailable
      }
    },

    has(productId) {
      return this.items.some(item => item.id === productId);
    },

    add(product) {
      if (this.has(product.id)) return;
      this.items.push(product);
      this.save();
      this.updateAllUI();
      Toast.show('Added to wishlist', 'success');
    },

    remove(productId) {
      this.items = this.items.filter(item => item.id !== productId);
      this.save();
      this.updateAllUI();
      Toast.show('Removed from wishlist');
    },

    toggle(product) {
      if (this.has(product.id)) {
        this.remove(product.id);
      } else {
        this.add(product);
      }
    },

    updateAllUI() {
      // Update badge counts
      $$('.header__badge[data-wishlist-count]').forEach(badge => {
        badge.textContent = this.items.length;
        badge.dataset.count = this.items.length;
      });

      // Update heart buttons
      $$('[data-wishlist-toggle]').forEach(btn => {
        const id = btn.dataset.productId;
        btn.classList.toggle('is-active', this.has(id));
        btn.setAttribute('aria-pressed', String(this.has(id)));
      });

      // Update drawer
      this.renderDrawer();
    },

    renderDrawer() {
      const container = $('.wishlist-drawer__items');
      if (!container) return;

      const countEl = $('.wishlist-drawer__count');
      if (countEl) countEl.textContent = `(${this.items.length})`;

      if (this.items.length === 0) {
        container.innerHTML = `
          <div class="wishlist-drawer__empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p>Your wishlist is empty</p>
            <a href="collections.html" class="btn btn-secondary btn-sm">Browse Collection</a>
          </div>`;
        return;
      }

      container.innerHTML = this.items.map(item => `
        <div class="wishlist-item" data-product-id="${sanitizeText(item.id)}">
          <div class="wishlist-item__img">
            <img src="${sanitizeText(item.image)}" alt="${sanitizeText(item.name)}" loading="lazy">
          </div>
          <div class="wishlist-item__info">
            <a href="${sanitizeText(item.url)}" class="wishlist-item__name">${sanitizeText(item.name)}</a>
            <span class="wishlist-item__price">${sanitizeText(item.price)}</span>
            <div class="wishlist-item__actions">
              <button class="wishlist-item__remove" data-wishlist-remove="${sanitizeText(item.id)}" aria-label="Remove ${sanitizeText(item.name)} from wishlist">Remove</button>
            </div>
          </div>
        </div>
      `).join('');
    },

    bindEvents() {
      // Delegate wishlist toggle clicks
      document.addEventListener('click', (e) => {
        const toggle = e.target.closest('[data-wishlist-toggle]');
        if (toggle) {
          e.preventDefault();
          const product = {
            id: toggle.dataset.productId,
            name: toggle.dataset.productName || '',
            price: toggle.dataset.productPrice || '',
            image: toggle.dataset.productImage || '',
            url: toggle.dataset.productUrl || ''
          };
          this.toggle(product);
        }

        const remove = e.target.closest('[data-wishlist-remove]');
        if (remove) {
          e.preventDefault();
          this.remove(remove.dataset.wishlistRemove);
        }
      });
    }
  };

  /* ---------- Wishlist Drawer ---------- */
  const WishlistDrawer = {
    init() {
      this.drawer = $('.wishlist-drawer');
      this.backdrop = $('.wishlist-drawer__backdrop');
      if (!this.drawer) return;

      $$('[data-open-wishlist]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      const closeBtn = $('.wishlist-drawer__close');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      if (this.backdrop) this.backdrop.addEventListener('click', () => this.close());

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });
    },

    get isOpen() {
      return this.drawer?.classList.contains('is-open');
    },

    open() {
      this.drawer.classList.add('is-open');
      this.backdrop?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      this.drawer.setAttribute('aria-hidden', 'false');
      const closeBtn = $('.wishlist-drawer__close', this.drawer);
      if (closeBtn) closeBtn.focus();
    },

    close() {
      this.drawer.classList.remove('is-open');
      this.backdrop?.classList.remove('is-open');
      document.body.style.overflow = '';
      this.drawer.setAttribute('aria-hidden', 'true');
    }
  };

  /* ---------- Size Guide Modal ---------- */
  const SizeGuide = {
    init() {
      this.modal = $('.size-guide-modal');
      if (!this.modal) return;

      this.tabs = $$('.size-guide-modal__tab, .size-guide-tab', this.modal);

      $$('[data-open-size-guide]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      const closeBtn = $('.size-guide-modal__close');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });

      // Tab switching
      this.tabs.forEach(tab => {
        tab.addEventListener('click', () => this.switchTab(tab));
      });
    },

    get isOpen() {
      return this.modal?.classList.contains('is-open');
    },

    open() {
      this.modal.hidden = false;
      this.modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      this.modal.setAttribute('role', 'dialog');
      this.modal.setAttribute('aria-modal', 'true');
      const closeBtn = $('.size-guide-modal__close', this.modal);
      if (closeBtn) closeBtn.focus();
    },

    close() {
      this.modal.classList.remove('is-open');
      document.body.style.overflow = '';
      this.modal.removeAttribute('aria-modal');
      this.modal.hidden = true;
      const trigger = $('[data-open-size-guide]');
      if (trigger) trigger.focus();
    },

    switchTab(tab) {
      const target = tab.dataset.tab;
      this.tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      $$('.size-guide-modal__panel', this.modal).forEach(p => p.hidden = true);
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const panel = $(`[data-panel="${target}"]`, this.modal);
      if (panel) panel.hidden = false;
    }
  };

  /* ---------- Back in Stock ---------- */
  const BackInStock = {
    init() {
      this.form = $('.back-in-stock__form');
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    },

    handleSubmit() {
      const input = $('.back-in-stock__input, input[type="email"]', this.form);
      const email = input?.value?.trim();
      if (!email) return;

      // Simple email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        Toast.show('Please enter a valid email address', 'error');
        return;
      }

      // Store notification request (in real app, send to backend)
      try {
        const notifications = JSON.parse(localStorage.getItem('vrai_back_in_stock') || '[]');
        notifications.push({ email, timestamp: Date.now() });
        localStorage.setItem('vrai_back_in_stock', JSON.stringify(notifications));
      } catch {
        // Storage unavailable
      }

      // Show success
      this.form.style.display = 'none';
      const success = $('.back-in-stock__success');
      if (success) {
        success.hidden = false;
        success.classList.add('is-visible');
      }
      Toast.show('You\'ll be notified when this item is back in stock!', 'success');
    }
  };

  /* ---------- Product Gallery ---------- */
  const ProductGallery = {
    init() {
      this.mainImg = $('.product-gallery__main img');
      if (!this.mainImg) return;

      $$('.product-gallery__thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          $$('.product-gallery__thumb').forEach(t => t.classList.remove('is-active'));
          thumb.classList.add('is-active');
          const img = thumb.querySelector('img');
          const src = img?.dataset.full || img?.dataset.fullSrc || img?.src;
          if (src) this.mainImg.src = src;
        });
      });
    }
  };

  /* ---------- Product Options ---------- */
  const ProductOptions = {
    init() {
      // Color swatches
      $$('.color-swatch, .product-color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
          $$('.color-swatch, .product-color-swatch').forEach(s => {
            s.classList.remove('is-active');
            s.setAttribute('aria-pressed', 'false');
          });
          swatch.classList.add('is-active');
          swatch.setAttribute('aria-pressed', 'true');
          const label = swatch.closest('.product-option, .product-info__option')?.querySelector('.product-option__label span, .product-info__option-label strong');
          if (label) label.textContent = swatch.dataset.color || '';
        });
      });

      // Size buttons
      $$('.size-btn:not(.is-disabled), .product-size-btn:not(.is-disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
          $$('.size-btn, .product-size-btn').forEach(b => {
            b.classList.remove('is-active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');
          const label = btn.closest('.product-option, .product-info__option')?.querySelector('.product-option__label span, .product-info__option-label strong');
          if (label) label.textContent = btn.textContent.trim();
        });
      });
    }
  };

  /* ---------- Quantity Selector ---------- */
  const QuantitySelector = {
    init() {
      $$('.quantity-selector, .product-quantity').forEach(selector => {
        const input = $('input, .product-quantity__input', selector);
        const minusBtn = $('[data-quantity="minus"]', selector);
        const plusBtn = $('[data-quantity="plus"]', selector);
        if (!input) return;

        minusBtn?.addEventListener('click', () => {
          const val = parseInt(input.value, 10) || 1;
          if (val > 1) input.value = val - 1;
        });

        plusBtn?.addEventListener('click', () => {
          const val = parseInt(input.value, 10) || 1;
          if (val < 99) input.value = val + 1;
        });
      });
    }
  };

  /* ---------- Accordion ---------- */
  const Accordion = {
    init() {
      $$('.product-accordion__trigger, .accordion__trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const item = trigger.closest('.product-accordion__item, .accordion__item');
          const content = item?.querySelector('.product-accordion__content, .accordion__panel');
          if (!item || !content) return;

          const isOpen = item.classList.contains('is-open');
          item.classList.toggle('is-open');
          content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', String(!isOpen));
        });
      });
    }
  };

  /* ---------- Filter Groups ---------- */
  const Filters = {
    init() {
      $$('.filter-group__title').forEach(title => {
        title.addEventListener('click', () => {
          title.closest('.filter-group')?.classList.toggle('is-collapsed');
        });
      });
    }
  };

  /* ---------- Scroll Animations ---------- */
  const ScrollAnimations = {
    init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      $$('.fade-in').forEach(el => observer.observe(el));
    }
  };

  /* ---------- Toast ---------- */
  const Toast = {
    show(message, type = 'default') {
      const existing = $('.toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = `toast ${type !== 'default' ? `toast--${sanitizeText(type)}` : ''}`;
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = message;

      document.body.appendChild(toast);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('is-visible'));
      });

      setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  };

  /* ---------- Newsletter ---------- */
  const Newsletter = {
    init() {
      const form = $('.newsletter__form, .newsletter-form, [data-newsletter-form]');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('input[type="email"]', form);
        const email = input?.value?.trim();
        if (!email) return;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          Toast.show('Please enter a valid email address', 'error');
          return;
        }

        Toast.show('Thank you for subscribing!', 'success');
        input.value = '';
      });
    }
  };

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    Header.init();
    Wishlist.init();
    WishlistDrawer.init();
    SizeGuide.init();
    BackInStock.init();
    ProductGallery.init();
    ProductOptions.init();
    QuantitySelector.init();
    Accordion.init();
    Filters.init();
    ScrollAnimations.init();
    Newsletter.init();
  });

  // Expose for external use
  window.VRAI = { Wishlist, Toast };
})();
