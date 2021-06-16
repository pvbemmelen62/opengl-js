
// Square matrix
Matrix = function(m) {
    this.m = m;
    var numCols = m[0].length;
    for(var r=1; r<m.length; ++r) {
        var okay = m[r].length == numCols;
        if(!okay) {
            throw "Invalid input: matrix has rows of varying length.";
        }
    }
};
Matrix.identity = function(n) {
  var m = Matrix.zeros(n,n);
  for(var r=0; r<n; ++r) {
    m[r][r] = 1;
  }
  return m;
};
Matrix.zeros = function(nr,nc) {
  var m = new Array(nr);
  for(var r=0; r<nr; ++r) {
    m[r] = new Array(nc);
    for(var c=0; c<nc; ++c) {
      m[r][c] = 0;
    }
  }
  return m;
};
Matrix.toString = function(m) {
  var isMatrix = (m instanceof Matrix);
  if(isMatrix) {
    m = m.m;
  }
  var s = "[" + "\n";
  var nr = m.length;
  var nc = m[0].length;
  for(var r=0; r<nr; ++r) {
    s += "  [";
    for(var c=0; c<nc; ++c) {
      s += m[r][c].toFixed(6) + ", ";
    }
    s += "]" + "\n";
  }
  s += "]" + "\n";
  return s;
};
Matrix.unary = function(m, func) {
  var isMatrix = (m instanceof Matrix);
  if(isMatrix) {
    m = m.m;
  }
  var nr = m.length;
  var nc = m[0].length;
  var result = Matrix.zeros(nr,nc);
  for(var r=0; r<nr; ++r) {
    for(var c=0; c<nc; ++c) {
      result[r][c] = func(m[r][c]);
    }
  }
  if(isMatrix) {
    result = new Matrix(result);
  }
  return result;
};
Matrix.scale = function(m, scale) {
  var rv = Matrix.unary(m, x => scale*x);
  return rv;
}
Matrix.binary = function(m0,m1,func) {
  Util.assert(Util.sameType(m0, m1));
  var isMatrix = (m0 instanceof Matrix);
  if(isMatrix) {
    m0 = m0.m;
    m1 = m1.m;
  }
  var nr = m0.length;
  var nc = m0[0].length;
  var result = Matrix.zeros(nr,nc);
  for(var r=0; r<nr; ++r) {
    for(var c=0; c<nc; ++c) {
      result[r][c] = func(m0[r][c], m1[r][c]);
    }
  }
  if(isMatrix) {
    result = new Matrix(result);
  }
  return result;
};
Matrix.add = function(m0,m1) {
  var rv = Matrix.binary(m0,m1,(x,y) => (x+y));
  return rv;
}
Matrix.subtract = function(m0,m1) {
  var rv = Matrix.binary(m0,m1,(x,y) => (x-y));
  return rv;
}
Matrix.accumulate = function(m,func,initial) {
  var isMatrix = (m instanceof Matrix);
  if(isMatrix) {
    m = m.m;
  }
  var value = initial;
  for(var r=0; r<nr; ++r) {
    for(var c=0; c<nc; ++c) {
      value = func(m[r][c], value);
    }
  }
  return value;
};
Matrix.transpose = function(m) {
  var isMatrix = (m instanceof Matrix);
  if(isMatrix) {
    m = m.m;
  }
  if(!Array.isArray(m[0])) {
    throw "m must be two dimensional."
  }
  var nr = m.length;
  var nc = m[0].length;
  var rv = Matrix.zeros(nc, nr);
  var r;
  var c;
  for(r=0; r<nr; ++r) {
    for(c=0; c<nc; ++c) {
      rv[c][r] = m[r][c];
    }
  }
  if(isMatrix) {
    rv = new Matrix(rv);
  }
  return rv;
};
Matrix.inverse = function(m) {
  var isMatrix = (m instanceof Matrix);
  if(isMatrix) {
    m = m.m;
  }
  var n = this.m.length;
  var ab = this.concat(Matrix.identity(n));
  var inv = gauss(ab);
  if(isMatrix) {
    inv = new Matrix(inv);
  }
  return inv;
};
/* Multiplies m and x.
 * Return type equals type of x .
 */
