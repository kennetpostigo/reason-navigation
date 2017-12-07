'use strict';

var List                    = require("bs-platform/lib/js/list.js");
var Js_exn                  = require("bs-platform/lib/js/js_exn.js");
var $$String                = require("bs-platform/lib/js/string.js");
var Caml_format             = require("bs-platform/lib/js/caml_format.js");
var Caml_string             = require("bs-platform/lib/js/caml_string.js");
var Caml_builtin_exceptions = require("bs-platform/lib/js/caml_builtin_exceptions.js");

function removeTrailingSlash(url) {
  var lastChar = Caml_string.get(url, url.length - 1 | 0);
  if (lastChar !== 47) {
    return url;
  } else {
    return $$String.sub(url, 0, url.length - 1 | 0);
  }
}

function addLeadingSlash(url) {
  var match = Caml_string.get(url, 0);
  if (match !== 47) {
    return "/" + url;
  } else {
    return url;
  }
}

function hasSearch(url) {
  if ($$String.contains(url, /* ":" */58)) {
    return /* Search */[$$String.index(url, /* ":" */58)];
  } else {
    return /* NoSearch */0;
  }
}

function hasHash(url) {
  if ($$String.contains(url, /* "#" */35)) {
    return /* Hash */[$$String.index(url, /* "#" */35)];
  } else {
    return /* NoHash */0;
  }
}

function loopPush(url, pattern) {
  var _url = url;
  var _pattern = pattern;
  var _urlStack = /* [] */0;
  var _patternStack = /* [] */0;
  while(true) {
    var patternStack = _patternStack;
    var urlStack = _urlStack;
    var pattern$1 = _pattern;
    var url$1 = _url;
    if (url$1 === "") {
      if (pattern$1 === "") {
        return /* Some */[/* tuple */[
                  urlStack,
                  patternStack
                ]];
      } else {
        return /* None */0;
      }
    } else if (pattern$1 === "") {
      return /* None */0;
    } else {
      var match = $$String.contains_from(url$1, 1, /* "/" */47);
      var uNextSlash = match !== 0 ? $$String.index_from(url$1, 1, /* "/" */47) : -1;
      var match$1 = $$String.contains_from(pattern$1, 1, /* "/" */47);
      var pNextSlash = match$1 !== 0 ? $$String.index_from(pattern$1, 1, /* "/" */47) : -1;
      var match$2 = +(uNextSlash === -1);
      var uItem = match$2 !== 0 ? "" : $$String.sub(url$1, 1, uNextSlash - 1 | 0);
      var match$3 = +(pNextSlash === -1);
      var pItem = match$3 !== 0 ? "" : $$String.sub(pattern$1, 1, pNextSlash - 1 | 0);
      var match$4 = +(uNextSlash === -1);
      var newUrlStack = match$4 !== 0 ? /* :: */[
          $$String.sub(url$1, 1, url$1.length - 1 | 0),
          urlStack
        ] : /* :: */[
          uItem,
          urlStack
        ];
      var match$5 = +(pNextSlash === -1);
      var newPatternStack = match$5 !== 0 ? /* :: */[
          $$String.sub(pattern$1, 1, pattern$1.length - 1 | 0),
          patternStack
        ] : /* :: */[
          pItem,
          patternStack
        ];
      var match$6 = +(uNextSlash === -1);
      var nextUrl = match$6 !== 0 ? "" : $$String.sub(url$1, uNextSlash, url$1.length - uNextSlash | 0);
      var match$7 = +(pNextSlash === -1);
      var nextPattern = match$7 !== 0 ? "" : $$String.sub(pattern$1, pNextSlash, pattern$1.length - pNextSlash | 0);
      _patternStack = newPatternStack;
      _urlStack = newUrlStack;
      _pattern = nextPattern;
      _url = nextUrl;
      continue ;
      
    }
  };
}

function loopPop(_firstIter, _, _search, _hash, params, pathStack, patternStack) {
  while(true) {
    var hash = _hash;
    var search = _search;
    var firstIter = _firstIter;
    var exit = 0;
    if (pathStack) {
      exit = 1;
    } else if (patternStack) {
      exit = 1;
    } else {
      return /* record */[
              /* search */search,
              /* hash */hash,
              /* params */params
            ];
    }
    if (exit === 1) {
      var patternItem = List.hd(patternStack);
      var pathItem = List.hd(pathStack);
      if (firstIter) {
        var match = hasHash(pathItem);
        if (match) {
          var loc = match[0];
          var match$1 = hasSearch(patternItem);
          if (match$1) {
            var h = $$String.sub(pathItem, loc, pathItem.length - loc | 0);
            var p = $$String.sub(pathItem, 0, loc);
            var s = $$String.sub(patternItem, 1, patternItem.length - 1 | 0);
            params[s] = p;
            _hash = h;
            _search = s + ("=" + p);
            _firstIter = /* false */0;
            continue ;
            
          } else {
            var h$1 = $$String.sub(pathItem, loc, pathItem.length - loc | 0);
            _hash = h$1;
            _search = "?";
            _firstIter = /* false */0;
            continue ;
            
          }
        } else {
          var match$2 = hasSearch(patternItem);
          if (match$2) {
            var s$1 = $$String.sub(patternItem, 1, patternItem.length - 1 | 0);
            params[s$1] = pathItem;
            _hash = "";
            _search = s$1 + ("=" + pathItem);
            _firstIter = /* false */0;
            continue ;
            
          } else {
            _hash = "";
            _search = "";
            _firstIter = /* false */0;
            continue ;
            
          }
        }
      } else {
        var match$3 = hasSearch(patternItem);
        if (match$3) {
          var s$2 = $$String.sub(patternItem, 1, patternItem.length - 1 | 0);
          params[s$2] = pathItem;
          var match$4 = +(List.length(pathStack) === 0);
          if (match$4 !== 0) {
            _search = "?" + (s$2 + ("=" + (pathItem + ("&" + search))));
            _firstIter = /* false */0;
            continue ;
            
          } else {
            _search = s$2 + ("=" + (pathItem + ("&" + search)));
            _firstIter = /* false */0;
            continue ;
            
          }
        } else {
          var match$5 = +(List.length(pathStack) === 0);
          if (match$5 !== 0) {
            _search = "?" + search;
            _firstIter = /* false */0;
            continue ;
            
          } else {
            _firstIter = /* false */0;
            continue ;
            
          }
        }
      }
    }
    
  };
}

