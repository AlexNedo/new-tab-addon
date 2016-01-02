var self = require('sdk/self');
var buttons = require('sdk/ui/button/action');
var hotkeys = require("sdk/hotkeys");
var tabs = require("sdk/tabs/utils");
var windows = require("sdk/window/utils");

var simplePrefs = require("sdk/simple-prefs");
var panel = require("sdk/panel");
var hotkey = require("sdk/hotkeys");

ILLEGAL_COMBOS = ["accel-z", "accel-c", "accel-x", "accel-v", "accel-q"];
var prefs = simplePrefs.prefs;

var old_ctrl_pref = prefs["mod_ctrl"];
var old_shift_pref = prefs["mod_shift"];
var old_alt_pref = prefs["mod_alt"];
var old_key_pref = prefs["key"];

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

//Generates the correct hotkey combo string for the Hotkey constructor
function makeComboString(){
    values = [];
    if (prefs["mod_ctrl"] === "KEY_SET")
        values.push("accel");
    if (prefs["mod_shift"] === "KEY_SET")
        values.push("shift");
    if (prefs["mod_alt"] === "KEY_SET")
        values.push("alt");
    values.push(prefs["key"][4].toLowerCase());
    return values.join("-");
}

var currentHotkey = hotkey.Hotkey({
    combo: makeComboString(),
    onPress: newNearTab
});

//this Panel is used for showing error messages after illegal preference changes
var myPanel = panel.Panel( {
        width: 400,
        height: 50,
        contentURL: "./panel.html"
});
myPanel.port.on("close-panel", function(){
    console.log("Close Panel");
    myPanel.hide();
});

function showMessage(message){
    myPanel.port.emit("show-message", message);
    myPanel.show();
}

function resetPrefsToOld(){
    //temporarily unregister prefChangeListener
    simplePrefs.removeListener("", onPrefChange);
    prefs["mod_ctrl"] = old_ctrl_pref;
    prefs["mod_shift"] = old_shift_pref;
    prefs["mod_alt"] = old_alt_pref;
    prefs["key"] = old_key_pref;
    simplePrefs.on("", onPrefChange);
}

function onPrefChange(prefName){
    
    //Check whether shift is the only modifier
    if (prefs["mod_ctrl"] === "KEY_NOT_SET" 
            && prefs["mod_shift"] === "KEY_SET"
            && prefs["mod_alt"] === "KEY_NOT_SET")
    {
        showMessage("Shift as the only modifier is not allowed.");
        resetPrefsToOld();
        return;
    }
    
    //Check whether no modifier at all was set
    if (prefs["mod_ctrl"] === "KEY_NOT_SET" 
            && prefs["mod_shift"] === "KEY_NOT_SET"
            && prefs["mod_alt"] === "KEY_NOT_SET")
    {
        showMessage("At least one modifier must be set.");
        resetPrefsToOld();
        return;
    }
    
    var hotkeyString = makeComboString();
    
    //Check for illegal Combos
    if (ILLEGAL_COMBOS.indexOf(hotkeyString) != -1){
        showMessage("Illegal hotkey. Choose another.");
        resetPrefsToOld();
        return;
    }
    
    //Backup current values for potential illegal preference change in the future
    old_ctrl_pref = prefs["mod_ctrl"];
    old_shift_pref = prefs["mod_shift"];
    old_alt_pref = prefs["mod_alt"];
    old_key_pref = prefs["key"];

    //remap the actual hotkey
    currentHotkey.destroy();
    currentHotkey = hotkey.Hotkey({combo:hotkeyString, onPress: newNearTab});
}

simplePrefs.on("", onPrefChange);