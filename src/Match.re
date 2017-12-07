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
let loopPush = (path, pattern) => {
  let rec loopPush = (path, pattern, pathsAndPatterns) =>
    switch (path, pattern) {
    | ("", "") => pathsAndPatterns
    | ("", _)
    | (_, "") => []
    | (path, pattern) =>
      let (newUrlHead, nextUrl) =
        if (String.contains_from(path, 1, '/')) {
          let uNextSlash = String.index_from(path, 1, '/');
          let uItem = String.sub(path, 1, uNextSlash - 1);
          (uItem, String.sub(path, uNextSlash, String.length(path) - uNextSlash))
        } else {
          (String.sub(path, 1, String.length(path) - 1), "")
        };
      let (newPatternHead, nextPattern) =
        if (String.contains_from(pattern, 1, '/')) {
          let pNextSlash = String.index_from(pattern, 1, '/');
          let pItem = String.sub(pattern, 1, pNextSlash - 1);
          (pItem, String.sub(pattern, pNextSlash, String.length(pattern) - pNextSlash))
        } else {
          (String.sub(pattern, 1, String.length(pattern) - 1), "")
        };
      loopPush(nextUrl, nextPattern, [(newUrlHead, newPatternHead), ...pathsAndPatterns])
    };
  loopPush(path, pattern, [])
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
/*
  Pop the pattern and path stack until empty
    - If the fist pop contains a "#" sub from it to the end and set it as the
      hash. Disregard from the hash to the end.
    - Check the pop value from the pattern
      + if it is a search param then put it in search and match params.
      + if it is a path then do nothing
 */
let parseUrl = (pathsAndPatterns) => {
  let rec remainingIterations = (search, hash, params, pathsAndPatterns) =>
    switch pathsAndPatterns {
    | [] => {search, hash, params}
    | [(singlePath, singlePattern)] =>
      switch (hasSearch(singlePattern)) {
      | NoSearch => remainingIterations("?" ++ search, hash, params, [])
      | Search(_) =>
        let s = String.sub(singlePattern, 1, String.length(singlePattern) - 1);
        Js.Dict.set(params, s, singlePath);
        remainingIterations("?" ++ s ++ "=" ++ singlePath ++ "&" ++ search, hash, params, [])
      }
    | [(pathHead, patternHead), ...rest] =>
      switch (hasSearch(patternHead)) {
      | NoSearch => remainingIterations(search, hash, params, rest)
      | Search(_) =>
        let s = String.sub(patternHead, 1, String.length(patternHead) - 1);
        Js.Dict.set(params, s, pathHead);
        remainingIterations(s ++ "=" ++ pathHead ++ "&" ++ search, hash, params, rest)
      }
    };
  let firstIteration = (search, hash, params, pathsAndPatterns) =>
    switch pathsAndPatterns {
    | [] => {search, hash, params}
    | [(pathHead, patternHead), ...rest] =>
      switch (hasHash(pathHead), hasSearch(patternHead)) {
      | (NoHash, NoSearch) => remainingIterations("", "", params, rest)
      | (NoHash, Search(_)) =>
        let s = String.sub(patternHead, 1, String.length(patternHead) - 1);
        Js.Dict.set(params, s, pathHead);
        remainingIterations(s ++ "=" ++ pathHead, "", params, rest)
      | (Hash(loc), NoSearch) =>
        let h = String.sub(pathHead, loc, String.length(pathHead) - loc);
        remainingIterations("?", h, params, rest)
      | (Hash(loc), Search(_)) =>
        let h = String.sub(pathHead, loc, String.length(pathHead) - loc);
        let p = String.sub(pathHead, 0, loc);
        let s = String.sub(patternHead, 1, String.length(patternHead) - 1);
        Js.Dict.set(params, s, p);
        remainingIterations(s ++ "=" ++ p, h, params, rest)
      }
    };
  firstIteration("", "", Js.Dict.empty(), pathsAndPatterns)
};

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
let isPathCompliant = (pathsAndPatterns) => {
  let rec remainingIterations =
    fun
    | [] => true
    | [(pathHead, patternHead)] =>
      switch (hasSearch(patternHead)) {
      | NoSearch => pathHead == patternHead
      | Search(_) => true
      }
    | [(pathHead, patternHead), ...rest] =>
      switch (hasSearch(patternHead)) {
      | NoSearch => pathHead == patternHead && remainingIterations(rest)
      | Search(_) => remainingIterations(rest)
      };
  let firstIteration =
    fun
    | [] => true
    | [(pathHead, patternHead), ...rest] =>
      switch (hasHash(pathHead), hasSearch(patternHead)) {
      | (NoHash, NoSearch) => pathHead == patternHead && remainingIterations(rest)
      | (NoHash, Search(_)) => remainingIterations(rest)
      | (Hash(loc), NoSearch) =>
        String.sub(pathHead, 0, loc) == patternHead && remainingIterations(rest)
      | (Hash(_), Search(_)) => remainingIterations(rest)
      };
  firstIteration(pathsAndPatterns)
};

let matchPath = (url, pattern) => {
  let formatUrl =
    switch url {
    | "/" => url
    | url => url |> addLeadingSlash |> removeTrailingSlash
    };
  let formatPattern =
    switch pattern {
    | "/" => pattern
    | pattern => pattern |> addLeadingSlash |> removeTrailingSlash
    };
  switch (loopPush(formatUrl, formatPattern)) {
  | [] => None
  | pathsAndPatterns =>
    if (isPathCompliant(pathsAndPatterns)) {
      Some((formatUrl, pathsAndPatterns))
    } else {
      None
    }
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
