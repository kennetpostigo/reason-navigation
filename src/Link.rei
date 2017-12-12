let make:
  (
    ~history: Router.history,
    ~href: string,
    ~target: string=?,
    ~style: ReactDOMRe.style,
    array(ReasonReact.reactElement)
  ) =>
  ReasonReact.componentSpec(
    ReasonReact.stateless,
    ReasonReact.stateless,
    ReasonReact.noRetainedProps,
    ReasonReact.noRetainedProps,
    ReasonReact.actionless
  );