(function () {
  function setText(selector, value, root = document) {
    const element = root.querySelector(selector);
    if (element && value) element.textContent = value;
  }

  function setHtml(selector, value, root = document) {
    const element = root.querySelector(selector);
    if (!element || !value) return;
    element.innerHTML = String(value).split('\n').map((line) => line.trim()).filter(Boolean).join('<br>');
  }

  function setHref(selector, value, root = document) {
    const element = root.querySelector(selector);
    if (element && value) element.setAttribute('href', value);
  }

  function applyAudaciousCopy() {
    if (!document.querySelector('.hero')) return;

    setText('.hero-badge span', 'Zevenaar - plaatbewerking');
    setHtml('.hero-title', 'Plaatbewerking met lef.\nHoogwaardig plaatwerk in kleine series.');
    setText('.hero-sub', 'Audacious Sheet Metal International B.V. ontwikkelt en produceert plaatwerkoplossingen in staal, roestvaststaal en aluminium. Wij leveren mono-delen, samengestelde plaatwerkconstructies en complete assemblages met aandacht voor precisie, afwerking en korte levertijden.');
    setText('.hero-actions .btn-primary', 'Offerte aanvragen');
    setHref('.hero-actions .btn-primary', '../html/contact.html');
    setText('.hero-actions .btn-outline', 'Bekijk werkzaamheden');
    setHref('.hero-actions .btn-outline', '../html/werkzaamheden.html');

    setHtml('.intro-title', 'CAD/CAM, CNC-machinepark\nen vakmensen.');
    setText('.intro-body', 'In een CAD/CAM-omgeving, met CNC-machines en een productie-besturingssysteem, maken wij wat de klant voor ogen heeft. De nadruk ligt op vakmanschap, flexibiliteit en korte doorlooptijden.');
    setHref('.intro-left .btn', '../html/over-ons.html');

    const proof = [
      ['Enkelstuks en kleine series', 'Audacious produceert veel enkelstuks en kleine series. Daarom zijn voorbereiding, korte steltijden en foutloze productie belangrijk.'],
      ['Staal, RVS en aluminium', 'Wij verwerken plaatmaterialen tot mono-delen, behuizingen, frames, constructies en samengestelde producten.'],
      ['Re-engineering en montage', 'Re-engineering en mechanische montage worden in eigen beheer uitgevoerd wanneer dat bij de opdracht past.'],
      ['Oppervlaktebehandeling', 'Oppervlaktebehandelingen worden als ketenregisseur uitbesteed aan betrouwbare specialistische partners.']
    ];

    document.querySelectorAll('.proof-item').forEach((item, index) => {
      const row = proof[index];
      if (!row) return;
      setText('.proof-title', row[0], item);
      setText('.proof-body', row[1], item);
    });

    setText('.org-control-eyebrow', 'Productievoorbereiding');
    setHtml('.org-control-title', 'Snelle steltijden.\nFoutloze productie.');
    setText('.org-control-copy', 'Bij elk ontwerp kijkt Audacious kritisch naar maakbaarheid, plaatdikte, lasnaden, materiaalgebruik en productieroute. Computersimulatie helpt om minder prototypes te maken en fouten vooraf te beperken.');

    const roadmap = [
      ['Maakbaarheid beoordelen', 'Controle op plaatdikte, buigradius, lasnaden, materiaal en productieroute.'],
      ['CAD/CAM voorbereiden', '3D CAD, STEP-bestanden, nesting en NC-programmering voor laser en kantbank.'],
      ['Produceren', 'Lasersnijden, kanten, walsen, persen, lassen en afwerken volgens de gekozen route.'],
      ['Assembleren en leveren', 'Mechanische montage, afstemming met partners en levering van mono-deel tot samenstelling.']
    ];
    document.querySelectorAll('.org-roadmap-item').forEach((item, index) => {
      const row = roadmap[index];
      if (!row) return;
      setText('strong', row[0], item);
      setText('p', row[1], item);
    });

    setText('.materials-kicker', 'Materialen');
    setText('#materials-title', 'Breed spectrum aan plaatmaterialen.');
    const materialIntro = document.querySelector('.materials-intro p:not(.materials-kicker)');
    if (materialIntro) materialIntro.textContent = 'Audacious verwerkt onder meer staal, RVS, aluminium en non-ferro materialen. De materiaalkeuze hangt af van toepassing, afwerking, sterkte, corrosiebestendigheid en maakbaarheid.';

    const materialCards = [
      ['Staal', 'Blanke staalplaat, elektrolytisch verzinkt, gebeitst S235JR, S355JR en slijtvaste staalsoorten zoals C45 en 42MnV7.'],
      ['RVS', 'RVS 304, RVS 316L, chroomstaal RVS 430 en RVS 321 / 310 / 316T in verschillende afwerkingen.'],
      ['Aluminium', 'Aluminium zoals AlMg3, AlMg1, geanodiseerd aluminium en 51ST.'],
      ['Messing', 'Messing CuZn36 F37 en andere materialen op aanvraag.'],
      ['Behuizingen en frames', 'Plaatwerkconstructies, omkastingen, frames en technische samenstellingen.'],
      ['Assemblages', 'Samenstellingen waarin plaatwerk, laswerk, afwerking en montage samenkomen.']
    ];
    document.querySelectorAll('.material-card').forEach((card, index) => {
      const row = materialCards[index];
      if (!row) return;
      setText('h3', row[0], card);
      setText('p', row[1], card);
    });

    setText('.markets-kicker', 'Markten en diensten');
    setHtml('#markets-title', 'Plaatwerk voor technische\ntoepassingen.');
    const marketsNote = document.querySelector('.markets-note');
    if (marketsNote) marketsNote.textContent = 'Audacious levert aan onder meer apparatenbouw, elektronica, voedingsmiddelenindustrie, medische industrie, halfgeleiderindustrie, algemene machinebouw en optische industrie.';

    setText('.products-kicker', 'Projecten');
    setHtml('#products-title', 'Voorbeelden van\nplaatwerkprojecten.');
    const productHead = document.querySelector('.products-stage-head p:not(.products-kicker)');
    if (productHead) productHead.textContent = 'Geen standaardcatalogus, maar voorbeelden van werk: food-frame, RVS 316L behuizingen, röntgenarm, verpakkingsmachineframes, schuifdeuren en transportwagen.';

    const projectCards = [
      ['Frame voor de food-industrie', 'Frameconstructie voor toepassing in de voedingsmiddelenindustrie.'],
      ['Plaatwerk behuizingen', 'Plaatwerk behuizingen uit RVS 316L.'],
      ['Project röntgenarm', 'Complete röntgenarm met technische plaatwerkcomponenten.'],
      ['Frames voor verpakkingsmachines', 'Precisieframes uit RVS 316L, gelast en afgewerkt.'],
      ['Schuifdeuren / cold corridor', 'Schuifdeuren voor luchtdichte cold corridors in serverruimtes.']
    ];
    document.querySelectorAll('.product-tile').forEach((tile, index) => {
      const row = projectCards[index];
      if (!row) return;
      setText('h3', row[0], tile);
      setText('p', row[1], tile);
    });

    setText('#contact-title', 'Neem contact op met Audacious.');
    setText('.contact-copy', 'Wilt u meer informatie over onze producten, werkwijze of een offerte aanvragen? Stuur een tekening, STEP-bestand of omschrijving mee, zodat wij gericht kunnen beoordelen.');
    setText('.contact-info-item:nth-child(2) strong', 'Mega 16, 6902 KL Zevenaar');

    setText('.footer-brand p', 'Audacious Sheet Metal International B.V. ontwikkelt en produceert plaatwerkoplossingen in enkelstuks en kleine series.');
    const footerNav = document.querySelector('.footer-col:nth-child(2)');
    if (footerNav) footerNav.innerHTML = '<h3>Navigatie</h3><a href="../html/productievoorbereiding.html">Productievoorbereiding</a><a href="../html/werkzaamheden.html">Werkzaamheden</a><a href="../html/projecten.html">Projecten</a><a href="../html/nieuws.html">Nieuws</a>';
    setText('.footer-col:nth-child(4) span', 'Mega 16, 6902 KL Zevenaar');
    setText('.footer-bottom span:first-child', '© 2026 Audacious Sheet Metal International B.V.');
    setText('.footer-bottom span:last-child', 'Plaatbewerking · CAD/CAM · CNC-machinepark · assemblage');
  }

  window.addEventListener('DOMContentLoaded', () => {
    applyAudaciousCopy();
    window.setTimeout(applyAudaciousCopy, 250);
    window.setTimeout(applyAudaciousCopy, 750);
  });

  window.addEventListener('load', () => {
    applyAudaciousCopy();
    window.setTimeout(applyAudaciousCopy, 500);
    window.setTimeout(applyAudaciousCopy, 1200);
  });
}());