async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    console.error(`No se pudo cargar ${path}`);
    return [];
  }
  return await response.json();
}

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('es-MX', options);
}


let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar(month, year, thoughts, playlist) {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Rellenar días vacíos al inicio
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendar.appendChild(emptyDay);
  }
  
  // Crear días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    const dateElement = document.createElement('div');
    dateElement.className = 'calendar-date';
    dateElement.textContent = day;
    dayElement.appendChild(dateElement);
    
    // Buscar pensamientos para este día
    const dailyThoughts = thoughts.filter(t => t.date.startsWith(dateStr));
    if (dailyThoughts.length > 0) {
      dayElement.classList.add('has-thought');
      
      const popup = document.createElement('div');
      popup.className = 'thought-popup';
      dailyThoughts.forEach(thought => {
        const thoughtElem = document.createElement('p');
        thoughtElem.textContent = thought.text;
        popup.appendChild(thoughtElem);
      });
      dayElement.appendChild(popup);
    }
    
    // Buscar canciones para este día
    const dailySongs = playlist.filter(s => s.date && s.date.startsWith(dateStr));
    dailySongs.forEach(song => {
      const songElem = document.createElement('div');
      songElem.className = 'playlist-event';
      songElem.textContent = `${song.artist} - ${song.title}`;
      songElem.title = `${song.artist} - ${song.title}`;
      dayElement.appendChild(songElem);
    });
    
    calendar.appendChild(dayElement);
  }
  
  // Actualizar título del mes
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                     "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
}

async function init() {
  const thoughts = await loadJSON('data/thoughts.json');
  const playlist = await loadJSON('data/playlist.json');
  
  // Configurar navegación de meses
  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear, thoughts, playlist);
  });
  
  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear, thoughts, playlist);
  });
  
  // Renderizar calendario inicial
  renderCalendar(currentMonth, currentYear, thoughts, playlist);
}

init();