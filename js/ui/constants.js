
  
// This is one of the code files assembled into pjui.js. 

if (!ui) {
  ui = pj.set("ui",pj.Object.mk());
}
ui.firebaseHome = "https://protochart.firebaseio.com";
ui.sessionTimeout = 24 * 60 * 60;


ui.homePage = "";
//pj.activeConsoleTags = (ui.isDev)?["error","updateError","installError"]:["error"];//,"drag","util","tree"];
