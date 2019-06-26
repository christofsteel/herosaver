# Herosaver
=========

Save Configuration and STL of https://www.heroforge.com/

## Usage
### Loading via Browser Console
-----
This method requres you to do this everytime you the website or reload the page.

1. Go to https://www.heroforge.com/
2. Open the Javascript Console [F12] and then click on Console
3. Paste the following
  
```
var xhr=new XMLHttpRequest;xhr.open("get","https://raw.githubusercontent.com/christofsteel/herosaver/master/herosaver.min.js",true);xhr.onreadystatechange=function(){if(xhr.readyState==4){var script=document.createElement("script");script.type="text/javascript";script.text=xhr.responseText;document.body.appendChild(script)}};xhr.send(null);
```
### Loading via Script
-----
This method should automatically load the script on page load.

1. Install Greecemonkey Browser Addon (or alternative)
2. Click the icon and select 'New User Script' from the dropdown menu
3. Paste the following
4. Save

```
// ==UserScript==
// @name		Herosaver
// @include		*heroforge.com*
// ==/UserScript==

var loadHerosaver = setInterval(function() {
  if (!document.getElementById("loading-overlay")) {
    clearInterval(loadHerosaver);
    var xhr=new XMLHttpRequest;xhr.open("get","https://raw.githubusercontent.com/christofsteel/herosaver/master/herosaver.min.js",true);xhr.onreadystatechange=function(){if(xhr.readyState==4){var script=document.createElement("script");script.type="text/javascript";script.text=xhr.responseText;document.body.appendChild(script)}};xhr.send(null);
  }	
}, 100);
```
### Buttons
-----
* Export Model (STL) - Exports the current model and downloads a STL of it.
* Export (JSON) - Exports the current model settings in a JSON format.
* Import (JSON) - Imports a previously exported JSON file with model settings.

## Limitations
-----------

Some details of the figures are implemented via shaders. These are not exported :( This is also the reason, the exported figures look a bit _blocky_. If you want hight quality exports, consider purchasing the stl files from heroforge :)
