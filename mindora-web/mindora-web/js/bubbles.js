// ═══════════════════════════════════════════════
//  MINDORA — bubbles.js
// ═══════════════════════════════════════════════

(function() {
  let popCount  = 0;
  let genTimer  = null;
  let nextId    = 0;

  const canvas    = document.getElementById('bubbleCanvas');
  const popEl     = document.getElementById('popCount');
  const stressEl  = document.getElementById('stressVal');
  const fillEl    = document.getElementById('stressBarFill');
  const celebEl   = document.getElementById('bubbleCelebration');

  function calcStress() { return Math.max(0, 100 - popCount * 5); }

  function updateUI() {
    const s = calcStress();
    popEl.textContent   = popCount;
    stressEl.textContent= s + '%';
    fillEl.style.width  = s + '%';
    if (s === 0) celebEl.classList.remove('hidden');
    else         celebEl.classList.add('hidden');
  }

  function spawnBubble() {
    const id    = nextId++;
    const size  = Math.random() * 36 + 48;          // 48–84px
    const x     = Math.random() * (canvas.clientWidth - size - 20) + 10;
    const speed = Math.random() * 6 + 7;            // 7–13s
    const emoji = BUBBLE_EMOJIS[Math.floor(Math.random() * BUBBLE_EMOJIS.length)];
    const color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];

    const el = document.createElement('div');
    el.className   = 'bubble-el';
    el.dataset.id  = id;
    el.textContent = emoji;
    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      bottom: -${size}px;
      font-size: ${size * 0.42}px;
      background: ${color};
      animation: floatUp ${speed}s linear forwards;
      box-shadow: inset -4px -4px 10px rgba(255,255,255,.55), 0 4px 14px rgba(0,0,0,.07);
    `;

    el.addEventListener('click', () => popBubble(el));
    canvas.appendChild(el);

    // Remove after animation
    setTimeout(() => { if (el.parentNode) el.remove(); }, speed * 1000);
  }

  function popBubble(el) {
    if (el.classList.contains('popped')) return;
    el.classList.add('popped');
    popCount++;
    updateUI();

    // Visual pop effect
    el.style.animation = 'popOut .25s ease forwards';
    setTimeout(() => el.remove(), 280);
  }

  function startSpawning() {
    spawnBubble(); spawnBubble(); spawnBubble(); spawnBubble();
    clearInterval(genTimer);
    genTimer = setInterval(spawnBubble, 1800);
  }

  function reset() {
    popCount = 0;
    updateUI();
    canvas.querySelectorAll('.bubble-el').forEach(b => b.remove());
    startSpawning();
  }

  document.getElementById('resetBubbles').addEventListener('click', reset);

  window.addEventListener('screenChanged', e => {
    if (e.detail === 'bubbles') {
      if (!genTimer) startSpawning();
    } else {
      clearInterval(genTimer);
      genTimer = null;
    }
  });

  updateUI();
})();
