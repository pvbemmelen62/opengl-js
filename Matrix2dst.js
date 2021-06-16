
/**
 * Matrix 2D scale translate
 *   |sx   0  tx| |p0x|   |p1x|
 *   | 0  sy  ty| |p0y| = |p1y|
 *   | 0   0   1| | 1 |   | 1 |
 *
 * @arg sx,sy,tx,ty
 */
function Matrix2DST(sx,sy,tx,ty) {
  this.sx = sx;
  this.sy = sy;
  this.tx = tx;
  this.ty = ty;
}

/*
 * Matrix that maps p0 to p1, and q0 to q1.
 * @arg each arg is an [x,y] .
 */
Matrix2DST.fromPoints = function(p0,p1,q0,q1) {
  let sx = (q1[0]-p1[0])/(q0[0]-p0[0]);
  let sy = (q1[1]-p1[1])/(q0[1]-p0[1]);
  let tx = p1[0] - sx*p0[0];
  let ty = p1[1] - sy*p0[1];
  let rv = new Matrix2DST(sx,sy,tx,ty);
  return rv;
}

Matrix2DST.prototype = {
/**
 * Map argument, which may be one of:
 * x,y
 * [x,y]
 * [[x0,y0],[x1,y1],...]
 * Returns respectively:
 * [x,y]
 * [x,y]
 * [[x0,y0],[x1,y1],...]
 */
  map : function(...as) {
/* as will return arguments in an array:
 *   [x,y]
 *   [[x,y]]
 *   [[[x0,y0],[x1,y1],...]]
 */
    let {sx,sy,tx,ty} = this;
    let rv;
    if(as.length==2 && !Array.isArray(as[0])) {
      let x = as[0];
      let y = as[1];
      rv = [sx*x + tx, sy*y+ty];
    }
    else if(as.length==1 && Array.isArray(as[0]) && !Array.isArray(as[0][0])) {
      let x = as[0][0];
      let y = as[0][1];
      rv = [sx*x + tx, sy*y+ty];
    }
    else if(as.length==1 && Array.isArray(as[0]) && Array.isArray(as[0][0])) {
      rv = [];
      let x;
      let y;
      as[0].forEach(xy => {
        x = xy[0];
        y = xy[1];
        rv.push([sx*x + tx, sy*y+ty]);
      });
    }
    else {
      throw "Matrix2DST.map: Invalid argument";
    }
    return rv;
  },
  verifyPoints(label, ...points) {
    for(var i=0; i<2; ++i) {
      debug(label + ":");
      debug(points[2*i] + " -> " + this.map(points[2*i]));
      debug("  must equal : " + points[2*i+1]);
    }
  },
  inverse : function() {
    let {sx,sy,tx,ty} = this;
    let rv = new Matrix2DST(1/sx,1/sy,-tx/sx,-ty/sy);
    return rv;
  },
  multiply : function(m) {
    let a = this;
    let b = m;
    let rv = new Matrix2DST(a.sx*b.sx, a.sy*b.sy, a.sx*b.tx+a.tx, a.sy*b.ty+a.ty);
    return rv;
  }
}

