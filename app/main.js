const pages = [
  {
    title: "Grupo 1",
    iframes: [
      'https://example.com/1', 'https://example.com/2', 'https://example.com/3', 'https://example.com/4'
    ]
  },
  {
    title: "Grupo 2",
    iframes: ['https://example.com/5', 'https://example.com/6']
  }
];

const fixedLinks = [
  { name: "Google", url: "https://google.com" },
  { name: "YouTube", url: "https://youtube.com" },
  { name: "Facebook", url: "https://facebook.com" }
];

const dropdownContent = document.getElementById('dropdownContent');
const toggleTimerButton = document.getElementById('toggleTimer');
const pagination = document.getElementById('pagination');
let timer = null;
let timerInterval = 5000;
let currentPage = 0;
let isPaused = false;

// Carregar links fixos e dinâmicos na lista suspensa
fixedLinks.forEach(link => {
  const anchor = document.createElement('a');
  anchor.textContent = link.name;
  anchor.href = link.url;
  anchor.target = '_blank';
  dropdownContent.appendChild(anchor);
});

pages.forEach((page, index) => {
  const anchor = document.createElement('a');
  anchor.textContent = page.title;
  anchor.href = '#';
  anchor.addEventListener('click', () => {
    loadPage(index);
  });
  dropdownContent.appendChild(anchor);
});

// Função para carregar a página de iframes
function loadPage(pageIndex) {
  const iframeContainer = document.getElementById('iframeContainer');
  iframeContainer.innerHTML = '';
  document.getElementById('groupTitle').textContent = pages[pageIndex].title;

  const links = pages[pageIndex].iframes;
  if (links.length === 1) {
    iframeContainer.innerHTML = `<iframe src="${links[0]}" style="width: 100%; height: 90vh; border: none;"></iframe>`;
    return;
  }

  links.forEach(url => {
    const iframeWrapper = document.createElement('div');
    iframeWrapper.className = 'iframe-wrapper';

    const iframe = document.createElement('iframe');
    iframe.src = url;

    iframe.addEventListener('click', () => {
      pauseTimer();
      showNotification("Temporizador pausado devido à interação.");
    });

    iframeWrapper.appendChild(iframe);
    iframeContainer.appendChild(iframeWrapper);
  });

  updatePagination();
}

// Atualizar paginação
function updatePagination() {
  pagination.innerHTML = '';
  for (let i = 0; i < pages.length; i++) {
    const button = document.createElement('button');
    button.textContent = i + 1;
    button.disabled = i === currentPage;
    button.addEventListener('click', () => {
      currentPage = i;
      loadPage(i);
    });
    pagination.appendChild(button);
  }
}

// Pausar temporizador
function pauseTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    isPaused = true;
    toggleTimerButton.textContent = "Retornar";
    showNotification("Temporizador pausado.");
  }
}

// Iniciar temporizador
function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      currentPage = (currentPage + 1) % pages.length;
      loadPage(currentPage);
    }, timerInterval);
    isPaused = false;
    toggleTimerButton.textContent = "Pausar";
    showNotification("Temporizador retomado.");
  }
}

// Mostrar notificação
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 2000);
}

// Ajustar tempo
document.getElementById('adjustTimer').addEventListener('click', () => {
  const input = prompt("Digite o tempo em segundos:");
  if (input && input > 0) {
    timerInterval = input * 1000;
    if (!isPaused) {
      clearInterval(timer);
      startTimer();
    }
    showNotification(`Temporizador ajustado para ${input} segundos.`);
  }
});

// Alternar tema
document.getElementById('toggleTheme').addEventListener('click', () => {
  const root = document.documentElement;
  if (root.style.getPropertyValue('--background-color') ===
('#000') {
    root.style.setProperty('--background-color', '#fff');
    root.style.setProperty('--text-color', '#000');
  } else {
    root.style.setProperty('--background-color', '#000');
    root.style.setProperty('--text-color', '#fff');
  }
});

// Alternar entre pausar e retornar o temporizador
toggleTimerButton.addEventListener('click', () => {
  if (isPaused) {
    startTimer();
  } else {
    pauseTimer();
  }
});

// Inicializar página e temporizador
loadPage(currentPage);
startTimer();