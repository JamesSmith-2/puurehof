'use strict';

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
if (menuButton && navigation) {
  const dropdowns = [...navigation.querySelectorAll('.nav-dropdown')];
  const closeDropdowns = () => dropdowns.forEach((item) => (item.open = false));
  dropdowns.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        dropdowns.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target)) closeDropdowns();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const openDropdown = dropdowns.find((item) => item.open);
      if (openDropdown) {
        closeDropdowns();
        openDropdown.querySelector('summary').focus();
      } else if (menuButton.getAttribute('aria-expanded') === 'true') {
        menuButton.setAttribute('aria-expanded', 'false');
        navigation.classList.remove('is-open');
        menuButton.focus();
      }
    }
  });
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    navigation.classList.toggle('is-open', !expanded);
    if (expanded) closeDropdowns();
  });
  navigation.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
      closeDropdowns();
    }),
  );
}
document
  .querySelector('.print-button')
  ?.addEventListener('click', () => window.print());

const search = document.querySelector('#site-search');
const results = document.querySelector('#search-results');
if (search && results && navigation) {
  const seen = new Set();
  const entries = [...navigation.querySelectorAll('a')].filter((link) => {
    if (link.hash || seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    results.replaceChildren();
    results.hidden = !query;
    if (!query) return;
    const matches = entries.filter((link) =>
      `${link.textContent} ${link.pathname}`.toLowerCase().includes(query),
    );
    matches.forEach((link) => {
      const result = link.cloneNode(true);
      result.removeAttribute('aria-current');
      results.append(result);
    });
    if (!matches.length) results.textContent = 'No matches yet. Try tomatoes, basil, garden, or butter.';
  });
  search.addEventListener('focus', () => { results.hidden = !search.value.trim(); });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-search')) results.hidden = true;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !results.hidden) {
      results.hidden = true;
      search.focus();
    }
  });
}
