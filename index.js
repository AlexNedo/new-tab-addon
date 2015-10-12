var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var hotkeys = require("sdk/hotkeys");
var tabs = require("sdk/tabs/utils");
var windows = require("sdk/window/utils");

//The current active window. Through its document property one can access the 
//DOM of the browser UI itself. (tab bar, url bar ...)
currentWindow = windows.getMostRecentBrowserWindow();
//With this one can add tabs manually to the tab bar
tabbrowser=tabs.getTabBrowser(currentWindow);

//The actual function, which opens a new tab next to the currently active tab
//It uses the relatedToCurrent functionality of the low-level api tabbrowser
function newNearTab(state) {
  var addedTab = tabbrowser.addTab("about:blank", {relatedToCurrent:true});
  tabs.activateTab(addedTab, currentWindow);
  //Get the urlbar and focus it, so the user can instantly type in it.
  var urlbar = currentWindow.document.getElementById("urlbar");
  urlbar.focus();
}

//This defines an button for the toolbar
var button = buttons.ActionButton({
  id: "new-near-tab",
  label: "Open nearby new tab",
  icon: {
    "16": "./newTabIcon-16x16.png",
    "32": "./newTabIcon-32x32.png",
    "64": "./newTabIcon-64x64.png"
  },
  onClick: newNearTab
});

//Own hotkey for the newNearTab
var openTabHotkey = hotkeys.Hotkey({
    combo:"accel-shift-t",
    onPress:newNearTab
});


//newNearTab shall also be called, when a middle click is executed on the new tab buttons

//This is new tab button that appears at the right side in the tab bar,
//when there are so many tabs, that the tab bar becomes scrollable.
var newTabButton = currentWindow.document.getElementById("new-tab-button");
newTabButton.onclick = function(mouseEvent){
                            //button == 1 is the middle click button
                           if(mouseEvent.button==1) newNearTab();
                       };

//This is the new tab button which appears at the right side of the rightmost tab,
//when there are not enough tabs to make the tab bar scrollable.
//This button is an "Anonymous Element" and therefore needs its own special method for retrieval
var secondNewTabButton = currentWindow.document.getAnonymousElementByAttribute(
                currentWindow.document.getElementById("tabbrowser-tabs"), 
                "class", "tabs-newtab-button");
secondNewTabButton.onclick = function(mouseEvent) {
                                    if (mouseEvent.button==1) newNearTab();
                             };
