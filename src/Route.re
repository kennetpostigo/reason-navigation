let component = ReasonReact.statelessComponent("Route");

let make = (~history: Router.history, ~path, ~render, _children) => {
  ...component,
  didMount: (_) => {
    switch (UrlParser.matchPath(history.state.path, path)) {
    | Some((url, urlStack, patternStack)) =>
      let {search, hash, params}: UrlParser.t = UrlParser.parseUrl(url, urlStack, patternStack);
      history.actions.updateMatch(search, hash, params)
    | None => ()
    };
    ReasonReact.NoUpdate
  },
  render: (_) => {
    let match =
      switch (UrlParser.matchPath(history.state.path, path)) {
      | Some(_) => true
      | None => false
      };
    match ? render(history.state) : ReasonReact.nullElement
  }
};