(() => {
  const cards = document.querySelectorAll('#collection .piece');
  const timers = new Map();
  let suppressClick = null;
  const hide = (card) => {
    clearTimeout(timers.get(card));
    timers.delete(card);
    card.classList.remove('is-info-visible');
    card.querySelector('.piece-info').setAttribute('aria-hidden', 'true');
    card.querySelector('a').removeAttribute('aria-describedby');
  };
  const schedule = (card) => {
    hide(card);
    timers.set(card, setTimeout(() => {
      card.classList.add('is-info-visible');
      const info = card.querySelector('.piece-info');
      info.setAttribute('aria-hidden', 'false');
      card.querySelector('a').setAttribute('aria-describedby', info.id);
      timers.delete(card);
    }, 1000));
  };
  cards.forEach((card) => {
    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch') schedule(card);
    });
    card.addEventListener('pointerleave', () => hide(card));
    card.addEventListener('focusin', () => schedule(card));
    card.addEventListener('focusout', () => hide(card));
    let touchStart;
    card.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch') return;
      touchStart = { x: event.clientX, y: event.clientY };
      suppressClick = null;
      schedule(card);
    });
    card.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'touch' || !touchStart) return;
      if (Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y) > 10) {
        hide(card);
        touchStart = null;
      }
    });
    card.addEventListener('pointerup', (event) => {
      if (event.pointerType !== 'touch') return;
      if (card.classList.contains('is-info-visible')) suppressClick = card;
      else hide(card);
      touchStart = null;
    });
    card.addEventListener('pointercancel', () => { hide(card); touchStart = null; });
    card.addEventListener('click', (event) => {
      if (suppressClick === card) {
        event.preventDefault();
        suppressClick = null;
      } else hide(card);
    });
  });
  document.querySelectorAll('#collection details').forEach((group) => {
    group.addEventListener('toggle', () => {
      if (!group.open) group.querySelectorAll('.piece').forEach(hide);
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') cards.forEach(hide);
  });
})();
