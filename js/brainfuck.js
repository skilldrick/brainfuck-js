var BF = (function () {
  var bf = {};

  function assert(condition, message) {
    if (! condition) {
      throw message;
    }
  }

  function parse(code, input) {
    bf.code = code.split('');
    if (input) {
      bf.input = input.split('');
    }
    bf.data = [];
    for (var i = 0; i < 40000; i++) {
      bf.data[i] = 0;
    }
    bf.max_d = bf.data.length;
    bf.max_i = bf.code.length;
    bf.output = [];
    bf.i_ptr = -1;
    bf.d_ptr = 0;
    bf.curr = '';
    bf.iteration = 0;
    bf.max_iterations = 100000;

    checkSyntax();

    while (getNextInstruction()) {
      executeCurrentInstruction();
    }

    return bf.output.join('');
  }

  function getNextInstruction(backwards) {
    bf.iteration++;
    assert(bf.iteration < bf.max_iterations, "Maximum iteration limit hit");

    if (backwards) {
      bf.i_ptr--;
    }
    else {
      bf.i_ptr++;
    }
    bf.curr = bf.code[bf.i_ptr];
    return bf.curr;
  }

  function executeCurrentInstruction() {
    switch (bf.curr) {
    case ',':
      readInput();
      break;
    case '.':
      writeOutput();
      break;
    case '+':
      incData();
      break;
    case '-':
      decData();
      break;
    case '>':
      incPointer();
      break;
    case '<':
      decPointer();
      break;
    case '[':
      openLoop();
      break;
    case ']':
      closeLoop();
      break;
    }
  }

  function openLoop() {
    if (bf.data[bf.d_ptr]) {
      return;
    }

    var counter = 0;
    while (true) {
      getNextInstruction();
      if (bf.curr === '[') {
        counter++;
      }
      else if (bf.curr === ']') {
        counter--;
        if (counter === 0) {
          break;
        }
      }
    }
  }

  function closeLoop() {
    if (bf.data[bf.d_ptr] === 0) {
      return;
    }

    var counter = 1;
    while (true) {
      getNextInstruction(true);
      assert(bf.i_ptr >= 0, "Mismatched brackets");
      if (bf.curr === ']') {
        counter++;
      }
      else if (bf.curr === '[') {
        counter--;
        if (counter === 0) {
          break;
        }
      }
    }
  }

  function readInput() {
    var c = bf.input.shift();
    if (c && c.charCodeAt) {
      bf.data[bf.d_ptr] = c.charCodeAt(0);
    }
    else {
      //if no input leave cell unchanged
    }
  }

  function writeOutput() {
    bf.output.push(String.fromCharCode(bf.data[bf.d_ptr]));
  }

  function incData() {
    bf.data[bf.d_ptr]++;
  }

  function decData() {
    bf.data[bf.d_ptr]--;
  }

  function incPointer() {
    bf.d_ptr++;
  }

  function decPointer() {
    bf.d_ptr--;
  }

  function checkSyntax() {
    var counter = 0;
    var c = '';
    for (var i = 0; i < bf.max_i; i++) {
      c = bf.code[i];
      if (c === '[') {
        counter++;
      }
      else if (c === ']') {
        counter--;
      }
    }
    assert(counter === 0, 'Mismatched brackets');
  }

  bf.parse = parse;
  return bf;
})();


$(document).ready(function () {
  var queryString = window.location.search.substring(1);
  var paramsArray = queryString.split('&');
  var params = {};
  for (var i = 0; i < paramsArray.length; i++) {
    var param = paramsArray[i].split('=');
    params[param[0]] = decodeURI(param[1]);
  }

  $('#code').val(params.code);
  $('#input').val(params.input);

  $('form').submit(function (e) {
    e.preventDefault();
    var code = $('#code').val();
    var input = $('#input').val();
    var output = '';
    try {
      output = BF.parse(code, input);
    }
    catch (e) {
      output = e;
    }
    $('#output').html(output);
  });
});

/*
var output = BF.parse('++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.');
console.log(output);
output = BF.parse(',[.-]', 'Z');
console.log(output);
*/
