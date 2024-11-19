let timer = null;
let timerInterval = 5000; // Intervalo padrão de 5 segundos
let isPaused = false;

// Função para carregar iframes
function loadPage(pageIndex) {
  const iframeContainer = document.getElementById('iframeContainer');
  iframeContainer.innerHTML = '';

  const links = [
    'https://example.com/1',
    'https://example.com/2',
    'https://example.com/3'
  ];

  links.forEach(url => {
    const iframeWrapper = document.createElement('div');
    iframeWrapper.className = 'iframe-wrapper';

    const iframe = document.createElement('iframe');
    iframe.src = url;

    iframe.addEventListener('click', (e) => {
      e.stopPropagation();
      pauseTimer();
      showNotification("Temporizador pausado ao clicar no iframe.");
    });

    iframeWrapper.appendChild(iframe);
    iframeContainer.appendChild(iframeWrapper);
  });
}

// Pausar o temporizador
function pauseTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    isPaused = true;
    showNotification("Temporizador pausado.");
  }
}

// Ajustar zoom dos iframes
function setIframeZoom(zoomLevel) {
  const iframes = document.querySelectorAll('.iframe-wrapper iframe');
  iframes.forEach(iframe => {
    iframe.style.transform = `scale(${zoomLevel})`;
    iframe.style.transformOrigin = 'top left';
  });
}

// Configuração dos botões
document.getElementById('toggleTimer').addEventListener('click', () => {
  if (isPaused) {
    timer = setInterval(() => console.log("Temporizador ativo"), timerInterval);
    isPaused = false;
    showNotification("Temporizador retomado.");
  } else {
    pauseTimer();
  }
});

document.getElementById('zoomIn').addEventListener('click', () => {
  setIframeZoom(0.75); // Aumentar para 75%
});

document.getElementById('zoomOut').addEventListener('click', () => {
  setIframeZoom(0.5); // Reduzir para 50%
});

// Mostrar notificações
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.opacity = 1;
  setTimeout(() => notification.style.opacity = 0, 2000);
}

// Inicializar página
loadPage(0);