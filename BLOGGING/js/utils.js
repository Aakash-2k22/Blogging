/**
 * InkSpace - Utility Functions
 * Toast notifications, custom modals, string helpers, date formatters, and sharing.
 */

const Utils = {
  /**
   * Escape raw HTML to prevent XSS
   */
  escapeHtml(str) {
    if (!str) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(str).replace(/[&<>"']/g, m => map[m]);
  },

  /**
   * Strip HTML tags from a string
   */
  stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  },

  /**
   * Generate URL friendly slug
   */
  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  },

  /**
   * Calculate reading time in minutes (200-250 WPM)
   */
  calculateReadingTime(content) {
    const text = this.stripHtml(content);
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const wpm = 220;
    const minutes = Math.ceil(words / wpm);
    return Math.max(1, minutes);
  },

  /**
   * Format ISO date string to human-friendly editorial date
   */
  formatDate(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  },

  /**
   * Relative time formatter (e.g., '2 days ago', 'Today')
   */
  timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return this.formatDate(dateString);
  },

  /**
   * Validate URL format
   */
  isValidUrl(urlString) {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:' || urlString.startsWith('data:image/');
    } catch (_) {
      return false;
    }
  },

  /**
   * Generate an SVG data URI placeholder when an image fails to load
   */
  getFallbackImage(title = 'Article', category = 'InkSpace') {
    const initial = (title || 'I').charAt(0).toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#0f172a" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
        <circle cx="400" cy="200" r="60" fill="#334155" />
        <text x="400" y="215" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="bold" fill="#f8fafc" text-anchor="middle" dominant-baseline="middle">${initial}</text>
        <text x="400" y="300" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="#94a3b8" text-anchor="middle">${this.escapeHtml(category.toUpperCase())}</text>
        <text x="400" y="335" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">InkSpace Editorial</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  },

  /**
   * Debounce helper for search inputs
   */
  debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Native Web Share with fallback to clipboard copy
   */
  async shareArticle(data) {
    const shareData = {
      title: data.title || 'InkSpace Article',
      text: data.text || 'Check out this article on InkSpace',
      url: data.url || window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        Toast.show('Shared successfully!', 'success');
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          // Fallback to clipboard if share was rejected
          this.copyToClipboard(shareData.url);
        }
        return;
      }
    }

    // Fallback: Copy link to clipboard
    this.copyToClipboard(shareData.url);
  },

  /**
   * Copy text to clipboard and show toast
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      Toast.show('Article link copied to clipboard!', 'success');
    } catch (err) {
      Toast.show('Could not copy link automatically', 'error');
    }
  }
};

/**
 * Toast Notification System
 */
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    }
  },

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {'success'|'error'|'info'|'warning'} type - Notification type
   * @param {number} duration - Auto-dismiss duration in ms
   */
  show(message, type = 'info', duration = 3500) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    // Icons for each type
    const icons = {
      success: `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`,
      error: `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`,
      warning: `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`,
      info: `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`
    };

    toast.innerHTML = `
      <div class="toast-content">
        ${icons[type] || icons.info}
        <span class="toast-message">${Utils.escapeHtml(message)}</span>
      </div>
      <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 300);
    };

    closeBtn.addEventListener('click', dismiss);

    this.container.appendChild(toast);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }
};

/**
 * Custom Confirmation & Alert Modal System
 * (Replaces window.confirm and window.alert with custom UI)
 */
const Modal = {
  activeModal: null,

  /**
   * Show a custom confirmation modal that returns a Promise
   */
  confirm({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false
  }) {
    return new Promise((resolve) => {
      this.close(); // Close any currently open modal

      const overlay = document.createElement('div');
      overlay.className = 'modal-backdrop';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');

      overlay.innerHTML = `
        <div class="modal-card">
          <div class="modal-header">
            <h3 class="modal-title ${isDanger ? 'text-danger' : ''}">${Utils.escapeHtml(title)}</h3>
            <button type="button" class="modal-close-icon" aria-label="Close dialog">&times;</button>
          </div>
          <div class="modal-body">
            <p>${Utils.escapeHtml(message)}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-cancel-btn">${Utils.escapeHtml(cancelText)}</button>
            <button type="button" class="btn ${isDanger ? 'btn-danger' : 'btn-primary'} modal-confirm-btn">${Utils.escapeHtml(confirmText)}</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.classList.add('modal-open');
      this.activeModal = overlay;

      const confirmBtn = overlay.querySelector('.modal-confirm-btn');
      const cancelBtn = overlay.querySelector('.modal-cancel-btn');
      const closeBtn = overlay.querySelector('.modal-close-icon');

      const cleanup = (result) => {
        overlay.classList.add('modal-closing');
        setTimeout(() => {
          if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
          document.body.classList.remove('modal-open');
          this.activeModal = null;
          resolve(result);
        }, 200);
      };

      confirmBtn.addEventListener('click', () => cleanup(true));
      cancelBtn.addEventListener('click', () => cleanup(false));
      closeBtn.addEventListener('click', () => cleanup(false));

      // Click outside to close
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cleanup(false);
      });

      // Escape key to cancel
      const keyHandler = (e) => {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', keyHandler);
          cleanup(false);
        }
      };
      document.addEventListener('keydown', keyHandler);

      // Focus confirm button
      setTimeout(() => confirmBtn.focus(), 50);
    });
  },

  close() {
    if (this.activeModal && this.activeModal.parentElement) {
      this.activeModal.parentElement.removeChild(this.activeModal);
      document.body.classList.remove('modal-open');
      this.activeModal = null;
    }
  }
};

// Expose globally
window.Utils = Utils;
window.Toast = Toast;
window.Modal = Modal;
