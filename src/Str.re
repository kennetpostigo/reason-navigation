let sub = (str, start, len) =>
  switch (String.sub(str, start, len)) {
  | exception (Invalid_argument(_)) => None
  | sub => Some(sub)
  };

let length = (str) =>
  switch (String.length(str)) {
  | exception (Invalid_argument(_)) => None
  | len => Some(len)
  };

let index = (str, chr) =>
  switch (String.index(str, chr)) {
  | exception Not_found => None
  | index => Some(index)
  };

let indexFrom = (str, index, char) =>
  switch (String.index_from(str, index, char)) {
  | exception (Invalid_argument(_)) => None
  | exception Not_found => None
  | nextIndex => Some(nextIndex)
  };

let get = (str, index) =>
  switch str.[index] {
  | exception (Invalid_argument(_)) => None
  | chr => Some(String.make(1, chr))
  };

let someOr = (opt, ~alt) =>
  switch opt {
  | Some(x) => x
  | None => alt
  };