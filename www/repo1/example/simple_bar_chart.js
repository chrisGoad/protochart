(function () {
var item = pj.svg.Element.mk('<g/>');
// barP is the prototype for bars
item.set("barP",pj.svg.Element.mk(
  '<rect fill="rgb(39, 49, 151)" stroke="black" stroke-width="3"  height="50"/>'));
item.barP.scale = 100;
item.set("spread",pj.Spread.mk(item.barP));
item.spread.binder = function (mark,data,index,size) {
  mark.width = mark.scale * data; // the width of the bar set from the data
  mark.y = index * 60; // stack the bars from top to bottom
}
item.__setData({"elements":[3,4,1]});
item.update = function () {
  // send the data down to the spread
  this.spread.__setData(this.__data,true);
}
pj.returnValue(undefined,item);
})();
/*
http://127.0.0.1:3000/edit.html?source=/repo1/example/simple_bar_chart.js
http://prototypejungle.org/chartsd?source=http://prototypejungle.org/sys/repo3|example/simple_bar_chart.js
*/