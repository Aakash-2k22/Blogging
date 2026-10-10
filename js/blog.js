/**
 * InkSpace - Blog Renderer Module
 * Generates blog cards, article detail pages, reading progress, and related posts.
 */

const BlogRenderer = {
  /**
   * Render a responsive, editorial blog card
   * @param {Object} blog - Blog object
   * @param {Object} options - Custom options (e.g., layout mode)
   * @returns {string} HTML string
   */
  renderBlogCard(blog, options = {}) {
    const isBookmarked = StorageManager.isBookmarked(blog.id);
    const isLiked = StorageManager.isLiked(blog.id);
    const dateFormatted = Utils.formatDate(blog.date);
    const fallbackSrc = Utils.getFallbackImage(blog.title, blog.category);

    return `
      <article class="blog-card" data-id="${Utils.escapeHtml(blog.id)}">
        <div class="blog-card-media">
          <a href="#/article/${encodeURIComponent(blog.id)}" class="blog-card-image-link" aria-label="Read ${Utils.escapeHtml(blog.title)}">
            <img 
              src="${Utils.escapeHtml(blog.image)}" 
              alt="${Utils.escapeHtml(blog.title)}" 
              class="blog-card-image" 
              loading="lazy" 
              onerror="this.onerror=null; this.src='${fallbackSrc}';"
            />
          </a>
          <span class="blog-card-category">${Utils.escapeHtml(blog.category)}</span>
        </div>

        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span class="meta-date">${dateFormatted}</span>
            <span class="meta-separator">&bull;</span>
            <span class="meta-reading-time">${blog.readingTime || 5} min read</span>
          </div>

          <h3 class="blog-card-title">
            <a href="#/article/${encodeURIComponent(blog.id)}">${Utils.escapeHtml(blog.title)}</a>
          </h3>

          <p class="blog-card-excerpt">
            ${Utils.escapeHtml(blog.excerpt || '')}
          </p>

          <div class="blog-card-footer">
            <div class="blog-card-author">
              <img 
                src="${Utils.escapeHtml(blog.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80')}" 
                alt="${Utils.escapeHtml(blog.author)}" 
                class="author-avatar-sm"
                onerror="this.onerror=null; this.src='${fallbackSrc}';"
              />
              <span class="author-name-sm">${Utils.escapeHtml(blog.author)}</span>
            </div>

            <div class="blog-card-actions">
              <button 
                type="button" 
                class="btn-icon card-like-btn ${isLiked ? 'active' : ''}" 
                data-action="like" 
                data-id="${Utils.escapeHtml(blog.id)}" 
                title="${isLiked ? 'Unlike article' : 'Like article'}"
                aria-label="Like article"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="like-count">${blog.likes || 0}</span>
              </button>

              <button 
                type="button" 
                class="btn-icon card-bookmark-btn ${isBookmarked ? 'active' : ''}" 
                data-action="bookmark" 
                data-id="${Utils.escapeHtml(blog.id)}" 
                title="${isBookmarked ? 'Remove from bookmarks' : 'Save article'}"
                aria-label="Save article"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  },

  /**
   * Render the Featured Article banner on the home page
   */
  renderFeaturedCard(blog) {
    if (!blog) return '';
    const dateFormatted = Utils.formatDate(blog.date);
    const fallbackSrc = Utils.getFallbackImage(blog.title, blog.category);
    const isBookmarked = StorageManager.isBookmarked(blog.id);

    return `
      <div class="featured-card">
        <div class="featured-media">
          <a href="#/article/${encodeURIComponent(blog.id)}" aria-label="Read featured article: ${Utils.escapeHtml(blog.title)}">
            <img 
              src="${Utils.escapeHtml(blog.image)}" 
              alt="${Utils.escapeHtml(blog.title)}" 
              class="featured-image" 
              onerror="this.onerror=null; this.src='${fallbackSrc}';"
            />
          </a>
        </div>
        <div class="featured-content">
          <div class="featured-badge-row">
            <span class="badge badge-accent">Featured Story</span>
            <span class="badge badge-subtle">${Utils.escapeHtml(blog.category)}</span>
          </div>

          <h2 class="featured-title">
            <a href="#/article/${encodeURIComponent(blog.id)}">${Utils.escapeHtml(blog.title)}</a>
          </h2>

          <p class="featured-excerpt">${Utils.escapeHtml(blog.excerpt)}</p>

          <div class="featured-footer">
            <div class="featured-author">
              <img 
                src="${Utils.escapeHtml(blog.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80')}" 
                alt="${Utils.escapeHtml(blog.author)}" 
                class="author-avatar"
                onerror="this.onerror=null; this.src='${fallbackSrc}';"
              />
              <div class="author-details">
                <span class="author-name">${Utils.escapeHtml(blog.author)}</span>
                <span class="author-subtext">${dateFormatted} &bull; ${blog.readingTime || 5} min read</span>
              </div>
            </div>

            <div class="featured-actions">
              <a href="#/article/${encodeURIComponent(blog.id)}" class="btn btn-primary">
                Read Article
                <svg class="btn-arrow" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
              <button 
                type="button" 
                class="btn-icon card-bookmark-btn ${isBookmarked ? 'active' : ''}" 
                data-action="bookmark" 
                data-id="${Utils.escapeHtml(blog.id)}" 
                title="${isBookmarked ? 'Remove bookmark' : 'Bookmark article'}"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Find 3 related articles based on category and tags
   */
  getRelatedArticles(currentBlog, allBlogs, limit = 3) {
    if (!currentBlog || !Array.isArray(allBlogs)) return [];

    const candidates = allBlogs.filter(b => 
      String(b.id) !== String(currentBlog.id) && b.status === 'published'
    );

    // Score candidates
    const scored = candidates.map(blog => {
      let score = 0;
      if (blog.category === currentBlog.category) {
        score += 5;
      }
      if (Array.isArray(blog.tags) && Array.isArray(currentBlog.tags)) {
        const matches = blog.tags.filter(t => currentBlog.tags.includes(t));
        score += matches.length * 2;
      }
      return { blog, score };
    });

    // Sort by score descending, then by date descending
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.blog.date) - new Date(a.blog.date);
    });

    return scored.slice(0, limit).map(item => item.blog);
  },

  /**
   * Setup Reading Progress Bar on scroll
   */
  setupReadingProgress() {
    const progressBar = document.getElementById('reading-progress-bar');
    if (!progressBar) return;

    const updateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        progressBar.style.width = '0%';
        return;
      }
      const scrollPos = window.scrollY;
      const progress = Math.min(100, Math.max(0, (scrollPos / docHeight) * 100));
      progressBar.style.width = `${progress}%`;
    };

    window.removeEventListener('scroll', window._inkspaceProgressHandler);
    window._inkspaceProgressHandler = updateProgress;
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  },

  /**
   * Render single article detail view
   */
  renderArticle(blog, allBlogs) {
    if (!blog) {
      return `
        <div class="empty-state container">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <h2>Article Not Found</h2>
          <p>The story you are looking for has been removed, unpublished, or does not exist.</p>
          <a href="#/" class="btn btn-primary">Return to InkSpace Home</a>
        </div>
      `;
    }

    // Increment view count in local storage
    StorageManager.incrementViews(blog.id);

    const isBookmarked = StorageManager.isBookmarked(blog.id);
    const isLiked = StorageManager.isLiked(blog.id);
    const dateFormatted = Utils.formatDate(blog.date);
    const fallbackSrc = Utils.getFallbackImage(blog.title, blog.category);
    const related = this.getRelatedArticles(blog, allBlogs, 3);

    const tagsHtml = Array.isArray(blog.tags) && blog.tags.length > 0
      ? blog.tags.map(t => `<a href="#/explore?search=${encodeURIComponent(t)}" class="article-tag">#${Utils.escapeHtml(t)}</a>`).join('')
      : '';

    const relatedHtml = related.length > 0
      ? `
        <section class="related-articles-section">
          <div class="section-header">
            <div>
              <span class="section-eyebrow">Continue Reading</span>
              <h3 class="section-title">Related Stories</h3>
            </div>
            <a href="#/explore?category=${encodeURIComponent(blog.category)}" class="section-link">
              More in ${Utils.escapeHtml(blog.category)} &rarr;
            </a>
          </div>
          <div class="blog-grid blog-grid-3">
            ${related.map(r => this.renderBlogCard(r)).join('')}
          </div>
        </section>
      `
      : '';

    // Defer reading progress setup
    setTimeout(() => this.setupReadingProgress(), 50);

    return `
      <div id="reading-progress-bar" class="reading-progress-bar" aria-hidden="true"></div>

      <article class="article-view container" data-id="${Utils.escapeHtml(blog.id)}">
        <!-- Breadcrumb & Category -->
        <nav class="article-breadcrumb" aria-label="Breadcrumb">
          <a href="#/">Home</a>
          <span class="breadcrumb-separator">/</span>
          <a href="#/explore?category=${encodeURIComponent(blog.category)}">${Utils.escapeHtml(blog.category)}</a>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">${Utils.escapeHtml(blog.title)}</span>
        </nav>

        <!-- Article Header -->
        <header class="article-header">
          <div class="article-category-badge">${Utils.escapeHtml(blog.category)}</div>
          <h1 class="article-main-title">${Utils.escapeHtml(blog.title)}</h1>
          
          <p class="article-lead-excerpt">${Utils.escapeHtml(blog.excerpt || '')}</p>

          <div class="article-meta-bar">
            <div class="article-author-info">
              <img 
                src="${Utils.escapeHtml(blog.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80')}" 
                alt="${Utils.escapeHtml(blog.author)}" 
                class="author-avatar-lg"
                onerror="this.onerror=null; this.src='${fallbackSrc}';"
              />
              <div class="author-meta-text">
                <span class="author-name-lg">${Utils.escapeHtml(blog.author)}</span>
                <span class="article-date-meta">Published on ${dateFormatted} &bull; ${blog.readingTime || 5} min read &bull; ${blog.views || 1} views</span>
              </div>
            </div>

            <div class="article-header-actions">
              <button 
                type="button" 
                class="btn-outline-action btn-share-article" 
                data-id="${Utils.escapeHtml(blog.id)}"
                title="Share this article"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span>Share</span>
              </button>

              <button 
                type="button" 
                class="btn-outline-action card-bookmark-btn ${isBookmarked ? 'active' : ''}" 
                data-action="bookmark" 
                data-id="${Utils.escapeHtml(blog.id)}" 
                title="${isBookmarked ? 'Saved to bookmarks' : 'Save article'}"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>${isBookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Featured Image -->
        <div class="article-hero-media">
          <img 
            src="${Utils.escapeHtml(blog.image)}" 
            alt="${Utils.escapeHtml(blog.title)}" 
            class="article-hero-image" 
            onerror="this.onerror=null; this.src='${fallbackSrc}';"
          />
        </div>

        <!-- Article Body Content -->
        <div class="article-content-wrapper">
          <div class="article-body rich-text-body">
            ${blog.content}
          </div>

          <!-- Tags -->
          ${tagsHtml ? `<div class="article-tags-cloud">${tagsHtml}</div>` : ''}

          <!-- Floating/Bottom Interaction Bar -->
          <div class="article-floating-actions">
            <div class="action-group-left">
              <button 
                type="button" 
                class="btn-like-pill card-like-btn ${isLiked ? 'active' : ''}" 
                data-action="like" 
                data-id="${Utils.escapeHtml(blog.id)}"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span class="like-label">${isLiked ? 'Liked' : 'Like'}</span>
                <span class="like-count">${blog.likes || 0}</span>
              </button>

              <button 
                type="button" 
                class="btn-icon-round card-bookmark-btn ${isBookmarked ? 'active' : ''}" 
                data-action="bookmark" 
                data-id="${Utils.escapeHtml(blog.id)}"
                title="Bookmark article"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>

            <div class="action-group-right">
              <button 
                type="button" 
                class="btn-icon-round btn-share-article" 
                data-id="${Utils.escapeHtml(blog.id)}" 
                title="Share article"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>

              <button 
                type="button" 
                class="btn-icon-round btn-copy-link" 
                title="Copy link to clipboard"
              >
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Author Bio Box -->
          <div class="author-bio-card">
            <img 
              src="${Utils.escapeHtml(blog.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80')}" 
              alt="${Utils.escapeHtml(blog.author)}" 
              class="author-bio-avatar"
              onerror="this.onerror=null; this.src='${fallbackSrc}';"
            />
            <div class="author-bio-details">
              <span class="author-bio-role">Written by</span>
              <h4 class="author-bio-name">${Utils.escapeHtml(blog.author)}</h4>
              <p class="author-bio-text">${Utils.escapeHtml(blog.authorBio || 'Contributing author at InkSpace.')}</p>
            </div>
          </div>
        </div>

        <!-- Related Articles -->
        ${relatedHtml}
      </article>
    `;
  }
};

// Expose globally
window.BlogRenderer = BlogRenderer;
