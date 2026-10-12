/**
 * TRADE INSIGHT BLOG - MAIN JAVASCRIPT
 * Modular Interactive Features & Global Config
 */

/* --------------------------------------------------------------------------
   GLOBAL CONFIGURATION (Central Base Settings)
   -------------------------------------------------------------------------- */
window.SITE_CONFIG = {
  referralLink: "https://fxnod.com/auth/register?ref=J306O7OW"
};

document.addEventListener('DOMContentLoaded', () => {
  initReferralLinks();
  initFooterPlaybooksToggle();
  initCategoryFilters();
  initSearch();
  initReadingProgressBar();
  initTableOfContentsSpy();
  initCopyCodeButtons();
  initShareButtons();
  initLoadMore();
  initChecklist();
  updateArticlesView();
});

/* --------------------------------------------------------------------------
   0. Central Referral Link Manager
   -------------------------------------------------------------------------- */
function initReferralLinks() {
  const refUrl = window.SITE_CONFIG.referralLink;
  if (!refUrl) return;

  // Automatically update all referral links across the entire site
  const referralSelectors = [
    'a[data-ref-link]',
    'a.ref-link',
    'a.fxnod-ref-link',
    'a.sidebar-cta-btn',
    'a.fxnod-cta-btn',
    'a[href*="fxnod.com/auth/register"]'
  ];

  const refLinks = document.querySelectorAll(referralSelectors.join(', '));
  refLinks.forEach(link => {
    link.href = refUrl;
    if (!link.getAttribute('target')) link.setAttribute('target', '_blank');
    if (!link.getAttribute('rel')) link.setAttribute('rel', 'noopener noreferrer');
  });
}

/* --------------------------------------------------------------------------
   0.1 Footer Playbooks Expand/Collapse Toggle
   -------------------------------------------------------------------------- */
function initFooterPlaybooksToggle() {
  const toggleBtn = document.getElementById('footer-toggle-playbooks');
  const archiveList = document.getElementById('footer-playbooks-archive');
  if (!toggleBtn || !archiveList) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = archiveList.style.display === 'none';
    if (isHidden) {
      archiveList.style.display = 'flex';
      archiveList.style.flexDirection = 'column';
      archiveList.style.gap = '0.75rem';
      toggleBtn.innerHTML = '<span>− Show Less Playbooks</span>';
      toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      archiveList.style.display = 'none';
      toggleBtn.innerHTML = '<span>+ View All 30 Playbooks</span>';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------------------------
   1. Articles Manager (Data-Driven Architecture)
   -------------------------------------------------------------------------- */
let currentVisibleLimit = 9;
const BATCH_SIZE = 9;

function renderArticleCard(art) {
  return `
    <article class="article-card" data-category="${art.category}">
      <div class="card-media">
        <span class="card-category-badge" style="background: ${art.badgeColor}; color: #ffffff;">${art.badgeText}</span>
        <img 
          src="${art.image}" 
          alt="${art.title.replace(/"/g, '&quot;')}" 
          loading="lazy"
          style="width: 100%; height: 100%; object-fit: cover;"
        >
        <a href="${art.slug}" class="card-action-overlay" aria-label="Read article">
          <span class="circle-arrow-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
        </a>
      </div>
      <div class="card-body">
        <h3 class="card-title">
          <a href="${art.slug}">${art.title}</a>
        </h3>
        <p class="card-excerpt">
          ${art.excerpt}
        </p>
        <div class="card-footer">
          <span class="card-meta-info">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ${art.readTime}
          </span>
          <a href="${art.slug}" class="card-read-link">Read &gt;</a>
        </div>
      </div>
    </article>
  `;
}

function updateArticlesView() {
  const grid = document.querySelector('.articles-grid');
  const allArticles = window.ARTICLES_DATA || [];
  if (!grid || !allArticles.length) return;

  const activeTab = document.querySelector('.filter-tab.active');
  const activeFilter = activeTab ? activeTab.getAttribute('data-filter')?.toLowerCase() : 'all';
  const searchInput = document.querySelector('.hero-search-input');
  const searchTerm = (searchInput?.value || '').toLowerCase().trim();

  // Filter articles
  const matchingArticles = allArticles.filter(art => {
    const matchesFilter = (activeFilter === 'all' || art.category.toLowerCase().includes(activeFilter));
    const matchesSearch = (!searchTerm ||
      art.title.toLowerCase().includes(searchTerm) ||
      art.excerpt.toLowerCase().includes(searchTerm) ||
      art.badgeText.toLowerCase().includes(searchTerm)
    );
    return matchesFilter && matchesSearch;
  });

  const isFiltering = (activeFilter !== 'all' || searchTerm.length > 0);
  const displayLimit = isFiltering ? matchingArticles.length : currentVisibleLimit;
  const articlesToRender = matchingArticles.slice(0, displayLimit);

  // Render cards into grid
  grid.innerHTML = articlesToRender.map(renderArticleCard).join('');

  // Dynamic Badge Count
  const badgeCount = document.querySelector('.badge-count');
  if (badgeCount) {
    badgeCount.textContent = `${matchingArticles.length} Articles`;
  }

  // Load More Subtext & Button State
  const loadMoreBtn = document.querySelector('.load-more-btn');
  const loadMoreSubtext = document.querySelector('.load-more-subtext');

  if (loadMoreSubtext) {
    const shownCount = Math.min(displayLimit, matchingArticles.length);
    loadMoreSubtext.textContent = `Showing ${shownCount} of ${matchingArticles.length} technical editorial analyses`;
  }

  if (loadMoreBtn) {
    if (isFiltering || currentVisibleLimit >= matchingArticles.length) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'inline-flex';
      loadMoreBtn.disabled = false;
      loadMoreBtn.style.opacity = '1';
      loadMoreBtn.innerHTML = `
        <span>Load More Articles</span>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
        </svg>
      `;
    }
  }
}

function initCategoryFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  if (!filterTabs.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentVisibleLimit = BATCH_SIZE;
      updateArticlesView();
    });
  });
}

