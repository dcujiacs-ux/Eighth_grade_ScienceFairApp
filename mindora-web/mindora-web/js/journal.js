// ═══════════════════════════════════════════════
//  MINDORA — journal.js
// ═══════════════════════════════════════════════

(function() {
  let selectedEmoji = '';
  let selectedMood  = '';
  let searchTimer   = null;

  const modal      = document.getElementById('journalModal');
  const searchEl   = document.getElementById('journalSearch');

  /* ── Open / close modal ────────────────────── */
  document.getElementById('openNewEntry').addEventListener('click', openModal);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function openModal() {
    selectedEmoji = ''; selectedMood = '';
    document.querySelectorAll('#journalModal .mood-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('journalTitle').value   = '';
    document.getElementById('journalContent').value = '';
    document.getElementById('journalTags').value    = '';
    modal.classList.remove('hidden');
  }
  function closeModal() { modal.classList.add('hidden'); }

  /* ── Mood selector inside modal ─────────────── */
  document.querySelectorAll('#journalModal .mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#journalModal .mood-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedEmoji = btn.dataset.emoji;
      selectedMood  = btn.dataset.mood;
    });
  });

  /* ── Save journal entry ─────────────────────── */
  document.getElementById('saveJournalBtn').addEventListener('click', () => {
    const title   = document.getElementById('journalTitle').value.trim();
    const content = document.getElementById('journalContent').value.trim();
    const tagsRaw = document.getElementById('journalTags').value.trim();
    if (!title) { showToast('📝 Escribe un título'); return; }

    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
    const entry = {
      id: Date.now(),
      title, content,
      mood: selectedMood,
      emoji: selectedEmoji,
      tags,
      ts: Date.now()
    };
    Storage.saveJournal(entry);
    closeModal();
    renderJournals();
    showToast('📓 Entrada guardada');
  });

  /* ── Search ──────────────────────────────────── */
  searchEl.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderJournals, 280);
  });

  /* ── Render list ─────────────────────────────── */
  function renderJournals() {
    const q       = searchEl.value.toLowerCase().trim();
    let journals  = Storage.getJournals();
    if (q) journals = journals.filter(j =>
      j.title.toLowerCase().includes(q) || j.content.toLowerCase().includes(q)
    );

    const list = document.getElementById('journalList');
    if (!journals.length) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-emoji">📓</div>
          <p>${q ? 'No se encontraron entradas' : 'Aún no tienes entradas'}</p>
          <p style="font-size:13px;margin-top:6px;color:var(--txt-soft)">
            ${q ? '' : 'Toca + Nueva entrada para empezar'}
          </p>
        </div>`;
      return;
    }

    list.innerHTML = journals.map(j => {
      const tags = j.tags.map((t, i) =>
        `<span class="tag ${i % 2 === 0 ? 'tag-lav' : 'tag-sage'}">${escHtml(t)}</span>`
      ).join('');
      return `
        <div class="journal-card" data-id="${j.id}">
          <div class="jc-header">
            <span class="jc-emoji">${j.emoji || '📓'}</span>
            <span class="jc-date">${relDate(j.ts)}</span>
          </div>
          <div class="jc-title">${escHtml(j.title)}</div>
          ${j.content ? `<div class="jc-preview">${escHtml(j.content.slice(0,120))}${j.content.length > 120 ? '...' : ''}</div>` : ''}
          ${tags ? `<div class="jc-tags">${tags}</div>` : ''}
          <div style="margin-top:10px;text-align:right">
            <button class="btn-ghost" style="font-size:12px;color:var(--txt-soft)" onclick="deleteJournal(${j.id})">🗑 Eliminar</button>
          </div>
        </div>`;
    }).join('');
  }

  window.deleteJournal = function(id) {
    if (confirm('¿Eliminar esta entrada?')) {
      Storage.deleteJournal(id);
      renderJournals();
    }
  };

  window.addEventListener('screenChanged', e => {
    if (e.detail === 'journal') renderJournals();
  });

  renderJournals();

  /* ── Helpers ─────────────────────────────────── */
  function relDate(ts) {
    const diff = Date.now() - ts;
    if (diff < 3_600_000)   return `Hace ${Math.floor(diff / 60000)} min`;
    if (diff < 86_400_000)  return `Hoy · ${new Date(ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`;
    if (diff < 172_800_000) return `Ayer`;
    return new Date(ts).toLocaleDateString('es', { day: 'numeric', month: 'short' });
  }

  function escHtml(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();
