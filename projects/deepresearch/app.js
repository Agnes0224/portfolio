'use strict';
(() => {
  const header = document.querySelector('.site-header');
  const links = [...document.querySelectorAll('header nav a')];
  const sections = links.map(link => document.querySelector(link.hash));
  const updateHeader = () => {
    document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
  };
  const updateNavigation = () => {
    const threshold = header.getBoundingClientRect().height + 45;
    const atBottom = scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
    const active = atBottom ? sections.at(-1) : [...sections].reverse().find(section => section.getBoundingClientRect().top < threshold) || sections[0];
    for (const link of links) {
      if (link.hash === `#${active.id}`) {
        if (!link.hasAttribute('aria-current')) {
          link.setAttribute('aria-current', 'location');
          const bounds = link.getBoundingClientRect();
          const frame = link.parentElement.getBoundingClientRect();
          if (bounds.left < frame.left || bounds.right > frame.right) {
            link.parentElement.scrollLeft += bounds.left - frame.left - 10;
          }
        }
      } else link.removeAttribute('aria-current');
    }
  };
  let queued = false;
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { updateNavigation(); queued = false; });
  }, { passive: true });
  addEventListener('resize', () => { updateHeader(); updateNavigation(); });
  if ('ResizeObserver' in window) new ResizeObserver(updateHeader).observe(header);
  updateHeader();
  updateNavigation();

  const gallery = document.querySelector('.workspace-capture');
  const choices = [...gallery.querySelectorAll('.workspace-choice')];
  const panels = choices.map(choice => document.getElementById(choice.getAttribute('aria-controls')));
  const chooseCapture = (index, focus = false) => {
    choices.forEach((choice, i) => {
      const selected = i === index;
      choice.setAttribute('aria-selected', String(selected));
      choice.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].tabIndex = 0;
    });
    const selected = choices[index], picture = panels[index].querySelector('img');
    const expand = gallery.querySelector('[data-expand]');
    expand.dataset.expand = `#${picture.id}`;
    expand.dataset.caption = selected.dataset.caption;
    gallery.querySelector('.capture-caption').textContent = selected.dataset.description;
    gallery.querySelector('.capture-count').textContent = `${String(index + 1).padStart(2, '0')} / 03`;
    if (focus) selected.focus();
  };
  gallery.classList.add('gallery-enhanced');
  gallery.querySelector('.workspace-choices').hidden = false;
  choices.forEach((choice, index) => {
    choice.addEventListener('click', () => chooseCapture(index));
    choice.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % choices.length;
      else if (event.key === 'ArrowLeft') next = (index + choices.length - 1) % choices.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = choices.length - 1;
      else return;
      event.preventDefault();
      chooseCapture(next, true);
    });
  });
  chooseCapture(0);

  const viewer = document.querySelector('#detail-viewer');
  const content = viewer.querySelector('.viewer-content');
  let trigger;
  document.querySelectorAll('[data-expand]').forEach(button => button.addEventListener('click', () => {
    const original = document.querySelector(button.dataset.expand);
    if (!original || typeof viewer.showModal !== 'function') return;
    trigger = button;
    const clone = original.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    content.replaceChildren(clone);
    viewer.querySelector('#viewer-title').textContent = button.dataset.caption;
    viewer.showModal();
    content.scrollTop = 0;
    document.body.classList.add('viewer-open');
    viewer.querySelector('.viewer-close').focus();
  }));
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    content.replaceChildren();
    trigger?.focus({ preventScroll: true });
  });
})();