function initSearch() {
  const searchInputs = document.querySelectorAll('.hero-search-input, .header-search input');
  if (!searchInputs.length) return;

  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      currentVisibleLimit = BATCH_SIZE;
      updateArticlesView();
    });
  });
}

/* --------------------------------------------------------------------------
   3. Reading Progress Bar (Article Page)
   -------------------------------------------------------------------------- */
function initReadingProgressBar() {
  const progressBar = document.querySelector('.reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  });
}

/* --------------------------------------------------------------------------
   4. Table of Contents Scroll-Spy (Article Page)
   -------------------------------------------------------------------------- */
function initTableOfContentsSpy() {
  const tocItems = document.querySelectorAll('.toc-item');
  const sections = document.querySelectorAll('.article-section');

  if (!tocItems.length || !sections.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    tocItems.forEach(item => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Copy Code Block
   -------------------------------------------------------------------------- */
function initCopyCodeButtons() {
  const copyButtons = document.querySelectorAll('.copy-code-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const codeElement = targetId ? document.getElementById(targetId) : btn.closest('.code-block-wrapper')?.querySelector('code');

      if (!codeElement) return;

      const codeText = codeElement.innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!`;
        btn.style.background = '#10b981';
        btn.style.color = '#ffffff';

        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.background = '';
          btn.style.color = '';
        }, 2200);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. Share / Copy Link
   -------------------------------------------------------------------------- */
function initShareButtons() {
  const copyLinkBtn = document.querySelector('.btn-copy-link');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Article link copied to clipboard!');
      });
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      z-index: 9999;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color:#10b981;">✓</span> ${message}`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
  }, 2500);
}

/* --------------------------------------------------------------------------
   7. Load More Articles
   -------------------------------------------------------------------------- */
function initLoadMore() {
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener('click', () => {
    loadMoreBtn.innerHTML = `
      <svg style="animation: spin 1s linear infinite;" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
      Loading More Articles...
    `;
    setTimeout(() => {
      currentVisibleLimit += BATCH_SIZE;
      updateArticlesView();
      showToast('Loaded more research articles.');
    }, 250);
  });
}

/* --------------------------------------------------------------------------
   8. Interactive Checklist
   -------------------------------------------------------------------------- */
function initChecklist() {
  const checklistItems = document.querySelectorAll('.checklist-item');
  checklistItems.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (!checkbox) return;

    item.addEventListener('click', (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      if (checkbox.checked) {
        item.style.borderColor = '#10b981';
        item.style.background = '#f0fdf4';
      } else {
        item.style.borderColor = '#f1f5f9';
        item.style.background = '#f8fafc';
      }
    });
  });
}
