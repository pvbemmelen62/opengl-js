
function OpenGL() {
}
OpenGL.prototype = {
  isCPVGood : false,
  mapPoint : function(p) {
    var isH = p.length == 4;
    if(!isH) {
      p = VectorH.from3D(p);
    }
    var rv = this.getCPV().multiply(p);
    if(!isH) {
      rv = VectorH.to3D(rv);
    }
    return rv;
  },
  setEye : function(eye) {
    this.eye = eye;
    this.isCPVGood = false;
  },
  setLookat : function(lookat) {
    this.lookat = lookat;
    this.isCPVGood = false;
  },
  setUp : function(up) {
    this.up = up;
    this.isCPVGood = false;
  },
  setAspect : function(aspect) {
    this.aspect = aspect;
    this.isCPVGood = false;
  },
  setCanvasHeight : function(canvasHeight) {
    this.canvasHeight = canvasHeight;
    this.isCPVGood = false;
  },
  setCanvasWidth : function(canvasWidth) {
    this.canvasWidth = canvasWidth;
    this.isCPVGood = false;
  },
  setFovy : function(fovy) {
    this.fovy = fovy;
    this.isCPVGood = false;
  },
  setNear : function(near) {
    this.near = near;
    this.isCPVGood = false;
  },
  setFar : function(far) {
    this.far = far;
    this.isCPVGood = false;
  },
  calcCPV : function() {
    // TODO improve api for aspect
    var aspect = this.aspect || (this.canvasWidth / this.canvasHeight);
    this.viewMatrix = new ViewMatrix(this.eye, this.lookat, this.up).getMatrix();
    this.perspective = Frustum.getMatrixFovy(this.fovy, aspect, this.near, this.far);

    // Matrix that maps p0 to p1, and q0 to q1.
    var p0 = [-1,-1];
    var p1 = [0, this.canvasHeight];
    var q0 = [1,1];
    var q1 = [this.canvasWidth,0];
    var m = Matrix2DST.fromPoints(p0,p1,q0,q1);
    this.canvasMatrix = new Matrix([
      [m.sx,   0  ,  0   , m.tx],
      [ 0  , m.sy ,  0   , m.ty],
      [ 0  ,   0  ,  1   ,  0  ],
      [ 0  ,   0  ,  0   ,  1  ]
    ]);
    this.cpv = this.canvasMatrix.multiply(this.perspective.multiply(this.viewMatrix));
  },
  getCPV : function() {
    if(!this.isCPVGood) {
      this.isCPVGood = true;
      this.calcCPV();
    }
    return this.cpv;
  }
}
/** Returns 4x4 homogeneous matrix equivalent to 3x3 matrix m.
 *  @param m : 3x3 matrix.
 */
OpenGL.matrixH = function(m) {
  var isMatrix = (m instanceof Matrix);
  if(isMatrix) {
    m = m.m;
  }
  var rv = [
    [m[0][0], m[0][1], m[0][2],  0  ],
    [m[1][0], m[1][1], m[1][2],  0  ],
    [m[2][0], m[2][1], m[2][2],  0  ],
    [  0    ,   0    ,   0    ,  1  ],
  ];
  if(isMatrix) {
    rv = new Matrix(rv);
  }
  return rv;
}
/** Rotation object contains 4x4 matrix this.R that represents rotation. */
OpenGL.Rotation = function(angle, axis) {
  this.axis = axis;
  var u = Vector.normalize(axis);
  var X = 0;
  var Y = 1;
  var Z = 2;
  this.S = new Matrix([
    [  0   , -u[Z],  u[Y] ],
    [ u[Z],    0  , -u[X] ],
    [-u[Y],  u[X] ,   0   ]
  ]);
  u = new Matrix( [ u ] ).transpose();
  var uT = u.transpose();
  this.uuT = u.multiply(uT);
  this.ImuuT = (new Matrix(Matrix.identity(3))).subtract(this.uuT);
  this.applyAngle(angle);
}
OpenGL.Rotation.prototype = {
  applyAngle : function(angle) {
    this.angle = angle;
    var part0 = this.uuT;
    var part1 = this.ImuuT.scale(Util.cosDeg(angle));
    var part2 = this.S.scale(Util.sinDeg(angle));
    this.R = part0.add(part1).add(part2);
    this.RH = OpenGL.matrixH(this.R);
    // for method chaining:
    return this;
  }
}
OpenGL.Translation = function(vector) {
  this.v = vector;
  var v = this.v;
  this.m = [
    [ 1, 0, 0, v[0]],
    [ 0, 1, 0, v[1]],
    [ 0, 0, 1, v[2]],
    [ 0, 0, 0,  1  ]
  ];
}
OpenGL.Translation.prototype = {
  inverse : function() {
    var v = Vector.negate(this.v);
    var rv = new OpenGL.Translation(v);
    return rv;
  }
}
OpenGL.Arc = function(spec) {
  this.angle = spec.angle;
  this.axis = spec.axis;
  this.center = spec.center;
  this.point = spec.point;
  this.angle = spec.angle;
  var angleIncrMax = this.angleIncrMax || OpenGL.Arc.angleIncrMax;
  this.partition = Util.partitionInterval(this.angle, angleIncrMax);
  // arrowhead
  var arrowAngle = this.angle - 2;
  this.rotation = new OpenGL.Rotation(arrowAngle, this.axis);
  this.vector = Vector.subtract(this.point, this.center);
  var vecRot = this.rotation.R.multiply(this.vector);
  if(spec.arrow) {
    this.arrow = {};
    this.arrow.point = Vector.add(this.center, vecRot);
    var direction = Vector.normalize(Vector.outerProduct(this.axis, vecRot));
    this.arrow.tangent = Vector.add(this.arrow.point, direction);
    var arrowBase = Vector.scale(-0.10, direction);
    var arrowTipAngle = 20;
    this.rotation.applyAngle(arrowTipAngle);
    var tip = this.rotation.R.multiply(arrowBase);
    this.arrow.tipPlus = Vector.add(this.arrow.point, tip);
    this.rotation.applyAngle(-arrowTipAngle);
    var tip = this.rotation.R.multiply(arrowBase);
    this.arrow.tipMinus = Vector.add(this.arrow.point, tip);
  }
  // arc approximation:
  this.rotation.applyAngle(this.partition.incr);
}
OpenGL.Arc.strokeStyle = "#000000";
OpenGL.Arc.lineDash = [];
OpenGL.Arc.angleIncrMax = 5;
OpenGL.Arc.arrowHead = null;

