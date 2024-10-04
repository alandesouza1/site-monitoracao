// Lista de sites locais como exemplo
var sites1 = [
    { name: "Página 1", url: "/pagina1.html" }, // Exemplo de URLs locais
    { name: "Página 2", url: "/pagina2.html" }
];

var sites2 = [
    { name: "Página 3", url: "/pagina3.html" },
    { name: "Página 4", url: "/pagina4.html" }
];

// Agrupa todas as listas `sites` em um único array `siteLists`
const siteLists = [sites1, sites2];

// Variáveis de controle de estado
let zoomLevel = 1;
let expandTimeout;
let isFullscreen = false;
let intervalTime = 3000; // Padrão de 3 segundos para expandir

document.addEventListener("DOMContentLoaded", function () {
    const iframesContainer = document.querySelector('.iframes-container');
    const adjustZoomBtn = document.getElementById('adjust-zoom');
    const openNewTabBtn = document.getElementById('open-new-tab');
    const returnToMainBtn = document.getElementById('return-to-main');
    const overlay = document.getElementById('overlay');
    const linkList = document.getElementById('link-list');
    const adjustTimeBtn = document.getElementById('adjust-time'); // Ajustar tempo para expansão

    // Função para inicializar iframes e lista lateral
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
                    // Acessar o documento interno do iframe e ajustar o zoom
                    iframe.contentWindow.document.body.style.zoom = zoomLevel;
                } catch (error) {
                    console.error('Erro ao aplicar zoom no conteúdo do iframe:', error);
                }
            };

            // Inicializar o comportamento de hover (tooltip e expansão)
            initializeIframeHoverBehavior(iframe);
        });
    }

    // Função para criar a lista lateral
    function initializeLinkList() {
        linkList.innerHTML = ''; // Limpa a lista

        siteLists.forEach((siteList, index) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = siteList[0].name;

            button.addEventListener('click', () => {
                initializeIframes(siteLists[index]);
            });

            li.appendChild(button);
            linkList.appendChild(li);
        });
    }

    // Função para ajustar o zoom dentro do iframe
    adjustZoomBtn.addEventListener('click', () => {
        const newZoom = prompt('Digite o novo nível de zoom (ex: 1 para 100%, 0.5 para 50%):');
        if (newZoom && !isNaN(newZoom) && newZoom > 0) {
            zoomLevel = parseFloat(newZoom);
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    iframe.contentWindow.document.body.style.zoom = zoomLevel;
                } catch (error) {
                    console.error('Erro ao aplicar zoom no conteúdo do iframe:', error);
                }
            });
        }
    });

    // Função para ajustar o tempo de expansão
    adjustTimeBtn.addEventListener('click', () => {
        const newTime = prompt('Digite o novo tempo para expandir em segundos:');
        if (newTime && !isNaN(newTime) && newTime > 0) {
            intervalTime = parseInt(newTime) * 1000;
        }
    });

    // Função para mostrar o tooltip
    function showTooltip(iframe) {
        const tooltip = document.createElement('div');
        tooltip.className = 'iframe-tooltip';
        tooltip.textContent = 'Mantenha o mouse por ' + (intervalTime / 1000) + ' segundos para expandir';
        document.body.appendChild(tooltip);

        // Posicionar o tooltip próximo ao iframe
        const rect = iframe.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + 10}px`;
        tooltip.style.top = `${rect.top + window.scrollY - 30}px`;

        return tooltip;
    }

    // Inicializar comportamento de hover e expansão para o iframe
    function initializeIframeHoverBehavior(iframe) {
        let tooltip;

        iframe.addEventListener('mouseover', () => {
            if (!isFullscreen) {
                // Mudar o cursor para "pointer"
                iframe.style.cursor = 'pointer';

                // Mostrar o tooltip
                tooltip = showTooltip(iframe);
                
                // Expandir após o tempo definido em intervalTime
                expandTimeout = setTimeout(() => {
                    if (tooltip) tooltip.remove();
                    iframe.classList.add('fullscreen');

                    // Mostrar overlay e botões de controle
                    overlay.style.display = 'block';
                    openNewTabBtn.style.display = 'block';
                    returnToMainBtn.style.display = 'block';
                    openNewTabBtn.dataset.url = iframe.dataset.url;
                    isFullscreen = true;
                }, intervalTime);
            }
        });

        // Ocultar o tooltip e cancelar a expansão se o mouse sair antes do tempo definido
        iframe.addEventListener('mouseout', () => {
            if (tooltip) tooltip.remove();
            clearTimeout(expandTimeout);
        });
    }

    // Função para minimizar o iframe e retornar à visualização padrão
    returnToMainBtn.addEventListener('click', () => {
        const fullscreenIframe = document.querySelector('iframe.fullscreen');
        if (fullscreenIframe) {
            fullscreenIframe.classList.remove('fullscreen');

            // Ocultar overlay e botões
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

    // Inicializa a lista lateral e os iframes ao carregar a página
    initializeLinkList();
    initializeIframes(siteLists[0]);
});