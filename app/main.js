// Lista de sites locais como exemplo
var sites1 = [
    { name: "Página 1", url: "/pagina1.html" }, // Exemplo de URLs locais no mesmo domínio
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

document.addEventListener("DOMContentLoaded", function () {
    const iframesContainer = document.querySelector('.iframes-container');
    const adjustZoomBtn = document.getElementById('adjust-zoom');
    const openNewTabBtn = document.getElementById('open-new-tab');
    const returnToMainBtn = document.getElementById('return-to-main');
    const overlay = document.getElementById('overlay');

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

    // Função para mostrar o tooltip
    function showTooltip(iframe) {
        const tooltip = document.createElement('div');
        tooltip.className = 'iframe-tooltip';
        tooltip.textContent = 'Mantenha o mouse por 3 segundos para expandir';
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
                
                // Expandir após 3 segundos
                expandTimeout = setTimeout(() => {
                    if (tooltip) tooltip.remove();
                    iframe.classList.add('fullscreen');

                    // Mostrar overlay e botões de controle
                    overlay.style.display = 'block';
                    openNewTabBtn.style.display = 'block';
                    returnToMainBtn.style.display = 'block';
                    openNewTabBtn.dataset.url = iframe.dataset.url;
                    isFullscreen = true;
                }, 3000);
            }
        });

        // Ocultar o tooltip e cancelar a expansão se o mouse sair antes dos 3 segundos
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

    // Inicializa os iframes ao carregar a página
    initializeIframes(siteLists[0]);
});