var parse = (function () {
  var input;
  var output;
  var data;
  var ptr;
  var debug = false;

  var ops = {
    '+': function () {
      data[ptr] = data[ptr] || 0;
      data[ptr]++;
      debug && console.log('+', data[ptr], ptr);
    },

    '-': function () {
      data[ptr] = data[ptr] || 0;
      data[ptr]--;
      debug && console.log('-', data[ptr], ptr);
    },

    '<': function () {
      ptr--;
      if (ptr < 0) {
        ptr = 0; //Don't allow pointer to leave data array
      }
      debug && console.log('<', ptr);
    },

    '>': function () {
      ptr++;
      debug && console.log('>', ptr);
    },

    '.': function () {
      var c = String.fromCharCode(data[ptr]);
      output.push(c);
      debug && console.log('.', c, data[ptr]);
    },

    ',': function () {
      var c = input.shift();
      if (typeof c == "string") {
        data[ptr] = c.charCodeAt(0);
      }
      debug && console.log(',', c, data[ptr]);
    },
  };

  function program(nodes) {
    return function (inputString) {
      output = [];
      data = [];
      ptr = 0;

      input = inputString && inputString.split('') || [];

      nodes.forEach(function (node) {
        node();
      });

      return output.join('');
    }
  }

  function loop(nodes) {
    return function () {
      while(data[ptr] > 0) {
        nodes.forEach(function (node) {
          node();
        });
      }
    };
  }



  var OP_REGEX = /<|>|\+|-|\.|,/;
  var chars;

  function parseProgram() {
    var nodes = [];
    var nextChar;

    while (chars.length > 0) {
      nextChar = chars.shift();
      if (ops[nextChar]) {
        nodes.push(ops[nextChar]);
      } else if (nextChar == '[') {
        nodes.push(parseLoop());
      } else if (nextChar == ']') {
        throw "Missing opening bracket";
      } else {
        // ignore it
      }
    }

    return program(nodes);
  }

  function parseLoop() {
    var nodes = [];
    var nextChar;

    while (chars[0] != ']') {
      nextChar = chars.shift();
      if (nextChar == undefined) {
        throw "Missing closing bracket";
      } else if (ops[nextChar]) {
        nodes.push(ops[nextChar]);
      } else if (nextChar == '[') {
        nodes.push(parseLoop());
      } else {
        throw "Invalid character: " + nextChar;
      }
    }
    chars.shift(); //discard ']'

    return loop(nodes);
  }

  function parse(str) {
    chars = str.split('');
    return parseProgram();
  }

  return parse;
})();


function run(code, input) {
  return parse(code)(input);
}


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
    var output;
    try {
      output = run(code, input);
    }
    catch (e) {
      output = e;
    }
    $('#output').text(output);
  });
});

var output = run('++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.');
console.log(output);
output = run(',[.-]', 'Z');
console.log(output);
