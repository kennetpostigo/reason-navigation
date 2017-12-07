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
    if (paths) {
      if (patterns) {
        if (firstIter !== 0) {
          var paths$1 = patterns[1];
          var pathHead = patterns[0];
          var patterns$1 = paths[1];
          var patternHead = paths[0];
          var match = hasHash(pathHead);
          if (match) {
            var match$1 = hasSearch(patternHead);
            if (match$1) {
              _patterns = patterns$1;
              _paths = paths$1;
              _firstIter = /* false */0;
              continue ;
              
            } else {
              var match$2 = +($$String.sub(pathHead, 0, match[0]) !== patternHead);
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
            var match$3 = hasSearch(patternHead);
            if (match$3) {
              _patterns = patterns$1;
              _paths = paths$1;
              _firstIter = /* false */0;
              continue ;
              
            } else {
              var match$4 = +(pathHead !== patternHead);
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
          var patterns$2 = patterns[1];
          var patternHead$1 = patterns[0];
          var paths$2 = paths[1];
          var match$5 = hasSearch(patternHead$1);
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
            var match$7 = +(paths[0] === patternHead$1);
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
      } else {
        throw [
              Caml_builtin_exceptions.invalid_argument,
              "isPathCompliance: paths length and patterns length not the same!"
            ];
      }
    } else if (patterns) {
      throw [
            Caml_builtin_exceptions.invalid_argument,
            "isPathCompliance: paths length and patterns length not the same!"
          ];
    } else {
      return /* true */1;
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
