var imageRadio = document.getElementById("img");
var image = document.getElementById("image");

imageRadio.addEventListener("change", function() {
  image.style.display = this.checked ? "block" : "none";
});


var tableRadio = document.getElementById("table");
var table = document.getElementById("table-wrap");







var tableWrapper = document.getElementById("table-wrap");



tableRadio.addEventListener("change", function() {
  // table.style.display = this.checked ? "block" : "none";

  const numRows = document.getElementById("t-row").value
  const numCols = document.getElementById("t-col").value

  var table = document.createElement("table");
  table.setAttribute("id","tableID")


  var headerRow = document.createElement("tr");

for (var j = 0; j < numCols; j++) {
  var headerCell = document.createElement("th");
  headerCell.className = "table-h-row";
  headerCell.contentEditable = true;
  headerCell.textContent = "input";
  headerRow.appendChild(headerCell);
}

table.appendChild(headerRow);

// Create the table rows and columns dynamically
for (var i = 1; i < numRows; i++) {
  var row = document.createElement("tr");

  for (var j = 0; j < numCols; j++) {
    var cell = document.createElement("td");
    cell.className = "table-d-row";
    cell.contentEditable = true;
    cell.textContent = "input";
    row.appendChild(cell);
  }

  table.appendChild(row);
}

// Remove any existing table elements
while (tableWrapper.firstChild) {
  tableWrapper.firstChild.remove();
}
var saveBtn = document.createElement("div")
saveBtn.classList.add("btn","save")
saveBtn.setAttribute("id","save-btn")
saveBtn.innerHTML = "SAVE"

saveBtn.addEventListener("click",(e)=>{
  console.log("clicked");

  var tableData = []; // Array to store table values
  
  // Get the table element
  var table = document.getElementById("tableID");
  
  // Get all rows from the table except the header row
  var rows = table.getElementsByTagName("tr");

  // Iterate over rows
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var rowData = {}; // Object to store row values
    
    // Get all cells in the row
    var cells = row.getElementsByTagName("td");
    
    // Iterate over cells and retrieve values
    for (var j = 0; j < cells.length; j++) {
      var cell = cells[j];
      
      // Get the header value for the corresponding cell
      var headerValue = table.rows[0].cells[j].textContent.trim();
      
      // Get the cell value and add it to the row data object
      rowData[headerValue] = cell.textContent.trim()


    }
    
    // Add the row data to the tableData array
    tableData.push(rowData);
  }
    tableData.reverse();  
    const data = document.getElementById("table-data")
    tableData = JSON.stringify(tableData)
    data.value = tableData

  
  console.log(tableData);

})

// Append the new table to the table wrapper
tableWrapper.appendChild(table);
tableWrapper.appendChild(saveBtn);

  
});



// const equationEditorElement = document.getElementById('equation-editor');
// const equationEditor = MathQuill.getInterface(2).MathField(equationEditorElement);
// const equation = equationEditor.latex();
// console.log(equation); // Print the equation in LaTeX format
