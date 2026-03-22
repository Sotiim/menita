// script.js — Funciones compartidas del sitio de Menita

async function loadJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`No se pudo cargar ${path}`);
      return [];
    }
    return await response.json();
  } catch (e) {
    console.warn(`Error cargando ${path}:`, e);
    return [];
  }
}

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('es-MX', options);
}

// Generar partículas decorativas flotantes
function spawnParticles(containerId, symbols = ['🌸', '💕', '✨'], count = 12) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (8 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.fontSize = (0.7 + Math.random() * 0.7) + 'rem';
    container.appendChild(p);
  }
}

// Transición suave de página
function navigateTo(url) {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  setTimeout(() => { window.location.href = url; }, 300);
}

// Fade in al cargar
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});

// Calendario (para páginas que lo usen)
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar(month, year, thoughts = [], playlist = []) {
  const calendar = document.getElementById('calendar');
  if (!calendar) return;
  calendar.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Días vacíos al inicio
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-day empty';
    calendar.appendChild(empty);
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';

    const dateEl = document.createElement('div');
    dateEl.className = 'calendar-date';
    dateEl.textContent = day;
    dayEl.appendChild(dateEl);

    // Pensamientos del día
    const dailyThoughts = thoughts.filter(t => t.date && t.date.startsWith(dateStr));
    if (dailyThoughts.length > 0) {
      dayEl.classList.add('has-thought');

      // Tap/click para móvil
      dayEl.addEventListener('click', () => {
        dayEl.classList.toggle('active-popup');
      });

      const popup = document.createElement('div');
      popup.className = 'thought-popup';
      dailyThoughts.forEach(t => {
        const p = document.createElement('p');
        p.textContent = t.text;
        popup.appendChild(p);
      });
      dayEl.appendChild(popup);
    }

    // Canciones del día
    const dailySongs = playlist.filter(s => s.date && s.date.startsWith(dateStr));
    dailySongs.forEach(song => {
      const songEl = document.createElement('div');
      songEl.className = 'playlist-event';
      songEl.textContent = `${song.artist} - ${song.title}`;
      songEl.title = `${song.artist} - ${song.title}`;
      dayEl.appendChild(songEl);
    });

    calendar.appendChild(dayEl);
  }

  // Título del mes
  const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const titleEl = document.getElementById('current-month');
  if (titleEl) titleEl.textContent = `${monthNames[month]} ${year}`;
}

async function initCalendar() {
  const thoughts = await loadJSON('data/thoughts.json');
  const playlist = await loadJSON('data/playlist.json');

  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      renderCalendar(currentMonth, currentYear, thoughts, playlist);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      renderCalendar(currentMonth, currentYear, thoughts, playlist);
    });
  }

  renderCalendar(currentMonth, currentYear, thoughts, playlist);
}
