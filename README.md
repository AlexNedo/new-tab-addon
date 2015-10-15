#Nearby New Tab
Provides functionality to open a new tab next to the currently open one. The standard open new tab command would open a new tab at the end of the tab list.

#Building the addon
Nearby New Tab is developed with the [Firefox Addon SDK] (https://developer.mozilla.org/en-US/Add-ons/SDK). The SDK is distributed as a package for the npm (node package manager) in a node.js installation. To install the Addon SDK which is called jpm run:

```npm install jpm --global```

There are two ways to run the addon:

1. Run it directly in a new temporary firefox profile. For that navigate to the main folder and run:

  ```jpm run```

2. Build a binary install file (.xpi):

  ```jpm xpi```

The .xpi file can be dragged into firefox in order to install the addon.
