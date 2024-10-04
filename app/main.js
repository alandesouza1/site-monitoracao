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
let zoomLevel = 1;
let expandTimeout;
let isFullscreen = false;

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

    // Function to adjust zoom within iframe content
    function applyZoomToIframeContent(zoomLevel) {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const iframeDocument = iframe.contentWindow.document;

                // Adjust zoom on the body of the iframe content
                iframeDocument.body.style.transform = `scale(${zoomLevel})`;
                iframeDocument.body.style.transformOrigin = '0 0'; // Ensure the zoom starts from the top-left corner
            } catch (error) {
                console.error('Erro ao aplicar zoom ao conteúdo do iframe:', error);
            }
        });
    }

    // Função para inicializar iframes (ajuste para manter o zoom ao alternar sites)
    function initializeIframes(siteList) {
        iframesContainer.innerHTML = ''; // Limpar iframes anteriores

        siteList.forEach((site) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'iframe-wrapper';

            const iframe = document.createElement('iframe');
            iframe.src = site.url;
            iframe.dataset.url = site.url;

            wrapper.appendChild(iframe);
            iframesContainer.appendChild(wrapper);

            // Aplica o zoom ao conteúdo do iframe ao carregar
            iframe.onload = function () {
                applyZoomToIframeContent(zoomLevel);
            };

            // Inicializa comportamento de hover (tooltip e expansão)
            initializeIframeHoverBehavior(iframe);
        });

        updateActiveListItem();
    }

    // Function to handle zoom button click
    adjustZoomBtn.addEventListener('click', () => {
        const newZoom = prompt('Digite o novo nível de zoom (ex: 1 para 100%, 0.5 para 50%):');
        if (newZoom && !isNaN(newZoom) && newZoom > 0) {
            zoomLevel = parseFloat(newZoom);
            applyZoomToIframeContent(zoomLevel); // Apply zoom to all iframes
        }
    });

    // Function to show tooltip on iframe hover
    function showTooltip(iframe) {
        const tooltip = document.createElement('div');
        tooltip.className = 'iframe-tooltip';
        tooltip.textContent = 'Mantenha o mouse por 3 segundos para expandir';
        document.body.appendChild(tooltip);

        // Position the tooltip near the iframe
        const rect = iframe.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + 10}px`;
        tooltip.style.top = `${rect.top + window.scrollY - 30}px`;

        return tooltip;
    }

    // Initialize tooltip and full-screen behavior on iframe hover
    function initializeIframeHoverBehavior(iframe) {
        let tooltip;

        iframe.addEventListener('mouseover', () => {
            // Show tooltip when hovering over iframe
            if (!isFullscreen) {
                tooltip = showTooltip(iframe);
                expandTimeout = setTimeout(() => {
                    // Remove tooltip once expanded
                    if (tooltip) tooltip.remove();
                    iframe.classList.add('fullscreen');

                    // Show overlay and buttons for full-screen controls
                    document.getElementById('overlay').style.display = 'block';
                    openNewTabBtn.style.display = 'block';
                    returnToMainBtn.style.display = 'block';
                    openNewTabBtn.dataset.url = iframe.dataset.url;
                    isFullscreen = true;
                }, 3000); // 3 seconds
            }
        });

        // Hide tooltip and cancel expansion if mouse is removed before timeout
        iframe.addEventListener('mouseout', () => {
            if (tooltip) tooltip.remove();
            clearTimeout(expandTimeout);
        });
    }

    // Function to exit fullscreen mode and return to main view
    function minimizeIframe() {
        const fullscreenIframe = document.querySelector('iframe.fullscreen');
        if (fullscreenIframe) {
            fullscreenIframe.classList.remove('fullscreen');
            
            // Hide overlay and buttons
            document.getElementById('overlay').style.display = 'none';
            openNewTabBtn.style.display = 'none';
            returnToMainBtn.style.display = 'none';
            
            isFullscreen = false; // Update state
        }
    }

    // Add click event to return to main view button
    returnToMainBtn.addEventListener('click', minimizeIframe);

    // Evento de clique para abrir o iframe expandido em nova aba
    openNewTabBtn.addEventListener('click', () => {
        if (openNewTabBtn.dataset.url) {
            window.open(openNewTabBtn.dataset.url, '_blank'); // Abre o link do iframe expandido em uma nova aba
        }
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

    // Função para iniciar o temporizador
    function startInterval() {
        interval = setInterval(() => {
            currentSiteListIndex = (currentSiteListIndex + 1) % siteLists.length;
            initializeIframes(siteLists[currentSiteListIndex]);
        }, intervalTime);
    }

    // Inicia o temporizador automaticamente
    startInterval();
});