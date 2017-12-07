/*
  Sample:
  let make = (_children) => {
   ...component,
   render: (_self) =>
     <Router>
       (
         (location, push) =>
           <div>
             <h1> (U.se("TEST SPA!!!!!")) </h1>
             <Link location push href="game"> (U.se("GAME")) </Link>
             <Route location path="/" render=(() => <Landing />) />
             <Route location path="/game" render=(() => <Canvas />) />
             <Route location path="/highscores" render=(() => <HighScore />) />
           </div>
       )
     </Router>
  };

  Process:
  - When <Router /> mounts it listens to changes and updates state
  - <Router /> has a matched field in state, this is used to check that when a url is hit
    If a route is matched, defaults to false, but when matched is set to true
  - When state changes, the location updates, if matched is already true and a <Route />
    tries to match then an exception should be thrown "multiple routes match URL"
  -  If only one route matches, render Route
 */
type t = {
  search: string,
  hash: string,
  params: Js.Dict.t(string)
};

type search =
  | Search(int)
  | NoSearch;

type hash =
  | Hash(int)
  | NoHash;

/* TODO: this throws */
let removeTrailingSlash = (url) => {
  let lastChar = url.[String.length(url) - 1];
  switch lastChar {
  | '/' => String.sub(url, 0, String.length(url) - 1)
  | _ => url
  }
};

/* TODO: this throws */
let addLeadingSlash = (url) =>
  switch url.[0] {
  | '/' => url
  | _ => "/" ++ url
  };

let hasSearch = (url) =>
  if (String.contains(url, ':')) {
    Search(String.index(url, ':'))
  } else {
    NoSearch
  };

let hasHash = (url) =>
  if (String.contains(url, '#')) {
    Hash(String.index(url, '#'))
  } else {
    NoHash
  };

/*
  Iterate through the path and pattern
    - push the path into a path stack
    - push the pattern into a pattern stack
 */
/* TODO: this throws because of string ops */
let loopPush = (url, pattern) => {
  let rec loopPush = (url, pattern, urls, patterns) =>
    switch (url, pattern) {
    | ("", "") => Some((urls, patterns))
    | ("", _)
    | (_, "") => None
    | (url, pattern) =>
      let uNextSlash = String.contains_from(url, 1, '/') ? String.index_from(url, 1, '/') : (-1);
      let pNextSlash =
        String.contains_from(pattern, 1, '/') ? String.index_from(pattern, 1, '/') : (-1);
      let uItem = uNextSlash == (-1) ? "" : String.sub(url, 1, uNextSlash - 1);
      let pItem = pNextSlash == (-1) ? "" : String.sub(pattern, 1, pNextSlash - 1);
      let newUrls =
        uNextSlash == (-1) ?
          [String.sub(url, 1, String.length(url) - 1), ...urls] : [uItem, ...urls];
      let newPatterns =
        pNextSlash == (-1) ?
          [String.sub(pattern, 1, String.length(pattern) - 1), ...patterns] : [pItem, ...patterns];
      let nextUrl =
        uNextSlash == (-1) ? "" : String.sub(url, uNextSlash, String.length(url) - uNextSlash);
      let nextPattern =
        pNextSlash == (-1) ?
          "" : String.sub(pattern, pNextSlash, String.length(pattern) - pNextSlash);
      loopPush(nextUrl, nextPattern, newUrls, newPatterns)
    };
  loopPush(url, pattern, [], [])
};

/*
  Pop the pattern and path stack until empty
    - If the fist pop contains a "#" sub from it to the end and set it as the
      hash. Disregard from the hash to the end.
    - Check the pop value from the pattern
      + if it is a search param then put it in search and match params.
      + if it is a path then do nothing
 */
