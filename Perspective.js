
function Perspective() {
}
Perspective.prototype = {

  /**
   *  Returns matrix that maps frustum to cube -1<=x<=1, -1<=y<=1, -1<=z<=1.
   */
  getFrustum : function(left,right,bottom,top,near,far) {
    let l=left,r=right,b=bottom,t=top,n=near,f=far;
    let R = [
      [2*n/(r-l) ,  0        , (r+l)/(r-l)  ,   0          ],
      [  0       , 2*n/(t-b) , (t+b)/(t-b)  ,   0          ],
      [  0       ,  0        , -(f+n)/(f-n) , -2*f*n/(f-n) ],
      [  0       ,  0        ,  -1          ,   0          ]
    ];
    return R;
  },
  /**
   *  Returns matrix that maps frustum to cube -1<=x<=1, -1<=y<=1, -1<=z<=1.
   */
  getPerspective : function(fovy,aspect,near,far) {
    // TODO
  }
}
