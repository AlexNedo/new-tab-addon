#Nearby New Tab
Provides functionality to open a new tab next to the currently open one. (The standard open new tab command would open a new tab at the end of the tab list)

#Building the addon
Nearyb New Tab is developed with the [Firefox Addon SDK] (https://developer.mozilla.org/en-US/Add-ons/SDK). The SDK is distributed as a package in npm (node package manager) as a part of a node.js installation. To install the Addon SDK which is called jpm:

```npm install jpm --global```

To run the addon directly in a new temporary firefox profile navigate to the main folder and use:

```jpm run```

To build a binary install file (.xpi) use:

```jpm xpi```

The .xpi file can be dragged into firefox to install the addon.
