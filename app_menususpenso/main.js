// Lista de sites com nomes e URLs
let sitesVips = [
  { name: 'Google', url: 'https://www.google.com' },
  { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
  { name: 'YouTube', url: 'https://www.youtube.com' },
  { name: 'GitHub', url: 'https://www.github.com' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com' }
];

let sitesTestGroup1 = [
  { name: 'Mozilla', url: 'https://www.mozilla.org' },
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  { name: 'CSS Tricks', url: 'https://css-tricks.com' },
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com' },
  { name: 'A List Apart', url: 'https://alistapart.com' }
];

let sitesTestGroup2 = [
  { name: 'Hacker News', url: 'https://news.ycombinator.com' },
  { name: 'Reddit', url: 'https://www.reddit.com' },
  { name: 'TechCrunch', url: 'https://techcrunch.com' },
  { name: 'The Verge', url: 'https://www.theverge.com' },
  { name: 'Ars Technica', url: 'https://arstechnica.com' }
];

var currentIndex = 0;
var timer;
var remainingTime = 5000; // 5 segundos para exemplo
var isPaused = false;

// Função para carregar sites de um array específico
function loadSitesFromArray(sitesArray) {
  var siteList = document.getElementById('site-list');
  siteList.innerHTML = ""; // Limpa a lista de sites atual
  sitesVips = sitesArray; // Define o array atual como o array de sites a ser utilizado
  createSiteList();
  loadSite(currentIndex);
  startTimer();
}

function loadSite(index) {
  var iframe = document.getElementById('content-frame');
  iframe.src = sitesVips[index].url;
  highlightActiveSite(index);
}

function startTimer() {
  clearInterval(timer); // Limpa qualquer temporizador anterior
  timer = setInterval(function() {
      currentIndex = (currentIndex + 1) % sitesVips.length; // Passa para o próximo site, volta ao início ao terminar
      loadSite(currentIndex);
  }, remainingTime);
}

function pauseRotation() {
  if (isPaused) {
      startTimer();
      document.getElementById('pauseBtn').textContent = 'Pausar';
  } else {
      clearInterval(timer);
      document.getElementById('pauseBtn').textContent = 'Retomar';
  }
  isPaused = !isPaused;
}

function showPreviousSite() {
  currentIndex = (currentIndex - 1 + sitesVips.length) % sitesVips.length;
  loadSite(currentIndex);
}

function showNextSite() {
  currentIndex = (currentIndex + 1) % sitesVips.length;
  loadSite(currentIndex);
}

function adjustTime() {
  var newTime = prompt("Insira o novo tempo de rotação em segundos:", remainingTime / 1000);
  if (newTime !== null && !isNaN(newTime) && newTime > 0) {
      remainingTime = newTime * 1000; // Converte segundos para milissegundos
      if (!isPaused) {
          startTimer();
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
      button.style.backgroundColor = (i === index) ? '#0056b3' : '#007BFF';
  });
}

function createSiteList() {
  var siteList = document.getElementById('site-list');
  sitesVips.forEach(function(site, index) {
      var li = document.createElement('li');
      var button = document.createElement('button');
      button.textContent = site.name; // Exibe o nome do site
      button.onclick = function() {
          currentIndex = index;
          loadSite(currentIndex);
          clearInterval(timer); // Pausa a rotação automática ao clicar manualmente
          document.getElementById('pauseBtn').textContent = 'Retomar';
          isPaused = true;
      };
      li.appendChild(button);
      siteList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const dropdownContent = document.querySelector(".dropdown-content");

  // Adiciona opções no dropdown para diferentes grupos de sites
  function addDropdownGroupOption(groupName, sitesArray) {
    const dropdownLink = document.createElement("a");
    dropdownLink.href = "#";
    dropdownLink.textContent = groupName;

    // Evento para carregar o conteúdo do grupo de sites ao clicar no link do dropdown
    dropdownLink.addEventListener("click", function(event) {
      event.preventDefault();
      loadSitesFromArray(sitesArray);
    });

    dropdownContent.appendChild(dropdownLink);
  }

  // Adiciona grupos de sites ao dropdown
  addDropdownGroupOption("Grupo VIP", sitesVips);
  addDropdownGroupOption("Grupo 1", sitesTestGroup1);
  addDropdownGroupOption("Grupo 2", sitesTestGroup2);

  // Inicializa a interface ao carregar a página
  createSiteList();
  loadSite(currentIndex);
  startTimer();

  document.getElementById('pauseBtn').onclick = pauseRotation;
  document.getElementById('prevBtn').onclick = showPreviousSite;
  document.getElementById('nextBtn').onclick = showNextSite;
  document.getElementById('adjustTimeBtn').onclick = adjustTime;
  document.getElementById('openInNewTabBtn').onclick = openInNewTab;
});
