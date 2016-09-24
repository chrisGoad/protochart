


pj.require('simple_bar_chart.js','sample_data0.js',function (erm,graphP,data) {
  var item = pj.svg.Element.mk('<g/>');
  item.set("graph",graphP.instantiate());
  item.graph.__setData(data);
  //item.graph.__isPart = 1;
  //item.__isAssembly = 1;
  pj.returnValue(undefined,item);
});
/*
http://127.0.0.1:3000/edit.html?source=/repo1/example/external_data.js

http://prototypejungle.org/chartsd?source=http://prototypejungle.org/sys/repo3|example/external_data.js
*/
