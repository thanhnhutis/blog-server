import Csrf from "csrf";

const tokens = new Csrf();
// const secret = tokens.secretSync();

export function signCsrf() {
  return tokens.create("123");
}

export function verifyCsrf(csrf: string) {
  return tokens.verify("123", csrf);
}
