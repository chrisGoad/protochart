
pj.require('../chart/bar.js','[TcYg4ep5s5TrvfxG5CWr11vjZZu1]/data/metal_densities.json',function (erm,graphP,data) {
//pj.require('../chart/bar1.js','[twitter:14822695]/data/metal_densities.json',function (erm,graphP,data) {
//pj.require('../chart/bar1.js','../data/trade_balance.js',function (erm,graphP,data) {
  var item = pj.svg.Element.mk('<g/>');
  item.set("graph",graphP.instantiate());
  item.graph.orientation = 'vertical';
  item.graph.axis.bigTickImageInterval = 10;
  item.graph.set('extent',pj.geom.Point.mk(500,300));
  pj.loadDataJSONP('[TcYg4ep5s5TrvfxG5CWr11vjZZu1]/data/metal_densities.json',
     function (data) {
        item.graph.__setData(data);
     });
  pj.returnValue(undefined,item);
});
/*
http://127.0.0.1:3000//edit.html?source=/repo1/example/load_data.js
*/
