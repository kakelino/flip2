// Include this script in your HTML file:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>

const url = 'code1.pdf'; // Replace with your PDF file path

// Load the PDF
pdfjsLib.getDocument(url).promise.then(pdf => {
    const container = document.getElementById('pdf-container');
    let renderPromises = [];
    
    // Loop through the PDF pages two at a time
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 2) {
        renderPromises.push(
            Promise.all([
                pdf.getPage(pageNum),
                pageNum + 1 <= pdf.numPages ? pdf.getPage(pageNum + 1) : null
            ]).then(([page1, page2]) => {
                renderTwoFlippedPages(page1, page2, container);
            })
        );
    }

    // Wait for all renderings to complete
    Promise.all(renderPromises).then(() => {
        console.log('All pages rendered!');
    });
});

function renderTwoFlippedPages(page1, page2, container) {
    // Create a wrapper div for the two pages
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '10px';
    wrapper.style.marginBottom = '20px';

    // Render the first page
    if (page1) {
        const canvas1 = renderFlippedPage(page1);
        wrapper.appendChild(canvas1);
    }

    // Render the second page (if exists)
    if (page2) {
        const canvas2 = renderFlippedPage(page2);
        wrapper.appendChild(canvas2);
    }

    container.appendChild(wrapper);
}

function renderFlippedPage(page) {
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Apply horizontal flip transformation
    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    // Render the page
    page.render(renderContext).promise.then(() => {
        console.log('Page rendered');
    });

    return canvas;
}
