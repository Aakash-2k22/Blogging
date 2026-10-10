/**
 * InkSpace - Main Application & Client-Side Router
 * Modular SPA architecture with zero external dependencies.
 */

const App = {
  currentRoute: '',
  routeParams: {},

  init() {
    console.log('[InkSpace] Initializing application...');

    // 1. Initialize storage and seed sample data if needed
    StorageManager.init();

    // 2. Initialize theme (respect system preference or saved setting)
    this.initTheme();

    // 3. Bind global event listeners (navigation, mobile drawer, likes, bookmarks, share)
    this.bindGlobalEvents();

    // 4. Setup routing
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Initial routing call
    this.handleRoute();
  },

  /**
   * Theme Controller (Light / Dark mode)
   */
  initTheme() {
    const savedTheme = StorageManager.getTheme();
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    this.applyTheme(initialTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = current === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
        StorageManager.setTheme(nextTheme);
        Toast.show(`Switched to ${nextTheme} theme`, 'info', 2000);
      });
    }
  },

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggleBtn.innerHTML = isDark
        ? `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  },

  /**
   * Parse current window.location.hash into route and query params
   */
  parseHash() {
    const raw = window.location.hash.slice(1) || '/';
    const [pathPart, queryPart] = raw.split('?');
    
    // Parse query params if any
    const queryParams = {};
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      for (const [k, v] of searchParams.entries()) {
        queryParams[k] = v;
      }
    }

    return { path: pathPart || '/', query: queryParams };
  },

  /**
   * Router Dispatcher
   */
  handleRoute() {
    const { path, query } = this.parseHash();
    const appMain = document.getElementById('app-main');
    if (!appMain) return;

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Close mobile menu if open
    this.closeMobileMenu();

    // Clean up reading progress handler if leaving article
    if (!path.startsWith('/article/')) {
      if (window._inkspaceProgressHandler) {
        window.removeEventListener('scroll', window._inkspaceProgressHandler);
      }
      const existingBar = document.getElementById('reading-progress-bar');
      if (existingBar && existingBar.parentElement) {
        existingBar.parentElement.removeChild(existingBar);
      }
    }

    // Update active nav links
    this.updateActiveNavLinks(path);

    // Route matching
    if (path === '/' || path === '') {
      this.renderHome(appMain);
    } else if (path === '/explore') {
      this.renderExplore(appMain, query);
    } else if (path.startsWith('/article/')) {
      const articleId = decodeURIComponent(path.replace('/article/', ''));
      this.renderSingleArticle(appMain, articleId);
    } else if (path === '/categories') {
      this.renderCategories(appMain);
    } else if (path === '/create') {
      this.renderCreateBlog(appMain);
    } else if (path.startsWith('/edit/')) {
      const editId = decodeURIComponent(path.replace('/edit/', ''));
      this.renderEditBlog(appMain, editId);
    } else if (path === '/dashboard') {
      this.renderDashboard(appMain);
    } else if (path === '/saved') {
      this.renderSaved(appMain);
    } else if (path === '/about') {
      this.renderAbout(appMain);
    } else {
      this.render404(appMain, path);
    }
  },

  /**
   * Highlight active navbar links
   */
  updateActiveNavLinks(path) {
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPath = href.replace(/^#/, '');
      if (linkPath === path || (linkPath === '/' && path === '')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  /**
   * VIEW: Home Page
   */
  renderHome(container) {
    const allBlogs = StorageManager.getBlogs().filter(b => b.status === 'published');
    const featured = allBlogs.find(b => b.featured) || allBlogs[0];
    const latestBlogs = allBlogs.filter(b => !featured || b.id !== featured.id).slice(0, 6);
    const categories = (window.CATEGORIES || []).filter(c => c.id !== 'all');

    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-container">
          <div class="hero-badge">
            <span class="badge-pulse"></span>
            <span>Independent Editorial Journal</span>
          </div>

          <h1 class="hero-headline">Ideas Worth Reading.</h1>

          <p class="hero-subheadline">
            InkSpace is an artisanal platform celebrating thoughtful long-form essays,
            technical craft, cognitive performance, and deliberate design.
          </p>

          <div class="hero-cta-group">
            <a href="#/explore" class="btn btn-primary btn-lg">Explore Articles</a>
            <a href="#/create" class="btn btn-secondary btn-lg">Start Writing</a>
          </div>
        </div>
      </section>

      <!-- Featured Article Section -->
      ${featured ? `
        <section class="featured-section container">
          <div class="section-header">
            <div>
              <span class="section-eyebrow">Editor's Pick</span>
              <h2 class="section-title">Featured Story</h2>
            </div>
          </div>
          ${BlogRenderer.renderFeaturedCard(featured)}
        </section>
      ` : ''}

      <!-- Latest Articles Section -->
      <section class="latest-section container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">Fresh Perspectives</span>
            <h2 class="section-title">Latest Articles</h2>
          </div>
          <a href="#/explore" class="section-link">View All Articles &rarr;</a>
        </div>

        <div class="blog-grid blog-grid-3">
          ${latestBlogs.map(b => BlogRenderer.renderBlogCard(b)).join('')}
        </div>
      </section>

      <!-- Popular Categories Section -->
      <section class="categories-section container">
        <div class="section-header">
          <div>
            <span class="section-eyebrow">Curated Collections</span>
            <h2 class="section-title">Explore by Category</h2>
          </div>
          <a href="#/categories" class="section-link">All Categories &rarr;</a>
        </div>

        <div class="category-cards-grid">
          ${categories.map(cat => {
            const count = allBlogs.filter(b => b.category === cat.id).length;
            return `
              <a href="#/explore?category=${encodeURIComponent(cat.id)}" class="category-card">
                <div class="category-card-top">
                  <h3 class="category-card-title">${Utils.escapeHtml(cat.name)}</h3>
                  <span class="category-card-count">${count} ${count === 1 ? 'article' : 'articles'}</span>
                </div>
                <p class="category-card-desc">${Utils.escapeHtml(cat.description || '')}</p>
                <span class="category-card-arrow">&rarr;</span>
              </a>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="newsletter-section container">
        <div class="newsletter-card">
          <div class="newsletter-content">
            <span class="section-eyebrow text-accent">The InkSpace Dispatch</span>
            <h2 class="newsletter-title">A Sunday morning essay, straight to your inbox.</h2>
            <p class="newsletter-desc">
              No sponsored junk, no algorithmic spam. Just one deeply considered essay on engineering, design, or philosophy every Sunday.
            </p>

            <form id="newsletter-form" class="newsletter-form" novalidate>
              <div class="newsletter-input-group">
                <input 
                  type="email" 
                  id="newsletter-email-input" 
                  class="newsletter-input" 
                  placeholder="Enter your email address..." 
                  required 
                  aria-label="Email address"
                />
                <button type="submit" class="btn btn-primary newsletter-submit-btn">Subscribe</button>
              </div>
              <span class="newsletter-feedback" id="newsletter-feedback"></span>
            </form>
          </div>
        </div>
      </section>
    `;

    // Bind newsletter submit
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletter-email-input');
        const feedback = document.getElementById('newsletter-feedback');
        const email = input ? input.value.trim() : '';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          if (feedback) {
            feedback.textContent = 'Please enter a valid email address.';
            feedback.className = 'newsletter-feedback feedback-error';
          }
          return;
        }

        const added = StorageManager.addSubscriber(email);
        if (input) input.value = '';
        if (feedback) {
          feedback.textContent = added 
            ? 'Thank you for subscribing to The InkSpace Dispatch!' 
            : 'You are already subscribed. Look out for this Sunday’s issue!';
          feedback.className = 'newsletter-feedback feedback-success';
        }
        Toast.show('Subscribed to the newsletter!', 'success');
      });
    }
  },

  /**
   * VIEW: Explore / All Blogs
   */
  renderExplore(container, queryParams = {}) {
    const currentCat = queryParams.category || 'all';
    const searchQuery = queryParams.search || '';
    const sortBy = queryParams.sort || 'latest';
    const tag = queryParams.tag || '';

    container.innerHTML = SearchManager.renderExploreView({
      currentCategory: currentCat,
      searchQuery: searchQuery,
      sortBy: sortBy,
      tag: tag
    });

    // Bind search and filter events
    const searchInput = document.getElementById('explore-search-input');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const sortSelect = document.getElementById('explore-sort-select');

    // Debounced search
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        const val = e.target.value.trim();
        this.updateExploreParams({ search: val });
      }, 300));
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        this.updateExploreParams({ search: '' });
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.updateExploreParams({ sort: e.target.value });
      });
    }

    // Category pills
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const cat = pill.getAttribute('data-category');
        this.updateExploreParams({ category: cat });
      });
    });

    // Reset filters buttons
    document.querySelectorAll('.reset-filters-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.hash = '#/explore';
      });
    });
  },

  updateExploreParams(updates) {
    const { query } = this.parseHash();
    const merged = { ...query, ...updates };

    // Remove empty params
    Object.keys(merged).forEach(k => {
      if (!merged[k] || (k === 'category' && merged[k] === 'all')) {
        delete merged[k];
      }
    });

    const newQueryStr = new URLSearchParams(merged).toString();
    window.location.hash = newQueryStr ? `#/explore?${newQueryStr}` : '#/explore';
  },

  /**
   * VIEW: Single Article
   */
  renderSingleArticle(container, blogId) {
    const blog = StorageManager.getBlogById(blogId);
    const allBlogs = StorageManager.getBlogs();
    container.innerHTML = BlogRenderer.renderArticle(blog, allBlogs);
  },

  /**
   * VIEW: Categories Directory
   */
  renderCategories(container) {
    const allBlogs = StorageManager.getBlogs().filter(b => b.status === 'published');
    const categories = (window.CATEGORIES || []).filter(c => c.id !== 'all');

    container.innerHTML = `
      <section class="categories-page container">
        <header class="explore-header">
          <span class="section-eyebrow">Editorial Taxonomy</span>
          <h1 class="explore-title">Categories & Topics</h1>
          <p class="explore-subtitle">Browse curated archives by discipline, craft, and intellectual pursuit.</p>
        </header>

        <div class="category-cards-grid">
          ${categories.map(cat => {
            const count = allBlogs.filter(b => b.category === cat.id).length;
            return `
              <a href="#/explore?category=${encodeURIComponent(cat.id)}" class="category-card">
                <div class="category-card-top">
                  <h3 class="category-card-title">${Utils.escapeHtml(cat.name)}</h3>
                  <span class="category-card-count">${count} ${count === 1 ? 'article' : 'articles'}</span>
                </div>
                <p class="category-card-desc">${Utils.escapeHtml(cat.description || '')}</p>
                <div class="category-card-footer">
                  <span class="link-label">Browse stories</span>
                  <span class="category-card-arrow">&rarr;</span>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </section>
    `;
  },

  /**
   * VIEW: Create Blog
   */
  renderCreateBlog(container) {
    container.innerHTML = BlogEditor.renderEditorView(null);
    BlogEditor.initEditorEvents();
  },

  /**
   * VIEW: Edit Blog
   */
  renderEditBlog(container, blogId) {
    const blog = StorageManager.getBlogById(blogId);
    if (!blog) {
      container.innerHTML = `
        <div class="empty-state container">
          <h2>Article Not Found</h2>
          <p>The story you wish to edit could not be found.</p>
          <a href="#/dashboard" class="btn btn-primary">Go to Dashboard</a>
        </div>
      `;
      return;
    }
    container.innerHTML = BlogEditor.renderEditorView(blogId);
    BlogEditor.initEditorEvents();
  },

  /**
   * VIEW: Dashboard
   */
  renderDashboard(container) {
    container.innerHTML = DashboardManager.renderDashboardView();
    DashboardManager.initDashboardEvents(() => this.renderDashboard(container));
  },

  /**
   * VIEW: Saved Bookmarks
   */
  renderSaved(container) {
    container.innerHTML = DashboardManager.renderSavedView();
  },

  /**
   * VIEW: About InkSpace
   */
  renderAbout(container) {
    container.innerHTML = `
      <section class="about-page container">
        <header class="about-header">
          <span class="section-eyebrow">Our Philosophy</span>
          <h1 class="about-title">A Sanctuary for Considered Ideas.</h1>
          <p class="about-lead">
            InkSpace was crafted to counter the frenetic tempo of algorithmic social feeds. 
            We believe words hold enduring weight when given room to breathe.
          </p>
        </header>

        <div class="about-content-grid">
          <div class="about-card">
            <h3 class="about-card-title">Editorial Restraint</h3>
            <p>
              We reject noisy popups, flashing banners, and clickbait headlines. 
              Our reading experience is deliberately calm, elegant, and typographically disciplined.
            </p>
          </div>

          <div class="about-card">
            <h3 class="about-card-title">Pure Platform Craft</h3>
            <p>
              Engineered with zero bloated dependencies. Built with native HTML5, modern CSS3, 
              and pure vanilla JavaScript for ultra-fast, lightweight performance and longevity.
            </p>
          </div>

          <div class="about-card">
            <h3 class="about-card-title">Local Autonomy</h3>
            <p>
              Your drafts, reading lists, likes, and reading metrics belong to you. 
              Persisted transparently in your browser's local storage engine with zero tracking cookies.
            </p>
          </div>
        </div>

        <div class="about-author-strip">
          <div class="author-strip-content">
            <h2 class="strip-headline">Ready to contribute your thoughts?</h2>
            <p class="strip-subtext">Open our minimalist editor, compose without friction, and publish immediately.</p>
            <a href="#/create" class="btn btn-primary btn-lg">Write on InkSpace</a>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * VIEW: 404 Not Found
   */
  render404(container, attemptedPath) {
    container.innerHTML = `
      <section class="not-found-page container">
        <div class="empty-state">
          <span class="error-code-badge">404</span>
          <h1 class="error-heading">Page Not Found</h1>
          <p class="error-message">
            The page <code>${Utils.escapeHtml(attemptedPath)}</code> does not exist or may have been relocated.
          </p>
          <div class="empty-state-actions">
            <a href="#/" class="btn btn-primary">Return to Home</a>
            <a href="#/explore" class="btn btn-secondary">Explore Articles</a>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * Global Event Delegation (Likes, Bookmarks, Shares, Copy, Mobile Menu)
   */
  bindGlobalEvents() {
    // Mobile menu toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileBackdrop = document.getElementById('mobile-backdrop');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');

    if (hamburgerBtn && mobileDrawer && mobileBackdrop) {
      hamburgerBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('open');
        mobileBackdrop.classList.toggle('open');
        document.body.classList.toggle('drawer-open');
      });

      const closeDrawer = () => this.closeMobileMenu();
      if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeDrawer);
      mobileBackdrop.addEventListener('click', closeDrawer);

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
          closeDrawer();
        }
      });
    }

    // Global click delegation for interactive card elements
    document.addEventListener('click', (e) => {
      // 1. Like button toggle
      const likeBtn = e.target.closest('.card-like-btn');
      if (likeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = likeBtn.getAttribute('data-id');
        if (id) {
          const res = StorageManager.toggleLike(id);
          // Update all matching like buttons on the page
          document.querySelectorAll(`.card-like-btn[data-id="${id}"]`).forEach(btn => {
            if (res.isLiked) {
              btn.classList.add('active');
              const svg = btn.querySelector('svg');
              if (svg) svg.setAttribute('fill', 'currentColor');
              const label = btn.querySelector('.like-label');
              if (label) label.textContent = 'Liked';
            } else {
              btn.classList.remove('active');
              const svg = btn.querySelector('svg');
              if (svg) svg.setAttribute('fill', 'none');
              const label = btn.querySelector('.like-label');
              if (label) label.textContent = 'Like';
            }
            const countEl = btn.querySelector('.like-count');
            if (countEl) countEl.textContent = res.likesCount;
          });

          Toast.show(
            res.isLiked ? 'Article liked!' : 'Like removed',
            'info',
            1800
          );
        }
        return;
      }

      // 2. Bookmark button toggle
      const bookmarkBtn = e.target.closest('.card-bookmark-btn');
      if (bookmarkBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = bookmarkBtn.getAttribute('data-id');
        if (id) {
          const isBookmarked = StorageManager.toggleBookmark(id);
          // Update all matching bookmark buttons on page
          document.querySelectorAll(`.card-bookmark-btn[data-id="${id}"]`).forEach(btn => {
            if (isBookmarked) {
              btn.classList.add('active');
              const svg = btn.querySelector('svg');
              if (svg) svg.setAttribute('fill', 'currentColor');
              const span = btn.querySelector('span');
              if (span) span.textContent = 'Saved';
            } else {
              btn.classList.remove('active');
              const svg = btn.querySelector('svg');
              if (svg) svg.setAttribute('fill', 'none');
              const span = btn.querySelector('span');
              if (span) span.textContent = 'Bookmark';
            }
          });

          Toast.show(
            isBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks',
            'info',
            2000
          );

          // If currently on saved articles view, refresh it
          const { path } = this.parseHash();
          if (path === '/saved') {
            this.handleRoute();
          }
        }
        return;
      }

      // 3. Share button
      const shareBtn = e.target.closest('.btn-share-article');
      if (shareBtn) {
        e.preventDefault();
        const id = shareBtn.getAttribute('data-id');
        const blog = StorageManager.getBlogById(id);
        if (blog) {
          Utils.shareArticle({
            title: blog.title,
            text: blog.excerpt,
            url: window.location.href
          });
        }
        return;
      }

      // 4. Copy Link button
      const copyBtn = e.target.closest('.btn-copy-link');
      if (copyBtn) {
        e.preventDefault();
        Utils.copyToClipboard(window.location.href);
        return;
      }
    });
  },

  closeMobileMenu() {
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileBackdrop = document.getElementById('mobile-backdrop');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('open');
    document.body.classList.remove('drawer-open');
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Expose globally
window.App = App;
