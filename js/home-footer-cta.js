function ensureHomeFooterCta(){
  const path=window.location.pathname.replace(/\/$/,'')||'/';
  if(!(path==='/'||path.endsWith('/html/index.html')||path.endsWith('/index.html')))return;
  const footer=document.querySelector('.site-footer,.simple-footer');
  if(!footer)return;
  if(!document.getElementById('home-footer-cta-style')){
    const style=document.createElement('style');
    style.id='home-footer-cta-style';
    style.textContent='.home-footer-cta{padding:5rem 0;background:#f8f6f2;border-top:1px solid rgba(17,17,15,.12)}.home-footer-cta .container{width:min(calc(100vw - clamp(2rem,5vw,6rem)),1480px);max-width:none;margin:0 auto}.home-footer-cta-card{display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:end;padding:3rem;background:#11110f;color:#fff;border:1px solid rgba(17,17,15,.16)}.home-footer-cta h2{margin:0;font-family:var(--font-display);font-size:clamp(2.4rem,5vw,5.8rem);line-height:.9;letter-spacing:-.08em;color:#fff}.home-footer-cta p{max-width:720px;margin:1rem 0 0;color:rgba(255,255,255,.72);line-height:1.7}.home-footer-cta a{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:0 1.35rem;border-radius:999px;background:#f58220;color:#11110f;font-weight:850;text-decoration:none}@media(max-width:900px){.home-footer-cta-card{grid-template-columns:1fr;padding:1.5rem}}';
    document.head.appendChild(style);
  }
  let cta=document.getElementById('home-footer-cta');
  if(!cta){
    cta=document.createElement('section');
    cta.id='home-footer-cta';
    cta.className='home-footer-cta';
    cta.innerHTML='<div class="container"><div class="home-footer-cta-card"><div><h2>Een vergelijkbaar project bespreken?</h2><p>Stuur uw tekening, bestand of omschrijving mee. Audacious kijkt mee naar materiaalkeuze, maakbaarheid, bewerkingen en de beste productieroute.</p></div><a href="/contact#offerte-aanvragen">Aanvraag starten</a></div></div>';
  }
  if(cta.nextElementSibling!==footer)footer.parentNode.insertBefore(cta,footer);
}
window.addEventListener('DOMContentLoaded',()=>{ensureHomeFooterCta();setTimeout(ensureHomeFooterCta,500);setTimeout(ensureHomeFooterCta,1500);setTimeout(ensureHomeFooterCta,3000)});
window.addEventListener('load',()=>{ensureHomeFooterCta();setTimeout(ensureHomeFooterCta,1000);setTimeout(ensureHomeFooterCta,2500)});