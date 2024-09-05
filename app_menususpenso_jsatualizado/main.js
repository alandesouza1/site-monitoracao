// Lista de sites VIP
var sitesVips = [
  { name: 'Google', url: 'https://www.google.com' },
  { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
  { name: 'YouTube', url: 'https://www.youtube.com' },
  { name: 'GitHub', url: 'https://www.github.com' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com' }
];

// Lista de sites de teste - Grupo 1
var sitesTestGroup1 = [
  { name: 'Mozilla', url: 'https://www.mozilla.org' },
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  { name: 'CSS Tricks', url: 'https://css-tricks.com' },
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com' },
  { name: 'A List Apart', url: 'https://alistapart.com' }
];

// Lista de sites de teste - Grupo 2
var sitesTestGroup2 = [
  { name: 'Hacker News', url: 'https://news.ycombinator.com' },
  { name: 'Reddit', url: 'https://www.reddit.com' },
  { name: 'TechCrunch', url: 'https://techcrunch.com' },
  { name: 'The Verge', url: 'https://www.theverge.com' },
  { name: 'Ars Technica', url: 'https://arstechnica.com' }
];

var currentIndex = 0;
var timer;
var isPaused = false;
var remainingTime = 5000; // Tempo de rotação padrão em milissegundos

// Função para obter um grupo de sites por nome
function getSiteGroup(groupName) {
  switch (groupName) {
    case 'Grupo VIP':
      return sitesVips;
    case 'Grupo 1':
      return sitesTestGroup1;
    case 'Grupo 2':
      return sitesTestGroup2;
    default:
      return [];
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const dropdownContent = document.querySelector(".dropdown-content");

  // Adiciona opções no dropdown para diferentes grupos de sites
  function addDropdownGroupOption(groupName) {
    const dropdownLink = document.createElement("a");
    dropdownLink.href = "#";
    dropdownLink.textContent = groupName;

    // Evento para carregar o conteúdo do grupo de sites ao clicar no link do dropdown
    dropdownLink.addEventListener("click", function(event) {
      event.preventDefault();
      const sitesArray = getSiteGroup(groupName);
      loadSitesFromArray(sitesArray);
    });

    dropdownContent.appendChild(dropdownLink);
  }

  // Adiciona grupos de sites ao dropdown
  addDropdownGroupOption("Grupo VIP");
  addDropdownGroupOption("Grupo 1");
  addDropdownGroupOption("Grupo 2");

  // Inicializa a interface ao carregar a página com o primeiro grupo (por exemplo, Grupo VIP)
  loadSitesFromArray(getSiteGroup("Grupo VIP"));

  document.getElementById('pauseBtn').onclick = pauseRotation;
  document.getElementById('prevBtn').onclick = showPreviousSite;
  document.getElementById('nextBtn').onclick = showNextSite;
  document.getElementById('adjustTimeBtn').onclick = adjustTime;
  document.getElementById('openInNewTabBtn').onclick = openInNewTab;
});

// Funções adicionais para manipular o carregamento dos sites

function loadSitesFromArray(sitesArray) {
  var siteList = document.getElementById('site-list');
  siteList.innerHTML = ""; // Limpa a lista de sites atual
  currentIndex = 0; // Reinicia o índice para o novo grupo de sites
  createSiteList(sitesArray);
  loadSite(sitesArray, currentIndex);
  startTimer(sitesArray);
}

function loadSite(sitesArray, index) {
  var iframe = document.getElementById('content-frame');
  iframe.src = sitesArray[index].url;
  highlightActiveSite(index);
}

function startTimer(sitesArray) {
  clearInterval(timer); // Limpa qualquer temporizador anterior
  timer = setInterval(function() {
      currentIndex = (currentIndex + 1) % sitesArray.length; // Passa para o próximo site, volta ao início ao terminar
      loadSite(sitesArray, currentIndex);
  }, remainingTime);
}

function pauseRotation() {
  if (isPaused) {
      startTimer(sitesVips);
      document.getElementById('pauseBtn').textContent = 'Pausar';
  } else {
      clearInterval(timer);
      document.getElementById('pauseBtn').textContent = 'Retomar';
  }
  isPaused = !isPaused;
}

function showPreviousSite() {
  currentIndex = (currentIndex - 1 + sitesVips.length) % sitesVips.length;
  loadSite(sitesVips, currentIndex);
}

function showNextSite() {
  currentIndex = (currentIndex + 1) % sitesVips.length;
  loadSite(sitesVips, currentIndex);
}

function adjustTime() {
  var newTime = prompt("Insira o novo tempo de rotação em segundos:", remainingTime / 1000);
  if (newTime !== null && !isNaN(newTime) && newTime > 0) {
      remainingTime = newTime * 1000; // Converte segundos para milissegundos
      if (!isPaused) {
          startTimer(sitesVips);
      }
  } else {
      alert("Por favor, insira um valor válido.");
  }
}

function openInNewTab() {
  var currentSite = sitesVips[currentIndex];
  window.open(currentSite.url, '_blank');
}

function highlightActiveSite(index) {
  var siteButtons = document.querySelectorAll('#site-list button');
  siteButtons.forEach(function(button, i) {
      if (i === index) {
          button.classList.add('active'); // Adiciona a classe 'active' ao botão ativo
      } else {
          button.classList.remove('active'); // Remove a classe 'active' dos outros botões
      }
  });
}

function createSiteList(sitesArray) {
  var siteList = document.getElementById('site-list');
  sitesArray.forEach(function(site, index) {
      var li = document.createElement('li');
      var button = document.createElement('button');
      button.textContent = site.name; // Exibe o nome do site
      button.className = 'sidebar-button'; // Aplica a classe padrão para os botões
      button.onclick = function() {
          currentIndex = index;
          loadSite(sitesArray, currentIndex);
          clearInterval(timer); // Pausa a rotação automática ao clicar manualmente
          document.getElementById('pauseBtn').textContent = 'Retomar';
          isPaused = true;
      };
      li.appendChild(button);
      siteList.appendChild(li);
  });
}