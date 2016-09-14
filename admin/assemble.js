/*

cd /mnt/ebs0/prototypejungledev/node;node admin/assemble.js d p

cd /mnt/ebs0/prototypejungledev/node;node admin/assemble.js p p
hw
The project relies on a exploiting the prototypical roots of javascript, via  the prototype tree data strucure,
which is, briefly,  a javascript tree threaded with inheritance chains. 
The major parts of the system are assembled into the single files: pjcs, pjdom and pjui
*/
var what = process.argv[2]; // should be core,dom,ui,inspect or rest (topbar,chooser,view,loginout,worker,bubbles)
//var fromDev = process.argv[3] === 'd';
//var toDev = process.argv[4] === 'd';
 
//console.log('fromDev = ',fromDev,'toDev = ',toDev);
var versions = require("./versions.js");
//var util = require('../ssutil.js');

var fs = require('fs');
//var s3 = require('../s3');
var minify = require('minify');
//var compressor = require('node-minify');
var zlib = require('zlib');    

var dom_files = ["spread","geom","data","dom1","jxon","svg","html","uistub","domstringify"];
var dom_files = ["spread","geom","data","dom1","jxon","svg","html","uistub","domstringify","firebase"];
//var dom_files = ["geom","dom1","jxon","svg","uistub","domstringify"];
dom_files = dom_files.map(function (f) { return "dom/"+f;});

//var ui_files = ["svg_serialize","ajax","constants","firebase","ui","browser",
var ui_files = ["svg_serialize","ajax","constants","ui","browser",
                //"page",
                "save","dom2","controls","svgx","tree1","tree2","lightbox"];
  
ui_files = ui_files.map(function (f) { return "ui/"+f;});

var chooser_files = ["ui/ajax","ui/ui","ui/constants","editor/chooser"];

var view_files = ["ui/poster","ui/constants","ui/min_ui","ui/view"];

var editor_files = ["editor/constants","editor/page_top","editor/page","editor/init"];

function doGzip(file,cb) {
  console.log("gzipping ",file);
  var gzip = zlib.createGzip();
  var inp = fs.createReadStream(file);
  var out = fs.createWriteStream(file+'.gz');
  inp.pipe(gzip).pipe(out);
  out.on('close',cb);
}



function fullName(f) {
  return 'js/'+f+".js";
}

function extract(fl) {
  var fln = fullName(fl);
  console.log("Reading from ",fln);
  var cn = ""+fs.readFileSync(fln);
  var sex0 = cn.indexOf("\n//start extract");
  if (sex0 < 0) {
    return cn;
  }
  var sex = sex0 + ("//start extract".length + 2);
  var eex = cn.indexOf("\n//end extract")-1;
  var ex = cn.substring(sex,eex);
  return ex;
}

function getContents(fl) {
  var fln = fullName(fl);
  console.log("Reading from ",fln);
  var cn = ""+fs.readFileSync(fln)
  return cn;
}

function mextract(fls) {
  var rs = "";
  fls.forEach(function (fl) {
    rs += extract(fl);
  });
  return rs;
}


function mkS3Path(which,version,mini) {
  
  return "www/js/"+which+"-"+version+(mini?".min":"")+".js";
  //return (toDev?"www/djs/":"www/js/")+which+"-"+version+(mini?".min":"")+".js";

}


function mkLocalFile(which,version,mini) {
  return "/home/ubuntu/staging/www/js/"+which+"-"+version+(mini?".min":"")+".js";
}

function mkModule(which,version,contents,cb) {
  console.log('mkModule',which,version);
  var rs = contents;
  var path = mkS3Path(which,version,0);
  var minpath = mkS3Path(which,version,1);
  var gzPath =  mkS3Path(which,version,1);
  console.log("Saving to path ",path);
  fs.writeFileSync(path,rs);
  minify(path,function (err,compressed) {
      console.log(err,"Saving the compressed file to ",minpath,!!compressed);
      fs.writeFileSync(minpath,compressed); // save the compressed version locally
      doGzip(minpath,function () { // finally ,gzip it;
        console.log("gzipping done");
      });
      
  });
}
 
 
  //var minifier = new compressor.minify;
  /*
  new compressor.minify({type:'gcc',
           fileIn:path,
           fileOut:minpath,
           callback:function (err,min) {
             console.log(err,"Saved the compressed file to ",minpath);
             doGzip(minpath,function () { 
               console.log("gzipping done");
             });
           } 
  });
*/                    
                     
                 

function mk_pjdom(cb) { 
  var fls = dom_files;
  var rs =
  '\nwindow.prototypeJungle =  (function () {\n\"use strict"\n'+mextract(fls) + "\nreturn pj;\n})();\n";
  mkModule("pjdom",versions.pjdom,rs,cb);
  
}


function mk_pjui(cb) { 
  var fls = ui_files;
  var rs = "(function (pj) {\n\nvar geom=pj.geom,dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,fb=pj.fb,ui=pj.ui;\n"+
 // var rs = "(function (pj) {\n\nvar om=pj.om,geom=pj.geom,dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui;\n"+
            '"use strict"\n'+
             mextract(fls) + "\n})(prototypeJungle);\n"
  mkModule('pjui',versions.pjui,rs,cb);

}



