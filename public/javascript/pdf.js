const paper1 = document.getElementById("paper1")
const A4 = document.getElementById("a4")

function generatePdf(){
// HTML content to convert
const htmlContent = A4.innerHTML;
console.log( A4.innerHTML);
// Convert HTML to DOC
const docxContent = htmlDocx.asBlob(htmlContent);

// Create a download link for the DOC file
const downloadLink = document.createElement('a');
downloadLink.href = window.URL.createObjectURL(docxContent);
downloadLink.download = 'document.docx';

// Trigger the download
downloadLink.click();

  } 

  console.log("hello");