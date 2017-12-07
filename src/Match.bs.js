'use strict';

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
      var match;
      if ($$String.contains_from(url$1, 1, /* "/" */47)) {
        var uNextSlash = $$String.index_from(url$1, 1, /* "/" */47);
        var uItem = $$String.sub(url$1, 1, uNextSlash - 1 | 0);
        match = /* tuple */[
          /* :: */[
            uItem,
            urls
          ],
          $$String.sub(url$1, uNextSlash, url$1.length - uNextSlash | 0)
        ];
      } else {
        match = /* tuple */[
          /* :: */[
            $$String.sub(url$1, 1, url$1.length - 1 | 0),
            urls
          ],
          ""
        ];
      }
      var match$1;
      if ($$String.contains_from(pattern$1, 1, /* "/" */47)) {
        var pNextSlash = $$String.index_from(pattern$1, 1, /* "/" */47);
        var pItem = $$String.sub(pattern$1, 1, pNextSlash - 1 | 0);
        match$1 = /* tuple */[
          /* :: */[
            pItem,
            patterns
          ],
          $$String.sub(pattern$1, pNextSlash, pattern$1.length - pNextSlash | 0)
        ];
      } else {
        match$1 = /* tuple */[
          /* :: */[
            $$String.sub(pattern$1, 1, pattern$1.length - 1 | 0),
            patterns
          ],
          ""
        ];
      }
      _patterns = match$1[0];
      _urls = match[0];
      _pattern = match$1[1];
      _url = match[1];
      continue ;
      
    }
  };
}

function loopPop(search, hash, params, paths, patterns) {
  var remainingIterations = function (_search, hash, params, _paths, _patterns) {
    while(true) {
      var patterns = _patterns;
      var paths = _paths;
      var search = _search;
      if (paths) {
        var paths$1 = paths[1];
        var singlePath = paths[0];
        var exit = 0;
        if (paths$1) {
          exit = 1;
        } else if (patterns) {
          if (patterns[1]) {
            exit = 1;
          } else {
            var singlePattern = patterns[0];
            var match = hasSearch(singlePattern);
            if (match) {
              var s = $$String.sub(singlePattern, 1, singlePattern.length - 1 | 0);
              params[s] = singlePath;
              _patterns = /* [] */0;
              _paths = /* [] */0;
              _search = "?" + (s + ("=" + (singlePath + ("&" + search))));
              continue ;
              
            } else {
              _patterns = /* [] */0;
              _paths = /* [] */0;
              _search = "?" + search;
              continue ;
              
            }
          }
        } else {
          exit = 1;
        }
        if (exit === 1) {
          if (patterns) {
            var patterns$1 = patterns[1];
            var patternHead = patterns[0];
            var match$1 = hasSearch(patternHead);
            if (match$1) {
              var s$1 = $$String.sub(patternHead, 1, patternHead.length - 1 | 0);
              params[s$1] = singlePath;
              _patterns = patterns$1;
              _paths = paths$1;
              _search = s$1 + ("=" + (singlePath + ("&" + search)));
              continue ;
              
            } else {
              _patterns = patterns$1;
              _paths = paths$1;
              continue ;
              
            }
          } else {
            throw [
                  Caml_builtin_exceptions.invalid_argument,
                  "loopPop remainingIterations: paths length and patterns length not the same!"
                ];
          }
        }
        
      } else if (patterns) {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "loopPop remainingIterations: paths length and patterns length not the same!"
            ];
      } else {
        return /* record */[
                /* search */search,
                /* hash */hash,
                /* params */params
              ];
      }
    };
  };
  var search$1 = search;
  var hash$1 = hash;
  var params$1 = params;
  var paths$1 = paths;
  var patterns$1 = patterns;
  if (paths$1) {
    if (patterns$1) {
      var patterns$2 = patterns$1[1];
      var patternHead = patterns$1[0];
      var paths$2 = paths$1[1];
      var pathHead = paths$1[0];
      var match = hasHash(pathHead);
      var match$1 = hasSearch(patternHead);
      if (match) {
        var loc = match[0];
        if (match$1) {
          var h = $$String.sub(pathHead, loc, pathHead.length - loc | 0);
          var p = $$String.sub(pathHead, 0, loc);
          var s = $$String.sub(patternHead, 1, patternHead.length - 1 | 0);
          params$1[s] = p;
          return remainingIterations(s + ("=" + p), h, params$1, paths$2, patterns$2);
        } else {
          var h$1 = $$String.sub(pathHead, loc, pathHead.length - loc | 0);
          return remainingIterations("?", h$1, params$1, paths$2, patterns$2);
        }
      } else if (match$1) {
        var s$1 = $$String.sub(patternHead, 1, patternHead.length - 1 | 0);
        params$1[s$1] = pathHead;
        return remainingIterations(s$1 + ("=" + pathHead), "", params$1, paths$2, patterns$2);
      } else {
        return remainingIterations("", "", params$1, paths$2, patterns$2);
      }
    } else {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "loopPop firstIteration: paths length and patterns length not the same!"
          ];
    }
  } else if (patterns$1) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "loopPop firstIteration: paths length and patterns length not the same!"
        ];
  } else {
    return /* record */[
            /* search */search$1,
            /* hash */hash$1,
            /* params */params$1
          ];
  }
}

