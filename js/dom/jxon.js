
  
// This is one of the code files assembled into pjdom.js. 

  // turning DOM object into JSON trees
// from https://developer.mozilla.org/en-US/docs/JXON
/*\
|*|
|*|  JXON Snippet #3 - Mozilla Developer Network
|*|
|*|  https://developer.mozilla.org/en-US/docs/JXON
|*|
\*/


// modified by cg to build prototypejungle dom.Elements rather than plain javascript object trees
function parseText (sValue) {
  if (/^\s*$/.test(sValue)) { return null; }
  if (/^(?:true|false)$/i.test(sValue)) { return sValue.toLowerCase() === "true"; }
  if (isFinite(sValue)) { return parseFloat(sValue); }
  return sValue;
}


function getJXONTree (oXMLParent,forXML) {
  var tv,nodeId, nLength = 0, sCollectedTxt = "",xf;
  var tag = oXMLParent.tagName;
  if (tag === "parsererror") {
    throw tag;
  }
  var vResult = dom.Element.__mkFromTag(tag);
  if (oXMLParent.attributes) { // cg added the check for existence of method
    // cg also modified this to stash in attributes rather than things named @att
    for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
      var oAttrib = oXMLParent.attributes.item(nLength);
      var attName = oAttrib.name;//.toLowerCase();
      var attValue = parseText(oAttrib.value.trim());
      if (attName === "style") {
        var st = dom.parseStyle(attValue);
        vResult.set("style",st);
      } else if (attName === "id") {
        vResult.__name = attValue; 
      } else if (attName === "transform") {
        var gxf = svg.stringToTransform(attValue);
        if (gxf) {
          vResult.set("transform",gxf);
        }
      } else {
        vResult[attName] = attValue;
      }
    }
  }
  if (oXMLParent.hasChildNodes()) {
    for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
      oNode = oXMLParent.childNodes.item(nItem);
      if (oNode.nodeType === 4) { sCollectedTxt += oNode.nodeValue; } /* nodeType is "CDATASection" (4) */
      else if (oNode.nodeType === 3) { sCollectedTxt += oNode.nodeValue.trim(); } /* nodeType is "Text" (3) */
      else if (oNode.nodeType === 1 && !oNode.prefix) { /* nodeType is "Element" (1) */
        if (nLength === 0) { }
        vContent = getJXONTree(oNode,oNode.tagName);
        var nm = vContent.__get("__name");
        if (nm) {
          vResult.set(nm,vContent);
        } else {
          vResult.push(vContent);
        }
        nLength++;
      }
    }
  }
  if (sCollectedTxt) {
    vResult.text= parseText(sCollectedTxt);
  }
  return vResult;
}

dom.domToElement = function (dm,forXML) {
  var tr = getJXONTree(dm);
  var rs = forXML||dom.alwaysXMLparse?tr: tr[2][1];// wrapped in html/body if parsing html
  return  rs;
}
