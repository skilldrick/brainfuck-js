TestCase("brainfuckTest", {
  "test should pass": function () {
    assertEquals(true, true);
  },

  "test simple input": function () {
    var result = BF.parse(',+.', 'a');
    assertEquals('b', result);
  },

  "test io": function () {
    var code = ">,>+++++++++,>+++++++++++[<++++++<++++++<+>>>-]<<.>.<<-.>.>.<<.";
    var input = "\n";
    assertEquals('LK\nLK\n', BF.parse(code, input));
  }

});
