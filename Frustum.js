
function Frustum() {
}

/** Returns Matrix that maps frustum to cube around origin with edges that have length 2.
 * Arguments: left, right, bottom, top, near, far
 * far < near < 0.
 */
Frustum.getMatrixLRBTNF = function(l,r,b,t,n,f) {

// OpenGL Programming Guide,
// The Official Guide to Learning OpenGL, Release 1
// Appendix G: Homogeneous Coordinates and Transformation Matrices,
// page 480
//
//    |2*n/(r-l),   0      ,  (r+l)/(r-l),     0       | 
//    |  0      , 2*n/(t-b),  (t+b)/(t-b),     0       | 
//    |  0      ,   0      , -(f+n)/(f-n), -2*f*n/(f-n)| 
//    |  0      ,   0      ,    -1       ,     0       |
//
// Is equivalent to
//
//  |1/(r-l)    0        0       0 |        | 2*n    0     r+l     0     |
//  |   0     1/(t-b)    0       0 |    *   |  0    2*n    t+b     0     |
//  |   0       0     1/(f-n)    0 |        |  0     0   -(f+n)  -2*f*n  |
//  |   0       0        0       1 |        |  0     0      -1     0     |
//
// which maps
//       [l  b  -n  1]     --> [-1 -1 -1  1]
// (f/n)*[l  b  -n  n/f]   --> [-1 -1  1  1]
//
// Which reverses the direction of the z-axis.
// Thus a right-handed coordinates system is transformed into a left-handed coordinate system.
// If we're only interested in mapping x and y to the html canvas, than that's not a problem.
// But it's easy to make the resulting coordinate system right-handed:

  var S = new Matrix( [
    [1/(r-l),   0    ,   0   ,   0 ],
    [   0   , 1/(t-b),   0   ,   0 ],
    [   0   ,   0    ,1/(f-n),   0 ],
    [   0   ,   0    ,   0   ,   1 ]
  ]);

  var T = [
   [ 2*n ,  0  ,  r+l ,   0     ],
   [  0  , 2*n ,  t+b ,   0     ],
   [  0  ,  0  ,  f+n ,  2*f*n  ],
   [  0  ,  0  ,   -1 ,   0     ]
  ];

  var ST = S.multiply(T);
  return ST;
}

/** Returns Matrix that maps frustum to cube around origin with edges that have length 2.
 *  Frustum z-coordinates range from -near to -far, with
 *  0 < near < far
 */
Frustum.getMatrixFovy = function(fovy, aspect, near, far) {
  var p = Frustum.paramFromFovy(fovy, aspect, near, far);
  var rv = Frustum.getMatrixLRBTNF(p.left,p.right,p.bottom,p.top,p.near,p.far);
  return rv;
}

Frustum.paramFromFovy = function(fovy, aspect, near, far) {
  var d3r = 180/Math.PI;
  var r3d = Math.PI/180;
  var h = 2*near*Math.tan(r3d*fovy/2);
  var w = aspect*h;
  var left = -0.5*w;
  var right = 0.5*w;
  var bottom = -0.5*h;
  var top = 0.5*h;
  var rv = {left:left, right:right, bottom:bottom, top:top, near:near, far:far};
  return rv;
}

//getMatrixInv : function() {
//
// OpenGL Programming Guide,
// page 480
//  var rv = [
//    [(r-l)/(2*n),    0        ,      0        , (r+l)/(2*n)  ],
//    [    0      , (t-b)/(2*n) ,      0        , (t+b)/(2*n)  ],
//    [    0      ,    0        ,      0        ,     -1       ],
//    [    0      ,    0        ,-(f-n)/(2*f*n) , (f+n)/(2*f*n)]
//  ];
//  TODO : find out the right-handed matrix.
//  return rv;
//}


