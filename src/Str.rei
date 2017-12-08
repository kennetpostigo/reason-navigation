let sub: (string, int, int) => option(string);

let length: string => option(int);

let index: (string, char) => option(int);

let indexFrom: (string, int, char) => option(int);

let get: (string, int) => option(string);

let someOr: (option('a), ~alt: 'a) => 'a;