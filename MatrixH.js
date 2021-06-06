
function MatrixH() {
}
MatrixH.map3D = function(m, v) {
  var rv = VectorH.to3D(m.multiply(VectorH.from3D(v)));
  return rv;
}

