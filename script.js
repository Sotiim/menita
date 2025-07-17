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

function createThoughtElement(thought) {
  const container = document.createElement('div');
  container.className = 'thought';

  const dateElem = document.createElement('div');
  dateElem.className = 'thought-date';
  dateElem.textContent = formatDate(thought.date);
  container.appendChild(dateElem);

  const textElem = document.createElement('div');
  textElem.className = 'thought-text';
  textElem.textContent = thought.text;
  container.appendChild(textElem);

  // Alternar mostrar/ocultar texto al hacer clic
  container.addEventListener('click', () => {
    textElem.style.display = textElem.style.display === 'block' ? 'none' : 'block';
  });

  return container;
}

function createPlaylistItem(song) {
  const li = document.createElement('li');
  li.className = 'playlist-item';

  const a = document.createElement('a');
  a.href = song.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.className = 'playlist-link';
  a.textContent = `${song.title} — ${song.artist}`;

  li.appendChild(a);
  return li;
}

async function init() {
  const thoughts = await loadJSON('data/thoughts.json');
  const playlist = await loadJSON('data/playlist.json');

  // Mostrar pensamientos ordenados por fecha
  thoughts.sort((a, b) => new Date(a.date) - new Date(b.date));
  const thoughtsContainer = document.getElementById('thoughts-container');
  thoughts.forEach(thought => {
    thoughtsContainer.appendChild(createThoughtElement(thought));
  });

  // Mostrar playlist
  const playlistContainer = document.getElementById('playlist-container');
  playlist.forEach(song => {
    playlistContainer.appendChild(createPlaylistItem(song));
  });
}

init();
