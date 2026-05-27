// ═══════════════════════════════════════════════
//  MINDORA — sounds.js
//  Web Audio API - genera sonidos sintéticos
// ═══════════════════════════════════════════════

(function() {
  let audioCtx      = null;
  const activeSounds = {};
  let timerMin      = 0;
  let timerInterval = null;
  let timerLeft     = 0;

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  /* ── Sound generators ────────────────────── */
  const generators = {
    rain: ctx => {
      const buf   = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data  = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src   = ctx.createBufferSource();
      src.buffer  = buf;
      src.loop    = true;
      const filt  = ctx.createBiquadFilter();
      filt.type   = 'bandpass';
      filt.frequency.value = 800;
      filt.Q.value = 0.5;
      const gain  = ctx.createGain();
      gain.gain.value = 0.35;
      src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
      src.start();
      return { src, gain };
    },
    ocean: ctx => {
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src  = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const filt = ctx.createBiquadFilter();
      filt.type  = 'lowpass'; filt.frequency.value = 500;
      const lfo  = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.08; lfoG.gain.value = 200;
      lfo.connect(lfoG); lfoG.connect(filt.frequency);
      const gain = ctx.createGain(); gain.gain.value = 0.4;
      src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
      src.start(); lfo.start();
      return { src, lfo, gain };
    },
    forest: ctx => {
      const osc  = ctx.createOscillator();
      osc.type   = 'sine'; osc.frequency.value = 300;
      const osc2 = ctx.createOscillator();
      osc2.type  = 'sine'; osc2.frequency.value = 600;
      const gain = ctx.createGain(); gain.gain.value = 0.04;
      const gain2 = ctx.createGain(); gain2.gain.value = 0.02;
      const lfo  = ctx.createOscillator();
      lfo.frequency.value = 0.3;
      const lfoG = ctx.createGain(); lfoG.gain.value = 50;
      lfo.connect(lfoG); lfoG.connect(osc.frequency);
      osc.connect(gain); osc2.connect(gain2);
      gain.connect(ctx.destination); gain2.connect(ctx.destination);
      osc.start(); osc2.start(); lfo.start();
      return { osc, osc2, lfo, gain };
    },
    white: ctx => {
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src  = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const gain = ctx.createGain(); gain.gain.value = 0.2;
      src.connect(gain); gain.connect(ctx.destination);
      src.start();
      return { src, gain };
    },
    fire: ctx => {
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src  = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      const filt = ctx.createBiquadFilter();
      filt.type  = 'lowpass'; filt.frequency.value = 300;
      const gain = ctx.createGain(); gain.gain.value = 0.45;
      src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
      src.start();
      return { src, gain };
    }
  };

  /* ── Sound cards ─────────────────────────── */
  document.querySelectorAll('.sound-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.sound;
      if (activeSounds[name]) {
        stopSound(name, card);
      } else {
        playSound(name, card);
      }
    });
  });

  function playSound(name, card) {
    try {
      const ctx  = getCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const nodes = generators[name](ctx);
      activeSounds[name] = nodes;
      card.classList.add('playing');
      buildWave(card.querySelector('.sound-wave'));
    } catch(e) {
      showToast('⚠️ Audio no disponible en este navegador');
    }
  }

  function stopSound(name, card) {
    const nodes = activeSounds[name];
    if (!nodes) return;
    ['src','osc','osc2','lfo'].forEach(k => { if (nodes[k]) { try { nodes[k].stop(); } catch{} } });
    delete activeSounds[name];
    card.classList.remove('playing');
    card.querySelector('.sound-wave').innerHTML = '';
  }

  function buildWave(el) {
    el.innerHTML = Array.from({length:5}, (_,i) =>
      `<div class="bar" style="height:${4+Math.random()*14}px;animation-delay:${i*.12}s"></div>`
    ).join('');
  }

  /* ── Timer ───────────────────────────────── */
  document.querySelectorAll('.timer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      timerMin = parseInt(btn.dataset.min);
      clearInterval(timerInterval);
      document.getElementById('timerDisplay').textContent = '';
      if (timerMin > 0) {
        timerLeft = timerMin * 60;
        updateTimerDisplay();
        timerInterval = setInterval(() => {
          timerLeft--;
          updateTimerDisplay();
          if (timerLeft <= 0) {
            clearInterval(timerInterval);
            stopAllSounds();
            showToast('🎵 Temporizador completado');
          }
        }, 1000);
      }
    });
  });

  function updateTimerDisplay() {
    const m = Math.floor(timerLeft / 60).toString().padStart(2,'0');
    const s = (timerLeft % 60).toString().padStart(2,'0');
    document.getElementById('timerDisplay').textContent = `${m}:${s}`;
  }

  function stopAllSounds() {
    document.querySelectorAll('.sound-card').forEach(card => {
      const name = card.dataset.sound;
      if (activeSounds[name]) stopSound(name, card);
    });
  }

  // Stop sounds when leaving screen
  window.addEventListener('screenChanged', e => {
    if (e.detail !== 'sounds') {
      clearInterval(timerInterval);
    }
  });
})();
