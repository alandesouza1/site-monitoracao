// manipulateSites.js

// Função para obter um grupo de sites por nome
function getSiteGroup(groupName) {
  switch (groupName) {
    case 'Grupo VIP':
      return sitesVips;
    case 'Grupo 1':
      return sitesTestGroup1;
    case 'Grupo 2':
      return sitesTestGroup2;
    default:
      return [];
  }
}
