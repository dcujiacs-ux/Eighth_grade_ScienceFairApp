// ═══════════════════════════════════════════════
//  MINDORA — mood.js
// ═══════════════════════════════════════════════

(function() {
  let selectedMood = null;
  let selectedEmoji = null;
  let intensity = 3;

  /* ── Mood grid ─────────────────────────────── */
  document.querySelectorAll('.mood-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.mood-item').forEach(m => m.classList.remove('selected'));
      item.classList.add('selected');
      selectedMood  = item.dataset.mood;
      selectedEmoji = item.dataset.emoji;
      document.getElementById('saveMoodBtn').disabled = false;
    });
  });

  /* ── Intensity bar ─────────────────────────── */
  const segs = document.querySelectorAll('.int-seg');
  segs.forEach(seg => {
    seg.addEventListener('click', () => {
      intensity = parseInt(seg.dataset.val);
      segs.forEach((s, i) => s.classList.toggle('lit', i < intensity));
    });
  });

  /* ── Save mood ─────────────────────────────── */
  document.getElementById('saveMoodBtn').addEventListener('click', () => {
    if (!selectedMood) return;
    const note = document.getElementById('moodNote').value.trim();
    const entry = {
      id: Date.now(),
      mood: selectedMood,
      emoji: selectedEmoji,
      intensity,
      note,
      ts: Date.now()
    };
    Storage.saveMood(entry);
    renderHistory();
    showToast(`${selectedEmoji} Estado guardado`);

    // Reset
    document.querySelectorAll('.mood-item').forEach(m => m.classList.remove('selected'));
    document.getElementById('moodNote').value = '';
    document.getElementById('saveMoodBtn').disabled = true;
    segs.forEach((s, i) => s.classList.toggle('lit', i < 3));
    intensity = 3;
    selectedMood = null;
  });

  /* ── History ───────────────────────────────── */
  function renderHistory() {
    const moods = Storage.getMoods();
    const list  = document.getElementById('moodHistoryList');
    const hist  = document.getElementById('moodHistory');
    if (!moods.length) { hist.style.display = 'none'; return; }
    hist.style.display = '';
    list.innerHTML = moods.slice(0, 7).map(m => {
      const d = relativeDate(m.ts);
      const dots = Array.from({ length: 7 }, (_, i) =>
        `<div class="mhi-dot${i < m.intensity ? ' lit' : ''}"></div>`
      ).join('');
      return `
        <div class="mood-history-item">
          <div class="mhi-emoji">${m.emoji}</div>
          <div class="mhi-info">
            <div class="mhi-mood">${m.mood}</div>
            ${m.note ? `<div class="mhi-note">${escHtml(m.note)}</div>` : ''}
          </div>
          <div>
            <div class="mhi-intensity">${dots}</div>
            <div class="mhi-date">${d}</div>
          </div>
        </div>`;
    }).join('');
  }

  window.addEventListener('screenChanged', e => {
    if (e.detail === 'mood') renderHistory();
  });

  renderHistory();

  /* ── Helpers ───────────────────────────────── */
  function relativeDate(ts) {
    const diff = Date.now() - ts;
    if (diff < 3_600_000)  return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86_400_000) return `Hoy`;
    if (diff < 172_800_000) return `Ayer`;
    return new Date(ts).toLocaleDateString('es', { day: 'numeric', month: 'short' });
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();
