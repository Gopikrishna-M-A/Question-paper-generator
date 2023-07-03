const addBtn = document.getElementById("addBtn")
const questionsDiv = document.querySelector('.questions');
let questionCount = 1

addBtn.addEventListener("click",(e)=>{
    const questionTemplate = document.querySelector('.question')

    const newQuestion = questionTemplate.cloneNode(true)
    const inputs = newQuestion.querySelectorAll('input')
    inputs.forEach(input => input.value = '')

    const questionNumber = questionCount + 1
    newQuestion.id = `question${questionNumber}`


    const numberDiv = newQuestion.querySelector('.number');
    numberDiv.textContent = questionNumber;

    questionsDiv.appendChild(newQuestion)
    questionCount++
})


// Assuming you have a submit button with an ID 'submitBtn'
document.getElementById('submitBtn').addEventListener('click', (event)=>{
    event.preventDefault(); // Prevent form submission
    
    // Select all the dynamically created divs with class 'question'
    var questionDivs = document.getElementsByClassName('question');
    document.getElementById("numOfQuestions").value = questionDivs.length
    // Create an empty array to store the values of the input fields
    var formData = [];
  
    // Loop through each question div
    for (var i = 0; i < questionDivs.length; i++) {
      var questionDiv = questionDivs[i];
  
      // Get the values of the input fields within the current question div
      var section = questionDiv.querySelector('.section').value;
      var mark = questionDiv.querySelector('.mark').value;
      var difficulty = questionDiv.querySelector('.Difficulty').value;
      var Cognitive = questionDiv.querySelector('.Cognitive').value;
  
      // Create an object with the input field values and push it to the formData array
      var dataObject = {
        section: section,
        mark: mark,
        level: difficulty,
        Cognitive: Cognitive
      };
      formData.push(dataObject);
    }   

    formData = JSON.stringify(formData)
    document.getElementById("form-data").value=formData
      // Send the form data to the /generate route using a POST request
      document.getElementById('generateForm').submit();

  });
  