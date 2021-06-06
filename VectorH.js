
function VectorH() {
}
VectorH.from3D = function(v) {
  return [v[0],v[1],v[2],1];
}
VectorH.to3D = function(v) {
  return [v[0]/v[3],v[1]/v[3],v[2]/v[3]];
}
