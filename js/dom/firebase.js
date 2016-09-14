// extensions of pj for prototypejungle  (beyond pjcs)
(function (pj) {
  
  
// This is one of the code files assembled into pjui.js. //start extract and //end extract indicate the part used in the assembly

//start extract



var fb = pj.set("fb",pj.Object.mk());
fb.__builtIn = true;

// get the  directory for this user. Create if missing.


 var config = {
    apiKey: "AIzaSyDCSJngwaC0I6K3QJNs4jibqmvV6Ezbvvc",
    authDomain: "protochart.firebaseapp.com",
    databaseURL: "https://protochart.firebaseio.com",
    storageBucket: "protochart.appspot.com",
  };
  
var prototypejungle_config = {
    apiKey: "AIzaSyAKaFHViXlHy6Hm-aDeKa5S9Pnz87ZRpvA",
    authDomain: "prototypejungle.firebaseapp.com",
    databaseURL: "https://prototypejungle.firebaseio.com",
    storageBucket: "project-5150272850535855811.appspot.com",
  };

 var dev_config = {
    apiKey: "AIzaSyA97dcoN5fPvEoK_7LAGZcJn-GHd3xPW9I",
    authDomain: "prototypejungle-dev.firebaseapp.com",
    databaseURL: "https://prototypejungle-dev.firebaseio.com",
    storageBucket: "prototypejungle-dev.appspot.com",
  };
  
fb.initFirebase = function () {
   firebase.initializeApp(config);
   fb.rootRef =  firebase.database().ref();
   fb.storage = firebase.storage();
   fb.storageRef = fb.storage.ref();
}

/*
 * Structure: to the user, there is just one tree of objects. The underlying firebase structure is more complicated.
 * uid/directory contains an entry for every element of the tree of whatever kind. For an item at uid/directory/<path>,
 * uid/diretory/<path> holds just a 1, and uid/s/<path> holds the JSON content of the item. For other kinds of files (eg .svg and .json),
 * uid/directory/<path> holds the URL in firebase storage where the data itself is held. 
 */
fb.setCurrentUser = function (cb) {
  if (fb.currentUser) {
     if (cb) {
      cb();
     }
     return;
  }
  var  auth = firebase.auth();
  fb.currentUser = auth.currentUser;
  if (!fb.currentUser) {
    auth.onAuthStateChanged(function(user) {
      fb.currentUser = user;
      if (cb) {
        cb();
      }
    });
    return;
  }
  if (cb) {
    cb();
  }
}
fb.removeUser = function () {
 if (fb.currentUser) {
    var uid = encodeURIComponent(fb.currentUser.uid);
    var userRef = fb.rootRef.child(uid);
    userRef.remove();
 }
}

fb.directoryRefString = function () {
   if (fb.currentUser) {
    var uid = fb.currentUser.uid;
    return uid+'/directory';
  }
}

fb.directoryRef = function () {
  return fb.rootRef.child(fb.directoryRefString());
}

fb.storeRefString = function () {
  if (fb.currentUser) {
    var uid = fb.currentUser.uid;
    return uid+'/s';
  }
}


fb.storageRefString = function () {
  return fb.currentUser.uid;
}

fb.svgMetadata =  {
  contentType: 'image/svg+xml'
};


fb.jsonMetadata =  {
  contentType: 'application/json'
};

fb.userRef = function () {
  if (fb.currentUser) {
     var uid = fb.currentUser.uid;
     return fb.rootRef.child(uid);
   }
}

//  .'s are replaced by %2E in the store; this puts the dots back in
var putInDots  = function (src) {
  for (var k in src) {
    var v = src[k];
    if (typeof v === 'object') {
      var child = src[k];
      if (child) {
        putInDots(child);
      }
    } else if (k.indexOf(pj.dotCode)>-1) {
      delete src[k];
      src[k.replace(pj.dotCode,'.')] = v;
    }
  }
  return src;
}

/* when getDirectory is called for the first time, this is detected by its lack of the value __ct3bfs4ew__ at top level
 * This special value is added, as well as some initial sample data files */

// sample data
/*
ui.metalData = `{
  "title":"Density in grams per cubic centimeter",
  "fields":[{"id":"metal","type":"string"},{"id":"density","type":"number"}],
  "elements":[["Lithium",0.53],["Copper",9],["Silver",10.5],["Gold",19.3]]
}`;


ui.tradeData = `{
  "title":"US-China Trade Balance in Billions",
  "fields":[
    {"id":"year","type":"number"},
    {"id":"Imports","type":"number"},
    {"id":"Exports","type":"number"},
    {"id":"Deficit","type":"number"}
  ],
  "elements":[[1980,291,272,19],[1995,616,535,81],[2000,1450,1073,377],[2010,2337,1842,495]]
}`;
*/
// ui.tradeData = `whatever`; breaks minify
fb.metalData = '{\n'+
'  "title":"Density in grams per cubic centimeter",\n'+
'  "fields":[{"id":"metal","type":"string"},{"id":"density","type":"number"}],\n'+
'  "elements":[["Lithium",0.53],["Copper",9],["Silver",10.5],["Gold",19.3]]\n'+
'}';


fb.tradeData = '{\n'+
'  "title":"US-China Trade Balance in Billions",\n'+
'  "fields":[\n'+
'    {"id":"year","type":"number"},\n'+
'    {"id":"Imports","type":"number"},\n'+
'    {"id":"Exports","type":"number"},\n'+
'    {"id":"Deficit","type":"number"}\n'+
'  ],\n'+
'  "elements":[[1980,291,272,19],[1995,616,535,81],[2000,1450,1073,377],[2010,2337,1842,495]]\n'+
'}';

fb.initializeStore = function (cb) {
  debugger;
 // var directory = {directory:
  var directory =  {data:{'metal_densities.json':1,'trade_balance.json':1}};
//                  s:{data:{metal_densities:fb.metalData,
//                           trade_balance:fb.tradeData}
//                  };
   // fb.userRef().update(directory).then(function () {
      //fb.directory = fb.addExtensions(directory);
      pj.saveString('/data/metal_densities.json',fb.metalData,function() {
        pj.saveString('/data/trade_balance.json',fb.tradeData,function() {        
          cb(directory)});
      });
      //cb(directory)})                  
}

fb.getDirectory = function (cb) {
  debugger;
  if (fb.directory) {
    cb(fb.directory);
    return;
  }
  var directoryRef = fb.directoryRef();
  if (directoryRef) {
    directoryRef.once("value").then(function (snapshot) {
      
      var rs = snapshot.val();
      if (rs === null) {
        fb.initializeStore(cb);
        return;
      } else {
        fb.directory = putInDots(rs);//rs.s)//fb.addExtensions(rs);
        debugger;
      }
       // console.log('directory found');
        //fb.directory = (fb.directory === 'empty')?{}:fb.directory;
      cb(fb.directory);
    });
  } else {
    fb.directory = undefined;
    cb(undefined);
    
  }
}


fb.deleteFromUiDirectory = function (path) {
  debugger;
  var splitPath = path.split('/');
  var cd = fb.directory;
  if (!cd) {
    return;
  }
  var ln = splitPath.length;
  for (var i=1;i<ln-1;i++) {
    cd = cd[splitPath[i]];
    if (!cd) {
      return;
    }
  }
  delete cd[splitPath[ln-1]];
}


fb.deleteFromDatabase =  function (path,cb) {
  debugger;
  var removePromise;
  //var directoryTopRef = fb.directoryRef();
  var dotPath = path.replace('.',pj.dotCode);
  var deleteFromDirectory = function () {
    var directoryRef = fb.rootRef.child(fb.directoryRefString() + dotPath);//directoryTopRef.child(dotPath);
    var removePromise = directoryRef.remove();
    removePromise.then(function () {
      debugger;
      fb.deleteFromUiDirectory(path);
    });
  }
   var deleteFromStore = function () {
    var storeRef = fb.rootRef.child(fb.storeRefString()+dotPath);
    //var storeRef = fb.storeRef().child(dotPath);
    var removePromise = storeRef.remove();
    removePromise.then(function () {
      debugger;
      deleteFromDirectory(path);
    });
  }
  var ext = pj.afterLastChar(path,'.',true);
  if (ext) {
    fb.directoryValue(path,function (err,rs) {
      debugger;
      var storageRef = fb.storage.refFromURL(rs);
      var deletePromise = storageRef.delete();
      deletePromise.then(function () {
        debugger;
        deleteFromDirectory();
      })
    });
  } else {
    deleteFromStore();
  }
}
  


fb.addToDirectory = function (parentPath,name,link,cb) {
  //var isSvg = pj.endsIn('.svg');
  var directoryRef = fb.directoryRef();
  var uv,pRef;
  if (directoryRef) {
    pRef = directoryRef.child(parentPath);
    uv = {};
    //var name = isSvg?pj.beforeLastChar(iname,'.'):iname;
    uv[name] = link;
    pRef.update(uv,cb);
  }
}


fb.directoryValue = function (path,cb) {
  debugger;
  var uid = fb.currentUser.uid;
  //var dburl = pj.databaseUrl(uid,path)'?callback=pj.returnStorage'
  //var childPath = 'svg'+path.substr(0,path.length-4);
  var directoryRef = fb.rootRef.child(fb.directoryRefString()+path.replace('.',pj.dotCode));
  directoryRef.once("value",function (snapshot) {
    debugger;
    var rs = snapshot.val();
    cb(null,rs);
  });
}

fb.getFromStore = function (uid,path,cb) {
  var ref = fb.rootRef.child(uid+path);
  ref.once("value",function (snapshot) {
    var rs = snapshot.val();
    cb(null,rs);
  });
}

  
fb.testStore = function () {
  var uid = encodeURIComponent(fb.authData.uid);
  var directoryRef = new Firebase(fb.firebaseHome+'/'+uid+'/directory');
  directoryRef.set({});return;
//return;
  directoryRef.update({'a':'def'});
}


pj.databaseUrl = function (uid,path) {
  return 'https://protochart.firebaseio.com/'+uid+'/directory'+path+'.json';//.replace('.',pj.dotCode)
}
pj.indirectUrl = function (iurl) { // deals with urls of the form [uid]path
  if (pj.beginsWith(iurl,'[')) {
    var closeBracket = iurl.indexOf(']');
    var uid = iurl.substr(1,closeBracket-1);
    var path = iurl.substring(closeBracket+1).replace('.',pj.dotCode)
     return pj.databaseUrl(uid,path)
    //return {uid:uid,path:path,url:pj.databaseUrl(uid,path)};
  }
}
//end extract

})(prototypeJungle);