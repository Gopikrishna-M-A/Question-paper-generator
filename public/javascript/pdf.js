// // Function to trigger download
// function downloadPDF() {
//     const element = document.getElementById('a4'); // Element to be downloaded
//     const options = {
//         margin: 10,
//         filename: 'question_paper.pdf',
//         image: { type: 'jpeg', quality: 0.98 }, // Image options
//         html2canvas: { scale: 2 }, // Html2canvas options
//         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } // jsPDF options
//     };
//     html2pdf().from(element).set(options).save();
// }

// // Bind the downloadPDF function to the button click event
// $(document).ready(function() {
//     $('#generate-btn').on('click', function() {
//         downloadPDF();
//     });
// });



// pdf.js
function downloadPDF() {
    const printableHeight = 277; // Maximum height that can fit on a single A4 page (in mm)

    const element = document.getElementById('a4'); // Element containing the questions
    const options = {
        margin: 10,
        filename: 'question_paper.pdf',
        image: { type: 'jpeg', quality: 0.98 }, // Image options
        html2canvas: { scale: 2 }, // Html2canvas options
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } // jsPDF options
    };

    const divsPerPage = Math.ceil(element.clientHeight / printableHeight);
    const pageCount = Math.ceil(element.children.length / divsPerPage);

    const pages = [];
    for (let i = 0; i < pageCount; i++) {
        const start = i * divsPerPage;
        const end = (i + 1) * divsPerPage;
        const pageDivs = Array.from(element.children).slice(start, end);
        const pageContent = document.createElement('div');
        pageDivs.forEach(div => {
            pageContent.appendChild(div.cloneNode(true));
        });
        pages.push(pageContent);
    }

    const pdf = html2pdf().set(options);

    pages.forEach((page, index) => {
        pdf.from(page).toPdf().output('datauristring').then((dataUri) => {
            if (index === 0) {
                pdf.output('dataurlnewwindow');
            }
        });
    });
}
function downloadSummary() {
    const printableHeight = 277; // Maximum height that can fit on a single A4 page (in mm)

    const element = document.getElementById('summary'); // Element containing the questions
    const options = {
        margin: 10,
        filename: 'question_paper.pdf',
        image: { type: 'jpeg', quality: 0.98 }, // Image options
        html2canvas: { scale: 2 }, // Html2canvas options
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } // jsPDF options
    };

    const divsPerPage = Math.ceil(element.clientHeight / printableHeight);
    const pageCount = Math.ceil(element.children.length / divsPerPage);

    const pages = [];
    for (let i = 0; i < pageCount; i++) {
        const start = i * divsPerPage;
        const end = (i + 1) * divsPerPage;
        const pageDivs = Array.from(element.children).slice(start, end);
        const pageContent = document.createElement('div');
        pageDivs.forEach(div => {
            pageContent.appendChild(div.cloneNode(true));
        });
        pages.push(pageContent);
    }

    const pdf = html2pdf().set(options);

    pages.forEach((page, index) => {
        pdf.from(page).toPdf().output('datauristring').then((dataUri) => {
            if (index === 0) {
                pdf.output('dataurlnewwindow');
            }
        });
    });
}

$(document).ready(function() {
    $('#generate-btn').on('click', function() {
        downloadPDF();
    });
    $('#summary-btn').on('click', function() {
        downloadSummary();
    });
});
