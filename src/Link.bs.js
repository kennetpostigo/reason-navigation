'use strict';

var Curry       = require("bs-platform/lib/js/curry.js");
var React       = require("react");
var ReasonReact = require("reason-react/src/ReasonReact.js");

var component = ReasonReact.statelessComponent("Link");

function getLinkEventData($$event, history, href, target) {
  var modified = +($$event.metaKey || $$event.altKey || $$event.ctrlKey || $$event.shiftKey);
  var match = $$event.button;
  if (match !== 0) {
    return /* () */0;
  } else if (modified !== 0) {
    return /* () */0;
  } else if (target === "") {
    $$event.preventDefault();
    return Curry._1(history[/* actions */1][/* push */0], href);
  } else {
    return /* () */0;
  }
}

function make(history, href, $staropt$star, children) {
  var target = $staropt$star ? $staropt$star[0] : "";
  var newrecord = component.slice();
  newrecord[/* render */9] = (function (self) {
      var match = +(self[/* state */2] === /* () */0);
      if (match !== 0) {
        return React.createElement("a", {
                    href: href,
                    onClick: (function (ev) {
                        return getLinkEventData(ev, history, href, target);
                      })
                  }, children);
      } else {
        return React.createElement("a", {
                    href: href
                  }, children);
      }
    });
  return newrecord;
}

exports.component        = component;
exports.getLinkEventData = getLinkEventData;
exports.make             = make;
/* component Not a pure module */
