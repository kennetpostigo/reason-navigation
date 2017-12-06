let component = ReasonReact.statelessComponent("Route");

let make = (~history: Router.history, ~path, ~render, _children) => {
  ...component,
  didMount: (_) => {
    switch (Match.matchPath(history.state.path, path)) {
    | Some((url, urlStack, patternStack)) =>
      let {search, hash, params}: Match.t = Match.parseUrl(url, urlStack, patternStack);
      history.actions.updateMatch(search, hash, params)
    | None => ()
    };
    ReasonReact.NoUpdate
  },
  render: (_) => {
    let match =
      switch (Match.matchPath(history.state.path, path)) {
      | Some(_) => true
      | None => false
      };
    match ? render() : ReasonReact.nullElement
  }
};