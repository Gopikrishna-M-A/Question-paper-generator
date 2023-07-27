
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