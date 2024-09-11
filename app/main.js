document.addEventListener("DOMContentLoaded", function () {
  // Dropdown Elements
  const dropdownContent = document.querySelector(".dropdown-content");
  const customLinksDropdown = document.getElementById("custom-links-dropdown");
  const addLinkBtn = document.getElementById("addLinkBtn");

  // Variáveis globais para controle do iframe
  let timer;
  let currentIndex = 0;
  let remainingTime = 5000; // 5 segundos para cada site
  let isPaused = false;
  let currentSitesArray = [];

  // Adiciona links personalizados ao dropdown "Links Personalizados"
  function addCustomLink(linkName, linkUrl) {
    const customLink = document.createElement("a");
    customLink.href = linkUrl;
    customLink.textContent = linkName;
    customLink.target = "_blank";
    customLinksDropdown.appendChild(customLink);
  }

  // Adicionando links provisórios
  addCustomLink("OpenAI", "https://www.openai.com");
  addCustomLink("Google", "https://www.google.com");
  addCustomLink("Wikipedia", "https://www.wikipedia.org");

  // Evento de adicionar um link personalizado
  addLinkBtn?.addEventListener("click", function () {
    const linkName = prompt("Insira o nome do link:");
    const linkUrl = prompt("Insira a URL do link:");
    if (linkName && linkUrl) {
      addCustomLink(linkName, linkUrl);
      alert("Link adicionado com sucesso!");
    } else {
      alert("Por favor, insira um nome e uma URL válidos.");
    }
  });

  // Adiciona grupo de sites no dropdown
  function addDropdownGroupOption(groupName) {
    const dropdownLink = document.createElement("a");
    dropdownLink.href = "#";
    dropdownLink.textContent = groupName;

    dropdownLink.addEventListener("click", function (event) {
      event.preventDefault();
      const sitesArray = getSiteGroup(groupName);
      loadSitesFromArray(sitesArray);
      saveCurrentGroup(groupName);
    });

    dropdownContent.appendChild(dropdownLink);
  }

  // Funções de LocalStorage
  function saveCurrentGroup(groupName) {
    localStorage.setItem("currentGroup", groupName);
  }

  function loadSavedGroup() {
    return localStorage.getItem("currentGroup");
  }

  // Adicionando os grupos de sites no dropdown
  addDropdownGroupOption("Grupo VIP");
  addDropdownGroupOption("Grupo 1");
  addDropdownGroupOption("Grupo 2");

  // Carrega o grupo salvo ou inicia com "Grupo VIP"
  const savedGroup = loadSavedGroup() || "Grupo VIP";
  loadSitesFromArray(getSiteGroup(savedGroup));

  // Botões de controle
  document.getElementById("pauseBtn").onclick = pauseRotation;
  document.getElementById("prevBtn").onclick = showPreviousSite;
  document.getElementById("nextBtn").onclick = showNextSite;
  document.getElementById("adjustTimeBtn").onclick = adjustTime;
  document.getElementById("openInNewTabBtn").onclick = openInNewTab;
  document.getElementById("copyUrlBtn").onclick = copyIframeUrl;

  // Funções relacionadas ao carregamento e navegação de sites
  function loadSitesFromArray(sitesArray) {
    const siteList = document.getElementById("site-list");
    siteList.innerHTML = ""; // Limpa a lista de sites atual
    currentSitesArray = sitesArray;
    currentIndex = 0;
    createSiteList(sitesArray);
    loadSite(sitesArray, currentIndex);
    startTimer(sitesArray);
  }

  function loadSite(sitesArray, index) {
    const iframe = document.getElementById("content-frame");
    iframe.src = sitesArray[index].url;
    highlightActiveSite(index);
  }

  function startTimer(sitesArray) {
    clearInterval(timer);
    timer = setInterval(function () {
      currentIndex = (currentIndex + 1) % sitesArray.length;
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
    const newTime = prompt("Insira o novo tempo de rotação em segundos:", remainingTime / 1000);
    if (newTime !== null && !isNaN(newTime) && newTime > 0) {
      remainingTime = newTime * 1000;
      if (!isPaused) {
        startTimer(currentSitesArray);
      }
    } else {
      alert("Por favor, insira um valor válido.");
    }
  }

  function openInNewTab() {
    const currentSite = currentSitesArray[currentIndex];
    window.open(currentSite.url, "_blank");
  }

  function copyIframeUrl() {
    const iframe = document.getElementById("content-frame");
    const iframeUrl = iframe.src;

    navigator.clipboard.writeText(iframeUrl)
      .then(() => {
        alert("URL copiada: " + iframeUrl);
      })
      .catch((err) => {
        console.error("Erro ao copiar a URL: ", err);
      });
  }

  function highlightActiveSite(index) {
    const siteButtons = document.querySelectorAll("#site-list button");
    siteButtons.forEach((button, i) => {
      if (i === index) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  }

  function createSiteList(sitesArray) {
    const siteList = document.getElementById("site-list");
    sitesArray.forEach((site, index) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = site.name;
      button.className = "sidebar-button";
      button.onclick = function () {
        currentIndex = index;
        loadSite(sitesArray, currentIndex);
        clearInterval(timer); // Pausa a rotação automática ao clicar manualmente
        document.getElementById("pauseBtn").textContent = "Retomar";
        isPaused = true;
      };
      li.appendChild(button);
      siteList.appendChild(li);
    });
  }

  // Função que retorna grupos de sites
  function getSiteGroup(groupName) {
    switch (groupName) {
      case "Grupo VIP":
        return sitesVips;
      case "Grupo 1":
        return sitesTestGroup1;
      case "Grupo 2":
        return sitesTestGroup2;
      default:
        return [];
    }
  }

  // Lista de sites VIP
  const sitesVips = [
    { name: "Google", url: "https://www.google.com" },
    { name: "Wikipedia", url: "https://www.wikipedia.org" },
    { name: "YouTube", url: "https://www.youtube.com" },
    { name: "GitHub", url: "https://www.github.com" },
    { name: "Stack Overflow", url: "https://stackoverflow.com" },
  ];

  // Lista de sites - Grupo 1
  const sitesTestGroup1 = [
    { name: "Mozilla", url: "https://www.mozilla.org" },
    { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
    { name: "CSS Tricks", url: "https://css-tricks.com" },
    { name: "Smashing Magazine", url: "https://www.smashingmagazine.com" },
    { name: "A List Apart", url: "https://alistapart.com" },
  ];

  // Lista de sites - Grupo 2
  const sitesTestGroup2 = [
    { name: "Hacker News", url: "https://news.ycombinator.com" },
    { name: "Reddit", url: "https://www.reddit.com" },
    { name: "TechCrunch", url: "https://techcrunch.com" },
    { name: "The Verge", url: "https://www.theverge.com" },
    { name: "Ars Technica", url: "https://arstechnica.com" },
  ];
});