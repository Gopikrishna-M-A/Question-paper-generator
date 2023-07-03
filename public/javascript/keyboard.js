var mathFieldSpan = document.getElementById('math-field');
var MQ = MathQuill.getInterface(2);

let config = {
  spaceBehavesLikeTab: true,
  restrictMismatchedBrackets: true,
  supSubsRequireOperand: true,
  handlers: {
      edit: function () { // useful event handlers
          var enteredMath = mathField.latex(); // Get entered math in LaTeX format
          document.getElementById("question-input").value = enteredMath
          console.log(enteredMath);
      }
  }
};

mathField = MQ.MathField(mathFieldSpan, config);

document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    mathField.cmd('\\space');
    event.preventDefault(); // Prevent the default space bar behavior
  }
});

function input(str) {
  mathField.cmd(str);
  mathField.focus();
}






// var mathField;
// let mathFieldSpan = document.getElementById('math-field');

// let MQ = MathQuill.getInterface(2); 

// mathField = MQ.MathField(mathFieldSpan, config);