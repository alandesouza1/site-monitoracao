let timer = null;
let timerInterval = 5000; // Intervalo padrão de 5 segundos
let currentPage = 0;
let isPaused = false;

const pages = [
  {
    title: "Grupo 1",
    iframes: [
      "https://example.com/1",
      "https://example.com/2",
      "https://example.com/3",
      "https://example.com/4",
    ],
  },
  {
    title: "Grupo 2",
    iframes: [
      "https://example.com/5",
      "https://example.com/6",
      "https://example.com/7",
      "https://example.com/8",
    ],
  },
];

function loadPage(pageIndex) {
  const iframeContainer = document.getElementById("iframeContainer");
  iframeContainer.innerHTML = "";
  document.getElementById("groupTitle").textContent = pages[pageIndex].title;

  pages[pageIndex].iframes.forEach((url) => {
    const iframeWrapper = document.createElement("div");
    iframeWrapper.className = "iframe-wrapper";

    const iframe = document.createElement("iframe");
    iframe.src = url;

    iframe.addEventListener("click", (e) => {
      e.stopPropagation();
      pauseTimer();
      showNotification("Temporizador pausado ao clicar no iframe.");
    });

    const openNewTabButton = document.createElement("button");
    openNewTabButton.className = "open-new-tab";
    openNewTabButton.textContent = "Abrir em Nova Aba";
    openNewTabButton.addEventListener("click", (e) => {
      e.stopPropagation();
      window.open(url, "_blank");
    });

    iframeWrapper.appendChild(iframe);
    iframeWrapper.appendChild(openNewTabButton);
    iframeContainer.appendChild(iframeWrapper);
  });
}

function updatePagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  pages.forEach((_, index) => {
    const button = document.createElement("button");
    button.textContent = index + 1;

    if (index === currentPage) {
      button.disabled = true;
      button.classList.add("current-page");
    }

    button.addEventListener("click", () => {
      currentPage = index;
      loadPage(index);
      updatePagination();
    });

    pagination.appendChild(button);
  });
}

function pauseTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    isPaused = true;
    document.getElementById("toggleTimer").textContent = "Retornar";
    showNotification("Temporizador pausado.");
  }
}

function startTimer() {
  if (!timer) {
    timer = setInterval(() => {
      currentPage = (currentPage + 1) % pages.length;
      loadPage(currentPage);
      updatePagination();
    }, timerInterval);
    isPaused = false;
    document.getElementById("toggleTimer").textContent = "Pausar";
    showNotification("Temporizador retomado.");
  }
}

function setIframeZoom(zoomLevel) {
  const iframes = document.querySelectorAll(".iframe-wrapper iframe");
  iframes.forEach((iframe) => {
    iframe.style.transform = `scale(${zoomLevel})`;
    iframe.style.transformOrigin = "top left";
  });
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.opacity = 1;
  setTimeout(() => {
    notification.style.opacity = 0;
  }, 2000);
}

document.getElementById("toggleTimer").addEventListener("click", () => {
  if (isPaused) {
    startTimer();
  } else {
    pauseTimer();
  }
});

document.getElementById("adjustTimer").addEventListener("click", () => {
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

document.getElementById("zoomIn").addEventListener("click", () => {
  setIframeZoom(0.75);
});

document.getElementById("zoomOut").addEventListener("click", () => {
  setIframeZoom(0.5);
});

document.getElementById("prev").addEventListener("click", () => {
  currentPage = (currentPage - 1 + pages.length) % pages.length;
  loadPage(currentPage);
  updatePagination();
});

document.getElementById("next").addEventListener("click", () => {
  currentPage = (currentPage + 1) % pages.length;
  loadPage(currentPage);
  updatePagination();
});

// Inicializar a página
loadPage(currentPage);
updatePagination();
startTimer();