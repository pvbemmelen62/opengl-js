
function ViewMatrix(eye, lookat, up) {
  this.eye = eye;
  this.lookat = lookat;
  this.up = up;
  this.matrix = null;
}

ViewMatrix.prototype = {
  calcMatrix : function() {
    // OpenGL Reference Manual, Second Edition
    // The Official Reference Document to OpenGL, Version 1.1
    // gluLookAt: page 405, 406
    var {eye,lookat,up} = this;
    var f = Vector.subtract(lookat,eye);
    var fn = Vector.normalize(f);
    var upn = Vector.normalize(up);
    var s = Vector.outerProduct(fn,upn);
    var u = Vector.outerProduct(s,fn);
    var M = [
      [  s[0],  s[1],  s[2], 0],
      [  u[0],  u[1],  u[2], 0],
      [-fn[0],-fn[1],-fn[2], 0],
      [  0   ,  0   ,  0   , 1]
    ];
    var T = [
      [1, 0, 0, -eye[0]],
      [0, 1, 0, -eye[1]],
      [0, 0, 1, -eye[2]],
      [0, 0, 0,  1     ]
    ]
    var M = new Matrix(M);
    //debug(JSON.stringify(M));
    //debug(JSON.stringify(T));
    var rv = M.multiply(T);
    return new Matrix(rv);
  },
  /** Returns view matrix as an Matrix object, that stores an array of rows (aka row major order).*/
  getMatrix : function() {
    if(!this.matrix) {
      this.matrix = this.calcMatrix();
    }
    return this.matrix;
  }
}

