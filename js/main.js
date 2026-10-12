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
  initCategoryFilters();
  initSearch();
  initReadingProgressBar();
  initTableOfContentsSpy();
  initCopyCodeButtons();
  initShareButtons();
  initLoadMore();
  initChecklist();
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
   1. Category Pill Filtering
   -------------------------------------------------------------------------- */
function initCategoryFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.articles-grid .article-card');

  if (!filterTabs.length || !cards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active state
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter')?.toLowerCase() || 'all';

      cards.forEach(card => {
        const category = card.getAttribute('data-category')?.toLowerCase() || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   2. Search Functionality
   -------------------------------------------------------------------------- */
function initSearch() {
  const searchInputs = document.querySelectorAll('.hero-search-input, .header-search input');
  const cards = document.querySelectorAll('.articles-grid .article-card');

  if (!searchInputs.length || !cards.length) return;

  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();

      cards.forEach(card => {
        const title = card.querySelector('.card-title')?.innerText.toLowerCase() || '';
        const excerpt = card.querySelector('.card-excerpt')?.innerText.toLowerCase() || '';
        const category = card.querySelector('.card-category-badge')?.innerText.toLowerCase() || '';

        if (title.includes(term) || excerpt.includes(term) || category.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
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
      Loading More Analyses...
    `;
    setTimeout(() => {
      loadMoreBtn.innerHTML = `Showing All Available Analyses`;
      loadMoreBtn.style.opacity = '0.7';
      loadMoreBtn.disabled = true;
      showToast('All 48 latest research articles loaded.');
    }, 1000);
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
