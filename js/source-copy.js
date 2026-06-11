function applySourceBasedCopy() {
  const heroBadge = document.querySelector('.hero-badge span');
  if (heroBadge) heroBadge.textContent = 'Zevenaar - intelligent plaatwerk';

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) heroTitle.innerHTML = 'Voor intelligent<br>plaatwerk.';

  const heroSub = document.querySelector('.hero-sub');
  if (heroSub) {
    heroSub.textContent = 'Audacious Sheet Metal ontwikkelt en vervaardigt plaatwerkproducten uit roestvaststaal, aluminium en staal. Van enkelstuks tot meerstuks, van rechttoe rechtaan tot gecompliceerd lasersnij-, kant- en laswerk, constructiewerk en complete assemblage.';
  }

  const introTitle = document.querySelector('.intro-title');
  if (introTitle) introTitle.innerHTML = 'Slim werken.<br>Sneller en beter produceren.';

  const introBody = document.querySelector('.intro-body');
  if (introBody) {
    introBody.textContent = 'De kracht van Audacious zit in de organisatie: goed voorbereiden, doelmatig calculeren en elke schakel in de keten optimaliseren. Niet geleefd worden, maar anticiperen. Zo houden we grip op kwaliteit, kosten en levertijd.';
  }

  const proofUpdates = [
    ['Ketenregisseur voor OEM', 'Audacious neemt desgewenst de hele productieketen voor zijn rekening: van productie tot assemblage, montage en afstemming met vaste specialistische partners.'],
    ['Enkelstuks en kleine series', 'Omdat we veel enkelstuks en kleine series maken, sturen we scherp op korte steltijden, slimme planning en foutloze productie.'],
    ['RVS, aluminium en staal', 'Van lasergesneden monodelen tot samengestelde precisieproducten, behuizingen, plaatwerkframes, machineframes en modules.'],
    ['ERP-gestuurde productie', 'Van offerte tot voorraadbeheer, productie, levering en facturering: de voortgang is per order te volgen en bij te sturen.']
  ];

  document.querySelectorAll('.proof-item').forEach((item, index) => {
    const update = proofUpdates[index];
    if (!update) return;
    const title = item.querySelector('.proof-title');
    const body = item.querySelector('.proof-body');
    if (title) title.textContent = update[0];
    if (body) body.textContent = update[1];
  });

  const heroProofTitle = document.querySelector('.hero-proof strong');
  const heroProofText = document.querySelector('.hero-proof span');
  const heroProofLabel = document.querySelector('.hero-proof-stars');
  if (heroProofLabel) heroProofLabel.textContent = 'SCM';
  if (heroProofTitle) heroProofTitle.textContent = 'Van jobber naar ketenregisseur';
  if (heroProofText) heroProofText.textContent = 'Plaatwerk, constructiewerk, assemblage en vaste partners in een keten';
}

window.addEventListener('DOMContentLoaded', applySourceBasedCopy);
window.addEventListener('load', applySourceBasedCopy);
applySourceBasedCopy();
