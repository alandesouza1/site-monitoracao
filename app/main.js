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

// Carregar os links fixos na lista suspensa
fixedLinks.forEach(link => {
  const anchor = document.createElement('a');
  anchor.textContent = link.name;
  anchor.href = link.url;
  anchor.target = '_blank';
  dropdownContent.appendChild(anchor);
});

// Carregar os grupos de iframes na lista suspensa
pages.forEach((page, index) => {
  const anchor = document.createElement('a');
  anchor.textContent = page.title;
  anchor.href = '#';
  anchor.addEventListener('click', () => {
    loadPage(index);
  });
  dropdownContent.appendChild(anchor);
});

// Função para carregar os iframes
function loadPage(pageIndex) {
  const iframeContainer = document.getElementById('iframeContainer');
  iframeContainer.innerHTML = '';
  document.getElementById('groupTitle').textContent = pages[pageIndex].title;

  const links = pages[pageIndex].iframes;
  if (links.length === 1) {
    const iframe = document.createElement('iframe');
    iframe.src = links[0];
    iframe.style.width = '100%';
    iframe.style.height = '90vh';
    iframeContainer.appendChild(iframe);
    return;
  }

  links.forEach(url => {
    const iframeWrapper = document.createElement('div');
    iframeWrapper.className = 'iframe-wrapper';

    const iframe = document.createElement('iframe');
    iframe.src = url;

    iframe.addEventListener('click', () => {
      clearInterval(timer);
      toggleTimerButton.textContent = 'Retornar';
      showNotification("Temporizador pausado devido à interação.");
    });

    iframeWrapper.appendChild(iframe);
    iframeContainer.appendChild(iframeWrapper);
  });
}

// Mostrar notificação
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 2000);
}

// Alternar tema
document.getElementById('toggleTheme').addEventListener('click', () => {
  const root = document.documentElement;
  if (root.style.getPropertyValue('--background-color') === '#000') {
    root.style.setProperty('--background-color', '#fff');
    root.style.setProperty('--text-color', '#000');
  } else {
    root.style.setProperty('--background-color', '#000');
    root.style.setProperty('--text-color', '#fff');
  }
});

// Controle de temporizador
let timer = null;
let timerInterval = 5000;

document.getElementById('toggleTimer').addEventListener('click', () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
    document.getElementById('toggleTimer').textContent = 'Retornar';
    showNotification("Temporizador pausado.");
  } else {
    startTimer();
    document.getElementById('toggleTimer').textContent = 'Pausar';
    showNotification("Temporizador retomado.");
  }
});

document.getElementById('adjustTimer').addEventListener('click', () => {
  const input = prompt("Digite o tempo em segundos:");
  if (input && input > 0) {
    timerInterval = input * 1000;
    clearInterval(timer);
    startTimer();
    document.getElementById('toggleTimer').textContent = 'Pausar';
    showNotification(`Temporizador ajustado para ${input} segundos.`);
  }
});

function startTimer() {
  timer = setInterval(() => {
    const nextIndex = (currentPage + 1) % pages.length;
    loadPage(nextIndex);
  }, timerInterval);
}

// Inicializar a página com o primeiro grupo e iniciar o temporizador
let currentPage = 0;
loadPage(currentPage);
startTimer();