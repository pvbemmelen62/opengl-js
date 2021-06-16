
function Util() {
}

Util.sqr = function(x) {
  return x*x;
}
Util.assert = function(x) {
  if(!x) {
    throw "Assertion failed";
  }
}
Util.sameType = function(a,b) {
  return a.constructor === b.constructor;
}
Util.cosDeg = function(a) {
  return Math.cos(a*Math.PI/180);
}
Util.sinDeg = function(a) {
  return Math.sin(a*Math.PI/180);
}
Util.partitionInterval = function(interval, incrMax) {
  var num = Math.ceil(interval/incrMax);
  var incr = interval/num;
  return {num: num, incr: incr};
}
