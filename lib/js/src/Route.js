'use strict';

var Curry       = require("bs-platform/lib/js/curry.js");
var Match       = require("./Match.js");
var ReasonReact = require("reason-react/lib/js/src/ReasonReact.js");

var component = ReasonReact.statelessComponent("Route");

function make(history, path, render, _) {
  var newrecord = component.slice();
  newrecord[/* didMount */4] = (function () {
      var match = Match.matchPath(history[/* state */0][/* path */0], path);
      if (match) {
        var match$1 = match[0];
        var match$2 = Match.parseUrl(match$1[0], match$1[1], match$1[2]);
        Curry._3(history[/* actions */1][/* updateMatch */2], match$2[/* search */0], match$2[/* hash */1], match$2[/* params */2]);
      }
      return /* NoUpdate */0;
    });
  newrecord[/* render */9] = (function () {
      var match = Match.matchPath(history[/* state */0][/* path */0], path);
      var match_ = match ? /* true */1 : /* false */0;
      if (match_ !== 0) {
        return Curry._1(render, /* () */0);
      } else {
        return null;
      }
    });
  return newrecord;
}

exports.component = component;
exports.make      = make;
/* component Not a pure module */