function mk_pjpage(cb) { 
  var fls = page_files;
  var rs = "(function (pj) {\n\nvar om=pj.om,geom=pj.geom,dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui;tree=pj.tree;lightbox=pj.lightbox;\n"+
 // var rs = "(function (pj) {\n\nvar om=pj.om,geom=pj.geom,dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui;\n"+
            '"use strict"\n'+
             mextract(fls) + "\n})(prototypeJungle);\n"
  mkModule('pjpage',versions.pjpage,rs,cb);

}



function mk_pjinspect(cb) {
  var fls = inspect_files;
  var rs = "(function (pj) {\n\nvar geom=pj.geom,dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui;lightbox=pj.lightbox,tree=pj.tree\n"+
            '"use strict"\n'+
             mextract(fls) + "\n})(prototypeJungle);\n"
  mkModule('pjinspect',versions.pjinspect,rs,cb);
}


function mk_pjdev(cb) {
  var fls = dev_files;
  var rs = "(function (pj) {\n\nvar geom=pj.geom,dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui;lightbox=pj.lightbox,tree=pj.tree\n"+
            '"use strict"\n'+
             mextract(fls) + "\n})(prototypeJungle);\n"
  mkModule('pjdev',versions.pjdev,rs,cb);
}

function mk_pjdraw(cb) {
  var fls = draw_files;
  var rs = "(function (pj) {\n\nvar geom=pj.geom,dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui;lightbox=pj.lightbox,tree=pj.tree\n"+

// var rs = "(function (pj) {\n\nvar dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui;\n"+
            '"use strict"\n'+
             mextract(fls) + "\n})(prototypeJungle);\n"
  mkModule('pjdraw',versions.pjdraw,rs,cb);f

}
// used to support the top bar for website pages
/* OBSOLETE function mk_topbar(cb) {
  var fls = topbar_files;
  console.log("Files:",fls);
  var rs =
  '\nwindow.prototypeJungle = {};\n(function (pj) {\n\"use strict"\n'+mextract(fls) + "\nreturn pj;\n})(prototypeJungle);\n";
  mkModule("topbar",versions.topbar,rs,cb);

}
*/
function mk_pjchooser(cb) {
  var fls = chooser_files;
  var rs = "(function (pj) {\n\nvar dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui;\n"+
            '"use strict"\n'+
             mextract(fls) + "\n})(prototypeJungle);\n"
  
  mkModule("pjchooser",versions.pjchooser,rs,cb);

}

function mk_pjview(cb) {
  var fls = view_files;
  var rs = "(function (pj) {\n\nvar dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui;\n"+
            '"use strict"\n'+
             mextract(fls) + "\n})(prototypeJungle);\n"
  
  mkModule("pjview",versions.pjview,rs,cb);

}


function mk_pjloginout(cb) {
  var fls = loginout_files;
  var rs =   '\nwindow.prototypeJungle =  window.pj = (function () {\n\"use strict"\n'+mextract(fls) + "\nreturn pj;\n})();\n";
  mkModule("pjloginout",versions.pjloginout,rs,cb);
}



function mk_pjworker(cb) {
  var fls = worker_files;
  var rs =   '(function () {\n\"use strict"\n'+mextract(fls) + "\nreturn pj;\n})(prototypeJungle);\n";
  mkModule("pjworker",versions.pjworker,rs,cb);
}


function mk_insert(cb) {
  debugger;
  var rs = getContents('editor/insert');
  mkModule('insert',versions.pjui,rs,cb);

}
function mk_pjeditor(cb) { 
  var fls = editor_files;
  var rs = "(function (pj) {\n\nvar geom=pj.geom,dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui, fb=pj.fb,tree=pj.tree,lightbox=pj.lightbox;\n"+
 // var rs = "(function (pj) {\n\nvar om=pj.om,geom=pj.geom,dat=pj.dat,dom=pj.dom,svg=pj.svg,html=pj.html,ui=pj.ui;\n"+
            '"use strict"\n'+
             mextract(fls,1) + "\n})(prototypeJungle);\n"
  mkModule('pjeditor',versions.editor,rs,cb);

}

function mk_bubbles(cb) {
  var fln = fullName("app/bubbles");
  var cn = ""+fs.readFileSync(fln)
  mkModule("pjbubbles",versions.pjworker,cn,cb);
}


var afn = function (d,cb) {
  d(cb);
}
var jobByWhat = {dom:mk_pjdom,ui:mk_pjui,//data:mk_pjdata,
                  view:mk_pjview,chooser:mk_pjchooser,editor:mk_pjeditor
                  // some old items: inspect:[mk_pjinspect],draw:[mk_pjdraw],dev:[mk_pjdev],login:[mk_pjloginout],
                 // rest:[mk_topbar,mk_pjloginout,mk_pjworker,mk_bubbles]
                  }
                  
var job = jobByWhat[what]; 

if (job) {
  console.log("ASSEMBLING ",what);
  job();
  //var jobs = [mk_pjom,mk_pjdom,mk_pjui,mk_pjtopbar,mk_pjchooser,mk_pjview,mk_pjloginout,mk_pjworker,mk_bubbles];
 // asyncFor(afn,jobs,function () {console.log("S3 Save  DDONE");});
} else {
  console.log("NO ASSEMBLY INSTRUCTIONS EXIT FOR ",what);
}


