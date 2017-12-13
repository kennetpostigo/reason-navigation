<p align="center">
  <img width="300px" src="assets/reason-navigation.png" />
</p>
<p style="margin-top: 20px; font-size: 24px; font-weight: 500;" align="center">reason-navigation</p>
<p style="margin-top: 20px;" align="center">
  <a href="http://npm.im/reason-navigation">
    <img src="https://img.shields.io/npm/v/reason-navigation.svg?style=flat-square"/>
  </a>
  <a href="http://npm-stat.com/charts.html?package=reason-navigation">
    <img src="https://img.shields.io/npm/dm/reason-navigation.svg?style=flat-square"/>
  </a>
  <a href="http://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/npm/l/reason-navigation.svg?style=flat-square" />
  </a>
</p>

## Install

```bash
yarn install reason-navigation
```

## bsconfig

```json
"bs-dependencies": [
  "reason-react",
  "reason-navigation"
]
```

## Example

```reason
let component = ReasonReact.statelessComponent("App");

let make = (_children) => {
  ...component,
  render: (_self) =>
    <Router>
      (
        (history) =>
          <div>
            <h1> (U.se("Reason Router")) </h1>
            <Link history href="/game"> (U.se("GAME")) </Link>
            <Route history path="/" render=(() => <Landing history />) />
            <Route history path="/game" render=(() => <Canvas history />) />
            <Route
              history
              path="/re/:id"
              render=(
                () => {
                  switch (Match.getInt(history.state.params, "id")) {
                  | Some(v) => Js.log(v)
                  | None => Js.log("None")
                  };
                  <p> (ReasonReact.stringToElement("Query params!")) </p>
                }
              )
            />
            <Route history path="/highscores" render=(() => <HighScore history />) />
          </div>
      )
    </Router>
};
```

## Navigation Components

### `<Router children: (history) => ReasonReact.element/>`

Router takes a function as a child, with a parameter that is passed a history
object. The body should be a single reason-react component, like a `<div />`
that wraps a bunch of child `<Route />` components.

### `<Route history: Router.history path: string render: unit => ReasonReact.element />`

Route needs to be passed the `Router.history` record that contains data in order
to determine whether it should render on a certain path or not. It also requires
a `path` that the route needs to match against, and lastly a `render` function
that passes query params and other data that is useful.

### `<Link history: Router.history href: string target: string />`

Link needs to be passed the `Router.history` record that contains actions to
update the browser location. It also takes an `href` to determine where to go
when the link is pressed. and lastly takes a target to determine where to open
the link.

## Query Params

When accessing query params, you should use the query accessors that
`reason-navigation` provides.

### `getInt(params: Js.Dict.t(string), field: string) => option(int)`

It will return `Some(int)` if they field you are accessing is present and an
`int`.

```reason
switch (Match.getInt(match.state.params, "id")) {
| Some(v) => Js.log(v)
| None => Js.log("None")
};
```

### `getString(params: Js.Dict.t(string), field: string) => option(string)`

It will return `Some(string)` if they field you are accessing is present and an
`string`.

```reason
switch (Match.getString(match.state.params, "id")) {
| Some(v) => Js.log(v)
| None => Js.log("None")
};
```

## Types

### Router.state

```reason
type state = {
  path: string,
  search: string,
  hash: string,
  params: Js.Dict.t(string),
  unlisten: [@bs] (unit => unit)
};
```

### Router.actions

```reason
type actions = {
  push: string => unit,
  replace: string => unit,
  updateMatch: (string, string, Js.Dict.t(string)) => unit
};
```

### Router.history

```reason
type history = {
  state,
  actions
};
```
