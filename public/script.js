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

// ===== NEWSLETTER FORM =====
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn = e.target.querySelector('button');
  if (!input.value.trim()) return;
  btn.textContent = 'Subscribed!';
  btn.style.backgroundColor = '#27ae60';
  btn.style.borderColor = '#27ae60';
  input.value = '';
  setTimeout(() => {
    btn.textContent = 'Subscribe';
    btn.style.backgroundColor = '';
    btn.style.borderColor = '';
  }, 3000);
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

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
  initNavbarScroll();
  initGAC();
  initWisdomQuotes();

  document.querySelectorAll('.newsletter-form').forEach(f => f.addEventListener('submit', handleNewsletterSubmit));

  // Smooth active nav detection
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.getAttribute('data-page') === page) link.classList.add('active');
  });
});
