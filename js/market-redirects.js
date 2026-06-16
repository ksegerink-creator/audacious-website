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

  redirectMarketHash();
  window.addEventListener('hashchange', redirectMarketHash);
}());