<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dropdown de Links Aleatórios</title>
</head>
<body>

  <div>
    <button id="addLinkBtn">Adicionar Link</button>
    <div id="customLinksDropdown"></div>
  </div>

  <script>
    const customLinksDropdown = document.getElementById("customLinksDropdown");
    const addLinkBtn = document.getElementById("addLinkBtn");

    // Função para adicionar um link personalizado ao dropdown e ao localStorage
    function addCustomLink(linkName, linkUrl) {
      const customLink = document.createElement("a");
      customLink.href = linkUrl;
      customLink.textContent = linkName;
      customLink.target = "_blank"; // Abre o link em nova aba

      customLinksDropdown.appendChild(customLink);

      // Salvar o link no localStorage
      saveLinkToStorage(linkName, linkUrl);
    }

    // Função para salvar links no localStorage
    function saveLinkToStorage(linkName, linkUrl) {
      // Recuperar os links já salvos
      let savedLinks = JSON.parse(localStorage.getItem("customLinks")) || [];

      // Adicionar o novo link
      savedLinks.push({ name: linkName, url: linkUrl });

      // Salvar novamente no localStorage
      localStorage.setItem("customLinks", JSON.stringify(savedLinks));
    }

    // Função para carregar os links salvos do localStorage
    function loadLinksFromStorage() {
      const savedLinks = JSON.parse(localStorage.getItem("customLinks")) || [];
      savedLinks.forEach(link => addCustomLink(link.name, link.url));
    }

    // Evento para adicionar um link personalizado ao clicar no botão "Adicionar Link"
    addLinkBtn.addEventListener("click", function () {
      const linkName = prompt("Insira o nome do link:");
      const linkUrl = prompt("Insira a URL do link:");

      if (linkName && linkUrl) {
        addCustomLink(linkName, linkUrl);
        alert("Link adicionado com sucesso!");
      } else {
        alert("Por favor, insira um nome e uma URL válidos.");
      }
    });

    // Carregar os links salvos ao carregar a página
    loadLinksFromStorage();
  </script>

</body>
</html>