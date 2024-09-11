document.addEventListener("DOMContentLoaded", function () {
    const customLinksDropdown = document.getElementById("custom-links-dropdown");
    const addLinkBtn = document.getElementById("addLinkBtn");

    // Função para adicionar links personalizados ao dropdown de Links Personalizados
    function addCustomLink(linkName, linkUrl) {
        const linkContainer = document.createElement("div"); // Contêiner para o link e botão de exclusão
        linkContainer.style.display = "flex";
        linkContainer.style.alignItems = "center";

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
        });

        linkContainer.appendChild(customLink); // Adiciona o link ao contêiner
        linkContainer.appendChild(deleteButton); // Adiciona o botão de exclusão ao contêiner

        customLinksDropdown.appendChild(linkContainer); // Adiciona o contêiner ao dropdown
    }

    // Adicionando links provisórios para teste
    addCustomLink("OpenAI", "https://www.openai.com");
    addCustomLink("Google", "https://www.google.com");
    addCustomLink("Wikipedia", "https://www.wikipedia.org");

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
});