type t = {
  search: string,
  hash: string,
  params: Js.Dict.t(string)
};

type path = list((string, string));

type search =
  | Search(int)
  | NoSearch;

type hash =
  | Hash(int)
  | NoHash;

let removeTrailingSlash: string => string;

let addLeadingSlash: string => string;

let hasSearch: string => search;

let hasHash: string => hash;

let getInt: (Js.Dict.t(string), string) => option(int);

let getString: (Js.Dict.t(string), string) => option(string);

let stringToPath: (string, string) => path;

let parseUrl: path => t;

let isPathCompliant: path => bool;

let matchPath: (string, string) => option((string, path));