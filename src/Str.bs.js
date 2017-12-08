'use strict';

var Js_exn                  = require("bs-platform/lib/js/js_exn.js");
var $$String                = require("bs-platform/lib/js/string.js");
var Caml_string             = require("bs-platform/lib/js/caml_string.js");
var Caml_builtin_exceptions = require("bs-platform/lib/js/caml_builtin_exceptions.js");

function sub(str, start, len) {
  var exit = 0;
  var sub$1;
  try {
    sub$1 = $$String.sub(str, start, len);
    exit = 1;
  }
  catch (raw_exn){
    var exn = Js_exn.internalToOCamlException(raw_exn);
    if (exn[0] === Caml_builtin_exceptions.invalid_argument) {
      return /* None */0;
    } else {
      throw exn;
    }
  }
  if (exit === 1) {
    return /* Some */[sub$1];
  }
  
}

function length(str) {
  var exit = 0;
  var len;
  try {
    len = str.length;
    exit = 1;
  }
  catch (raw_exn){
    var exn = Js_exn.internalToOCamlException(raw_exn);
    if (exn[0] === Caml_builtin_exceptions.invalid_argument) {
      return /* None */0;
    } else {
      throw exn;
    }
  }
  if (exit === 1) {
    return /* Some */[len];
  }
  
}

function index(str, chr) {
  var exit = 0;
  var index$1;
  try {
    index$1 = $$String.index(str, chr);
    exit = 1;
  }
  catch (exn){
    if (exn === Caml_builtin_exceptions.not_found) {
      return /* None */0;
    } else {
      throw exn;
    }
  }
  if (exit === 1) {
    return /* Some */[index$1];
  }
  
}

function indexFrom(str, index, $$char) {
  var exit = 0;
  var nextIndex;
  try {
    nextIndex = $$String.index_from(str, index, $$char);
    exit = 1;
  }
  catch (raw_exn){
    var exn = Js_exn.internalToOCamlException(raw_exn);
    if (exn[0] === Caml_builtin_exceptions.invalid_argument) {
      return /* None */0;
    } else if (exn === Caml_builtin_exceptions.not_found) {
      return /* None */0;
    } else {
      throw exn;
    }
  }
  if (exit === 1) {
    return /* Some */[nextIndex];
  }
  
}

function get(str, index) {
  var exit = 0;
  var chr;
  try {
    chr = Caml_string.get(str, index);
    exit = 1;
  }
  catch (raw_exn){
    var exn = Js_exn.internalToOCamlException(raw_exn);
    if (exn[0] === Caml_builtin_exceptions.invalid_argument) {
      return /* None */0;
    } else {
      throw exn;
    }
  }
  if (exit === 1) {
    return /* Some */[$$String.make(1, chr)];
  }
  
}

function someOr(opt, alt) {
  if (opt) {
    return opt[0];
  } else {
    return alt;
  }
}

exports.sub       = sub;
exports.length    = length;
exports.index     = index;
exports.indexFrom = indexFrom;
exports.get       = get;
exports.someOr    = someOr;
/* No side effect */