function parseUrl(_, urls, patterns) {
  return loopPop("", "", { }, urls, patterns);
}

function isPathCompliant(paths, patterns) {
  var remainingIterations = function (_paths, _patterns) {
    while(true) {
      var patterns = _patterns;
      var paths = _paths;
      if (paths) {
        var paths$1 = paths[1];
        var singlePath = paths[0];
        var exit = 0;
        if (paths$1) {
          exit = 1;
        } else if (patterns) {
          if (patterns[1]) {
            exit = 1;
          } else {
            var singlePattern = patterns[0];
            var match = hasSearch(singlePattern);
            if (match) {
              return /* true */1;
            } else {
              return +(singlePath === singlePattern);
            }
          }
        } else {
          exit = 1;
        }
        if (exit === 1) {
          if (patterns) {
            var patterns$1 = patterns[1];
            var patternHead = patterns[0];
            var match$1 = hasSearch(patternHead);
            if (match$1) {
              _patterns = patterns$1;
              _paths = paths$1;
              continue ;
              
            } else if (singlePath === patternHead) {
              _patterns = patterns$1;
              _paths = paths$1;
              continue ;
              
            } else {
              return /* false */0;
            }
          } else {
            throw [
                  Caml_builtin_exceptions.invalid_argument,
                  "isPathCompliant remainingIterations: paths length and patterns length not the same!"
                ];
          }
        }
        
      } else if (patterns) {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "isPathCompliant remainingIterations: paths length and patterns length not the same!"
            ];
      } else {
        return /* true */1;
      }
    };
  };
  var paths$1 = paths;
  var patterns$1 = patterns;
  if (paths$1) {
    if (patterns$1) {
      var patterns$2 = patterns$1[1];
      var patternHead = patterns$1[0];
      var paths$2 = paths$1[1];
      var pathHead = paths$1[0];
      var match = hasHash(pathHead);
      var match$1 = hasSearch(patternHead);
      if (match) {
        if (match$1 || $$String.sub(pathHead, 0, match[0]) === patternHead) {
          return remainingIterations(paths$2, patterns$2);
        } else {
          return /* false */0;
        }
      } else if (match$1 || pathHead === patternHead) {
        return remainingIterations(paths$2, patterns$2);
      } else {
        return /* false */0;
      }
    } else {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "isPathCompliant firstIteration: paths length and patterns length not the same!"
          ];
    }
  } else if (patterns$1) {
    throw [
          Caml_builtin_exceptions.invalid_argument,
          "isPathCompliant firstIteration: paths length and patterns length not the same!"
        ];
  } else {
    return /* true */1;
  }
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
    if (isPathCompliant(u, p)) {
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
exports.isPathCompliant     = isPathCompliant;
exports.matchPath           = matchPath;
exports.getInt              = getInt;
exports.getString           = getString;
/* No side effect */
