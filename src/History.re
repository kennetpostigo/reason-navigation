type location = {. "pathname": string, "search": string, "hash": string};

type browserHistory = {
  .
  "length": int,
  "location": location,
  "listen": [@bs.meth] ((location => unit) => [@bs] (unit => unit)),
  "push": [@bs.meth] (string => unit),
  "replace": [@bs.meth] (string => unit),
  "go": [@bs.meth] (int => unit),
  "goBack": [@bs.meth] (unit => unit),
  "goForward": [@bs.meth] (unit => unit)
};

[@bs.val] [@bs.module "history/createBrowserHistory"]
external createBrowserHistory : unit => browserHistory =
  "default";
