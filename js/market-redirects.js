(function () {
  const redirects = {
    '#halfgeleiderindustrie': '../pages/halfgeleiderindustrie.html',
    '#medische-industrie': '../pages/medische-industrie.html',
    '#voedingsmiddelenindustrie': '../pages/voedingsmiddelenindustrie.html',
    '#drank-zuivel': '../pages/drank-zuivelindustrie.html',
    '#verpakkingsindustrie': '../pages/verpakkingsindustrie.html',
    '#bouw-meubel': '../pages/bouw-meubelindustrie.html'
  };

  function redirectMarketHash() {
    const target = redirects[window.location.hash];
    if (!target) return;
    window.location.replace(target);
  }

  function makeMarketRowsClickable() {
    document.querySelectorAll('.technical-list article').forEach((row) => {
      const link = row.querySelector('a[href]');
      if (!link) return;
      row.classList.add('market-clickable-card');
      row.setAttribute('tabindex', '0');
      row.setAttribute('role', 'link');
      row.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        window.location.href = link.href;
      });
      row.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        window.location.href = link.href;
      });
    });
  }

  redirectMarketHash();
  window.addEventListener('hashchange', redirectMarketHash);
  window.addEventListener('DOMContentLoaded', makeMarketRowsClickable);
}());