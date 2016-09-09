
pj.require('../shape/arc_arrow.js',function (errorMessage,arrowPP) {
  var geom = pj.geom;
  var svg = pj.svg;
  var item = svg.Element.mk('<g/>');// the root of the diagram we are assembling
  var p1 = geom.Point.mk(-30,0);
  var p2 = geom.Point.mk(30,0);
  // first the circles
  item.set('rect',svg.Element.mk('<rect x="-45" y="-45" width="90" height="90"  fill="white"/>'));

  item.set('circleP',svg.Element.mk(
   '<circle fill="rgb(39, 49, 151)" stroke="black" stroke-width="2" \ r="10" />').__hide());
  item.set("circle1",item.circleP.instantiate()).__show();
  item.set("circle2",item.circleP.instantiate()).__show();
  item.circle1.__moveto(p1);
  item.circle2.__moveto(p2);
  // now the arrows 
  item.set("arrowP",arrowPP.instantiate()).__hide();
  item.arrowP.stroke = 'orange';
  item.arrowP.radius = 0.9; // radius of the arc as a multiple of arrow length
  item.arrowP.headGap = 15;
  item.arrowP.tailGap = 15;
  item.arrowP['stroke-width'] = 3;
  item.set("arrow1",item.arrowP.instantiate()).__show();
  item.set("arrow2",item.arrowP.instantiate()).__show();
  item.arrow1.setEnds(p1,p2);
  item.arrow2.setEnds(p2,p1);
  pj.returnValue(undefined,item);
});
/*
 *
 *
http://prototypejungle.org/edit.html?source=http://prototypejungle.org/repo1/example/simple_diagram.js
*/
