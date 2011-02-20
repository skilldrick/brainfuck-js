var BF = function (code, input) {
  var code = code.split('');
  if (input) {
    var input = input.split('');
  }
  var data = [];
  for (var i = 0; i < 1000; i++) {
    data[i] = 0;
  }
  var output = [];
  var i_ptr = -1;
  var d_ptr = 0;
  var curr = '';

  function getNextInstruction(backwards) {
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
      else if (c === ']') {
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
    data[d_ptr] = input.shift().charCodeAt(0);
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

  while (getNextInstruction()) {
    executeCurrentInstruction();
  }

  console.log(output.join(''));
}

BF('++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.', '');
