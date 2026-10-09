/**
 * InkSpace - Rich Text Editor & Blog Form Controller
 * Lightweight custom editor using contenteditable with full inline validation,
 * image live preview, word counter, and draft/publish workflows.
 */

const BlogEditor = {
  activeBlogId: null,

  /**
   * Render the Create or Edit blog page form
   * @param {string|null} blogId - If passed, loads blog data for editing
   */
  renderEditorView(blogId = null) {
    this.activeBlogId = blogId;
    let blog = null;
    let isEditing = false;

    if (blogId) {
      blog = StorageManager.getBlogById(blogId);
      if (blog) {
        isEditing = true;
      }
    }

    const categories = (window.CATEGORIES || []).filter(c => c.id !== 'all');

    const defaultImage = blog ? blog.image : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80';
    const currentTags = blog && Array.isArray(blog.tags) ? blog.tags.join(', ') : '';

    return `
      <section class="editor-page container">
        <header class="editor-header">
          <div class="editor-header-meta">
            <span class="section-eyebrow">${isEditing ? 'Update Existing Story' : 'New Article'}</span>
            <h1 class="editor-page-title">${isEditing ? 'Edit Story' : 'Write a Story'}</h1>
          </div>
          <div class="editor-header-actions">
            <button type="button" class="btn btn-secondary" id="editor-cancel-btn">Cancel</button>
            <button type="button" class="btn btn-outline" id="editor-draft-btn">Save Draft</button>
            <button type="button" class="btn btn-primary" id="editor-publish-btn">${isEditing ? 'Update & Publish' : 'Publish Story'}</button>
          </div>
        </header>

        <form id="blog-editor-form" class="editor-form" novalidate>
          <div class="editor-layout-grid">
            <!-- Left Main Column: Content, Title, Excerpt, Rich Text -->
            <div class="editor-main-col">
              <!-- Title Field -->
              <div class="form-group" id="group-title">
                <label for="blog-title-input" class="form-label">Article Title <span class="required-star">*</span></label>
                <input 
                  type="text" 
                  id="blog-title-input" 
                  class="form-control form-control-title" 
                  placeholder="Enter a compelling title..." 
                  value="${blog ? Utils.escapeHtml(blog.title) : ''}" 
                  maxlength="120"
                  required
                />
                <span class="field-error" id="error-title"></span>
              </div>

              <!-- Excerpt Field -->
              <div class="form-group" id="group-excerpt">
                <label for="blog-excerpt-input" class="form-label">Short Excerpt / Summary <span class="required-star">*</span></label>
                <textarea 
                  id="blog-excerpt-input" 
                  class="form-control" 
                  rows="2" 
                  placeholder="A clear 1-2 sentence overview that appears on preview cards..."
                  maxlength="280"
                  required
                >${blog ? Utils.escapeHtml(blog.excerpt) : ''}</textarea>
                <span class="field-error" id="error-excerpt"></span>
              </div>

              <!-- Rich Text Toolbar & ContentEditable Area -->
              <div class="form-group" id="group-content">
                <div class="editor-field-header">
                  <label class="form-label">Story Content <span class="required-star">*</span></label>
                  <span class="editor-stats" id="editor-word-stats">0 words &bull; 1 min read</span>
                </div>

                <div class="rich-editor-container">
                  <!-- Custom Toolbar -->
                  <div class="editor-toolbar" role="toolbar" aria-label="Editor formatting tools">
                    <div class="toolbar-group">
                      <button type="button" class="toolbar-btn" data-command="bold" title="Bold (Ctrl+B)" aria-label="Bold">
                        <strong>B</strong>
                      </button>
                      <button type="button" class="toolbar-btn" data-command="italic" title="Italic (Ctrl+I)" aria-label="Italic">
                        <em>I</em>
                      </button>
                      <button type="button" class="toolbar-btn" data-command="underline" title="Underline (Ctrl+U)" aria-label="Underline">
                        <u>U</u>
                      </button>
                      <button type="button" class="toolbar-btn" data-command="strikeThrough" title="Strikethrough" aria-label="Strikethrough">
                        <s>S</s>
                      </button>
                    </div>

                    <div class="toolbar-divider"></div>

                    <div class="toolbar-group">
                      <button type="button" class="toolbar-btn" data-command="formatBlock" data-val="h2" title="Subheading 2" aria-label="Heading 2">
                        H2
                      </button>
                      <button type="button" class="toolbar-btn" data-command="formatBlock" data-val="h3" title="Subheading 3" aria-label="Heading 3">
                        H3
                      </button>
                      <button type="button" class="toolbar-btn" data-command="formatBlock" data-val="p" title="Paragraph" aria-label="Paragraph">
                        P
                      </button>
                    </div>

                    <div class="toolbar-divider"></div>

                    <div class="toolbar-group">
                      <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="Bullet List" aria-label="Bullet List">
                        &bull; List
                      </button>
                      <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="Numbered List" aria-label="Numbered List">
                        1. List
                      </button>
                      <button type="button" class="toolbar-btn" data-command="formatBlock" data-val="blockquote" title="Quote Block" aria-label="Quote Block">
                        &ldquo; Quote
                      </button>
                    </div>

                    <div class="toolbar-divider"></div>

                    <div class="toolbar-group">
                      <button type="button" class="toolbar-btn" id="toolbar-link-btn" title="Insert Link" aria-label="Insert Link">
                        Link
                      </button>
                      <button type="button" class="toolbar-btn" data-command="removeFormat" title="Clear Formatting" aria-label="Clear Formatting">
                        Clear
                      </button>
                    </div>
                  </div>

                  <!-- Editable Canvas -->
                  <div 
                    id="rich-editor-content" 
                    class="rich-editor-content rich-text-body" 
                    contenteditable="true" 
                    placeholder="Tell your story... Write insights, format thoughts, and craft ideas."
                    role="textbox"
                    aria-multiline="true"
                  >${blog ? blog.content : ''}</div>
                </div>

                <span class="field-error" id="error-content"></span>
              </div>
            </div>

            <!-- Right Sidebar Column: Metadata, Cover, Tags, Author -->
            <aside class="editor-sidebar-col">
              <div class="editor-sidebar-card">
                <h3 class="sidebar-card-title">Publishing Settings</h3>

                <!-- Category Field -->
                <div class="form-group" id="group-category">
                  <label for="blog-category-select" class="form-label">Category <span class="required-star">*</span></label>
                  <select id="blog-category-select" class="form-control" required>
                    <option value="" disabled ${!blog ? 'selected' : ''}>Select a category</option>
                    ${categories.map(c => `
                      <option value="${Utils.escapeHtml(c.id)}" ${blog && blog.category === c.id ? 'selected' : ''}>
                        ${Utils.escapeHtml(c.name)}
                      </option>
                    `).join('')}
                  </select>
                  <span class="field-error" id="error-category"></span>
                </div>

                <!-- Author Name -->
                <div class="form-group" id="group-author">
                  <label for="blog-author-input" class="form-label">Author Name <span class="required-star">*</span></label>
                  <input 
                    type="text" 
                    id="blog-author-input" 
                    class="form-control" 
                    placeholder="Your name" 
                    value="${blog ? Utils.escapeHtml(blog.author) : 'Aakash Keshari'}"
                    required
                  />
                  <span class="field-error" id="error-author"></span>
                </div>

                <!-- Cover Image URL -->
                <div class="form-group" id="group-image">
                  <label for="blog-image-input" class="form-label">Cover Image URL <span class="required-star">*</span></label>
                  <input 
                    type="url" 
                    id="blog-image-input" 
                    class="form-control" 
                    placeholder="https://images.unsplash.com/..." 
                    value="${Utils.escapeHtml(defaultImage)}"
                    required
                  />
                  <span class="field-error" id="error-image"></span>
                  
                  <!-- Live Image Preview -->
                  <div class="image-preview-wrapper" id="image-preview-wrapper">
                    <span class="preview-label">Cover Preview</span>
                    <div class="image-preview-container">
                      <img 
                        id="cover-image-preview" 
                        src="${Utils.escapeHtml(defaultImage)}" 
                        alt="Cover image preview" 
                        class="cover-image-preview"
                        onerror="this.onerror=null; this.src='${Utils.getFallbackImage('Preview', 'InkSpace')}';"
                      />
                    </div>
                  </div>
                </div>

                <!-- Tags Field -->
                <div class="form-group" id="group-tags">
                  <label for="blog-tags-input" class="form-label">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    id="blog-tags-input" 
                    class="form-control" 
                    placeholder="Technology, AI, Frontend" 
                    value="${Utils.escapeHtml(currentTags)}"
                  />
                  <span class="form-helper">Separate keywords with commas</span>
                </div>

                <!-- Featured Toggle -->
                <div class="form-group form-check-group">
                  <label class="toggle-switch">
                    <input type="checkbox" id="blog-featured-toggle" ${blog && blog.featured ? 'checked' : ''} />
                    <span class="toggle-slider"></span>
                  </label>
                  <span class="toggle-label">Feature on Homepage</span>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </section>
    `;
  },

  /**
   * Bind event handlers for the editor toolbar, image preview, word count, and validation
   */
  initEditorEvents() {
    const editor = document.getElementById('rich-editor-content');
    const wordStats = document.getElementById('editor-word-stats');
    const imageInput = document.getElementById('blog-image-input');
    const imagePreview = document.getElementById('cover-image-preview');
    const publishBtn = document.getElementById('editor-publish-btn');
    const draftBtn = document.getElementById('editor-draft-btn');
    const cancelBtn = document.getElementById('editor-cancel-btn');
    const toolbar = document.querySelector('.editor-toolbar');
    const linkBtn = document.getElementById('toolbar-link-btn');

    if (!editor) return;

    // Update word count & reading time
    const updateWordCount = () => {
      const text = editor.innerText || editor.textContent || '';
      const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      const readingTime = Math.max(1, Math.ceil(words / 220));
      if (wordStats) {
        wordStats.innerHTML = `${words} ${words === 1 ? 'word' : 'words'} &bull; ${readingTime} min read`;
      }
    };
    editor.addEventListener('input', updateWordCount);
    updateWordCount();

    // Toolbar formatting commands
    if (toolbar) {
      toolbar.querySelectorAll('.toolbar-btn[data-command]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const cmd = btn.getAttribute('data-command');
          const val = btn.getAttribute('data-val') || null;
          editor.focus();
          document.execCommand(cmd, false, val);
          updateWordCount();
        });
      });
    }

    // Link button
    if (linkBtn) {
      linkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const selection = window.getSelection();
        const selectedText = selection.toString();
        const url = prompt('Enter the link destination URL:', 'https://');
        if (url && Utils.isValidUrl(url)) {
          editor.focus();
          document.execCommand('createLink', false, url);
        } else if (url) {
          Toast.show('Please provide a valid URL starting with http:// or https://', 'warning');
        }
      });
    }

    // Live Cover Image Preview
    if (imageInput && imagePreview) {
      const updateImage = () => {
        const val = imageInput.value.trim();
        if (val) {
          imagePreview.src = val;
        } else {
          imagePreview.src = Utils.getFallbackImage('Preview', 'Cover');
        }
      };
      imageInput.addEventListener('input', Utils.debounce(updateImage, 400));
    }

    // Cancel Button
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (this.activeBlogId) {
          window.location.hash = `#/article/${encodeURIComponent(this.activeBlogId)}`;
        } else {
          window.location.hash = '#/dashboard';
        }
      });
    }

    // Publish & Draft Buttons
    if (publishBtn) {
      publishBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSubmit('published');
      });
    }

    if (draftBtn) {
      draftBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSubmit('draft');
      });
    }
  },

  /**
   * Validate form fields and return clean payload or null
   */
  validateForm() {
    const titleInput = document.getElementById('blog-title-input');
    const categorySelect = document.getElementById('blog-category-select');
    const authorInput = document.getElementById('blog-author-input');
    const imageInput = document.getElementById('blog-image-input');
    const excerptInput = document.getElementById('blog-excerpt-input');
    const editor = document.getElementById('rich-editor-content');
    const tagsInput = document.getElementById('blog-tags-input');
    const featuredToggle = document.getElementById('blog-featured-toggle');

    // Reset errors
    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-control').forEach(el => el.classList.remove('is-invalid'));

    let isValid = true;

    // Title validation
    const title = titleInput ? titleInput.value.trim() : '';
    if (!title) {
      this.showError('title', 'Article title is required.');
      isValid = false;
    } else if (title.length < 5) {
      this.showError('title', 'Title must be at least 5 characters long.');
      isValid = false;
    }

    // Excerpt validation
    const excerpt = excerptInput ? excerptInput.value.trim() : '';
    if (!excerpt) {
      this.showError('excerpt', 'A short excerpt is required for card previews.');
      isValid = false;
    } else if (excerpt.length < 10) {
      this.showError('excerpt', 'Excerpt must be at least 10 characters long.');
      isValid = false;
    }

    // Category validation
    const category = categorySelect ? categorySelect.value : '';
    if (!category) {
      this.showError('category', 'Please select a relevant category.');
      isValid = false;
    }

    // Author validation
    const author = authorInput ? authorInput.value.trim() : '';
    if (!author) {
      this.showError('author', 'Author name is required.');
      isValid = false;
    }

    // Image URL validation
    const image = imageInput ? imageInput.value.trim() : '';
    if (!image) {
      this.showError('image', 'Cover image URL is required.');
      isValid = false;
    } else if (!Utils.isValidUrl(image)) {
      this.showError('image', 'Please enter a valid HTTP or HTTPS image URL.');
      isValid = false;
    }

    // Content validation
    const content = editor ? editor.innerHTML.trim() : '';
    const textContent = editor ? (editor.innerText || editor.textContent || '').trim() : '';
    if (!content || textContent.length < 20) {
      this.showError('content', 'Article content cannot be empty (minimum 20 characters).');
      isValid = false;
    }

    if (!isValid) return null;

    // Parse tags
    const rawTags = tagsInput ? tagsInput.value : '';
    const tags = rawTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    return {
      title,
      category,
      author,
      image,
      excerpt,
      content,
      tags,
      featured: featuredToggle ? featuredToggle.checked : false
    };
  },

  showError(fieldKey, message) {
    const errorEl = document.getElementById(`error-${fieldKey}`);
    const inputEl = document.getElementById(`blog-${fieldKey}-input`) || document.getElementById(`blog-${fieldKey}-select`);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add('is-invalid');
  },

  /**
   * Handle form save / publish
   */
  handleSubmit(status = 'published') {
    const payload = this.validateForm();
    if (!payload) {
      Toast.show('Please fix the errors in the form before proceeding.', 'error');
      return;
    }

    payload.status = status;

    if (this.activeBlogId) {
      // Update existing
      const updated = StorageManager.updateBlog(this.activeBlogId, payload);
      if (updated) {
        Toast.show(`Article ${status === 'draft' ? 'saved as draft' : 'updated and published'}!`, 'success');
        window.location.hash = `#/article/${encodeURIComponent(updated.id)}`;
      } else {
        Toast.show('Failed to update article.', 'error');
      }
    } else {
      // Create new
      const created = StorageManager.addBlog(payload);
      if (created) {
        Toast.show(`Article ${status === 'draft' ? 'saved as draft' : 'published successfully'}!`, 'success');
        window.location.hash = `#/article/${encodeURIComponent(created.id)}`;
      } else {
        Toast.show('Failed to save article.', 'error');
      }
    }
  }
};

// Expose globally
window.BlogEditor = BlogEditor;
