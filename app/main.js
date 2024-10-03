document.addEventListener("DOMContentLoaded", function() {
    const linkList = document.getElementById('link-list');
    const iframesContainer = document.querySelector('.iframes-container');
    const openNewTabBtn = document.getElementById('open-new-tab');
    
    // Inicializa a lista de iframes para a lista de sites atual
    function initializeIframes(siteList) {
        iframesContainer.innerHTML = ''; // Limpar os iframes anteriores
        linkList.innerHTML = ''; // Limpar a lista de links anterior

        siteList.forEach((site) => {
            // Cria o wrapper do iframe
            const wrapper = document.createElement('div');
            wrapper.className = 'iframe-wrapper';
            
            // Título do site
            const title = document.createElement('div');
            title.className = 'site-title';
            title.textContent = site.name;

            // Iframe
            const iframe = document.createElement('iframe');
            iframe.src = site.url;
            iframe.dataset.url = site.url;

            // Barra de progresso
            const progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            wrapper.appendChild(progressBar);

            wrapper.appendChild(title);
            wrapper.appendChild(iframe);
            iframesContainer.appendChild(wrapper);

            // Adiciona evento para expandir o iframe após 3 segundos de hover
            let hoverTimeout;
            iframe.addEventListener('mouseenter', () => {
                pauseInterval(); // Pausar ao interagir com iframe
                hoverTimeout = setTimeout(() => {
                    iframe.classList.add('fullscreen');
                    showOpenTabButton(site.url); // Mostrar o botão "Abrir em Nova Aba"
                }, 3000); // 3 segundos para expandir
            });

            iframe.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                iframe.classList.remove('fullscreen');
                hideOpenTabButton(); // Esconder o botão "Abrir em Nova Aba"
                resumeInterval(); // Retomar o temporizador ao sair do iframe
            });
        });
    }

    // Função para mostrar o botão "Abrir em Nova Aba"
    function showOpenTabButton(url) {
        openNewTabBtn.style.display = 'block';
        openNewTabBtn.onclick = () => window.open(url, '_blank'); // Abre o link do iframe expandido em uma nova aba
    }

    // Função para esconder o botão "Abrir em Nova Aba"
    function hideOpenTabButton() {
        openNewTabBtn.style.display = 'none';
    }

    // Atualiza os iframes com base no índice atual
    function updateIframes(siteList) {
        const iframes = document.querySelectorAll('.iframe-wrapper iframe');
        const titles = document.querySelectorAll('.iframe-wrapper .site-title');

        iframes.forEach((iframe, index) => {
            const siteIndex = (currentIndex + index) % siteList.length;
            iframe.src = siteList[siteIndex].url; // Atualiza a URL do iframe
            titles[index].textContent = siteList[siteIndex].name; // Atualiza o título
        });
    }

    // Alternar entre diferentes listas de sites
    function switchSiteList(index) {
        currentSiteListIndex = index;
        currentIndex = 0;
        initializeIframes(siteLists[currentSiteListIndex]);
        resetInterval();
    }

    // Inicializa a primeira lista de iframes
    initializeIframes(siteLists[currentSiteListIndex]);

    // Controla o tempo de troca dos iframes
    function startInterval() {
        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % siteLists[currentSiteListIndex].length;
            updateIframes(siteLists[currentSiteListIndex]);
        }, intervalTime);
    }

    function resetInterval() {
        clearInterval(interval);
        if (!isPaused) {
            startInterval();
        }
    }

    startInterval(); // Inicia o temporizador

    // Controles para alternar entre listas de sites
    const switchButtonsContainer = document.createElement('div');
    switchButtonsContainer.className = 'switch-buttons';

    siteLists.forEach((_, index) => {
        const button = document.createElement('button');
        button.textContent = `Lista ${index + 1}`;
        button.addEventListener('click', () => switchSiteList(index));
        switchButtonsContainer.appendChild(button);
    });

    document.body.appendChild(switchButtonsContainer);

    // Pausar/Retomar o temporizador
    function pauseInterval() {
        clearInterval(interval);
        isPaused = true;
    }

    function resumeInterval() {
        isPaused = false;
        startInterval();
    }
});