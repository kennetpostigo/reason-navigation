let make:
  (~history: Router.history, ~path: string, ~render: unit => ReasonReact.reactElement, 'a) =>
  ReasonReact.componentSpec(
    ReasonReact.stateless,
    ReasonReact.stateless,
    ReasonReact.noRetainedProps,
    ReasonReact.noRetainedProps,
    ReasonReact.actionless
  );