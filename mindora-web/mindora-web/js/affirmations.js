// ═══════════════════════════════════════════════
//  MINDORA — affirmations.js
// ═══════════════════════════════════════════════

(function() {
  let currentIdx = 0;
  let currentCat = 'all';
  let filtered   = [...AFFIRMATIONS];

  const bigEl  = document.getElementById('affirmationBig');
  const catEl  = document.getElementById('affirmationCat');
  const listEl = document.getElementById('affirmationList');

  function getFiltered() {
    return currentCat === 'all'
      ? AFFIRMATIONS
      : AFFIRMATIONS.filter(a => a.category === currentCat);
  }

  function render() {
    filtered = getFiltered();
    if (!filtered.length) return;
    currentIdx = Math.min(currentIdx, filtered.length - 1);
    const aff = filtered[currentIdx];

    bigEl.textContent = `"${aff.text}"`;
    catEl.textContent = aff.category;

    listEl.innerHTML = filtered.map((a, i) => `
      <div class="aff-item" style="cursor:pointer;${i === currentIdx ? 'background:var(--lav-lt);border-color:var(--lav-dp)' : ''}"
           onclick="selectAff(${i})">
        ${a.text}
      </div>
    `).join('');
  }

  window.selectAff = function(i) {
    currentIdx = i;
    render();
  };

  document.getElementById('nextAffirmation').addEventListener('click', () => {
    filtered = getFiltered();
    currentIdx = (currentIdx + 1) % filtered.length;
    render();
  });

  document.getElementById('prevAffirmation').addEventListener('click', () => {
    filtered = getFiltered();
    currentIdx = (currentIdx - 1 + filtered.length) % filtered.length;
    render();
  });

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      currentIdx = 0;
      render();
    });
  });

  window.addEventListener('screenChanged', e => {
    if (e.detail === 'affirmations') render();
  });

  render();
})();
