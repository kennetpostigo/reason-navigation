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

function loopPush(path, pattern) {
  var _path = path;
  var _pattern = pattern;
  var _pathsAndPatterns = /* [] */0;
  while(true) {
    var pathsAndPatterns = _pathsAndPatterns;
    var pattern$1 = _pattern;
    var path$1 = _path;
    if (path$1 === "") {
      if (pattern$1 === "") {
        return pathsAndPatterns;
      } else {
        return /* [] */0;
      }
    } else if (pattern$1 === "") {
      return /* [] */0;
    } else {
      var match;
      if ($$String.contains_from(path$1, 1, /* "/" */47)) {
        var uNextSlash = $$String.index_from(path$1, 1, /* "/" */47);
        var uItem = $$String.sub(path$1, 1, uNextSlash - 1 | 0);
        match = /* tuple */[
          uItem,
          $$String.sub(path$1, uNextSlash, path$1.length - uNextSlash | 0)
        ];
      } else {
        match = /* tuple */[
          $$String.sub(path$1, 1, path$1.length - 1 | 0),
          ""
        ];
      }
      var match$1;
      if ($$String.contains_from(pattern$1, 1, /* "/" */47)) {
        var pNextSlash = $$String.index_from(pattern$1, 1, /* "/" */47);
        var pItem = $$String.sub(pattern$1, 1, pNextSlash - 1 | 0);
        match$1 = /* tuple */[
          pItem,
          $$String.sub(pattern$1, pNextSlash, pattern$1.length - pNextSlash | 0)
        ];
      } else {
        match$1 = /* tuple */[
          $$String.sub(pattern$1, 1, pattern$1.length - 1 | 0),
          ""
        ];
      }
      _pathsAndPatterns = /* :: */[
        /* tuple */[
          match[0],
          match$1[0]
        ],
        pathsAndPatterns
      ];
      _pattern = match$1[1];
      _path = match[1];
      continue ;
      
    }
  };
}

function parseUrl(pathsAndPatterns) {
  var remainingIterations = function (_search, hash, params, _pathsAndPatterns) {
    while(true) {
      var pathsAndPatterns = _pathsAndPatterns;
      var search = _search;
      if (pathsAndPatterns) {
        var rest = pathsAndPatterns[1];
        var match = pathsAndPatterns[0];
        var patternHead = match[1];
        var pathHead = match[0];
        if (rest) {
          var match$1 = hasSearch(patternHead);
          if (match$1) {
            var s = $$String.sub(patternHead, 1, patternHead.length - 1 | 0);
            params[s] = pathHead;
            _pathsAndPatterns = rest;
            _search = s + ("=" + (pathHead + ("&" + search)));
            continue ;
            
          } else {
            _pathsAndPatterns = rest;
            continue ;
            
          }
        } else {
          var match$2 = hasSearch(patternHead);
          if (match$2) {
            var s$1 = $$String.sub(patternHead, 1, patternHead.length - 1 | 0);
            params[s$1] = pathHead;
            var search$1 = "?" + (s$1 + ("=" + (pathHead + ("&" + search))));
            return /* record */[
                    /* search */search$1,
                    /* hash */hash,
                    /* params */params
                  ];
          } else {
            var search$2 = "?" + search;
            return /* record */[
                    /* search */search$2,
                    /* hash */hash,
                    /* params */params
                  ];
          }
        }
      } else {
        return /* record */[
                /* search */search,
                /* hash */hash,
                /* params */params
              ];
      }
    };
  };
  var search = "";
  var hash = "";
  var params = { };
  var pathsAndPatterns$1 = pathsAndPatterns;
  if (pathsAndPatterns$1) {
    var rest = pathsAndPatterns$1[1];
    var match = pathsAndPatterns$1[0];
    var patternHead = match[1];
    var pathHead = match[0];
    var match$1 = hasHash(pathHead);
    var match$2 = hasSearch(patternHead);
    if (match$1) {
      var loc = match$1[0];
      if (match$2) {
        var h = $$String.sub(pathHead, loc, pathHead.length - loc | 0);
        var p = $$String.sub(pathHead, 0, loc);
        var s = $$String.sub(patternHead, 1, patternHead.length - 1 | 0);
        params[s] = p;
        return remainingIterations(s + ("=" + p), h, params, rest);
      } else {
        var h$1 = $$String.sub(pathHead, loc, pathHead.length - loc | 0);
        return remainingIterations("?", h$1, params, rest);
      }
    } else if (match$2) {
      var s$1 = $$String.sub(patternHead, 1, patternHead.length - 1 | 0);
      params[s$1] = pathHead;
      return remainingIterations(s$1 + ("=" + pathHead), "", params, rest);
    } else {
      return remainingIterations("", "", params, rest);
    }
  } else {
    return /* record */[
            /* search */search,
            /* hash */hash,
            /* params */params
          ];
  }
}

function isPathCompliant(pathsAndPatterns) {
  var normalizedPathsAndPatterns;
  if (pathsAndPatterns) {
    var match = pathsAndPatterns[0];
    var path = match[0];
    var match$1 = hasHash(path);
    normalizedPathsAndPatterns = match$1 ? /* :: */[
        /* tuple */[
          $$String.sub(path, 0, match$1[0]),
          match[1]
        ],
        pathsAndPatterns[1]
      ] : pathsAndPatterns;
  } else {
    normalizedPathsAndPatterns = pathsAndPatterns;
  }
  return List.for_all((function (param) {
                var pattern = param[1];
                var match = hasSearch(pattern);
                if (match) {
                  return /* true */1;
                } else {
                  return +(param[0] === pattern);
                }
              }), normalizedPathsAndPatterns);
}

function matchPath(url, pattern) {
  var formatUrl = url === "/" ? url : removeTrailingSlash(addLeadingSlash(url));
  var formatPattern = pattern === "/" ? pattern : removeTrailingSlash(addLeadingSlash(pattern));
  var pathsAndPatterns = loopPush(formatUrl, formatPattern);
  if (pathsAndPatterns && isPathCompliant(pathsAndPatterns)) {
    return /* Some */[/* tuple */[
              formatUrl,
              pathsAndPatterns
            ]];
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
exports.parseUrl            = parseUrl;
exports.isPathCompliant     = isPathCompliant;
exports.matchPath           = matchPath;
exports.getInt              = getInt;
exports.getString           = getString;
/* No side effect */
