/* codemirror/mode/lua/lua.js */
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) define(["../../lib/codemirror"], mod);
  else mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  CodeMirror.defineMode("lua", function(config) {
    function wordRegexp(words) {
      return new RegExp("^(?:" + words.join("|") + ")\\b", "i");
    }
    var keywords = wordRegexp([
      "and", "break", "do", "else", "elseif", "end", "false",
      "for", "function", "if", "in", "local", "nil", "not", "or",
      "repeat", "return", "then", "true", "until", "while"
    ]);
    var indentTokens = wordRegexp(["do", "if", "function", "repeat"]);
    var dedentTokens = wordRegexp(["end", "until"]);
    return {
      startState: function() { return { basecol: 0, indent: 0 }; },
      token: function(stream, state) {
        if (stream.eatSpace()) return null;
        var w = stream.next();
        if (w == "--") { stream.skipToEnd(); return "comment"; }
        if (keywords.test(stream.current())) return "keyword";
        if (/\d/.test(w)) { stream.eatWhile(/[\w.]/); return "number"; }
        if (/[a-zA-Z_]/.test(w)) { stream.eatWhile(/[\w]/); return "variable"; }
        return null;
      },
      indent: function(state, textAfter) {
        if (indentTokens.test(textAfter)) state.indent += config.indentUnit;
        if (dedentTokens.test(textAfter)) state.indent -= config.indentUnit;
        return state.indent;
      }
    };
  });
  CodeMirror.defineMIME("text/x-lua", "lua");
});
