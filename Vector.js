
function sqr(x) {
  return x*x;
}
function assert(x) {
  if(!x) {
    throw "Assertion failed";
  }
}

function Vector(arr) {
  this.arr = arr;
}
Vector._length = function(v) {
  var isVector = (v instanceof Vector);
  if(isVector) {
    v = v.arr;
  }
  var lenSqr = 0;
  var i;
  for(i=0; i<v.length; ++i) {
    lenSqr += sqr(v[i]);
  }
  var len = Math.sqrt(lenSqr);
  return len;
}
Vector.binary = function(f,v,w) {
  assert(Util.sameType(v, w));
  var isVector = (v instanceof Vector);
  if(isVector) {
    v = v.arr;
    w = w.arr;
  }
  assert(v.length == w.length);
  var i;
  var rv = new Array(v.length);
  for(i=0; i<v.length; ++i) {
    rv[i] = f(v[i],w[i]);
  }
  if(isVector) {
    rv = new Vector(rv);
  }
  return rv;
}
Vector.subtract = function(v,w) {
  var rv = Vector.binary((v,w)=>(v-w),v,w);
  return rv;
}
Vector.add = function(v,w) {
  var rv = Vector.binary((v,w)=>(v+w),v,w);
  return rv;
}
Vector.normalize = function(v) {
  var isVector = (v instanceof Vector);
  if(isVector) {
    v = v.arr;
  }
  var len = Vector._length(v);
  var cp = v.slice();
  var i;
  for(i=0; i<cp.length; ++i) {
    cp[i] /= len;
  }
  if(isVector) {
    cp = new Vector(cp);
  }
  return cp;
}
Vector.outerProduct = function(v,w) {
  assert(Util.sameType(v, w));
  var isVector = (v instanceof Vector);
  if(isVector) {
    w = w.arr;
    v = v.arr;
  }
  assert(v.length==3 && w.length==3);
  var rv = [
    v[1]*w[2]-v[2]*w[1],
    v[2]*w[0]-v[0]*w[2],
    v[0]*w[1]-v[1]*w[0]
  ];
  if(isVector) {
    rv = new Vector(rv);
  }
  return rv;
}
Vector.prototype = {
  length : function() {
    return Vector._length(this);
  },
  subtract : function(v) {
    var isVector = (v instanceof Vector);
    if(!isVector) {
      v = new Vector(v);
    }
    return Vector.subtract(this, v);
  },
  add : function(v) {
    var isVector = (v instanceof Vector);
    if(!isVector) {
      v = new Vector(v);
    }
    return Vector.add(this, v);
  },
  normalize : function() {
    return Vector.normalize(this);
  },
  outerProduct : function(v) {
    var isVector = (v instanceof Vector);
    if(!isVector) {
      v = new Vector(v);
    }
    return Vector.outerProduct(this,v);
  }
}

