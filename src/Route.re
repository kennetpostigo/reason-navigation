let component = ReasonReact.statelessComponent("Route");

let make = (~history: Router.history, ~path, ~render, _children) => {
  ...component,
  didMount: (_) => {
    switch (Match.matchPath(history.state.path, path)) {
    | Some((_url, pathsAndPatterns)) =>
      let {search, hash, params}: Match.t = Match.parseUrl(pathsAndPatterns);
      history.actions.updateMatch(search, hash, params)
    | None => ()
    };
    ReasonReact.NoUpdate
  },
  render: (_) =>
    switch (Match.matchPath(history.state.path, path)) {
    | Some(_) => render()
    | None => ReasonReact.nullElement
    }
};
