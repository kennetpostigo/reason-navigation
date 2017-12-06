/*
   ✅ <Router /> didMount => path populated
   ✅ <Router /> render => passes state to Routes
   ✅ <Route /> didMount => Update state with matched, search, hash, and params
   ✅ <Route /> render => check if theres a match
 */
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

let component = ReasonReact.reducerComponent("Router");

let make = (~history: History.browserHistory=History.createBrowserHistory(), children) => {
  ...component,
  initialState: () => {
    path: history##location##pathname,
    search: "",
    hash: "",
    params: Js.Dict.empty(),
    unlisten: [@bs] (() => ())
  },
  didMount: ({reduce}) => {
    let unsub =
      history##listen(
        (location) => {
          reduce((_e) => UpdatePath(location##pathname), ());
          ()
        }
      );
    reduce((_e) => SetUnlisten(unsub), ());
    ReasonReact.NoUpdate
  },
  willUnmount: (self) => [@bs] self.state.unlisten(),
  reducer: (action, state) =>
    switch action {
    | Push(path) => ReasonReact.SideEffects(((_self) => history##push(path)))
    | Replace(path) => ReasonReact.SideEffects(((_self) => history##replace(path)))
    | Go(n) => ReasonReact.SideEffects(((_self) => history##go(n)))
    | GoBack => ReasonReact.SideEffects(((_self) => history##goBack()))
    | GoForward => ReasonReact.SideEffects(((_self) => history##goForward()))
    | UpdatePath(pathname) => ReasonReact.Update({...state, path: pathname})
    | UpdateMatch(search, hash, params) => ReasonReact.Update({...state, search, hash, params})
    | SetUnlisten(unsub) => ReasonReact.Update({...state, unlisten: unsub})
    },
  render: ({reduce, state}) => {
    let history: history = {
      state,
      actions: {
        push: (path) => reduce((_e) => Push(path), ()),
        replace: (path) => reduce((_e) => Replace(path), ()),
        updateMatch: (search, hash, params) =>
          reduce((_e) => UpdateMatch(search, hash, params), ())
      }
    };
    children[0](history)
  }
};