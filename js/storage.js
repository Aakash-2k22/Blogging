/**
 * InkSpace - Storage Manager
 * Robust localStorage data layer with fallback in-memory cache and defensive error handling.
 */

const StorageManager = {
  KEYS: {
    BLOGS: 'inkspace_blogs',
    BOOKMARKS: 'inkspace_bookmarks',
    LIKES: 'inkspace_likes',
    THEME: 'inkspace_theme',
    SUBSCRIBERS: 'inkspace_subscribers'
  },

  // Fallback memory cache if storage fails or is blocked
  _memoryCache: {},

  _hasLocalStorage() {
    try {
      const testKey = '__inkspace_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },

  _getItem(key, defaultValue = null) {
    if (this._hasLocalStorage()) {
      try {
        const item = window.localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
      } catch (e) {
        console.warn(`[InkSpace Storage] Corrupted data in ${key}, resetting to default:`, e);
        return defaultValue;
      }
    }
    return this._memoryCache[key] !== undefined ? this._memoryCache[key] : defaultValue;
  },

  _setItem(key, value) {
    if (this._hasLocalStorage()) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error(`[InkSpace Storage] Failed to write ${key}:`, e);
      }
    }
    this._memoryCache[key] = value;
    return true;
  },

  /**
   * Initialize storage with default blogs if not already set
   */
  init() {
    const existing = this._getItem(this.KEYS.BLOGS, null);
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      console.log('[InkSpace Storage] Initializing default sample articles...');
      this.saveBlogs(window.INITIAL_BLOGS || []);
    }

    if (!this._getItem(this.KEYS.BOOKMARKS)) {
      this._setItem(this.KEYS.BOOKMARKS, []);
    }

    if (!this._getItem(this.KEYS.LIKES)) {
      this._setItem(this.KEYS.LIKES, []);
    }

    if (!this._getItem(this.KEYS.SUBSCRIBERS)) {
      this._setItem(this.KEYS.SUBSCRIBERS, []);
    }
  },

  /**
   * Get all blogs
   * @returns {Array} List of blog objects
   */
  getBlogs() {
    const blogs = this._getItem(this.KEYS.BLOGS, []);
    if (!Array.isArray(blogs) || blogs.length === 0) {
      // Re-initialize if corrupted
      return window.INITIAL_BLOGS || [];
    }
    return blogs;
  },

  /**
   * Overwrite all blogs
   */
  saveBlogs(blogs) {
    return this._setItem(this.KEYS.BLOGS, blogs);
  },

  /**
   * Get a single blog by ID
   */
  getBlogById(id) {
    const blogs = this.getBlogs();
    return blogs.find(blog => String(blog.id) === String(id)) || null;
  },

  /**
   * Add a new blog
   */
  addBlog(blogData) {
    const blogs = this.getBlogs();
    const newId = `blog-${Date.now()}`;
    const slug = Utils.slugify(blogData.title || `article-${newId}`);
    const readingTime = Utils.calculateReadingTime(blogData.content || '');

    const newBlog = {
      id: newId,
      title: blogData.title.trim(),
      slug: slug,
      category: blogData.category || 'Technology',
      author: blogData.author.trim() || 'Anonymous Author',
      authorBio: blogData.authorBio || 'Contributing writer at InkSpace.',
      authorAvatar: blogData.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      date: new Date().toISOString().split('T')[0],
      readingTime: readingTime,
      image: blogData.image.trim() || Utils.getFallbackImage(blogData.title, blogData.category),
      excerpt: blogData.excerpt.trim(),
      content: blogData.content,
      tags: Array.isArray(blogData.tags) ? blogData.tags : [],
      featured: Boolean(blogData.featured),
      likes: 0,
      views: 0,
      status: blogData.status || 'published', // 'published' or 'draft'
      createdAt: new Date().toISOString()
    };

    // If marked featured, optionally unfeature other posts or let multiple exist
    blogs.unshift(newBlog);
    this.saveBlogs(blogs);
    return newBlog;
  },

  /**
   * Update an existing blog
   */
  updateBlog(id, updatedData) {
    const blogs = this.getBlogs();
    const index = blogs.findIndex(b => String(b.id) === String(id));
    if (index === -1) return null;

    const current = blogs[index];
    const readingTime = updatedData.content 
      ? Utils.calculateReadingTime(updatedData.content) 
      : current.readingTime;

    const updatedBlog = {
      ...current,
      ...updatedData,
      id: current.id, // prevent ID change
      readingTime: readingTime,
      updatedAt: new Date().toISOString()
    };

    blogs[index] = updatedBlog;
    this.saveBlogs(blogs);
    return updatedBlog;
  },

  /**
   * Delete a blog by ID
   */
  deleteBlog(id) {
    const blogs = this.getBlogs();
    const filtered = blogs.filter(b => String(b.id) !== String(id));
    if (filtered.length !== blogs.length) {
      this.saveBlogs(filtered);
      // Clean up bookmarks and likes
      const bookmarks = this.getBookmarks().filter(bId => String(bId) !== String(id));
      this.saveBookmarks(bookmarks);
      const likes = this.getLikedBlogIds().filter(lId => String(lId) !== String(id));
      this.saveLikes(likes);
      return true;
    }
    return false;
  },

  /**
   * Bookmark handling
   */
  getBookmarks() {
    return this._getItem(this.KEYS.BOOKMARKS, []);
  },

  saveBookmarks(bookmarks) {
    return this._setItem(this.KEYS.BOOKMARKS, bookmarks);
  },

  isBookmarked(id) {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(bId => String(bId) === String(id));
  },

  toggleBookmark(id) {
    const bookmarks = this.getBookmarks();
    const stringId = String(id);
    const index = bookmarks.findIndex(bId => String(bId) === stringId);
    let isNowBookmarked = false;

    if (index === -1) {
      bookmarks.push(stringId);
      isNowBookmarked = true;
    } else {
      bookmarks.splice(index, 1);
      isNowBookmarked = false;
    }

    this.saveBookmarks(bookmarks);
    return isNowBookmarked;
  },

  /**
   * Likes handling
   */
  getLikedBlogIds() {
    return this._getItem(this.KEYS.LIKES, []);
  },

  saveLikes(likedIds) {
    return this._setItem(this.KEYS.LIKES, likedIds);
  },

  isLiked(id) {
    const likes = this.getLikedBlogIds();
    return likes.some(lId => String(lId) === String(id));
  },

  toggleLike(id) {
    const likedIds = this.getLikedBlogIds();
    const stringId = String(id);
    const index = likedIds.findIndex(lId => String(lId) === stringId);
    let isLikedNow = false;

    const blogs = this.getBlogs();
    const blogIndex = blogs.findIndex(b => String(b.id) === stringId);

    if (index === -1) {
      likedIds.push(stringId);
      isLikedNow = true;
      if (blogIndex !== -1) {
        blogs[blogIndex].likes = (blogs[blogIndex].likes || 0) + 1;
      }
    } else {
      likedIds.splice(index, 1);
      isLikedNow = false;
      if (blogIndex !== -1) {
        blogs[blogIndex].likes = Math.max(0, (blogs[blogIndex].likes || 0) - 1);
      }
    }

    this.saveLikes(likedIds);
    if (blogIndex !== -1) {
      this.saveBlogs(blogs);
    }

    return {
      isLiked: isLikedNow,
      likesCount: blogIndex !== -1 ? blogs[blogIndex].likes : 0
    };
  },

  /**
   * Increment blog view counter
   */
  incrementViews(id) {
    const blogs = this.getBlogs();
    const blog = blogs.find(b => String(b.id) === String(id));
    if (blog) {
      blog.views = (blog.views || 0) + 1;
      this.saveBlogs(blogs);
      return blog.views;
    }
    return 0;
  },

  /**
   * Subscribers handling
   */
  getSubscribers() {
    return this._getItem(this.KEYS.SUBSCRIBERS, []);
  },

  addSubscriber(email) {
    const list = this.getSubscribers();
    const normalized = String(email).trim().toLowerCase();
    if (!list.includes(normalized)) {
      list.push(normalized);
      this._setItem(this.KEYS.SUBSCRIBERS, list);
      return true;
    }
    return false;
  },

  /**
   * Theme preference
   */
  getTheme() {
    return this._getItem(this.KEYS.THEME, null);
  },

  setTheme(theme) {
    return this._setItem(this.KEYS.THEME, theme);
  }
};

// Expose globally
window.StorageManager = StorageManager;
