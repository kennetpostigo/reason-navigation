let component = ReasonReact.statelessComponent("Link");

let getLinkEventData = (event, history: Router.history, href: string, target: string) => {
  let isLeftClick = ReactEventRe.Mouse.button(event) == 0;
  let isModified =
    ReactEventRe.Mouse.metaKey(event)
    || ReactEventRe.Mouse.altKey(event)
    || ReactEventRe.Mouse.ctrlKey(event)
    || ReactEventRe.Mouse.shiftKey(event);
  let hasNoTarget = target == "";
  if (isLeftClick && ! isModified && hasNoTarget) {
    ReactEventRe.Mouse.preventDefault(event);
    history.actions.push(href)
  }
};

let make = (~history: Router.history, ~href: string, ~target: string="", children) => {
  ...component,
  render: (self) =>
    self.state == () ?
      <a href onClick=((ev) => getLinkEventData(ev, history, href, target))>
        (ReasonReact.arrayToElement(children))
      </a> :
      <a href> (ReasonReact.arrayToElement(children)) </a>
};