function assert(condition, message) {
  if (! condition) {
    throw message;
  }
}

var BF = (function () {
  var that = {};

  function init(code, input) {
    that.code = code.split('');
    if (input) {
      that.input = input.split('');
    }
    that.data = [];
    for (var i = 0; i < 10000; i++) {
      that.data[i] = 0;
    }
    that.max_d = that.data.length;
    that.max_i = that.code.length;
    that.output = [];
    that.i_ptr = -1;
    that.d_ptr = 0;
    that.curr = '';

    checkSyntax();

    while (getNextInstruction()) {
      executeCurrentInstruction();
    }

    console.log(that.output.join(''));
  }

  function getNextInstruction(backwards) {
    if (backwards) {
      that.i_ptr--;
    }
    else {
      that.i_ptr++;
    }
    that.curr = that.code[that.i_ptr];
    return that.curr;
  }

  function executeCurrentInstruction() {
    switch (that.curr) {
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
    if (that.data[that.d_ptr]) {
      return;
    }

    var counter = 0;
    while (true) {
      getNextInstruction();
      if (that.curr === '[') {
        counter++;
      }
      else if (that.curr === ']') {
        counter--;
        if (counter === 0) {
          break;
        }
      }
    }
  }

  function closeLoop() {
    if (that.data[that.d_ptr] === 0) {
      return;
    }

    var counter = 1;
    while (true) {
      getNextInstruction(true);
      assert(that.i_ptr >= 0, "Mismatched brackets");
      if (that.curr === ']') {
        counter++;
      }
      else if (that.curr === '[') {
        counter--;
        if (counter === 0) {
          break;
        }
      }
    }
  }

  function readInput() {
    var c = that.input.shift();
    if (c && c.charCodeAt) {
      that.data[that.d_ptr] = c.charCodeAt(0);
    }
    else {
      //if no input just insert 0
      that.data[that.d_ptr] = 0;
    }
  }

  function writeOutput() {
    that.output.push(String.fromCharCode(that.data[that.d_ptr]));
  }

  function incData() {
    that.data[that.d_ptr]++;
  }

  function decData() {
    that.data[that.d_ptr]--;
  }

  function incPointer() {
    that.d_ptr++;
  }

  function decPointer() {
    that.d_ptr--;
  }

  function checkSyntax() {
    var counter = 0;
    var c = '';
    for (var i = 0; i < that.max_i; i++) {
      c = that.code[i];
      if (c === '[') {
        counter++;
      }
      else if (c === ']') {
        counter--;
      }
    }
    assert(counter === 0, 'Mismatched brackets');
  }

  that.init = init;
  return that;
})();

BF.init('++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.');
BF.init(',[.-]', 'Z');
