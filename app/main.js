document.addEventListener("DOMContentLoaded", function () {
  const dropdownContent = document.querySelector(".dropdown-content");
  const customLinksDropdown = document.getElementById("custom-links-dropdown");
  const addLinkBtn = document.getElementById("addLinkBtn");

  // Função para adicionar links personalizados ao dropdown de Links Aleatórios
  function addCustomLink(linkName, linkUrl) {
    const customLink = document.createElement("a");
    customLink.href = linkUrl;
    customLink.textContent = linkName;
    customLink.target = "_blank"; // Abre o link em nova aba

    customLinksDropdown.appendChild(customLink);
  }

  // Adicionando links provisórios para teste
  addCustomLink("OpenAI", "https://www.openai.com");
  addCustomLink("Google", "https://www.google.com");
  addCustomLink("Wikipedia", "https://www.wikipedia.org");

  // Evento para adicionar um link personalizado ao clicar no botão "Adicionar Link"
  addLinkBtn.addEventListener("click", function () {
    const linkName = prompt("Insira o nome do link:");
    const linkUrl = prompt("Insira a URL do link:");

    if (linkName && linkUrl) {
      addCustomLink(linkName, linkUrl);
      alert("Link adicionado com sucesso!");
    } else {
      alert("Por favor, insira um nome e uma URL válidos.");
    }
  });

  // Adiciona opções no dropdown para diferentes grupos de sites
  function addDropdownGroupOption(groupName) {
    const dropdownLink = document.createElement("a");
    dropdownLink.href = "#";
    dropdownLink.textContent = groupName;

    // Evento para carregar o conteúdo do grupo de sites ao clicar no link do dropdown
    dropdownLink.addEventListener("click", function (event) {
      event.preventDefault();
      const sitesArray = getSiteGroup(groupName); // Obtém o grupo de sites usando a função
      loadSitesFromArray(sitesArray);
      saveCurrentGroup(groupName); // Salva o grupo selecionado no LocalStorage
    });

    dropdownContent.appendChild(dropdownLink);
  }

  // Função para salvar o grupo atual no LocalStorage
  function saveCurrentGroup(groupName) {
    localStorage.setItem("currentGroup", groupName);
  }

  // Função para carregar o grupo salvo no LocalStorage
  function loadSavedGroup() {
    return localStorage.getItem("currentGroup");
  }

  // Adiciona grupos de sites ao dropdown
  addDropdownGroupOption("Grupo VIP");
  addDropdownGroupOption("Grupo 1");
  addDropdownGroupOption("Grupo 2");

  // Carrega o grupo salvo no LocalStorage ou inicia com "Grupo VIP" se não houver nada salvo
  const savedGroup = loadSavedGroup() || "Grupo VIP";
  loadSitesFromArray(getSiteGroup(savedGroup));

  document.getElementById("pauseBtn").onclick = pauseRotation;
  document.getElementById("prevBtn").onclick = showPreviousSite;
  document.getElementById("nextBtn").onclick = showNextSite;
  document.getElementById("adjustTimeBtn").onclick = adjustTime;
  document.getElementById("openInNewTabBtn").onclick = openInNewTab;
  document.getElementById("copyUrlBtn").onclick = copyIframeUrl;
});

// Variáveis globais
var timer;
var currentIndex = 0;
var remainingTime = 5000; // 5 segundos para cada site
var isPaused = false;
var currentSitesArray = [];

// Funções adicionais para manipular o carregamento dos sites

function loadSitesFromArray(sitesArray) {
  var siteList = document.getElementById("site-list");
  siteList.innerHTML = ""; // Limpa a lista de sites atual
  currentSitesArray = sitesArray; // Armazena o array atual globalmente
  currentIndex = 0; // Reinicia o índice para o novo grupo de sites
  createSiteList(sitesArray);
  loadSite(sitesArray, currentIndex);
  startTimer(sitesArray);
}

function loadSite(sitesArray, index) {
  var iframe = document.getElementById("content-frame");
  iframe.src = sitesArray[index].url;
  highlightActiveSite(index);
}

function startTimer(sitesArray) {
  clearInterval(timer); // Limpa qualquer temporizador anterior
  timer = setInterval(function () {
    currentIndex = (currentIndex + 1) % sitesArray.length; // Passa para o próximo site, volta ao início ao terminar
    loadSite(sitesArray, currentIndex);
  }, remainingTime);
}

function pauseRotation() {
  if (isPaused) {
    startTimer(currentSitesArray);
    document.getElementById("pauseBtn").textContent = "Pausar";
  } else {
    clearInterval(timer);
    document.getElementById("pauseBtn").textContent = "Retomar";
  }
  isPaused = !isPaused;
}

function showPreviousSite() {
  currentIndex = (currentIndex - 1 + currentSitesArray.length) % currentSitesArray.length;
  loadSite(currentSitesArray, currentIndex);
}

function showNextSite() {
  currentIndex = (currentIndex + 1) % currentSitesArray.length;
  loadSite(currentSitesArray, currentIndex);
}

function adjustTime() {
  var newTime = prompt(
    "Insira o novo tempo de rotação em segundos:",
    remainingTime / 1000
  );
  if (newTime !== null && !isNaN(newTime) && newTime > 0) {
    remainingTime = newTime * 1000; // Converte segundos para milissegundos
    if (!isPaused) {
      startTimer(currentSitesArray);
    }
  } else {
    alert("Por favor, insira um valor válido.");
  }
}

function openInNewTab() {
  var currentSite = currentSitesArray[currentIndex];
  window.open(currentSite.url, "_blank");
}

// Função para copiar a URL atual do iframe
function copyIframeUrl() {
  var iframe = document.getElementById("content-frame");
  var iframeUrl = iframe.src;

  // Usa a API de Clipboard para copiar a URL
  navigator.clipboard