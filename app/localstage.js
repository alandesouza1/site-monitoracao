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
    <div id="custom-links-dropdown" class="dropdown-content"></div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", function () {
      const customLinksDropdown = document.getElementById("custom-links-dropdown");
      const addLinkBtn = document.getElementById("addLinkBtn");

      // Função para adicionar links personalizados ao dropdown de Links Aleatórios
      function addCustomLink(linkName, linkUrl) {
        const linkContainer = document.createElement("div"); // Contêiner para o link e botão de exclusão
        linkContainer.style.display = "flex";
        linkContainer.style.alignItems = "center";
        linkContainer.style.marginBottom = "5px"; // Espaçamento entre links

        const customLink = document.createElement("a");
        customLink.href = linkUrl;
        customLink.textContent = linkName;
        customLink.target = "_blank"; // Abre o link em uma nova aba
        customLink.style.flexGrow = "1"; // O link ocupará o espaço disponível

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.style.marginLeft = "10px";
        deleteButton.style.backgroundColor = "#ff0000";
        deleteButton.style.color = "#fff";
        deleteButton.style.border = "none";
        deleteButton.style.cursor = "pointer";

        // Função para excluir o link
        deleteButton.addEventListener("click", function () {
          linkContainer.remove(); // Remove o contêiner (e o link)
          removeLinkFromStorage(linkName, linkUrl);
        });

        linkContainer.appendChild(customLink); // Adiciona o link ao contêiner
        linkContainer.appendChild(deleteButton); // Adiciona o botão de exclusão ao contêiner

        customLinksDropdown.appendChild(linkContainer); // Adiciona o contêiner ao dropdown
      }

      // Função para salvar links no localStorage
      function saveLinkToStorage(linkName, linkUrl) {
        let savedLinks = JSON.parse(localStorage.getItem("customLinks")) || [];

        // Adicionar o novo link
        savedLinks.push({ name: linkName, url: linkUrl });

        // Salvar novamente no localStorage
        localStorage.setItem("customLinks", JSON.stringify(savedLinks));
      }

      // Função para remover um link do localStorage
      function removeLinkFromStorage(linkName, linkUrl) {
        let savedLinks = JSON.parse(localStorage.getItem("customLinks")) || [];
        
        // Filtrar para manter apenas os links diferentes do que será removido
        savedLinks = savedLinks.filter(link => link.name !== linkName || link.url !== linkUrl);

        // Atualizar o localStorage
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
          saveLinkToStorage(linkName, linkUrl);
          alert("Link adicionado com sucesso!");
        } else {
          alert("Por favor, insira um nome e uma URL válidos.");
        }
      });

      // Carregar os links salvos ao carregar a página
      loadLinksFromStorage();
    });
  </script>
</body>
</html>