// Configuração dos grupos
const pages = [
  {
    title: "Grupo 1",
    iframes: ["https://example1.com", "https://example2.com", "https://example3.com"],
  },
  {
    title: "Grupo 2",
    iframes: ["https://example4.com", "https://example5.com"],
  },
  {
    title: "Grupo 3",
    iframes: ["https://example6.com", "https://example7.com", "https://example8.com"],
  },
];

let currentPage = 0;

// Seleção de elementos
const iframeContainer = document.getElementById("iframeContainer");
const groupTitle = document.getElementById("groupTitle");
const dropdownDynamic = document.querySelector(".dropdown-dynamic");
const notification = document.getElementById("notification");

// Função para carregar a página
function loadPage(pageIndex) {
  iframeContainer.innerHTML = "";
  groupTitle.textContent = pages[pageIndex].title;

  pages[pageIndex].iframes.forEach((url) => {
    const iframeWrapper = document.createElement("div");
    iframeWrapper.className = "iframe-wrapper";

    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.loading = "lazy"; // Lazy loading para melhor desempenho
    iframeWrapper.appendChild(iframe);

    iframeContainer.appendChild(iframeWrapper);
  });
}

// Navegação entre páginas
document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    loadPage(currentPage);
  } else {
    showNotification("Você já está no primeiro grupo.");
  }
  updateButtonState();
});

document.getElementById("next").addEventListener("click", () => {
  if (currentPage < pages.length - 1) {
    currentPage++;
    loadPage(currentPage);
  } else {
    showNotification("Você já está no último grupo.");
  }
  updateButtonState();
});

// Função para atualizar os botões de navegação
function updateButtonState() {
  document.getElementById("prev").disabled = currentPage === 0;
  document.getElementById("next").disabled = currentPage === pages.length - 1;
}

// Função para carregar o dropdown
function loadDropdown() {
  dropdownDynamic.innerHTML = ""; // Limpar conteúdo anterior

  pages.forEach((page, index) => {
    const link = document.createElement("a");
    link.textContent = page.title;
    link.href = "#";
    link.style.display = "block";

    // Adicionar evento de clique para navegar ao grupo correspondente
    link.addEventListener("click", () => {
      currentPage = index;
      loadPage(currentPage);
      updateButtonState();
    });

    dropdownDynamic.appendChild(link);
  });

  // Configurar layout do dropdown para 6 links por coluna
  dropdownDynamic.style.display = "grid";
  dropdownDynamic.style.gridTemplateColumns = `repeat(auto-fill, minmax(150px, 1fr))`;
  dropdownDynamic.style.maxHeight = "300px";
  dropdownDynamic.style.overflowY = "auto";
}

// Função de notificação
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Alternância de tema claro/escuro
document.getElementById("toggleTheme").addEventListener("click", () => {
  const root = document.documentElement;
  const currentBackground = getComputedStyle(root).getPropertyValue(
    "--background-color"
  );
  if (currentBackground.trim() === "#f0f0f0") {
    root.style.setProperty("--background-color", "#333");
    root.style.setProperty("--text-color", "#fff");
  } else {
    root.style.setProperty("--background-color", "#f0f0f0");
    root.style.setProperty("--text-color", "#333");
  }
});

// Navegação por teclas
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") updatePage("next");
  if (event.key === "ArrowLeft") updatePage("prev");
});

// Inicialização
loadDropdown();
loadPage(currentPage);
updateButtonState();