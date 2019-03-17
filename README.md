Herosaver
=========

Save Configuration and STL of https://www.heroforge.com/

Usage (Option 1 - Browser Console)
-----

  1. Go to https://www.heroforge.com/
  2. Open the Javascript Console [F12], then click on Console
  3. Paste the following
  
```
var xhr=new XMLHttpRequest;xhr.open("get","https://raw.githubusercontent.com/christofsteel/herosaver/master/herosaver.min.js",true);xhr.onreadystatechange=function(){if(xhr.readyState==4){var script=document.createElement("script");script.type="text/javascript";script.text=xhr.responseText;document.body.appendChild(script)}};xhr.send(null);
```

Usage (Option 2 - Greecemonkey)
-----

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

Limitations
-----------

Some details of the figures are implemented via shaders. These are not exported :( This is also the reason, the exported figures look a bit _blocky_. If you want hight quality exports, consider purchasing the stl files from heroforge :)
