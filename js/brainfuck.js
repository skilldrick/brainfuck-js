var parse = (function () {

  var OP_REGEX = /<|>|\+|-|\.|,/;
  var chars;

  function program() {
    var prog = [];

    while (chars.length > 0) {
      if (chars[0].match(OP_REGEX)) {
        prog.push(chars.shift());
      } else if (chars[0] == '[') {
        prog.push(loop());
      } else if (chars[0] == ']') {
        throw "Missing opening bracket";
      }
    }

    return prog;
  }

  function loop() {
    var lp = [];
    chars.shift(); //discard '['
    while (chars[0] != ']') {
      if (chars[0] == undefined) {
        throw "Missing closing bracket";
      }
      else if (chars[0].match(OP_REGEX)) {
        lp.push(chars.shift());
      } else if (chars[0] == '[') {
        lp.push(loop());
      } else {
        throw "Invalid character: " + chars[0];
      }
    }
    chars.shift(); //discard ']'
    return lp;
  }

  function parse(str) {
    chars = str.split('');
    return program();
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
    var output;
    try {
      output = parse(code, input);
    }
    catch (e) {
      output = e;
    }
    $('#output').text(output);
  });
});
var output = parse('++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.');
console.log(output);
output = parse(',[.-]', 'Z');
console.log(output);
