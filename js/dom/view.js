
// This is one of the code files assembled into pjdom.js. 


pj.viewItem = function (item,inDiv,cb) {
  var viewIt = function () {
    var root = pj.svg.Root.mk(document.getElementById(inDiv));
    root.set("contents", item);
    pj.updateParts(root);
    root.fitContents();
    if (cb) {
      cb();
    }
  }
  if (document.readyState == "complete" || document.readyState == "loaded") {
     viewIt();
  } else {
    document.addEventListener('DOMContentLoaded',viewIt);
  }
}
 


/*
pj.viewItem = function (url,inDiv) {
  document.addEventListener('DOMContentLoaded',function () {
    pj.require(url,function (errorMessage,item) {
      var root = pj.svg.Root.mk(document.getElementById(inDiv));
    //var root = pj.svg.Element.mk('<g/>');// the root of the diagram we are assembling
      root.set("contents", item);
      pj.updateParts(root);
      root.fitContents();
    });
  });
}
*/
})(prototypeJungle);

