var mathFieldSpan = document.getElementById('math-field');
var MQ = MathQuill.getInterface(2);
var mathField = MQ.MathField(mathFieldSpan, config);

var config = {
  spaceBehavesLikeTab: true,
  restrictMismatchedBrackets: true,
  supSubsRequireOperand: true,
  handlers: {
    edit: function () {
      var enteredMath = mathField.latex();
      document.getElementById("question-input").value = enteredMath;
    }
  }
};

function convertToNormal(latexExpression) {
  var localMathField = MQ.MathField(mathFieldSpan, config);
  localMathField.latex(latexExpression);
  var normalExpression = localMathField.text();
  return normalExpression;
}

var latexExpression = document.getElementById("math-field").getAttribute("data-val")
var normalExpression = convertToNormal(latexExpression);

