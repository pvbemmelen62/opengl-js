

function Debug(id, atTop, max) {
  this.id = id;
  this.atTop = atTop;
  this.max = max;
  this.count = 0;
}
/**
 * Creates a function that takes a string and writes that to the element with id given by the id parameter.
 * @id  id of element to which text nodes are appended/prepended.
 * @atTop true if each text node is added as first child, false if added as last child.
 * @max max number of text nodes that the element given by id will hold.
 * Usage example:
 *   var debug = Debug.createFunction("preId", true, 40);
 * will create a function and store it in variable debug; when called with a string argument,
 * that function will write the string as a text node to the element given by "preId" ;
 * for proper effect, the element given by the id, should be a <pre> element.
 */
Debug.createFunction = function(id, atTop, max) {
  // too complex maybe ?
  return (function() {
    var _id = id;
    var _atTop = atTop;
    var _max = max; 
    var _debug = new Debug(_id, _atTop, _max);
    return function(s) { _debug.debug(s) };
  }());
}
Debug.prototype = {
  debug : function (s) {
    var textNode = document.createTextNode(s + "\n");
    var parent = document.getElementById(this.id)
    if(this.atTop) {
      parent.prepend(textNode)
      this.count += 1;
      if(this.count>this.max) {
        parent.lastChild.remove();
        this.count -= 1;
      }
    }
    else {
      parent.appendChild(textNode);
      this.count += 1;
      if(this.count>this.max) {
        parent.firstChild.remove();
        this.count -= 1;
      }
    }
  }
}