let rec loopPop = (firstIter, path, search, hash, params, paths, patterns) =>
  switch (paths, patterns) {
  | ([], []) => {search, hash, params}
  | (paths, patterns) =>
    let patternItem = List.hd(patterns);
    let pathItem = List.hd(paths);
    let patterns = List.tl(patterns);
    let paths = List.tl(paths);
    if (firstIter) {
      switch (hasHash(pathItem)) {
      | NoHash =>
        switch (hasSearch(patternItem)) {
        | NoSearch => loopPop(false, path, "", "", params, paths, patterns)
        | Search(_) =>
          let s = String.sub(patternItem, 1, String.length(patternItem) - 1);
          Js.Dict.set(params, s, pathItem);
          loopPop(false, path, s ++ "=" ++ pathItem, "", params, paths, patterns)
        }
      | Hash(loc) =>
        switch (hasSearch(patternItem)) {
        | NoSearch =>
          let h = String.sub(pathItem, loc, String.length(pathItem) - loc);
          loopPop(false, path, "?", h, params, paths, patterns)
        | Search(_) =>
          let h = String.sub(pathItem, loc, String.length(pathItem) - loc);
          let p = String.sub(pathItem, 0, loc);
          let s = String.sub(patternItem, 1, String.length(patternItem) - 1);
          Js.Dict.set(params, s, p);
          loopPop(false, path, s ++ "=" ++ p, h, params, paths, patterns)
        }
      }
    } else {
      switch (hasSearch(patternItem)) {
      | NoSearch =>
        List.length(paths) == 0 ?
          loopPop(false, path, "?" ++ search, hash, params, paths, patterns) :
          loopPop(false, path, search, hash, params, paths, patterns)
      | Search(_) =>
        let s = String.sub(patternItem, 1, String.length(patternItem) - 1);
        Js.Dict.set(params, s, pathItem);
        List.length(paths) == 0 ?
          loopPop(
            false,
            path,
            "?" ++ s ++ "=" ++ pathItem ++ "&" ++ search,
            hash,
            params,
            paths,
            patterns
          ) :
          loopPop(
            false,
            path,
            s ++ "=" ++ pathItem ++ "&" ++ search,
            hash,
            params,
            paths,
            patterns
          )
      }
    }
  };

/*
   Generate a Url Object from a Url:
    {
       path: "/search/something1/thing#someHash",
       search: "?query=something1",
       hash: "#someHash",
       params: {
         query: "something1"
       }
     }
 */
let parseUrl = (url, urls, patterns) =>
  loopPop(true, url, "", "", Js.Dict.empty(), urls, patterns);

/*
   Generate a Url from a Url Object:
    {
       path: "/search/something1",
       search: "?query=something1",
       hash: "#someHash"
       params: {
         query: "something1"
       }
     }
   - Pattern: "/search/:query"
   - Url: "/search/something1"
 */
/* let parseUrlObj = (urlObj) => {}; */
/*
   Compliance Rules:
   - static path: Must Be equal verbatim
   - query param: value doesn't matter

   Pop the pattern and path stack until compliance fails or stack is empty
   - First Iteration Value
     - If contains a hash remove it and compare
       - If compliant recurse with true
       - If not compliant stop and return false
     - If doesn't contain hash compare
       - If compliant recurse with true
       - If not compliant stop and return false
   - Remaining Iterations
     - If compliant recurse with true
     - If not compliant stop and return false
 */
let rec isPathCompliance = (firstIter, paths, patterns) =>
  switch (firstIter, paths, patterns) {
  | (_, [], []) => true
  | (true, paths, patterns) =>
    let patternItem = List.hd(patterns);
    let pathItem = List.hd(paths);
    let patterns = List.tl(patterns);
    let paths = List.tl(paths);
    switch (hasHash(pathItem)) {
    | NoHash =>
      switch (hasSearch(patternItem)) {
      | NoSearch => pathItem != patternItem ? false : isPathCompliance(false, paths, patterns)
      | Search(_) => isPathCompliance(false, paths, patterns)
      }
    | Hash(loc) =>
      switch (hasSearch(patternItem)) {
      | NoSearch =>
        String.sub(pathItem, 0, loc) != patternItem ?
          false : isPathCompliance(false, paths, patterns)
      | Search(_) => isPathCompliance(false, paths, patterns)
      }
    }
  | (false, paths, patterns) =>
    let patternItem = List.hd(patterns);
    let pathItem = List.hd(paths);
    let patterns = List.tl(patterns);
    let paths = List.tl(paths);
    switch (hasSearch(patternItem)) {
    | NoSearch =>
      pathItem == patternItem ?
        List.length(paths) == 0 ? true : isPathCompliance(false, paths, patterns) : false
    | Search(_) => List.length(paths) == 0 ? true : isPathCompliance(false, paths, patterns)
    }
  };

let matchPath = (url, pattern) => {
  let formatUrl = url == "/" ? url : url |> addLeadingSlash |> removeTrailingSlash;
  let formatPattern = pattern == "/" ? pattern : pattern |> addLeadingSlash |> removeTrailingSlash;
  switch (loopPush(formatUrl, formatPattern)) {
  | Some((u, p)) =>
    if (isPathCompliance(true, u, p)) {
      Some((formatUrl, u, p))
    } else {
      None
    }
  | None => None
  }
};

let getInt = (params, field) =>
  switch (Js.Dict.get(params, field)) {
  | Some(v) =>
    switch (int_of_string(v)) {
    | x => Some(x)
    | exception (Failure(_)) => None
    }
  | None => None
  };

let getString = (params, field) =>
  switch (Js.Dict.get(params, field)) {
  | Some(v) => Some(v)
  | None => None
  };
