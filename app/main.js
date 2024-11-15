const pages = [
  // Each array contains iframe URLs for one page
  ['https://example.com/1', 'https://example.com/2', 'https://example.com/3', 'https://example.com/4',
   'https://example.com/5', 'https://example.com/6', 'https://example.com/7', 'https://example.com/8',
   'https://example.com/9', 'https://example.com/10', 'https://example.com/11', 'https://example.com/12'],
  ['https://example.com/13', 'https://example.com/14', 'https://example.com/15', 'https://example.com/16']
];

let currentPage = 0;
let timer = null;
const iframeContainer = document.getElementById('iframeContainer');
const pagination = document.getElementById('pagination');

// Function to load a page of iframes
function loadPage(pageIndex) {
  iframeContainer.innerHTML = '';
  pages[pageIndex].forEach((url) => {
    const iframeWrapper = document.createElement('div');
    iframeWrapper.className = 'iframe-wrapper';

    const iframe = document.createElement('iframe');
    iframe.src = url;

    const button = document.createElement('button');
    button.textContent = 'Open in New Tab';
    button.onclick = () => window.open(url, '_blank');

    iframeWrapper.appendChild(iframe);
    iframeWrapper.appendChild(button);
    iframeContainer.appendChild(iframeWrapper);
  });
  updatePagination(pageIndex);
}

// Update pagination buttons
function updatePagination(activeIndex) {
  pagination.innerHTML = '';
  for (let i = 0; i < pages.length; i++) {
    const button = document.createElement('button');
    button.textContent = i + 1;
    button.disabled = i === activeIndex;
    button.addEventListener('click', () => {
      currentPage = i;
      loadPage(i);
    });
    pagination.appendChild(button);
  }
}

// Controls
document.getElementById('prev').addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage--;
    loadPage(currentPage);
  }
});

document.getElementById('next').addEventListener('click', () => {
  if (currentPage < pages.length - 1) {
    currentPage++;
    loadPage(currentPage);
  }
});

document.getElementById('pause').addEventListener('click', () => {
  clearInterval(timer);
  document.getElementById('pause').disabled = true;
  document.getElementById('resume').disabled = false;
});

document.getElementById('resume').addEventListener('click', () => {
  startTimer();
  document.getElementById('pause').disabled = false;
  document.getElementById('resume').disabled = true;
});

// Timer to automatically move to the next page
function startTimer() {
  timer = setInterval(() => {
    if (currentPage < pages.length - 1) {
      currentPage++;
      loadPage(currentPage);
    } else {
      clearInterval(timer);
    }
  }, 5000); // Adjust time (in ms) as needed
}

// Initialize
loadPage(currentPage);
startTimer();