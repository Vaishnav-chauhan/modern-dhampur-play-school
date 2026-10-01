// ---------- 1. Mobile hamburger menu ----------
const burger = document.getElementById('burger');
const links = document.getElementById('links');

function closeMenu() {
  links.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', function () {
  const isOpen = links.classList.toggle('open');
  burger.classList.toggle('open');
  if (isOpen) {
    burger.setAttribute('aria-expanded', 'true');
  } else {
    burger.setAttribute('aria-expanded', 'false');
  }
});

// Link click hone par menu band ho jaye
links.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', closeMenu);
});

// ---------- 2. Gentle scroll reveal ----------
const items = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // ek hi baar animate ho
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function (el) { observer.observe(el); });
} else {
  // Purane browser: seedha dikha do
  items.forEach(function (el) { el.classList.add('show'); });
}

// ---------- 3. Photo sliders (About + Gallery) ----------
// Photos na ho toh gradient + emoji placeholder dikhta hai
const EMOJIS = ['🖍️', '📖', '🎨', '🧸', '🎈', '🧩', '🎵', '⚽', '🌈', '✏️'];

function buildSlider(box, startDelay) {
  const folder = box.dataset.folder;
  const count = Number(box.dataset.count);
  const mode = box.dataset.mode;          // 'slide' = side mein, 'wipe' = pencil se
  const interval = Number(box.dataset.interval);

  const track = document.createElement('div');
  track.className = 'track';
  for (let i = 0; i < count; i++) {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.dataset.emoji = EMOJIS[i % EMOJIS.length];
    const img = document.createElement('img');
    img.src = folder + '/' + (i + 1) + '.jpeg';
    img.alt = 'Modern Dhampur Play School photo ' + (i + 1);
    img.loading = 'lazy';
    img.setAttribute('onerror', 'this.remove()');   // photo missing = placeholder
    slide.appendChild(img);
    track.appendChild(slide);
  }

  const glitter = document.createElement('div');
  glitter.className = 'glitter';
  const pencil = document.createElement('span');
  pencil.className = 'pencil';
  pencil.textContent = '✏️';
  box.append(track, glitter, pencil);

  const slides = track.children;
  let current = 0;

  if (mode === 'slide') {
    track.appendChild(slides[0].cloneNode(true)); // loop smooth rakhne ke liye
  } else {
    box.classList.add('wipe');
    slides[0].classList.add('on');
  }

  function playEffects() {
    [glitter, pencil].forEach(function (el) {
      el.classList.remove('go');
      void el.offsetWidth;                 // animation dobara start
      el.classList.add('go');
    });
  }

  function next() {
    playEffects();
    if (mode === 'slide') {
      current++;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      if (current === count) {
        setTimeout(function () {           // clone par pahunch ke chupke se start par
          track.style.transition = 'none';
          current = 0;
          track.style.transform = 'translateX(0)';
          void track.offsetWidth;
          track.style.transition = '';
        }, 950);
      }
    } else {
      const old = slides[current];
      current = (current + 1) % count;
      const incoming = slides[current];
      incoming.classList.add('in');
      setTimeout(function () {
        incoming.classList.remove('in');
        incoming.classList.add('on');
        old.classList.remove('on');
      }, 1000);
    }
  }

  setTimeout(function () { setInterval(next, interval); }, startDelay);
}

document.querySelectorAll('.slider').forEach(function (box, i) {
  buildSlider(box, i * 700);   // har box thoda alag time par badle
});
