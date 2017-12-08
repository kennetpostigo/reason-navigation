/*
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

type path = list((string, string));

type search =
  | Search(int)
  | NoSearch;

type hash =
  | Hash(int)
  | NoHash;

let removeTrailingSlash = (url) => {
  let lastChar = url.[(Str.length(url) |> Str.someOr(~alt=1)) - 1];
  switch lastChar {
  | '/' => Str.sub(url, 0, (Str.length(url) |> Str.someOr(~alt=1)) - 1) |> Str.someOr(~alt=url)
  | _ => url
  }
};

let addLeadingSlash = (url) =>
  switch (Str.get(url, 0) |> Str.someOr(~alt="")) {
  | "" => "/"
  | "/" => url
  | _ => "/" ++ url
  };

let hasSearch = (url) =>
  switch (String.contains(url, ':')) {
    | true => Search(Str.index(url, ':') |> Str.someOr(~alt=-1))
    | false => NoSearch
  };

let hasHash = (url) =>
  switch (String.contains(url, '#')) {
    | true => Hash((Str.index(url, '#') |> Str.someOr(~alt=-1)))
    | false => NoHash
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

/*
  Iterate through the path and pattern
    - push the path into a path stack
    - push the pattern into a pattern stack
 */
/* TODO: this throws because of string ops */
let stringToPath = (path, pattern) => {
  let rec stringToPath = (path, pattern, pathsAndPatterns) =>
    switch (path, pattern) {
    | ("", "") => pathsAndPatterns
    | ("", _)
    | (_, "") => []
    | (path, pattern) =>
      let (newUrlHead, nextUrl) =
        switch (String.contains_from(path, 1, '/')) {
        | true => 
            let nextUrlSlash = String.index_from(path, 1, '/');
            let urlItem = String.sub(path, 1, nextUrlSlash - 1);
            (urlItem, String.sub(path, nextUrlSlash, String.length(path) - nextUrlSlash))
        | false =>  (String.sub(path, 1, String.length(path) - 1), "")
        };
      let (newPatternHead, nextPattern) =
        switch (String.contains_from(pattern, 1, '/')) {
         | true =>  
            let nextPatternSlash = String.index_from(pattern, 1, '/');
            let patternItem = String.sub(pattern, 1, nextPatternSlash - 1);
            (patternItem, String.sub(pattern, nextPatternSlash, String.length(pattern) - nextPatternSlash))
        | false => (String.sub(pattern, 1, String.length(pattern) - 1), "")
        };
      stringToPath(nextUrl, nextPattern, [(newUrlHead, newPatternHead), ...pathsAndPatterns])
    };
  stringToPath(path, pattern, [])
};

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
    | [(pathHead, patternHead)] =>
      switch (hasSearch(patternHead)) {
      | NoSearch => remainingIterations("?" ++ search, hash, params, [])
      | Search(_) =>
        let s = String.sub(patternHead, 1, String.length(patternHead) - 1);
        Js.Dict.set(params, s, pathHead);
        remainingIterations("?" ++ s ++ "=" ++ pathHead ++ "&" ++ search, hash, params, [])
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
  let normalizedPathsAndPatterns =
    switch pathsAndPatterns {
    | [(path, pattern), ...rest] =>
      switch (hasHash(path)) {
      | NoHash => pathsAndPatterns
      | Hash(loc) => [(String.sub(path, 0, loc), pattern), ...rest]
      }
    | _ => pathsAndPatterns
    };
  normalizedPathsAndPatterns
  |> List.for_all(
       ((path, pattern)) =>
         switch (hasSearch(pattern)) {
         | NoSearch => path == pattern
         | Search(_) => true
         }
     )
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
  switch (stringToPath(formatUrl, formatPattern)) {
  | [] => None
  | pathsAndPatterns =>
    if (isPathCompliant(pathsAndPatterns)) {
      Some((formatUrl, pathsAndPatterns))
    } else {
      None
    }
  }
};