function parseUrl(url, urlStack, patternStack) {
  return loopPop(/* true */1, url, "", "", { }, urlStack, patternStack);
}

function isPathCompliance(_firstIter, pathStack, patternStack) {
  while(true) {
    var firstIter = _firstIter;
    var exit = 0;
    if (pathStack) {
      exit = 1;
    } else if (patternStack) {
      exit = 1;
    } else {
      return /* true */1;
    }
    if (exit === 1) {
      if (firstIter !== 0) {
        var patternItem = List.hd(patternStack);
        var pathItem = List.hd(pathStack);
        var match = hasHash(pathItem);
        if (match) {
          var match$1 = hasSearch(patternItem);
          if (match$1) {
            _firstIter = /* false */0;
            continue ;
            
          } else {
            var match$2 = +($$String.sub(pathItem, 0, match[0]) !== patternItem);
            if (match$2 !== 0) {
              return /* false */0;
            } else {
              _firstIter = /* false */0;
              continue ;
              
            }
          }
        } else {
          var match$3 = hasSearch(patternItem);
          if (match$3) {
            _firstIter = /* false */0;
            continue ;
            
          } else {
            var match$4 = +(pathItem !== patternItem);
            if (match$4 !== 0) {
              return /* false */0;
            } else {
              _firstIter = /* false */0;
              continue ;
              
            }
          }
        }
      } else {
        var patternItem$1 = List.hd(patternStack);
        var pathItem$1 = List.hd(pathStack);
        var match$5 = hasSearch(patternItem$1);
        if (match$5) {
          var match$6 = +(List.length(pathStack) === 0);
          if (match$6 !== 0) {
            return /* true */1;
          } else {
            _firstIter = /* false */0;
            continue ;
            
          }
        } else {
          var match$7 = +(pathItem$1 === patternItem$1);
          if (match$7 !== 0) {
            var match$8 = +(List.length(pathStack) === 0);
            if (match$8 !== 0) {
              return /* true */1;
            } else {
              _firstIter = /* false */0;
              continue ;
              
            }
          } else {
            return /* false */0;
          }
        }
      }
    }
    
  };
}

function matchPath(url, pattern) {
  var match = +(url === "/");
  var formatUrl = match !== 0 ? url : removeTrailingSlash(addLeadingSlash(url));
  var match$1 = +(pattern === "/");
  var formatPattern = match$1 !== 0 ? pattern : removeTrailingSlash(addLeadingSlash(pattern));
  var stackify = loopPush(formatUrl, formatPattern);
  if (stackify) {
    var match$2 = stackify[0];
    var p = match$2[1];
    var u = match$2[0];
    if (isPathCompliance(/* true */1, u, p)) {
      return /* Some */[/* tuple */[
                formatUrl,
                u,
                p
              ]];
    } else {
      return /* None */0;
    }
  } else {
    return /* None */0;
  }
}

function getInt(params, field) {
  var match = params[field];
  if (match !== undefined) {
    var exit = 0;
    var x;
    try {
      x = Caml_format.caml_int_of_string(match);
      exit = 1;
    }
    catch (raw_exn){
      var exn = Js_exn.internalToOCamlException(raw_exn);
      if (exn[0] === Caml_builtin_exceptions.failure) {
        return /* None */0;
      } else {
        throw exn;
      }
    }
    if (exit === 1) {
      return /* Some */[x];
    }
    
  } else {
    return /* None */0;
  }
}

function getString(params, field) {
  var match = params[field];
  if (match !== undefined) {
    return /* Some */[match];
  } else {
    return /* None */0;
  }
}

exports.removeTrailingSlash = removeTrailingSlash;
exports.addLeadingSlash     = addLeadingSlash;
exports.hasSearch           = hasSearch;
exports.hasHash             = hasHash;
exports.loopPush            = loopPush;
exports.loopPop             = loopPop;
exports.parseUrl            = parseUrl;
exports.isPathCompliance    = isPathCompliance;
exports.matchPath           = matchPath;
exports.getInt              = getInt;
exports.getString           = getString;
/* No side effect */