Matrix.multiply = function(m, x) {
  var isMatrix = {};
  isMatrix.m = (m instanceof Matrix);
  if(isMatrix.m) {
    m = m.m;
  }
  isMatrix.x = (x instanceof Matrix);
  if(isMatrix.x) {
    x = x.m;
  }
  var result;
  if(!Array.isArray(x)) {
    // scalar
    result = this.copy();
    var nr = m.length;
    var nc = m[0].length;
    for(var r=0; r<nr; ++r) {
      for(var c=0; c<nc; ++c) {
        result[r][c] *= x;
      }
    }
  }
  else if(!Array.isArray(x[0])) {
    // vector but should be thought of as matrix with dimensions [x.lenght, 1].
    result = new Array(m.length);
    for(var r=0; r<m.length; ++r) {
      result[r] = 0;
      for(var c=0; c<m[0].length; ++c) {
        result[r] += m[r][c]*x[c];
      }
    }
  }
  else {
    var nr = m.length;
    var nc = m[0].length;
    var nrx = x.length;
    var ncx = x[0].length;
    if(nc != nrx) {
      throw "Wrong dimensions";
    }
    result = Matrix.zeros(nr,ncx);
    for(var cx=0; cx<ncx; ++cx) {
      for(var r=0; r<nr; ++r) {
        for(var c=0; c<nc; ++c) {
          result[r][cx] += m[r][c]*x[c][cx];
        }
      }
    }
  }
  if(isMatrix.x) {
    result = new Matrix(result);
  }
  return result;
};
Matrix.copy = function(m) {
  var isMatrix = (m instanceof Matrix);
  if(isMatrix) {
    m = m.m;
  }
  var result = new Array(m.length);
  for(var r=0; r<m.length; ++r) {
    result[r] = new Array(m[r].length);
    for(var c=0; c<m[r].length; ++c) {
      result[r][c] = m[r][c];
    }
  }
  if(isMatrix) {
    return new Matrix(result);
  }
  return result;
};
/** Concats matrix m and b.
 * Return type is type of b.
 */
Matrix.concat = function(m, b) {
  var isMatrix = {};
  isMatrix.m = (m instanceof Matrix);
  if(isMatrix.m) {
    m = m.m;
  }
  isMatrix.b = (b instanceof Matrix);
  if(isMatrix.b) {
    b = b.m;
  }
  if(! m.length == b.length) {
    throw "Invalid argument: b has wrong length";
  }
  var ab = Matrix.copy(m);
  if(Array.isArray(b[0])) {
    var ncb = b[0].length;
    for(var r=0; r<ab.length; ++r) {
      for(var c=0; c<ncb; ++c) {
        ab[r].push(b[r][c]);
      }
    }
  }
  else {
    for(var r=0; r<ab.length; ++r) {
      ab[r].push(b[r]);
    }
  }
  if(isMatrix.m) {
    ab = new Matrix(ab);
  }
  return ab;
};
/* Return x such that:  Matrix * x = b
 * Type of x is same as type of b.
 */
Matrix.solve = function(m, b) {
  var isMatrix = {};
  isMatrix.m = (m instanceof Matrix);
  if(isMatrix.m) {
    m = m.m;
  }
  isMatrix.b = (b instanceof Matrix);
  if(isMatrix.b) {
    b = b.m;
  }
  var ab = Matrix.concat(m, b);
  var x = gauss(ab);
  if(isMatrix.b) {
    x = new Matrix(x);
  }
  return x;
};

Matrix.prototype = {
  toString : function() {
    return Matrix.toString(this);
  },
  scale : function(scale) {
    return Matrix.scale(this, scale);
  },
  add : function(m) {
    return Matrix.add(this,m);
  },
  subtract : function(m) {
    return Matrix.subtract(this,m);
  },
  transpose : function() {
    return Matrix.transpose(this);
  },
  inverse : function() {
    return Matrix.inverse(this);
  },
  multiply : function(x) {
    return Matrix.multiply(this, x);
  },
  copy : function() {
    return Matrix.copy(this);
  },
  concat : function(b) {
    return Matrix.concat(this, b);
  },
  solve : function(b) {
    return Matrix.solve(this, b);
  }
}

