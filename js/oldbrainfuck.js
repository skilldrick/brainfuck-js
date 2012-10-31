var parse = (function () {
  var MAX_ITERATIONS = 100000;

  var code;
  var data;
  var input;
  var output;
  var max_i;
  var i_ptr;
  var d_ptr;
  var curr;
  var iteration;

  function assert(condition, message) {
    if (! condition) {
      throw message;
    }
  }

  function parse(codeString, inputString) {
    code = codeString.split('');
    if (inputString) {
      input = inputString.split('');
    }
    data = [];
    for (var i = 0; i < 40000; i++) {
      data[i] = 0;
    }
    max_i = code.length;
    output = [];
    i_ptr = -1;
    d_ptr = 0;
    curr = '';
    iteration = 0;

    checkSyntax();

    while (getNextInstruction()) {
      executeCurrentInstruction();
    }

    return output.join('');
  }

  function getNextInstruction(backwards) {
    iteration++;
    assert(iteration < MAX_ITERATIONS, "Maximum iteration limit hit");

    if (backwards) {
      i_ptr--;
    }
    else {
      i_ptr++;
    }
    curr = code[i_ptr];
    return curr;
  }

  function executeCurrentInstruction() {
    switch (curr) {
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
    if (data[d_ptr]) {
      return;
    }

    var counter = 0;
    while (true) {
      getNextInstruction();
      if (curr === '[') {
        counter++;
      }
      else if (curr === ']') {
        counter--;
        if (counter === 0) {
          break;
        }
      }
    }
  }

  function closeLoop() {
    if (data[d_ptr] === 0) {
      return;
    }

    var counter = 1;
    while (true) {
      getNextInstruction(true);
      assert(i_ptr >= 0, "Mismatched brackets");
      if (curr === ']') {
        counter++;
      }
      else if (curr === '[') {
        counter--;
        if (counter === 0) {
          break;
        }
      }
    }
  }

  function readInput() {
    var c = input.shift();
    if (c && c.charCodeAt) {
      data[d_ptr] = c.charCodeAt(0);
    }
    else {
      //if no input leave cell unchanged
    }
  }

  function writeOutput() {
    output.push(String.fromCharCode(data[d_ptr]));
  }

  function incData() {
    data[d_ptr]++;
  }

  function decData() {
    data[d_ptr]--;
  }

  function incPointer() {
    d_ptr++;
  }

  function decPointer() {
    d_ptr--;
  }

  function checkSyntax() {
    var counter = 0;
    var c = '';
    for (var i = 0; i < max_i; i++) {
      c = code[i];
      if (c === '[') {
        counter++;
      }
      else if (c === ']') {
        counter--;
      }
    }
    assert(counter === 0, 'Mismatched brackets');
  }

  return parse;
})();


$(document).ready(function () {
  function makeUrl() {
    var code = $('#code').val() || '';
    var input = $('#input').val() || '';
    var url = 'http://skilldrick.co.uk/brainfuck/';
    url += '?code=' + code;
    url += '&input=' + encodeURIComponent(input);
    $('#url').attr('href', url);
  }

  var queryString = window.location.search.substring(1);
  var paramsArray = queryString.split('&');
  var params = {};
  for (var i = 0; i < paramsArray.length; i++) {
    var param = paramsArray[i].split('=');
    params[param[0]] = decodeURI(param[1]);
  }

  $('#code').val(params.code);
  $('#input').val(params.input);
  makeUrl();


  $('#code, #input').change(function () {
    makeUrl();
  });

  $('form').submit(function (e) {
    e.preventDefault();
    var code = $('#code').val();
    var input = $('#input').val();
    var output = '';
    var escaped = '';
    try {
      output = parse(code, input);
    }
    catch (e) {
      output = e;
    }
    //escaped = output.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    $('#output').text(output);
  });
});

var output = parse('++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.');
console.log(output);
output = parse(',[.-]', 'Z');
console.log(output);
