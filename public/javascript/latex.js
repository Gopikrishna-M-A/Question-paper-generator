// var mathFieldSpan = document.getElementById('math-field');
// var MQ = MathQuill.getInterface(2);
// var mathField = MQ.MathField(mathFieldSpan, config);

// var config = {
//   spaceBehavesLikeTab: true,
//   restrictMismatchedBrackets: true,
//   supSubsRequireOperand: true,
//   handlers: {
//     edit: function () {
//       var enteredMath = mathField.latex();
//       document.getElementById("question-input").value = enteredMath;
//     }
//   }
// };

// function convertToNormal(latexExpression) {
//   var localMathField = MQ.MathField(mathFieldSpan, config);
//   localMathField.latex(latexExpression);
//   var normalExpression = localMathField.text();
//   return normalExpression;
// }

// var latexExpression = document.getElementById("math-field").getAttribute("data-val")
// var normalExpression = convertToNormal(latexExpression);





var mathFieldSpans = document.getElementsByClassName('math-field');
var MQ = MathQuill.getInterface(2);

var config = {
  spaceBehavesLikeTab: true,
  restrictMismatchedBrackets: true,
  supSubsRequireOperand: true,
  handlers: {
    edit: function () {
      var enteredMath = mathField.latex();
      var questionIndex = this.getAttribute('data-index');
      document.getElementById("id-" + questionIndex).textContent = enteredMath;
    }
  }
};

Array.from(mathFieldSpans).forEach(function(mathFieldSpan, index) {
  var mathField = MQ.MathField(mathFieldSpan, config);
  mathFieldSpan.setAttribute('data-index', index);
});