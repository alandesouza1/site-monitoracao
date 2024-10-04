// Lista de sites como exemplo
var sites1 = [
    { name: "Google", url: "https://www.google.com" }, 
    { name: "YouTube", url: "https://www.youtube.com" }
];

var sites2 = [
    { name: "GitHub", url: "https://www.github.com" },
    { name: "Stack Overflow", url: "https://stackoverflow.com" }
];

const siteLists = [sites1, sites2];

// Variáveis de controle de estado
let zoomLevel = 1; // Nível de zoom inicial para iframes
let expandTimeout;
let isFullscreen = false;
let hoverTime = 3000; // Tempo padrão de 3 segundos para expandir
let currentSiteListIndex = 0;
let intervalTime = 5000;
let interval;
let isPaused = false;

document.addEventListener("DOMContentLoaded", function () {
    const iframesContainer = document.querySelector('.iframes-container');
    const adjustZoomBtn = document.getElementById('adjust-zoom');
    const openNewTabBtn = document.getElementById('open-new-tab');
    const returnToMainBtn = document.getElementById('return-to-main');
    const overlay = document.getElementById('overlay');
    const linkList = document.getElementById('link-list');
    const adjustTimeBtn = document.getElementById('adjust-time');
    const prevGroupBtn = document.getElementById('previous-group');
    const nextGroupBtn = document.getElementById('next-group');
    const pauseResumeBtn = document.getElementById('pause-resume');

    // Função para inicializar iframes
    function initializeIframes(siteList) {
        iframesContainer.innerHTML = ''; // Limpar iframes anteriores

        siteList.forEach((site) => {
            const iframeWrapper = document.createElement('div');
            iframeWrapper.className = 'iframe-wrapper';

            const iframe = document.createElement('iframe');
            iframe.src = site.url;
            iframe.dataset.url = site.url;

            iframeWrapper.appendChild(iframe);
            iframesContainer.appendChild(iframeWrapper);

            // Adicionar evento de carregamento para aplicar o zoom no conteúdo interno
            iframe.onload = function () {
                try {
                    // Aplicar zoom ao conteúdo interno do iframe
                    iframe.contentWindow.document.body.style.zoom = zoomLevel;
                } catch (error) {
                    console.error('Erro ao aplicar zoom no conteúdo do iframe:', error);
                }
            };

            // Inicializar comportamento de hover para tooltip e expansão
            initializeIframeHoverBehavior(iframe);
        });

        updateActiveListItem(); // Atualizar destaque da lista lateral
    }

    // Função para aplicar o zoom atual em todos os iframes presentes na tela
    function applyZoomToIframes() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                iframe.contentWindow.document.body.style.zoom = zoomLevel;
            } catch (error) {
                console.error('Erro ao aplicar zoom ao iframe:', error);
            }
        });
    }

    // Função para ajustar o zoom dentro dos iframes
    adjustZoomBtn.addEventListener('click', () => {
        const newZoom = prompt('Digite o novo nível de zoom (ex: 1 para 100%, 0.5 para 50%):');
        if (newZoom && !isNaN(newZoom) && newZoom > 0) {
            zoomLevel = parseFloat(newZoom);
            applyZoomToIframes(); // Aplicar o novo zoom a todos os iframes
        }
    });

    // Função para ajustar o tempo de expansão ao passar o mouse
    adjustTimeBtn.addEventListener('click', () => {
        const newTime = prompt('Digite o novo tempo para expandir em segundos:');
        if (newTime && !isNaN(newTime) && newTime > 0) {
            hoverTime = parseInt(newTime) * 1000; // Tempo em milissegundos
        }
    });

    // Função para mostrar a tooltip ao passar o mouse
    function showTooltip(iframe) {
        const tooltip = document.createElement('div');
        tooltip.className = 'iframe-tooltip';
        tooltip.textContent = 'Mantenha o mouse por ' + (hoverTime / 1000) + ' segundos para expandir';
        document.body.appendChild(tooltip);

        // Posicionar a tooltip próximo ao iframe
        const rect = iframe.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + 10}px`;
        tooltip.style.top = `${rect.top + window.scrollY - 30}px`;

        return tooltip;
    }

    // Função para expandir o iframe ao passar o mouse por um determinado tempo
    function initializeIframeHoverBehavior(iframe) {
        let tooltip;

        iframe.addEventListener('mouseover', () => {
            if (!isFullscreen) {
                iframe.style.cursor = 'pointer'; // Mudar o cursor para indicar interatividade

                // Mostrar a tooltip
                tooltip = showTooltip(iframe);

                // Expandir o iframe após o tempo definido
                expandTimeout = setTimeout(() => {
                    if (tooltip) tooltip.remove();
                    iframe.classList.add('fullscreen');

                    // Mostrar overlay e botões de controle ao expandir
                    overlay.style.display = 'block';
                    openNewTabBtn.style.display = 'block';
                    returnToMainBtn.style.display = 'block';
                    openNewTabBtn.dataset.url = iframe.dataset.url; // Define a URL correta no botão
                    isFullscreen = true;
                }, hoverTime);
            }
        });

        // Remover tooltip e cancelar expansão se o mouse sair antes do tempo definido
        iframe.addEventListener('mouseout', () => {
            if (tooltip) tooltip.remove();
            clearTimeout(expandTimeout);
        });
    }

    // Função para minimizar o iframe e retornar ao modo padrão
    returnToMainBtn.addEventListener('click', () => {
        const fullscreenIframe = document.querySelector('iframe.fullscreen');
        if (fullscreenIframe) {
            fullscreenIframe.classList.remove('fullscreen');

            // Ocultar overlay e botões ao minimizar
            overlay.style.display = 'none';
            openNewTabBtn.style.display = 'none';
            returnToMainBtn.style.display = 'none';

            isFullscreen = false;
        }
    });

    // Evento para abrir o iframe expandido em uma nova aba
    openNewTabBtn.addEventListener('click', () => {
        if (openNewTabBtn.dataset.url) {
            window.open(openNewTabBtn.dataset.url, '_blank');
        }
    });

    // Função para atualizar o destaque da lista lateral
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

    // Eventos para navegação pelos grupos de sites
    prevGroupBtn.addEventListener('click', () => {
        currentSiteListIndex = (currentSiteListIndex - 1 + siteLists.length) % siteLists.length;
        initializeIframes(siteLists[currentSiteListIndex]);
        applyZoomToIframes(); // Aplicar o zoom atual ao mudar de grupo
    });

    nextGroupBtn.addEventListener('click', () => {
        currentSiteListIndex = (currentSiteListIndex + 1) % siteLists.length;
        initializeIframes(siteLists[currentSiteListIndex]);
        applyZoomToIframes(); // Aplicar o zoom atual ao mudar de grupo
    });

    // Inicializa a lista lateral e os iframes ao carregar a página
    initializeIframes(siteLists[currentSiteListIndex]);
    applyZoomToIframes(); // Aplicar zoom inicial aos iframes
});