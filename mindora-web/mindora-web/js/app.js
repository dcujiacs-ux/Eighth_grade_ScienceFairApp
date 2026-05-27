// ═══════════════════════════════════════════════
//  MINDORA — app.js
//  Core: splash, navegación, toast, emergency
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  /* ── Splash ──────────────────────────────── */
  const splash = document.getElementById('splash');
  setTimeout(() => splash.classList.add('hidden'), 2800);

  /* ── Greeting & date ─────────────────────── */
  const hour = new Date().getHours();
  const greetings = { morning: 'Buenos días 🌸', afternoon: 'Buenas tardes 🌿', evening: 'Buenas noches 🌙' };
  const greeting = hour < 12 ? greetings.morning : hour < 18 ? greetings.afternoon : greetings.evening;
  document.getElementById('greetingText').textContent = greeting;

  const dateEl = document.getElementById('dateText');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('es', {
      weekday: 'long', day: 'numeric', month: 'long'
    }).replace(/^./, c => c.toUpperCase());
  }

  /* ── Navigation ──────────────────────────── */
  const sidebarItems = document.querySelectorAll('.sidebar__item');
  const screens      = document.querySelectorAll('.screen');
  const quickCards   = document.querySelectorAll('.quick-card[data-nav]');

  function navigate(target) {
    screens.forEach(s => s.classList.remove('active'));
    sidebarItems.forEach(i => i.classList.remove('active'));

    const screen = document.getElementById('screen-' + target);
    if (screen) screen.classList.add('active');

    const item = document.querySelector(`.sidebar__item[data-screen="${target}"]`);
    if (item) item.classList.add('active');

    // Trigger screen-specific init
    window.dispatchEvent(new CustomEvent('screenChanged', { detail: target }));

    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.screen));
  });

  quickCards.forEach(card => {
    card.addEventListener('click', () => navigate(card.dataset.nav));
  });

  // Home mood buttons → navigate to mood screen
  document.querySelectorAll('#moodQuickCard .mood-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate('mood'));
  });

  /* ── Daily quote ─────────────────────────── */
  let quoteIndex = Math.floor(Math.random() * QUOTES.length);
  function renderQuote() {
    const q = QUOTES[quoteIndex];
    document.getElementById('quoteText').textContent = q.text;
    document.getElementById('quoteAuthor').textContent = q.author ? `— ${q.author}` : '';
  }
  renderQuote();

  document.getElementById('refreshQuote').addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % QUOTES.length;
    renderQuote();
  });

  /* ── Daily affirmation ───────────────────── */
  const todayAff = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
  const affEl = document.getElementById('affirmationText');
  if (affEl) affEl.textContent = todayAff.text;

  /* ── Self-care tip ───────────────────────── */
  function renderTip(mood) {
    let candidates = mood
      ? SELF_CARE_TIPS.filter(t => t.moods.includes(mood))
      : [];
    const tip = candidates.length
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : SELF_CARE_TIPS[Math.floor(Math.random() * SELF_CARE_TIPS.length)];
    document.getElementById('tipEmoji').textContent = tip.emoji;
    document.getElementById('tipTitle').textContent  = tip.title;
    document.getElementById('tipDesc').textContent   = tip.desc;
  }
  const latest = Storage.getLatestMood();
  renderTip(latest?.mood || null);

  /* ── Emergency ───────────────────────────── */
  const emergencyModal  = document.getElementById('emergencyModal');
  const groundingModal  = document.getElementById('groundingModal');

  document.getElementById('emergencyBtn').addEventListener('click', () => {
    emergencyModal.classList.remove('hidden');
  });
  document.getElementById('closeEmergency').addEventListener('click', () => {
    emergencyModal.classList.add('hidden');
  });
  emergencyModal.addEventListener('click', e => {
    if (e.target === emergencyModal) emergencyModal.classList.add('hidden');
  });

  // Grounding exercise
  let groundingStep = 0;
  document.getElementById('groundingExercise').addEventListener('click', () => {
    emergencyModal.classList.add('hidden');
    groundingStep = 0;
    updateGrounding();
    groundingModal.classList.remove('hidden');
  });
  document.getElementById('closeGrounding').addEventListener('click', () => {
    groundingModal.classList.add('hidden');
  });
  document.getElementById('nextGrounding').addEventListener('click', () => {
    const steps = document.querySelectorAll('.grounding-step');
    const btnNext = document.getElementById('nextGrounding');
    if (groundingStep < steps.length - 1) {
      groundingStep++;
      updateGrounding();
    } else {
      groundingModal.classList.add('hidden');
      showToast('🌿 Ejercicio completo. Tómate un momento.');
    }
  });

  function updateGrounding() {
    const steps = document.querySelectorAll('.grounding-step');
    const btnNext = document.getElementById('nextGrounding');
    steps.forEach((s, i) => s.classList.toggle('active', i === groundingStep));
    btnNext.textContent = groundingStep < steps.length - 1 ? 'Siguiente →' : 'Finalizar ✓';
  }

  /* ── Toast ───────────────────────────────── */
  window.showToast = function(msg, duration = 3000) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), duration);
  };

  /* ── Expose navigate globally ─────────────── */
  window.navigate = navigate;
});
