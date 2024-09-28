Sim, o comportamento que você está descrevendo pode ser resolvido utilizando o LocalStorage do navegador para salvar os links adicionados, de modo que eles permaneçam disponíveis mesmo após o fechamento e reabertura do site.

Aqui está como você pode modificar o código para salvar e carregar os links personalizados utilizando LocalStorage:

1. Salvar os links no LocalStorage

Toda vez que você adicionar um link, ele será salvo no LocalStorage.

function addCustomLink(linkName, linkUrl) {
  // Cria um objeto com o nome e a URL do link
  const customLink = { name: linkName, url: linkUrl };

  // Obtém os links armazenados no LocalStorage, ou inicia um array vazio se não houver nenhum
  let links = JSON.parse(localStorage.getItem("customLinks")) || [];

  // Adiciona o novo link ao array
  links.push(customLink);

  // Salva o array atualizado no LocalStorage
  localStorage.setItem("customLinks", JSON.stringify(links));

  // Atualiza a interface com o novo link
  renderLinks();
}

2. Carregar os links do LocalStorage

Quando a página for carregada ou recarregada, você pode carregar os links armazenados no LocalStorage e mostrá-los na interface.

function loadCustomLinks() {
  // Obtém os links armazenados no LocalStorage
  let links = JSON.parse(localStorage.getItem("customLinks")) || [];

  // Carrega os links na interface
  renderLinks();
}

function renderLinks() {
  const linkContainer = document.getElementById("linkContainer");
  linkContainer.innerHTML = ''; // Limpa o conteúdo anterior

  // Obtém os links armazenados no LocalStorage
  let links = JSON.parse(localStorage.getItem("customLinks")) || [];

  // Cria os elementos para os links e os adiciona ao container
  links.forEach(link => {
    const linkElement = document.createElement("a");
    linkElement.href = link.url;
    linkElement.textContent = link.name;
    linkElement.target = "_blank"; // Para abrir em uma nova aba
    linkContainer.appendChild(linkElement);
  });
}

3. Carregar links automaticamente ao abrir a página

Você pode utilizar o evento DOMContentLoaded para garantir que os links sejam carregados assim que a página for carregada.

document.addEventListener("DOMContentLoaded", function () {
  loadCustomLinks();
});

4. Exemplo Completo

Aqui está o exemplo completo que implementa a funcionalidade de salvar e carregar links:

<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gerenciador de Links</title>
</head>
<body>
  <h1>Gerenciador de Links</h1>

  <div>
    <input type="text" id="linkName" placeholder="Nome do Link">
    <input type="text" id="linkUrl" placeholder="URL do Link">
    <button id="addLinkBtn">Adicionar Link</button>
  </div>

  <div id="linkContainer"></div>

  <script>
    // Função para adicionar link personalizado
    function addCustomLink(linkName, linkUrl) {
      const customLink = { name: linkName, url: linkUrl };
      let links = JSON.parse(localStorage.getItem("customLinks")) || [];
      links.push(customLink);
      localStorage.setItem("customLinks", JSON.stringify(links));
      renderLinks();
    }

    // Função para carregar os links do LocalStorage
    function loadCustomLinks() {
      renderLinks();
    }

    // Função para renderizar os links na interface
    function renderLinks() {
      const linkContainer = document.getElementById("linkContainer");
      linkContainer.innerHTML = '';
      let links = JSON.parse(localStorage.getItem("customLinks")) || [];
      links.forEach(link => {
        const linkElement = document.createElement("a");
        linkElement.href = link.url;
        linkElement.textContent = link.name;
        linkElement.target = "_blank";
        linkContainer.appendChild(linkElement);
      });
    }

    // Evento de adicionar link
    document.getElementById("addLinkBtn").addEventListener("click", function () {
      const linkName = document.getElementById("linkName").value;
      const linkUrl = document.getElementById("linkUrl").value;

      if (linkName && linkUrl) {
        addCustomLink(linkName, linkUrl);
        alert("Link adicionado com sucesso!");
      } else {
        alert("Por favor, insira um nome e uma URL válidos.");
      }
    });

    // Carrega os links quando a página é carregada
    document.addEventListener("DOMContentLoaded", function () {
      loadCustomLinks();
    });
  </script>
</body>
</html>

Como isso resolve o problema:

Persistência dos dados: O LocalStorage é utilizado para armazenar os links de forma persistente, garantindo que os links adicionados permaneçam mesmo após fechar ou recarregar a página.

Fácil de usar: Cada vez que um link é adicionado, ele é salvo no LocalStorage e exibido automaticamente.


Se precisar de mais alguma otimização ou outra funcionalidade, estou à disposição!


---

Hotkeys:

W: Sim, continue

T: Testar código

S: Explicação linha por linha

F: Corrigir


<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gerenciador de Links com LocalStorage</title>
</head>
<body>
  <h1>Gerenciador de Links</h1>

  <div>
    <input type="text" id="linkName" placeholder="Nome do Link">
    <input type="text" id="linkUrl" placeholder="URL do Link">
    <button id="addLinkBtn">Adicionar Link</button>
  </div>

  <div id="linkContainer"></div>

  <script>
    // Função para adicionar link personalizado e salvar no LocalStorage
    function addCustomLink(linkName, linkUrl) {
      const customLink = { name: linkName, url: linkUrl };

      // Obtém os links armazenados no LocalStorage, ou inicia um array vazio
      let links = JSON.parse(localStorage.getItem("customLinks")) || [];

      // Adiciona o novo link ao array
      links.push(customLink);

      // Salva o array atualizado no LocalStorage
      localStorage.setItem("customLinks", JSON.stringify(links));

      // Atualiza a interface com o novo link
      renderLinks();
    }

    // Função para carregar e renderizar os links na interface
    function loadCustomLinks() {
      // Obtém os links armazenados no LocalStorage
      let links = JSON.parse(localStorage.getItem("customLinks")) || [];
      renderLinks(links);
    }

    function renderLinks(links) {
      const linkContainer = document.getElementById("linkContainer");
      linkContainer.innerHTML = ''; // Limpa o container antes de renderizar

      // Renderiza os links
      links.forEach(link => {
        const linkElement = document.createElement("a");
        linkElement.href = link.url;
        linkElement.textContent = link.name;
        linkElement.target = "_blank";
        linkContainer.appendChild(linkElement);
      });
    }

    // Adiciona evento de clique no botão de adicionar link
    document.getElementById("addLinkBtn").addEventListener("click", function () {
      const linkName = document.getElementById("linkName").value;
      const linkUrl = document.getElementById("linkUrl").value;

      if (linkName && linkUrl) {
        addCustomLink(linkName, linkUrl);
        alert("Link adicionado com sucesso!");
      } else {
        alert("Por favor, insira um nome e uma URL válidos.");
      }
    });

    // Carrega os links ao carregar a página
    document.addEventListener("DOMContentLoaded", function () {
      loadCustomLinks();
    });
  </script>
</body>
</html>

