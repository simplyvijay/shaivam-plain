// ===== GOAL ACHIEVEMENT CYCLE =====
function initGAC() {
  const nodes = document.querySelectorAll('.gac-node');
  const panel = document.getElementById('gacDetailPanel');
  const section = document.getElementById('goal-cycle');
  if (!nodes.length || !panel) return;

  const phases = [
    { num: '1', deity: 'Ganesha', title: 'Inception', color: '#D35400',
      text: 'Setting vision, identifying the goal, removing obstacles — beginning with clarity and confident initiative. Ganesha, the remover of obstacles, represents that first essential step of seeing clearly where you want to go and what stands in the way.',
      keys: ['Vision', 'Clarity', 'Initiative', 'Beginnings'] },
    { num: '2', deity: 'Subramaniam', title: 'Execution', color: '#8B1A1A',
      text: 'Taking focused action, maintaining discipline, overcoming challenges — moving with precision and relentless dedication. Subramaniam, the divine warrior, embodies the fierce commitment required to see intentions through to completion.',
      keys: ['Action', 'Precision', 'Discipline', 'Dedication'] },
    { num: '3', deity: 'Parvati', title: 'Unofficial Impact', color: '#B8860B',
      text: 'Creating organic influence, nurturing communities, compassionate leadership — the quiet power that transforms from within. Parvati represents the phase where work begins touching lives beyond the original goal.',
      keys: ['Relationships', 'Organic Growth', 'Compassion', 'Nurturing'] },
    { num: '4', deity: 'Shivam', title: 'Official Impact', color: '#1A237E',
      text: 'Achieving recognition, transforming reality, manifestation — when vision becomes legacy. Shivam, as the cosmic transformer, represents the phase of full expression where work receives its formal acknowledgment in the world.',
      keys: ['Recognition', 'Transformation', 'Legacy', 'Manifestation'] },
    { num: '5', deity: 'Ganesha (Renewed)', title: 'Back to Inception', color: '#2D6A4F',
      text: 'Integration of learnings, setting a new vision enriched by wisdom gathered through the cycle. The return to Ganesha is not a regression but an elevation — the same beginning, from a higher vantage point.',
      keys: ['Renewal', 'Wisdom', 'New Beginnings', 'Integration'] }
  ];

  let autoTimer = null;
  let hasInteracted = false;
  let autoPhase = 1;

  function activatePhase(phaseNum) {
    const p = phases[phaseNum - 1];
    nodes.forEach(n => n.classList.toggle('active', parseInt(n.dataset.phase) === phaseNum));
    document.getElementById('gacDetailNum').textContent = p.num;
    document.getElementById('gacDetailNum').style.background = p.color;
    document.getElementById('gacDetailDeity').textContent = p.deity;
    document.getElementById('gacDetailDeity').style.color = p.color;
    document.getElementById('gacDetailTitle').textContent = p.title;
    document.getElementById('gacDetailText').textContent = p.text;
    document.getElementById('gacDetailKeys').innerHTML = p.keys
      .map(k => `<span style="background:${p.color}22;color:${p.color}">${k}</span>`).join('');
    panel.style.borderColor = p.color + '55';
  }

  function startAutoPlay() {
    autoPhase = 1;
    activatePhase(autoPhase);
    autoTimer = setInterval(function() {
      autoPhase = (autoPhase % 5) + 1;
      activatePhase(autoPhase);
    }, 1800);
  }

  function stopAutoPlay() {
    hasInteracted = true;
    clearInterval(autoTimer);
    autoTimer = null;
  }

  nodes.forEach(function(node) {
    node.addEventListener('mouseenter', function() {
      stopAutoPlay();
      activatePhase(parseInt(node.dataset.phase));
    });
    node.addEventListener('click', function() {
      stopAutoPlay();
      activatePhase(parseInt(node.dataset.phase));
    });
    node.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        stopAutoPlay();
        activatePhase(parseInt(node.dataset.phase));
      }
    });
  });

  // Start auto-play when section scrolls into view
  if (section && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !hasInteracted && !autoTimer) {
          setTimeout(startAutoPlay, 500);
          obs.unobserve(section);
        }
      });
    }, { threshold: 0.25 });
    obs.observe(section);
  } else {
    activatePhase(1);
  }
}

// ===== ROTATING WISDOM QUOTES =====
function initWisdomQuotes() {
  var el = document.getElementById('wisdomQuoteText');
  var dotsEl = document.getElementById('wisdomDots');
  if (!el || !dotsEl) return;

  var quotes = [
    "If you have the right intention, you will automatically acquire the right competency to rule the world",
    "There is difference between \u2018Something that is beautiful\u2019 and \u2018Something I think that is beautiful\u2019 and the life is always the latter case",
    "Humans are independent and authoritative, hence humans call him Mahadeva",
    "Humans\u2019 problems are always humans\u2019 problems, and they care for themselves, God will only provide directions",
    "It is not possible to lead a disciplined life without a motive",
    "Love within the society is called Shivam, love across boundaries is called Poorvapoorvam"
  ];

  var current = 0;
  var timer = null;
  var paused = false;

  quotes.forEach(function(_, i) {
    var btn = document.createElement('button');
    btn.className = 'wisdom-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Wisdom quote ' + (i + 1));
    btn.setAttribute('data-testid', 'wisdom-dot-' + (i + 1));
    btn.addEventListener('click', function() { goTo(i); resetTimer(); });
    dotsEl.appendChild(btn);
  });

  function updateDots() {
    dotsEl.querySelectorAll('.wisdom-dot').forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function show(index) {
    el.classList.remove('visible');
    setTimeout(function() {
      current = ((index % quotes.length) + quotes.length) % quotes.length;
      el.textContent = '\u201c' + quotes[current] + '\u201d';
      el.classList.add('visible');
      updateDots();
    }, 450);
  }

  function goTo(index) { show(index); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(function() {
      if (!paused) goTo(current + 1);
    }, 5500);
  }

  // Initialise first quote
  el.textContent = '\u201c' + quotes[0] + '\u201d';
  el.classList.add('visible');
  updateDots();
  resetTimer();

  var sect = el.closest('section');
  if (sect) {
    sect.addEventListener('mouseenter', function() { paused = true; });
    sect.addEventListener('mouseleave', function() { paused = false; });
  }
}

