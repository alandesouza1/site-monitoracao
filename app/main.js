// Suponha que você tenha 13 listas de sites como esta (substitua pelos seus próprios dados)
var sites1 = [
    { name: "Google", url: "https://www.google.com" },
    { name: "YouTube", url: "https://www.youtube.com" },
    // Continue até 12 links
];

var sites2 = [
    { name: "GitHub", url: "https://www.github.com" },
    { name: "Stack Overflow", url: "https://stackoverflow.com" },
    // Continue até 12 links
];

// Continue para suas outras listas de sites até sites13
var sites13 = [
    { name: "Reddit", url: "https://www.reddit.com" },
    { name: "Twitter", url: "https://www.twitter.com" },
    // Continue até 12 links
];

// Agrupa todas as listas `sites` em um único array `siteLists`
const siteLists = [
    sites1, sites2, /* ..., */ sites13
];

// Variáveis de controle de estado
let currentSiteListIndex = 0; // Índice da lista de sites atual
let intervalTime = 5000; // Intervalo padrão de 5 segundos para mudar os links
let interval;
let isPaused = false;

document.addEventListener("DOMContentLoaded", function() {
    const linkList = document.getElementById('link-list');
    const iframesContainer = document.querySelector('.iframes-container');
    
    // Seleciona os botões já criados
    const pauseResumeBtn = document.getElementById('pause-resume'); // Botão pausar/retomar
    const adjustTimeBtn = document.getElementById('adjust-time'); // Botão ajustar tempo
    
    // Inicializa a lista de iframes para a lista de sites atual
    function initializeIframes(siteList) {
        iframesContainer.innerHTML = ''; // Limpar os iframes anteriores

        // Cria 12 iframes com base na lista atual
        siteList.forEach((site) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'iframe-wrapper';
            
            const iframe = document.createElement('iframe');
            iframe.src = site.url;
            iframe.dataset.url = site.url;

            wrapper.appendChild(iframe);
            iframesContainer.appendChild(wrapper);

            // Expande o iframe com clique único
            iframe.addEventListener('click', () => {
                iframe.classList.toggle('fullscreen');
            });

            // Sai da tela cheia com duplo clique
            iframe.addEventListener('dblclick', () => {
                iframe.classList.remove('fullscreen');
            });
        });

        // Atualiza o destaque na lista lateral
        updateActiveListItem();
    }

    // Função para iniciar o temporizador
    function startInterval() {
        interval = setInterval(() => {
            currentSiteListIndex = (currentSiteListIndex + 1) % siteLists.length;
            initializeIframes(siteLists[currentSiteListIndex]);
        }, intervalTime);
    }

    // Função para pausar o temporizador
    function pauseInterval() {
        clearInterval(interval);
        isPaused = true;
        pauseResumeBtn.textContent = '▶️ Retomar'; // Altera o texto do botão para "Retomar"
    }

    // Função para retomar o temporizador
    function resumeInterval() {
        if (isPaused) {
            isPaused = false;
            startInterval();
            pauseResumeBtn.textContent = '⏸ Pausar'; // Altera o texto do botão para "Pausar"
        }
    }

    // Evento de clique para pausar ou retomar o temporizador
    pauseResumeBtn.addEventListener('click', () => {
        if (isPaused) {
            resumeInterval();
        } else {
            pauseInterval();
        }
    });

    // Evento de clique para ajustar o tempo do temporizador
    adjustTimeBtn.addEventListener('click', () => {
        const newTime = prompt('Digite o novo intervalo de tempo em segundos:');
        if (newTime && !isNaN(newTime) && newTime > 0) {
            intervalTime = parseInt(newTime) * 1000; // Converte para milissegundos
            if (!isPaused) {
                clearInterval(interval);
                startInterval();
            }
        }
    });

    // Função para atualizar o destaque na lista lateral
    function updateActiveListItem() {
        const listItems = document.querySelectorAll('#link-list li');
        listItems.forEach((item, index) => {
            // Adiciona ou remove a classe de destaque com base no índice atual
            if (index === currentSiteListIndex) {
                item.classList.add('active-site');
            } else {
                item.classList.remove('active-site');
            }
        });
    }

    // Cria a lista de links para alternar entre as diferentes listas de sites
    siteLists.forEach((siteList, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = `Site ${index + 1}`; // Exibe o nome de cada site

        button.addEventListener('click', () => {
            pauseInterval(); // Pausar o temporizador ao mudar manualmente
            currentSiteListIndex = index;
            initializeIframes(siteLists[currentSiteListIndex]);
        });

        li.appendChild(button);
        linkList.appendChild(li);
    });

    // Inicializa a primeira lista de iframes
    initializeIframes(siteLists[currentSiteListIndex]);

    // Inicia o temporizador automaticamente
    startInterval();
});