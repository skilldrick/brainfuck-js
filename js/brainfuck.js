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