// ===== NEWSLETTER SUBSCRIBE =====
async function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const nameInput  = form.querySelector('input[type="text"], input[name="name"]');
  const emailInput = form.querySelector('input[type="email"]');
  const btn        = form.querySelector('button[type="submit"]');

  // Get or create status element
  let status = form.querySelector('.nl-status');
  if (!status) {
    status = document.createElement('div');
    status.className = 'nl-status';
    form.appendChild(status);
  }
  status.textContent = '';
  status.className = 'nl-status';

  const name  = nameInput  ? nameInput.value.trim()  : '';
  const email = emailInput ? emailInput.value.trim() : '';

  // Validation
  if (!name) {
    status.textContent = 'Please enter your name.';
    status.classList.add('nl-error');
    if (nameInput) nameInput.focus();
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.textContent = 'Please enter a valid email address.';
    status.classList.add('nl-error');
    if (emailInput) emailInput.focus();
    return;
  }

  // Show spinner
  const originalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-1"></i>Subscribing\u2026';

  try {
    const res = await fetch('https://api.shaivam.info/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });

    if (res.status === 202) {
      status.textContent = 'Thank you! You\'re now subscribed.';
      status.classList.add('nl-success');
      if (nameInput)  nameInput.value  = '';
      if (emailInput) emailInput.value = '';
    } else {
      status.textContent = 'Something went wrong. Please try again.';
      status.classList.add('nl-error');
    }
  } catch (_) {
    status.textContent = 'Unable to reach the server. Please try again.';
    status.classList.add('nl-error');
  }

  btn.disabled = false;
  btn.innerHTML = originalHTML;
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), index * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  elements.forEach(el => observer.observe(el));
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 60
      ? '0 4px 20px rgba(0,0,0,0.12)'
      : '0 2px 15px rgba(0,0,0,0.06)';
  }, { passive: true });
}

// ===== SHARE MODAL =====
function initShareModal() {
  // Build overlay once and reuse
  const overlay = document.createElement('div');
  overlay.className = 'share-overlay';
  overlay.setAttribute('data-testid', 'share-overlay');
  overlay.innerHTML = `
    <div class="share-modal" role="dialog" aria-modal="true" aria-labelledby="shareModalTitle" data-testid="share-modal">
      <button class="share-modal-close" aria-label="Close share menu" data-testid="share-modal-close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="share-modal-title" id="shareModalTitle">Share this article</div>
      <div class="share-modal-subtitle" id="shareModalUrl"></div>
      <div class="share-actions">
        <a class="share-btn-fb" id="shareModalFb" href="#" target="_blank" rel="noopener noreferrer" data-testid="share-facebook-btn">
          <i class="fa-brands fa-facebook"></i> Share on Facebook
        </a>
        <div class="share-divider">or</div>
        <button class="share-btn-copy" id="shareModalCopy" data-testid="share-copy-btn">
          <i class="fa-regular fa-copy"></i>
          <span id="shareModalCopyText">Copy link</span>
        </button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const modal   = overlay.querySelector('.share-modal');
  const closeBtn = overlay.querySelector('.share-modal-close');
  const fbBtn    = overlay.querySelector('#shareModalFb');
  const copyBtn  = overlay.querySelector('#shareModalCopy');
  const copyText = overlay.querySelector('#shareModalCopyText');
  const urlLabel = overlay.querySelector('#shareModalUrl');

  function openModal() {
    const url = window.location.href;
    urlLabel.textContent = url;
    fbBtn.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
    overlay.style.display = 'flex';
    // Trigger animation next frame
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { overlay.classList.add('open'); });
    });
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.addEventListener('transitionend', function hide() {
      overlay.style.display = 'none';
      overlay.removeEventListener('transitionend', hide);
    });
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  copyBtn.addEventListener('click', function() {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(showCopied);
    } else {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showCopied(); } catch (_) {}
      document.body.removeChild(ta);
    }
  });

  function showCopied() {
    copyBtn.classList.add('copied');
    copyText.textContent = 'Link copied!';
    copyBtn.querySelector('i').className = 'fa-solid fa-check';
    setTimeout(function() {
      copyBtn.classList.remove('copied');
      copyText.textContent = 'Copy link';
      copyBtn.querySelector('i').className = 'fa-regular fa-copy';
    }, 2500);
  }

  // Attach to every share button on the page
  document.querySelectorAll('[data-testid="share-btn"]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  initNavbarScroll();
  initGAC();
  initWisdomQuotes();
  initShareModal();

  document.querySelectorAll('.newsletter-form').forEach(f => f.addEventListener('submit', handleNewsletterSubmit));

  // Active nav detection — folder-based URL structure
  // e.g. /shaivam/about/ → 'about',  /shaivam/blog/dual-monism/ → 'blog'
  const pathSegments = window.location.pathname
    .split('/')
    .filter(p => p && p !== 'index.html' && p !== 'shaivam');
  const currentSection = pathSegments.length > 0 ? pathSegments[0] : 'index';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === currentSection) link.classList.add('active');
  });
});
