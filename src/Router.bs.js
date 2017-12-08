'use strict';

var Block                = require("bs-platform/lib/js/block.js");
var Curry                = require("bs-platform/lib/js/curry.js");
var Caml_array           = require("bs-platform/lib/js/caml_array.js");
var ReasonReact          = require("reason-react/src/ReasonReact.js");
var CreateBrowserHistory = require("history/createBrowserHistory");

var component = ReasonReact.reducerComponent("Router");

function make($staropt$star, children) {
  var history = $staropt$star ? $staropt$star[0] : CreateBrowserHistory.default();
  var newrecord = component.slice();
  newrecord[/* didMount */4] = (function (param) {
      var reduce = param[/* reduce */1];
      var unsub = history.listen((function ($$location) {
              Curry._2(reduce, (function () {
                      return /* UpdatePath */Block.__(3, [$$location.pathname]);
                    }), /* () */0);
              return /* () */0;
            }));
      Curry._2(reduce, (function () {
              return /* SetUnlisten */Block.__(5, [unsub]);
            }), /* () */0);
      return /* NoUpdate */0;
    });
  newrecord[/* willUnmount */6] = (function (self) {
      return self[/* state */2][/* unlisten */4]();
    });
  newrecord[/* render */9] = (function (param) {
      var reduce = param[/* reduce */1];
      return Curry._1(Caml_array.caml_array_get(children, 0), /* record */[
                  /* state */param[/* state */2],
                  /* actions : record */[
                    /* push */(function (path) {
                        return Curry._2(reduce, (function () {
                                      return /* Push */Block.__(0, [path]);
                                    }), /* () */0);
                      }),
                    /* replace */(function (path) {
                        return Curry._2(reduce, (function () {
                                      return /* Replace */Block.__(1, [path]);
                                    }), /* () */0);
                      }),
                    /* updateMatch */(function (search, hash, params) {
                        return Curry._2(reduce, (function () {
                                      return /* UpdateMatch */Block.__(4, [
                                                search,
                                                hash,
                                                params
                                              ]);
                                    }), /* () */0);
                      })
                  ]
                ]);
    });
  newrecord[/* initialState */10] = (function () {
      return /* record */[
              /* path */history.location.pathname,
              /* search */"",
              /* hash */"",
              /* params */{ },
              /* unlisten */(function () {
                  return /* () */0;
                })
            ];
    });
  newrecord[/* reducer */12] = (function (action, state) {
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
              return /* Update */Block.__(0, [/* record */[
                          /* path */action[0],
                          /* search */state[/* search */1],
                          /* hash */state[/* hash */2],
                          /* params */state[/* params */3],
                          /* unlisten */state[/* unlisten */4]
                        ]]);
          case 4 : 
              return /* Update */Block.__(0, [/* record */[
                          /* path */state[/* path */0],
                          /* search */action[0],
                          /* hash */action[1],
                          /* params */action[2],
                          /* unlisten */state[/* unlisten */4]
                        ]]);
          case 5 : 
              return /* Update */Block.__(0, [/* record */[
                          /* path */state[/* path */0],
                          /* search */state[/* search */1],
                          /* hash */state[/* hash */2],
                          /* params */state[/* params */3],
                          /* unlisten */action[0]
                        ]]);
          
        }
      }
    });
  return newrecord;
}

exports.make = make;
/* component Not a pure module */
