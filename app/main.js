// Lista de sites como exemplo
var sites1 = [
    { name: "Google", url: "https://www.google.com" },
    { name: "YouTube", url: "https://www.youtube.com" },
    // Continue até 12 links com seus nomes e URLs
];

var sites2 = [
    { name: "GitHub", url: "https://www.github.com" },
    { name: "Stack Overflow", url: "https://stackoverflow.com" },
    // Continue até 12 links com seus nomes e URLs
];

// Agrupa todas as listas `sites` em um único array `siteLists`
const siteLists = [sites1, sites2];

// Variáveis de controle de estado
let currentSiteListIndex = 0;
let intervalTime = 5000;
let interval;
let isPaused = false;
let zoomLevel = 1; // Zoom inicial para o conteúdo dentro dos iframes
let expandTimeout; // Timeout para expandir o iframe
let isFullscreen = false; // Estado para verificar se algum iframe está em tela cheia

document.addEventListener("DOMContentLoaded", function () {
    const linkList = document.getElementById('link-list');
    const iframesContainer = document.querySelector('.iframes-container');
    const openNewTabBtn = document.getElementById('open-new-tab');
    const returnToMainBtn = document.getElementById('return-to-main');
    const pauseResumeBtn = document.getElementById('pause-resume');
    const adjustTimeBtn = document.getElementById('adjust-time');
    const adjustZoomBtn = document.getElementById('adjust-zoom');
    const prevGroupBtn = document.getElementById('previous-group');
    const nextGroupBtn = document.getElementById('next-group');
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-fullscreen');

    // Função para inicializar iframes
    function initializeIframes(siteList) {
        iframesContainer.innerHTML = ''; // Limpar iframes anteriores

        siteList.forEach((site, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'iframe-wrapper';

            const iframe = document.createElement('iframe');
            iframe.src = site.url;
            iframe.dataset.url = site.url;

            // Cria a mensagem de dica
            const hoverMessage = document.createElement('div');
            hoverMessage.textContent = 'Mantenha o mouse por 3 segundos para expandir';
            hoverMessage.className = 'hover-message';
            hoverMessage.style.display = 'none';

            wrapper.appendChild(hoverMessage);
            wrapper.appendChild(iframe);
            iframesContainer.appendChild(wrapper);

            // Evento de zoom no iframe
            iframe.onload = function () {
                try {
                    iframe.contentWindow.document.body.style.zoom = zoomLevel;
                } catch (error) {
                    console.error('Erro ao aplicar zoom ao iframe:', error);
                }
            };

            // Expande o iframe após hover por 3 segundos
            iframe.addEventListener('mouseover', () => {
                if (!isFullscreen) {
                    hoverMessage.style.display = 'block';
                    expandTimeout = setTimeout(() => {
                        iframe.classList.add('fullscreen');
                        // Mostra os botões somente quando o iframe estiver expandido
                        openNewTabBtn.style.display = 'block';
                        returnToMainBtn.style.display = 'block';
                        closeBtn.style.display = 'block';
                        openNewTabBtn.dataset.url = iframe.dataset.url;
                        overlay.style.display = 'block'; // Mostra a sobreposição
                        hoverMessage.style.display = 'none';
                        isFullscreen = true; // Define o estado como tela cheia
                    }, 3000); // 3 segundos
                }
            });

            // Cancela expansão se o mouse sair antes dos 3 segundos
            iframe.addEventListener('mouseout', () => {
                clearTimeout(expandTimeout);
                hoverMessage.style.display = 'none';
            });
        });

        updateActiveListItem();
    }

    // Evento de clique para fechar a sobreposição e voltar ao estado normal
    overlay.addEventListener('click', () => {
        minimizeIframe();
    });

    // Evento de clique para o botão de fechar/minimizar
    closeBtn.addEventListener('click', () => {
        minimizeIframe();
    });

    // Função para minimizar o iframe e esconder botões
    function minimizeIframe() {
        const fullscreenIframe = document.querySelector('iframe.fullscreen');
        if (fullscreenIframe) {
            fullscreenIframe.classList.remove('fullscreen');
            openNewTabBtn.style.display = 'none';
            returnToMainBtn.style.display = 'none';
            closeBtn.style.display = 'none';
            overlay.style.display = 'none';
            isFullscreen = false; // Volta ao estado normal
        }
    }

    // Função para manter a animação de destaque ao alternar sites
    function updateActiveListItem() {
        const listItems = document.querySelectorAll('#link-list li button');
        listItems.forEach((item, index) => {
            if (index === currentSiteListIndex) {
                item.classList.add('active-site');
            } else {
                item.classList.remove('active-site');
            }
        });
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
        pauseResumeBtn.textContent = '▶️ Retomar';
    }

    // Função para retomar o temporizador
    function resumeInterval() {
        if (isPaused) {
            isPaused = false;
            startInterval();
            pauseResumeBtn.textContent = '⏸ Pausar';
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

    // Evento para ajustar o intervalo de tempo do temporizador
    adjustTimeBtn.addEventListener('click', () => {
        const newTime = prompt('Digite o novo intervalo de tempo em segundos:');
        if (newTime && !isNaN(newTime) && newTime > 0) {
            intervalTime = parseInt(newTime) * 1000;
            if (!isPaused) {
                clearInterval(interval);
                startInterval();
            }
        }
    });

    // Evento para ajustar o zoom do conteúdo dentro dos iframes
    adjustZoomBtn.addEventListener('click', () => {
        const newZoom = prompt('Digite o novo nível de zoom (ex: 1 para 100%, 0.5 para 50%):');
        if (newZoom && !isNaN(newZoom) && newZoom > 0) {
            zoomLevel = parseFloat(newZoom);
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                iframe.contentWindow.document.body.style.zoom = zoomLevel;
            });
        }
    });

    // Evento de clique para abrir o iframe expandido em nova aba
    openNewTabBtn.addEventListener('click', () => {
        if (openNewTabBtn.dataset.url) {
            window.open(openNewTabBtn.dataset.url, '_blank');
        }
    });

    // Evento de clique para retornar à tela principal
    returnToMainBtn.addEventListener('click', () => {
        minimizeIframe();
    });

    // Cria a lista de links para alternar entre as diferentes listas de sites
    siteLists.forEach((siteList, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = siteList[0].name; // Exibe o nome do primeiro site do grupo

        button.addEventListener('click', () => {
            pauseInterval(); // Pausar o temporizador ao mudar manualmente
            currentSiteListIndex = index;
            initializeIframes(siteLists[currentSiteListIndex]);
        });

        li.appendChild(button);
        linkList.appendChild(li);
    });

    // Eventos para os botões de navegação (Anterior/Próximo)
    prevGroupBtn.addEventListener('click', () => {
        pauseInterval();
        currentSiteListIndex = (currentSiteListIndex - 1 + siteLists.length) % siteLists.length;
        initializeIframes(siteLists[currentSiteListIndex]);
    });

    nextGroupBtn.addEventListener('click', () => {
        pauseInterval();
        currentSiteListIndex = (currentSiteListIndex + 1) % siteLists.length;
        initializeIframes(siteLists[currentSiteListIndex]);
    });

    // Inicializa a primeira lista de iframes
    initializeIframes(siteLists[currentSiteListIndex]);

    // Inicia o temporizador automaticamente
    startInterval();
});