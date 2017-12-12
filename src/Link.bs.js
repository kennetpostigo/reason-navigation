'use strict';

var Curry       = require("bs-platform/lib/js/curry.js");
var React       = require("react");
var ReasonReact = require("reason-react/src/ReasonReact.js");

var component = ReasonReact.statelessComponent("Link");

function make(history, href, $staropt$star, style, children) {
  var target = $staropt$star ? $staropt$star[0] : "";
  var newrecord = component.slice();
  newrecord[/* render */9] = (function () {
      return React.createElement("a", {
                  style: style,
                  href: href,
                  onClick: (function (ev) {
                      var $$event = ev;
                      var history$1 = history;
                      var href$1 = href;
                      var target$1 = target;
                      var modified = +($$event.metaKey || $$event.altKey || $$event.ctrlKey || $$event.shiftKey);
                      var match = $$event.button;
                      if (match !== 0) {
                        return /* () */0;
                      } else if (modified !== 0) {
                        return /* () */0;
                      } else if (target$1 === "") {
                        $$event.preventDefault();
                        return Curry._1(history$1[/* actions */1][/* push */0], href$1);
                      } else {
                        return /* () */0;
                      }
                    })
                }, children);
    });
  return newrecord;
}

exports.make = make;
/* component Not a pure module */