OpenGL.Arc.prototype = {
  draw : function(ogl, ctx) {
    var strokeStyle = this.strokeStyle || OpenGL.Arc.strokeStyle;
    var lineDash = this.lineDash || OpenGL.Arc.lineDash;
    var {num, incr} = this.partition;
    var i;
    var X = 0;
    var Y = 1;
    var vi = this.vector;
    var p = Vector.add(this.center, vi);
    var q = ogl.mapPoint(p);
    ctx.beginPath();
    ctx.moveTo(q[X],q[Y]);
    for(i=0; i<num; ++i) {
      vi = this.rotation.R.multiply(vi);
      p = Vector.add(this.center, vi);
      q = ogl.mapPoint(p);
      ctx.lineTo(q[X],q[Y]);
    }
    ctx.strokeStyle = strokeStyle;
    ctx.setLineDash(lineDash);
    ctx.stroke();
    if(this.arrow) {
      ctx.beginPath();
      var q = ogl.mapPoint(this.arrow.tipPlus);
      ctx.moveTo(q[X], q[Y]);
      q = ogl.mapPoint(this.arrow.point);
      ctx.lineTo(q[X], q[Y]);
      q = ogl.mapPoint(this.arrow.tipMinus);
      ctx.lineTo(q[X], q[Y]);
      ctx.stroke();
    }
  }
}
OpenGL.Line = function(spec) {
  this.p0 = spec.p0;
  this.p1 = spec.p1;
}
OpenGL.Line.lineWidth = 1;
OpenGL.Line.strokeStyle = "#000000";
OpenGL.Line.lineDash = [];

OpenGL.Line.prototype = {
  scale : function(s) {
    var p0 = Vector.scale(s, this.p0);
    var p1 = Vector.scale(s, this.p1);
    var rv = new OpenGL.Line({p0:p0, p1:p1});
    return rv;
  },
  draw : function(ogl, ctx) {
    var lineWidth = this.lineWidth || OpenGL.Line.lineWidth;
    var strokeStyle = this.strokeStyle || OpenGL.Line.strokeStyle;
    var lineDash = this.lineDash || OpenGL.Line.lineDash;
    var q0 = ogl.mapPoint(this.p0);
    var q1 = ogl.mapPoint(this.p1);
    ctx.beginPath();
    ctx.moveTo(q0[0],q0[1]);
    ctx.lineTo(q1[0],q1[1]);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.setLineDash(lineDash);
    ctx.stroke();
  }
}
OpenGL.Text = function(spec) {
  this.text = spec.text;
  this.point = spec.point;
}
OpenGL.Text.fillStyle = "#000000";
OpenGL.Text.font = "bold 15pt sans-serif";

OpenGL.Text.prototype = {
  draw : function(ogl, ctx) {
    var fillStyle = this.fillStyle || OpenGL.Text.fillStyle;
    var font = this.font || OpenGL.Text.font;
    var q = ogl.mapPoint(this.point);
    ctx.font = font;

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 10;
    ctx.strokeText(this.text, q[0],q[1]);

    ctx.fillStyle = fillStyle;
    ctx.fillText(this.text, q[0],q[1]);
  }
}
