'use strict';

var Curry                  = require("bs-platform/lib/js/curry.js");
var ReasonReact            = require("reason-react/src/ReasonReact.js");
var Match$ReasonNavigation = require("./Match.bs.js");

var component = ReasonReact.statelessComponent("Route");

function make(history, path, render, _) {
  var newrecord = component.slice();
  newrecord[/* didMount */4] = (function () {
      var match = Match$ReasonNavigation.matchPath(history[/* state */0][/* path */0], path);
      if (match) {
        var match$1 = Match$ReasonNavigation.parseUrl(match[0][1]);
        Curry._3(history[/* actions */1][/* updateMatch */2], match$1[/* search */0], match$1[/* hash */1], match$1[/* params */2]);
      }
      return /* NoUpdate */0;
    });
  newrecord[/* render */9] = (function () {
      var match = Match$ReasonNavigation.matchPath(history[/* state */0][/* path */0], path);
      if (match) {
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
