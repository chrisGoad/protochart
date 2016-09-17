// extensions of pj for prototypejungle  (beyond pjcs)
(function (pj) {


// This is one of the code files assembled into pjdom.js. //start extract and //end extract indicate the part used in the assembly

//start extract


pj.viewItem = function (url,inDiv) {
  document.addEventListener('DOMContentLoaded',function () {
    debugger;
    pj.require(url,function (errorMessage,item) {
      debugger;
      var root = pj.svg.Root.mk(document.getElementById(inDiv));
    //var root = pj.svg.Element.mk('<g/>');// the root of the diagram we are assembling
      root.set("contents", item);
      pj.updateParts(root);
      root.fitContents();
    });
  });
}

//end extract

})(prototypeJungle);

