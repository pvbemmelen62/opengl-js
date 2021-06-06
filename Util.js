
function sqr(x) {
  return x*x;
}
function assert(x) {
  if(!x) {
    throw "Assertion failed";
  }
}
function sameType(a,b) {
  return a.constructor === b.constructor;
}
