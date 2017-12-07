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
  var _urls = /* [] */0;
  var _patterns = /* [] */0;
  while(true) {
    var patterns = _patterns;
    var urls = _urls;
    var pattern$1 = _pattern;
    var url$1 = _url;
    if (url$1 === "") {
      if (pattern$1 === "") {
        return /* Some */[/* tuple */[
                  urls,
                  patterns
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
      var newUrls = match$4 !== 0 ? /* :: */[
          $$String.sub(url$1, 1, url$1.length - 1 | 0),
          urls
        ] : /* :: */[
          uItem,
          urls
        ];
      var match$5 = +(pNextSlash === -1);
      var newPatterns = match$5 !== 0 ? /* :: */[
          $$String.sub(pattern$1, 1, pattern$1.length - 1 | 0),
          patterns
        ] : /* :: */[
          pItem,
          patterns
        ];
      var match$6 = +(uNextSlash === -1);
      var nextUrl = match$6 !== 0 ? "" : $$String.sub(url$1, uNextSlash, url$1.length - uNextSlash | 0);
      var match$7 = +(pNextSlash === -1);
      var nextPattern = match$7 !== 0 ? "" : $$String.sub(pattern$1, pNextSlash, pattern$1.length - pNextSlash | 0);
      _patterns = newPatterns;
      _urls = newUrls;
      _pattern = nextPattern;
      _url = nextUrl;
      continue ;
      
    }
  };
}

function loopPop(_firstIter, _, _search, _hash, params, _paths, _patterns) {
  while(true) {
    var patterns = _patterns;
    var paths = _paths;
    var hash = _hash;
    var search = _search;
    var firstIter = _firstIter;
    var exit = 0;
    if (paths) {
      exit = 1;
    } else if (patterns) {
      exit = 1;
    } else {
      return /* record */[
              /* search */search,
              /* hash */hash,
              /* params */params
            ];
    }
    if (exit === 1) {
      var patternItem = List.hd(patterns);
      var pathItem = List.hd(paths);
      var patterns$1 = List.tl(patterns);
      var paths$1 = List.tl(paths);
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
            _patterns = patterns$1;
            _paths = paths$1;
            _hash = h;
            _search = s + ("=" + p);
            _firstIter = /* false */0;
            continue ;
            
          } else {
            var h$1 = $$String.sub(pathItem, loc, pathItem.length - loc | 0);
            _patterns = patterns$1;
            _paths = paths$1;
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
            _patterns = patterns$1;
            _paths = paths$1;
            _hash = "";
            _search = s$1 + ("=" + pathItem);
            _firstIter = /* false */0;
            continue ;
            
          } else {
            _patterns = patterns$1;
            _paths = paths$1;
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
          var match$4 = +(List.length(paths$1) === 0);
          _patterns = patterns$1;
          _paths = paths$1;
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
          var match$5 = +(List.length(paths$1) === 0);
          _patterns = patterns$1;
          _paths = paths$1;
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

function parseUrl(url, urls, patterns) {
  return loopPop(/* true */1, url, "", "", { }, urls, patterns);
}

function isPathCompliance(_firstIter, _paths, _patterns) {
  while(true) {
    var patterns = _patterns;
    var paths = _paths;
    var firstIter = _firstIter;
    var exit = 0;
    if (paths) {
      exit = 1;
    } else if (patterns) {
      exit = 1;
    } else {
      return /* true */1;
    }
    if (exit === 1) {
      if (firstIter !== 0) {
        var patternItem = List.hd(patterns);
        var pathItem = List.hd(paths);
        var patterns$1 = List.tl(patterns);
        var paths$1 = List.tl(paths);
        var match = hasHash(pathItem);
        if (match) {
          var match$1 = hasSearch(patternItem);
          if (match$1) {
            _patterns = patterns$1;
            _paths = paths$1;
            _firstIter = /* false */0;
            continue ;
            
          } else {
            var match$2 = +($$String.sub(pathItem, 0, match[0]) !== patternItem);
            if (match$2 !== 0) {
              return /* false */0;
            } else {
              _patterns = patterns$1;
              _paths = paths$1;
              _firstIter = /* false */0;
              continue ;
              
            }
          }
        } else {
          var match$3 = hasSearch(patternItem);
          if (match$3) {
            _patterns = patterns$1;
            _paths = paths$1;
            _firstIter = /* false */0;
            continue ;
            
          } else {
            var match$4 = +(pathItem !== patternItem);
            if (match$4 !== 0) {
              return /* false */0;
            } else {
              _patterns = patterns$1;
              _paths = paths$1;
              _firstIter = /* false */0;
              continue ;
              
            }
          }
        }
      } else {
        var patternItem$1 = List.hd(patterns);
        var pathItem$1 = List.hd(paths);
        var patterns$2 = List.tl(patterns);
        var paths$2 = List.tl(paths);
        var match$5 = hasSearch(patternItem$1);
        if (match$5) {
          var match$6 = +(List.length(paths$2) === 0);
          if (match$6 !== 0) {
            return /* true */1;
          } else {
            _patterns = patterns$2;
            _paths = paths$2;
            _firstIter = /* false */0;
            continue ;
            
          }
        } else {
          var match$7 = +(pathItem$1 === patternItem$1);
          if (match$7 !== 0) {
            var match$8 = +(List.length(paths$2) === 0);
            if (match$8 !== 0) {
              return /* true */1;
            } else {
              _patterns = patterns$2;
              _paths = paths$2;
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
  var match$2 = loopPush(formatUrl, formatPattern);
  if (match$2) {
    var match$3 = match$2[0];
    var p = match$3[1];
    var u = match$3[0];
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
