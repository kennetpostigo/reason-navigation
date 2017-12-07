let component = ReasonReact.statelessComponent("Link");

let getLinkEventData = (event, history: Router.history, href: string, target: string) => {
  let modified =
    ReactEventRe.Mouse.metaKey(event)
    || ReactEventRe.Mouse.altKey(event)
    || ReactEventRe.Mouse.ctrlKey(event)
    || ReactEventRe.Mouse.shiftKey(event);
  switch (ReactEventRe.Mouse.button(event), modified, target) {
  | (0, false, "") =>
    /* left click, no target */
    ReactEventRe.Mouse.preventDefault(event);
    history.actions.push(href)
  | _ => ()
  }
};

let make = (~history: Router.history, ~href: string, ~target: string="", children) => {
  ...component,
  render: (_self) =>
    <a href onClick=((ev) => getLinkEventData(ev, history, href, target))>
      (ReasonReact.arrayToElement(children))
    </a>
};
