let make:
  (~history: Router.history, ~href: string, ~target: string=?, array(ReasonReact.reactElement)) =>
  ReasonReact.componentSpec(
    ReasonReact.stateless,
    ReasonReact.stateless,
    ReasonReact.noRetainedProps,
    ReasonReact.noRetainedProps,
    ReasonReact.actionless
  );