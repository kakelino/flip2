const url = 'code1.pdf'; // Replace with your actual PDF file path
let pdf = null;
let currentPage = 1;

// Load the PDF and initialize navigation
pdfjsLib.getDocument(url).promise.then(loadedPdf => {
    pdf = loadedPdf;
    renderPages(currentPage);
});

// Function to render two pages at a time
function renderPages(startPage) {
    const container = document.getElementById('pdf-container');
    container.innerHTML = ''; // Clear previous pages

    Promise.all([
        pdf.getPage(startPage),
        startPage + 1 <= pdf.numPages ? pdf.getPage(startPage + 1) : null
    ]).then(([page1, page2]) => {
        if (page1) {
            const canvas1 = renderPage(page1);
            canvas1.classList.add('fade-in'); // Add fade-in animation
            container.appendChild(canvas1);
        }
        if (page2) {
            const canvas2 = renderPage(page2);
            canvas2.classList.add('fade-in'); // Add fade-in animation
            container.appendChild(canvas2);
        }
    });
}

// Function to render a single page without mirroring
function renderPage(page) {
    const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale for clarity
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    page.render(renderContext).promise.then(() => {
        console.log('Page rendered');
    });

    return canvas;
}

// Navigation functions
function nextPages() {
    if (currentPage + 2 <= pdf.numPages) {
        currentPage += 2;
        renderPages(currentPage);
    }
}

function previousPages() {
    if (currentPage - 2 > 0) {
        currentPage -= 2;
        renderPages(currentPage);
    }
}
