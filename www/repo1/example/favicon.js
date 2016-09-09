
(function () {
  var geom = pj.geom;
  var svg = pj.svg;
  var item = svg.Element.mk('<g/>');// the root of the diagram we are assembling
  var p1 = geom.Point.mk(-30,0);
  var p2 = geom.Point.mk(30,0);
  // first the circles
  item.set('rectP',svg.Element.mk('<rect x="-12.5" y="-10" width="25" height="15"  fill="orange"/>')).__hide();
  item.set("rect1",item.rectP.instantiate()).__show();
  item.set("rect2",item.rectP.instantiate()).__show();
  item.rect1.__moveto(geom.Point.mk(0,-16));
  item.rect2.__moveto(geom.Point.mk(0,16))
  item.set('circleP',svg.Element.mk(
   '<circle fill="rgb(39, 49, 151)" stroke="black" stroke-width="2" \ r="20" />').__hide());
  item.set("circle1",item.circleP.instantiate()).__show();
  item.set("circle2",item.circleP.instantiate()).__show();
  item.circle1.__moveto(p1);
  item.circle2.__moveto(p2);
  // now the arrows 
  pj.returnValue(undefined,item);
})();
/*
 *
 *
http://prototypejungle.org/edit.html?source=http://prototypejungle.org/repo1/example/simple_diagram.js
*/
