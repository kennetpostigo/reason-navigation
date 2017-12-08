type state = {
  path: string,
  search: string,
  hash: string,
  params: Js.Dict.t(string),
  unlisten: [@bs] (unit => unit)
};

type actions = {
  push: string => unit,
  replace: string => unit,
  updateMatch: (string, string, Js.Dict.t(string)) => unit
};

type history = {
  state,
  actions
};

type action =
  | Push(string)
  | Replace(string)
  | Go(int)
  | GoBack
  | GoForward
  | UpdatePath(string)
  | UpdateMatch(string, string, Js.Dict.t(string))
  | SetUnlisten([@bs] (unit => unit));

let make:
  (~history: History.browserHistory=?, array((history => ReasonReact.reactElement))) =>
  ReasonReact.componentSpec(
    state,
    state,
    ReasonReact.noRetainedProps,
    ReasonReact.noRetainedProps,
    action
  );