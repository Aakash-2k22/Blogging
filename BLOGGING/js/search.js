/**
 * InkSpace - Search & Filter Module
 * Real-time multi-field search, category filtering, tag filtering, and sorting.
 */

const SearchManager = {
  /**
   * Filter and sort blogs collection
   */
  filterAndSort(blogs, { query = '', category = 'all', tag = '', sortBy = 'latest', status = 'published' } = {}) {
    if (!Array.isArray(blogs)) return [];

    // Filter by status if specified
    let results = status ? blogs.filter(b => b.status === status) : [...blogs];

    // Filter by category
    if (category && category !== 'all') {
      const lowerCat = category.toLowerCase();
      results = results.filter(b => (b.category || '').toLowerCase() === lowerCat);
    }

    // Filter by specific tag
    if (tag) {
      const lowerTag = tag.toLowerCase().replace(/^#/, '');
      results = results.filter(b => 
        Array.isArray(b.tags) && b.tags.some(t => t.toLowerCase() === lowerTag)
      );
    }

    // Filter by search query (across title, excerpt, content, category, author, tags)
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter(b => {
        const titleMatch = (b.title || '').toLowerCase().includes(q);
        const excerptMatch = (b.excerpt || '').toLowerCase().includes(q);
        const authorMatch = (b.author || '').toLowerCase().includes(q);
        const categoryMatch = (b.category || '').toLowerCase().includes(q);
        const tagsMatch = Array.isArray(b.tags) && b.tags.some(t => t.toLowerCase().includes(q));
        const contentMatch = Utils.stripHtml(b.content || '').toLowerCase().includes(q);

        return titleMatch || excerptMatch || authorMatch || categoryMatch || tagsMatch || contentMatch;
      });
    }

    // Sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'az':
          return (a.title || '').localeCompare(b.title || '');
        case 'latest':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return results;
  },

  /**
   * Render the Explore / All Blogs view template
   */
  renderExploreView({ currentCategory = 'all', searchQuery = '', sortBy = 'latest', tag = '' } = {}) {
    const allBlogs = StorageManager.getBlogs();
    const categories = window.CATEGORIES || [];
    
    // Filter blogs
    const filteredBlogs = this.filterAndSort(allBlogs, {
      query: searchQuery,
      category: currentCategory,
      tag: tag,
      sortBy: sortBy,
      status: 'published'
    });

    // Category pills HTML
    const categoryPillsHtml = categories.map(cat => {
      const isActive = cat.id === currentCategory;
      return `
        <button 
          type="button" 
          class="category-pill ${isActive ? 'active' : ''}" 
          data-category="${Utils.escapeHtml(cat.id)}"
        >
          ${Utils.escapeHtml(cat.name)}
        </button>
      `;
    }).join('');

    // Dynamic result count message
    let statusText = '';
    if (searchQuery) {
      statusText = `Found <strong>${filteredBlogs.length}</strong> ${filteredBlogs.length === 1 ? 'article' : 'articles'} matching "<em>${Utils.escapeHtml(searchQuery)}</em>"`;
    } else if (tag) {
      statusText = `Showing <strong>${filteredBlogs.length}</strong> ${filteredBlogs.length === 1 ? 'article' : 'articles'} tagged with <strong>#${Utils.escapeHtml(tag)}</strong>`;
    } else if (currentCategory !== 'all') {
      statusText = `Showing <strong>${filteredBlogs.length}</strong> ${filteredBlogs.length === 1 ? 'article' : 'articles'} in <strong>${Utils.escapeHtml(currentCategory)}</strong>`;
    } else {
      statusText = `Showing all <strong>${filteredBlogs.length}</strong> published articles`;
    }

    // Cards or empty state
    let contentHtml = '';
    if (filteredBlogs.length > 0) {
      contentHtml = `
        <div class="blog-grid blog-grid-3">
          ${filteredBlogs.map(blog => BlogRenderer.renderBlogCard(blog)).join('')}
        </div>
      `;
    } else {
      contentHtml = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3>No articles found</h3>
          <p>We couldn't find any articles matching your current search or category filters.</p>
          <button type="button" class="btn btn-secondary reset-filters-btn">Clear All Filters</button>
        </div>
      `;
    }

    return `
      <section class="explore-page container">
        <header class="explore-header">
          <span class="section-eyebrow">The Editorial Archive</span>
          <h1 class="explore-title">Explore Articles</h1>
          <p class="explore-subtitle">Discover deep insights across technology, design, cognitive performance, and modern culture.</p>
        </header>

        <!-- Search and Sort Controls -->
        <div class="filter-controls-card">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            <input 
              type="text" 
              id="explore-search-input" 
              class="search-input" 
              placeholder="Search by title, topic, author, tag, or content..." 
              value="${Utils.escapeHtml(searchQuery)}"
              aria-label="Search articles"
            />
            ${searchQuery ? `<button type="button" id="clear-search-btn" class="clear-search-btn" aria-label="Clear search">&times;</button>` : ''}
          </div>

          <div class="sort-selector-wrapper">
            <label for="explore-sort-select" class="sort-label">Sort by:</label>
            <select id="explore-sort-select" class="sort-select" aria-label="Sort articles">
              <option value="latest" ${sortBy === 'latest' ? 'selected' : ''}>Latest (Newest First)</option>
              <option value="oldest" ${sortBy === 'oldest' ? 'selected' : ''}>Oldest First</option>
              <option value="likes" ${sortBy === 'likes' ? 'selected' : ''}>Most Liked</option>
              <option value="views" ${sortBy === 'views' ? 'selected' : ''}>Most Read</option>
              <option value="az" ${sortBy === 'az' ? 'selected' : ''}>Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        <!-- Category Pills -->
        <div class="category-pills-row" role="tablist" aria-label="Filter by category">
          ${categoryPillsHtml}
        </div>

        <!-- Results Counter & Status -->
        <div class="results-status-bar">
          <span class="status-count">${statusText}</span>
          ${(searchQuery || currentCategory !== 'all' || tag) ? `
            <button type="button" class="btn-text-subtle reset-filters-btn">Reset filters</button>
          ` : ''}
        </div>

        <!-- Articles Grid / Empty State -->
        ${contentHtml}
      </section>
    `;
  }
};

// Expose globally
window.SearchManager = SearchManager;
