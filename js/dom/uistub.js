// so that some ui functions can be included in items that are used in a non-ui context

// This is one of the code files assembled into pjdom.js. 
// Allows code to include UI operations, but to run in variants of the system lacking the UI (like prototypejungle.org/view)
var ui = pj.set("ui",Object.create(pj.Object));
ui.setNote = function () {}
ui.watch = function () {}
ui.freeze = function (){}
ui.freezeExcept = function (){}
ui.hide = function () {}
ui.show = function () {}
ui.hideExcept = function () {}
ui.hideInstance = function () {}
ui.hideInInstance = function () {}
pj.Object.__setFieldType = function () {}
pj.Object.__setUIStatus = function () {}
