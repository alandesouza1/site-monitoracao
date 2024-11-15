const pages = [
  {
    title: "Grupo 1",
    iframes: [
      'https://example.com/1',
      'https://example.com/2',
      'https://example.com/3',
      'https://example.com/4'
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

const dropdownFixed = document.querySelector('.dropdown-fixed');
const dropdownDynamic = document.querySelector('.dropdown-dynamic');
const toggleTimerButton = document.getElementById('toggleTimer');
const pagination = document.getElementById('pagination');
let timer = null;
let timerInterval = 5000; // Intervalo padrão de 5 segundos
let currentPage = 0;
let isPaused = false;

// Adicionar evento global para pausar o temporizador ao clicar em qualquer lugar
document.addEventListener('click', (event) => {
  const clickedElement = event.target;
  // Evita pausar o temporizador ao clicar em botões específicos
  if (clickedElement.id !== 'toggleTimer' && clickedElement.id !== 'adjustTimer') {
    pauseTimer();
    showNotification("Temporizador pausado devido à interação.");
  }
});

// Carregar links fixos e dinâmicos na lista suspensa
function loadDropdown() {
  // Adicionar links fixos
  fixedLinks.forEach(link => {
    const anchor = document.createElement('a');
    anchor.textContent = link.name;
    anchor.href = link.url;
    anchor.target = '_blank';
    dropdownFixed.appendChild(anchor);
  });

  // Adicionar grupos dinâmicos
  pages.forEach((page, index) => {
    const anchor = document.createElement('a');
    anchor.textContent = page.title;
    anchor.href = '#';
    anchor.addEventListener('click', () => {
      currentPage = index;
      loadPage(index);
    });
    dropdownDynamic.appendChild(anchor);
  });
}

// Abrir lista suspensa ao passar o mouse
document.querySelector('.dropdown').addEventListener('mouseenter', () => {
  document.getElementById('dropdownContent').style.display = 'grid';
});

document.querySelector('.dropdown').addEventListener('mouseleave', () => {
  document.getElementById('dropdownContent').style.display = 'none';
});

// Carregar iframes da página
function loadPage(pageIndex) {
  const iframeContainer = document.getElementById('iframeContainer');
  iframeContainer.innerHTML = '';
  document.getElementById('groupTitle').textContent = pages[pageIndex].title;

  const links = pages[pageIndex].iframes;

  // Se o grupo tiver apenas um link, expande o iframe
  if (links.length === 1) {
    iframeContainer.innerHTML = `<iframe src="${links[0]}" style="width: 100%; height: 90vh; border: none;"></iframe>`;
    return;
  }

  // Renderizar múltiplos iframes
  links.forEach(url => {
    const iframeWrapper = document.createElement('div');
    iframeWrapper.className = 'iframe-wrapper';

    const iframe = document.createElement('iframe');
    iframe.src = url;

    // Botão "Abrir em Nova Aba"
    const openNewTabButton = document.createElement('button');
    openNewTabButton.className = 'open-new-tab';
    openNewTabButton.textContent = 'Abrir em Nova Aba';
    openNewTabButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita pausar o temporizador ao clicar no botão
      window.open(url, '_blank');
    });

    iframeWrapper.appendChild(iframe);
    iframeWrapper.appendChild(openNewTabButton);
    iframeContainer.appendChild(iframeWrapper);
  });

  updatePagination();
}

// Atualizar paginação
function updatePagination() {
  pagination.innerHTML = '';
  pages.forEach((_, index) => {
    const button = document.createElement('button');
    button.textContent = index + 1;
    button.disabled = index === currentPage;
    button.addEventListener('click', () => {
      currentPage = index;
      loadPage(index);
    });
    pagination.appendChild(button);
  });
}

// Temporizador
function pauseTimer() {
  if (timer) {
    clearInterval(timer); // Interrompe o temporizador ativo
    timer = null;
    isPaused = true;
    toggleTimerButton.textContent = "Retornar"; // Atualiza o botão para "Retornar"
    showNotification("Temporizador pausado.");
  }
}

function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      currentPage = (currentPage + 1) % pages.length;
      loadPage(currentPage);
    }, timerInterval);
    isPaused = false;
    toggleTimerButton.textContent = "Pausar"; // Atualiza o botão para "Pausar"
    showNotification("Temporizador iniciado.");
  }
}

// Alternar entre pausar e retomar o temporizador
toggleTimerButton.addEventListener('click', () => {
  if (isPaused) {
    startTimer();
  } else {
    pauseTimer();
  }
});

// Ajustar o tempo do temporizador
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

// Mostrar notificação
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 2000);
}

// Alternar tema claro/escuro
document.getElementById('toggleTheme').addEventListener('click', () => {
  const root = document.documentElement;
  const currentBackground = root.style.getPropertyValue('--background-color') || '#000';
  if (currentBackground === '#000') {
    root.style.setProperty('--background-color', '#fff');
    root.style.setProperty('--text-color', '#000');
  } else {
    root.style.setProperty('--background-color', '#000');
    root.style.setProperty('--text-color', '#fff');
  }
});

// Inicializar a página
loadDropdown();
loadPage(currentPage);
startTimer();