// ═══════════════════════════════════════════════
//  MINDORA — breathing.js
// ═══════════════════════════════════════════════

(function() {
  let exIndex   = 0;
  let phaseIdx  = 0;
  let countdown = 0;
  let running   = false;
  let timer     = null;
  let cycles    = 0;

  const countEl  = document.getElementById('breathCount');
  const phaseEl  = document.getElementById('breathPhase');
  const dotsEl   = document.getElementById('breathDots');
  const cyclesEl = document.getElementById('breathCycles');
  const toggleBtn= document.getElementById('breathToggle');
  const circleEl = document.getElementById('breathCircle');
  const descEl   = document.getElementById('breathDesc');
  const ringO    = document.getElementById('bRingOuter');
  const ringM    = document.getElementById('bRingMid');

  /* ── Tabs ──────────────────────────────────── */
  document.querySelectorAll('.btab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      exIndex = parseInt(btn.dataset.ex);
      stop();
      phaseIdx = 0; cycles = 0;
      initExercise();
    });
  });

  /* ── Toggle ────────────────────────────────── */
  toggleBtn.addEventListener('click', () => {
    if (running) stop(); else start();
  });

  function start() {
    running = true;
    toggleBtn.textContent = '⏸  Pausar';
    tick();
  }

  function stop() {
    running = false;
    clearInterval(timer);
    toggleBtn.textContent = '▶  Comenzar';
  }

  function initExercise() {
    const ex = BREATHING_EXERCISES[exIndex];
    descEl.textContent = ex.desc;
    buildDots(ex.phases.length);
    countdown = ex.phases[0].secs;
    renderPhase();
  }

  function tick() {
    clearInterval(timer);
    timer = setInterval(() => {
      countdown--;
      countEl.textContent = countdown;
      if (countdown <= 0) {
        const ex = BREATHING_EXERCISES[exIndex];
        phaseIdx = (phaseIdx + 1) % ex.phases.length;
        if (phaseIdx === 0) { cycles++; renderCycles(); }
        countdown = ex.phases[phaseIdx].secs;
        renderPhase();
      } else {
        countEl.textContent = countdown;
      }
    }, 1000);
  }

  function renderPhase() {
    const ex    = BREATHING_EXERCISES[exIndex];
    const phase = ex.phases[phaseIdx];
    phaseEl.textContent  = phase.label;
    countEl.textContent  = phase.secs;

    // Dots
    dotsEl.querySelectorAll('.bdot').forEach((d, i) =>
      d.classList.toggle('active', i === phaseIdx)
    );

    // Circle scale
    const isInhale = phase.label.toLowerCase().includes('inha');
    const isExhale = phase.label.toLowerCase().includes('exha');
    const scale = isInhale ? 1.2 : isExhale ? 0.85 : 1;
    circleEl.style.transform = `scale(${scale})`;
    ringO.style.transform    = `scale(${scale * 1.04})`;
    ringM.style.transform    = `scale(${scale * 1.02})`;
  }

  function renderCycles() {
    cyclesEl.textContent = cycles > 0 ? `Ciclos completados: ${cycles}` : '';
  }

  function buildDots(n) {
    dotsEl.innerHTML = Array.from({ length: n }, (_, i) =>
      `<div class="bdot${i === 0 ? ' active' : ''}"></div>`
    ).join('');
  }

  // Init
  initExercise();
})();
