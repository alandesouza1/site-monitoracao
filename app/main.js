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

    // Função para inicializar iframes (ajuste para manter o zoom ao alternar sites)
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

            // Aplica o zoom ao conteúdo do iframe ao carregar
            iframe.onload = function () {
                try {
                    applyZoomToIframe(iframe); // Aplica o zoom ao iframe recém-criado
                } catch (error) {
                    console.error('Erro ao aplicar zoom ao conteúdo do iframe:', error);
                }
            };

            // Adiciona evento para expandir o iframe após hover por 3 segundos
            iframe.addEventListener('mouseover', () => {
                if (!isFullscreen) {
                    hoverMessage.style.display = 'block';
                    expandTimeout = setTimeout(() => {
                        expandIframe(iframe); // Função para expandir o iframe
                        hoverMessage.style.display = 'none'; // Oculta a mensagem após expandir
                    }, 3000); // 3 segundos
                }
            });

            // Cancela expansão se o mouse sair antes dos 3 segundos
            iframe.addEventListener('mouseout', () => {
                clearTimeout(expandTimeout);
                hoverMessage.style.display = 'none';
            });
        });

        applyZoomToIframes(); // Mantém o zoom em todos os iframes ao inicializar
        updateActiveListItem(); // Atualiza a lista lateral para destacar o grupo ativo
    }

    // Função para aplicar o zoom ao conteúdo dentro de um iframe
    function applyZoomToIframe(iframe) {
        try {
            // Aplica zoom ao conteúdo do iframe
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            iframeDocument.body.style.transform = `scale(${zoomLevel})`;
            iframeDocument.body.style.transformOrigin = '0 0';
        } catch (error) {
            console.error('Erro ao aplicar zoom ao conteúdo do iframe:', error);
        }
    }

    // Função para aplicar o zoom a todos os iframes presentes na tela
    function applyZoomToIframes() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => applyZoomToIframe(iframe));
    }

    // Função para expandir o iframe para tela cheia
    function expandIframe(iframe) {
        iframe.classList.add('fullscreen');
        openNewTabBtn.style.display = 'block'; // Mostra o botão para abrir em nova aba
        returnToMainBtn.style.display = 'block'; // Mostra o botão para retornar à tela principal
        openNewTabBtn.dataset.url = iframe.dataset.url;
        isFullscreen = true; // Define o estado como tela cheia
    }

    // Função para minimizar o iframe e esconder botões
    function minimizeIframe() {
        const fullscreenIframe = document.querySelector('iframe.fullscreen');
        if (fullscreenIframe) {
            fullscreenIframe.classList.remove('fullscreen');
            openNewTabBtn.style.display = 'none'; // Esconde o botão ao minimizar
            returnToMainBtn.style.display = 'none'; // Esconde o botão de retorno
            isFullscreen = false;
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
            updateActiveListItem(); // Atualiza a lista lateral durante a troca automática
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

    // Evento para ajustar o