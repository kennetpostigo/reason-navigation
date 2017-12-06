'use strict';

var Block                = require("bs-platform/lib/js/block.js");
var Curry                = require("bs-platform/lib/js/curry.js");
var ReasonReact          = require("reason-react/lib/js/src/ReasonReact.js");
var CreateBrowserHistory = require("history/createBrowserHistory");

var component = ReasonReact.reducerComponent("Router");

function make($staropt$star, _) {
  var history = $staropt$star ? $staropt$star[0] : CreateBrowserHistory.createHistory();
  var newrecord = component.slice();
  newrecord[/* didMount */4] = (function (param) {
      Curry._2(param[/* reduce */1], (function () {
              return /* UpdateLocation */Block.__(3, [history.location]);
            }), /* () */0);
      return /* NoUpdate */0;
    });
  newrecord[/* render */9] = (function () {
      return null;
    });
  newrecord[/* initialState */10] = (function () {
      return history.location;
    });
  newrecord[/* reducer */12] = (function (action, _) {
      if (typeof action === "number") {
        if (action) {
          return /* SideEffects */Block.__(2, [(function () {
                        return history.goForward();
                      })]);
        } else {
          return /* SideEffects */Block.__(2, [(function () {
                        return history.goBack();
                      })]);
        }
      } else {
        switch (action.tag | 0) {
          case 0 : 
              var path = action[0];
              return /* SideEffects */Block.__(2, [(function () {
                            return history.push(path);
                          })]);
          case 1 : 
              var path$1 = action[0];
              return /* SideEffects */Block.__(2, [(function () {
                            return history.replace(path$1);
                          })]);
          case 2 : 
              var n = action[0];
              return /* SideEffects */Block.__(2, [(function () {
                            return history.go(n);
                          })]);
          case 3 : 
              return /* Update */Block.__(0, [action[0]]);
          
        }
      }
    });
  return newrecord;
}

exports.component = component;
exports.make      = make;
/* component Not a pure module */
