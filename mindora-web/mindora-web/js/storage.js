// ═══════════════════════════════════════════════
//  MINDORA — storage.js
//  Helpers de localStorage
// ═══════════════════════════════════════════════

const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem('mindora_' + key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('mindora_' + key, JSON.stringify(value)); }
    catch (e) { console.warn('Storage write failed:', e); }
  },

  // Moods
  getMoods()        { return this.get('moods', []); },
  saveMood(entry)   { const m = this.getMoods(); m.unshift(entry); this.set('moods', m.slice(0, 100)); },
  getLatestMood()   { return this.getMoods()[0] || null; },

  // Journal
  getJournals()     { return this.get('journals', []); },
  saveJournal(e)    { const j = this.getJournals(); j.unshift(e); this.set('journals', j); },
  deleteJournal(id) { this.set('journals', this.getJournals().filter(j => j.id !== id)); },

  // Quotes favorites
  getFavQuotes()    { return this.get('fav_quotes', []); },
  saveFavQuote(q)   { const fq = this.getFavQuotes(); if (!fq.find(x => x.text === q.text)) { fq.unshift(q); this.set('fav_quotes', fq); } },
};
