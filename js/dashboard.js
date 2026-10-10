/**
 * InkSpace - Dashboard & Saved Articles Module
 * Statistics cards, content management table, draft/publish toggling,
 * custom deletion modal flow, and saved bookmarks view.
 */

const DashboardManager = {
  currentFilter: 'all', // 'all' | 'published' | 'draft'

  /**
   * Render author dashboard with statistics and article table
   */
  renderDashboardView() {
    const blogs = StorageManager.getBlogs();
    const bookmarks = StorageManager.getBookmarks();
    
    // Compute stats
    const totalCount = blogs.length;
    const publishedCount = blogs.filter(b => b.status === 'published').length;
    const draftsCount = blogs.filter(b => b.status === 'draft').length;
    const totalLikes = blogs.reduce((sum, b) => sum + (b.likes || 0), 0);
    const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

    // Filter articles for table
    let filteredList = blogs;
    if (this.currentFilter === 'published') {
      filteredList = blogs.filter(b => b.status === 'published');
    } else if (this.currentFilter === 'draft') {
      filteredList = blogs.filter(b => b.status === 'draft');
    }

    const rowsHtml = filteredList.length > 0
      ? filteredList.map(blog => {
          const isPublished = blog.status === 'published';
          const fallbackSrc = Utils.getFallbackImage(blog.title, blog.category);
          return `
            <tr data-id="${Utils.escapeHtml(blog.id)}">
              <td class="col-article">
                <div class="table-article-info">
                  <img 
                    src="${Utils.escapeHtml(blog.image)}" 
                    alt="${Utils.escapeHtml(blog.title)}" 
                    class="table-thumb" 
                    onerror="this.onerror=null; this.src='${fallbackSrc}';"
                  />
                  <div>
                    <h4 class="table-article-title">
                      <a href="#/article/${encodeURIComponent(blog.id)}">${Utils.escapeHtml(blog.title)}</a>
                    </h4>
                    <span class="table-article-author">${Utils.escapeHtml(blog.author)} &bull; ${blog.readingTime || 5}m read</span>
                  </div>
                </div>
              </td>
              <td class="col-category">
                <span class="badge badge-subtle">${Utils.escapeHtml(blog.category)}</span>
              </td>
              <td class="col-status">
                <span class="status-pill ${isPublished ? 'status-published' : 'status-draft'}">
                  <span class="status-dot"></span>
                  ${isPublished ? 'Published' : 'Draft'}
                </span>
              </td>
              <td class="col-date">${Utils.formatDate(blog.date)}</td>
              <td class="col-metrics">
                <span class="metric-item" title="Likes">
                  <svg class="icon-inline" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  ${blog.likes || 0}
                </span>
                <span class="metric-item" title="Views">
                  <svg class="icon-inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  ${blog.views || 0}
                </span>
              </td>
              <td class="col-actions">
                <div class="table-actions">
                  <a href="#/article/${encodeURIComponent(blog.id)}" class="btn-table-action" title="View Story" aria-label="View Story">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </a>
                  <a href="#/edit/${encodeURIComponent(blog.id)}" class="btn-table-action" title="Edit Story" aria-label="Edit Story">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </a>
                  <button type="button" class="btn-table-action toggle-status-btn" data-id="${Utils.escapeHtml(blog.id)}" title="${isPublished ? 'Unpublish to draft' : 'Publish story'}" aria-label="Toggle publish state">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  </button>
                  <button type="button" class="btn-table-action btn-danger-action delete-blog-btn" data-id="${Utils.escapeHtml(blog.id)}" title="Delete Story" aria-label="Delete Story">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('')
      : `
        <tr>
          <td colspan="6" class="table-empty">
            <div class="empty-inline">
              <p>No stories found matching this filter.</p>
              <a href="#/create" class="btn btn-sm btn-primary">Create New Story</a>
            </div>
          </td>
        </tr>
      `;

    return `
      <section class="dashboard-page container">
        <header class="dashboard-header">
          <div>
            <span class="section-eyebrow">Author Workspace</span>
            <h1 class="dashboard-title">Editorial Dashboard</h1>
            <p class="dashboard-subtitle">Manage your stories, view reader engagement metrics, and polish upcoming drafts.</p>
          </div>
          <div class="dashboard-header-cta">
            <a href="#/create" class="btn btn-primary">
              <svg class="btn-icon-svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              Write New Story
            </a>
          </div>
        </header>

        <!-- Metrics Overview Grid -->
        <div class="dashboard-metrics-grid">
          <div class="metric-card">
            <span class="metric-card-title">Total Stories</span>
            <div class="metric-card-value">${totalCount}</div>
            <span class="metric-card-sub">In local database</span>
          </div>

          <div class="metric-card">
            <span class="metric-card-title">Published</span>
            <div class="metric-card-value">${publishedCount}</div>
            <span class="metric-card-sub">Live on site</span>
          </div>

          <div class="metric-card">
            <span class="metric-card-title">Drafts</span>
            <div class="metric-card-value">${draftsCount}</div>
            <span class="metric-card-sub">In progress</span>
          </div>

          <div class="metric-card">
            <span class="metric-card-title">Total Reader Likes</span>
            <div class="metric-card-value">${totalLikes}</div>
            <span class="metric-card-sub">Community appreciation</span>
          </div>

          <div class="metric-card">
            <span class="metric-card-title">Saved Bookmarks</span>
            <div class="metric-card-value">${bookmarks.length}</div>
            <span class="metric-card-sub">In your reading list</span>
          </div>
        </div>

        <!-- Management Section & Filter Tabs -->
        <div class="dashboard-content-card">
          <div class="dashboard-toolbar">
            <div class="dashboard-tabs">
              <button type="button" class="dashboard-tab ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
                All Stories (${totalCount})
              </button>
              <button type="button" class="dashboard-tab ${this.currentFilter === 'published' ? 'active' : ''}" data-filter="published">
                Published (${publishedCount})
              </button>
              <button type="button" class="dashboard-tab ${this.currentFilter === 'draft' ? 'active' : ''}" data-filter="draft">
                Drafts (${draftsCount})
              </button>
            </div>
          </div>

          <!-- Table Wrapper -->
          <div class="table-responsive">
            <table class="dashboard-table">
              <thead>
                <tr>
                  <th class="col-article">Story Title</th>
                  <th class="col-category">Category</th>
                  <th class="col-status">Status</th>
                  <th class="col-date">Date</th>
                  <th class="col-metrics">Engagement</th>
                  <th class="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  },

  /**
   * Render Saved Articles / Reading List view
   */
  renderSavedView() {
    const allBlogs = StorageManager.getBlogs();
    const bookmarkIds = StorageManager.getBookmarks();
    const savedBlogs = allBlogs.filter(b => bookmarkIds.includes(String(b.id)));

    let contentHtml = '';
    if (savedBlogs.length > 0) {
      contentHtml = `
        <div class="blog-grid blog-grid-3">
          ${savedBlogs.map(blog => BlogRenderer.renderBlogCard(blog)).join('')}
        </div>
      `;
    } else {
      contentHtml = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3>You haven't saved any articles yet</h3>
          <p>Click the bookmark icon on any article card to preserve ideas for quiet reading later.</p>
          <a href="#/explore" class="btn btn-primary">Browse All Articles</a>
        </div>
      `;
    }

    return `
      <section class="saved-page container">
        <header class="explore-header">
          <span class="section-eyebrow">Your Reading List</span>
          <h1 class="explore-title">Saved Articles</h1>
          <p class="explore-subtitle">Curated stories bookmarked for your focused, offline reflection.</p>
        </header>

        ${contentHtml}
      </section>
    `;
  },

  /**
   * Bind event handlers for dashboard actions (status toggle, custom delete confirmation modal)
   */
  initDashboardEvents(refreshCallback) {
    // Tab filters
    document.querySelectorAll('.dashboard-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.getAttribute('data-filter') || 'all';
        if (typeof refreshCallback === 'function') refreshCallback();
      });
    });

    // Delete Blog Flow (Custom Modal - NOT confirm())
    document.querySelectorAll('.delete-blog-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const blog = StorageManager.getBlogById(id);
        const title = blog ? blog.title : 'this article';

        const confirmed = await Modal.confirm({
          title: 'Delete Article Permanently?',
          message: `Are you sure you want to remove "${title}"? This action will permanently remove it from your local storage database.`,
          confirmText: 'Delete Forever',
          cancelText: 'Cancel',
          isDanger: true
        });

        if (confirmed) {
          StorageManager.deleteBlog(id);
          Toast.show('Article permanently deleted', 'info');
          if (typeof refreshCallback === 'function') refreshCallback();
        }
      });
    });

    // Toggle Status (Publish / Unpublish)
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const blog = StorageManager.getBlogById(id);
        if (!blog) return;

        const newStatus = blog.status === 'published' ? 'draft' : 'published';
        StorageManager.updateBlog(id, { status: newStatus });
        Toast.show(
          newStatus === 'published' ? 'Story published to the archive!' : 'Story reverted to draft.',
          'success'
        );
        if (typeof refreshCallback === 'function') refreshCallback();
      });
    });
  }
};

// Expose globally
window.DashboardManager = DashboardManager;
