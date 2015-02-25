
var dev = false;

//leave this... this is changed by sed when we make
//snapshots for google... see makesnapshots.sh
var snaps = true;

/* - - - generic helper functions and shorcuts, etc - - -  */

if(typeof console == "undefined" || typeof console.log == "undefined") {
	console = { log: function() {} };
}

function log(stuff) {
	if(dev) {
		console.log(stuff);
	}
}


head = document.getElementsByTagName("head")[0];
body = document.getElementsByTagName("body")[0];

/* - - - generic stuff - - -  */

//charset
var charset = document.createElement("meta");
charset.setAttribute("charset", "utf-8");
head.appendChild(charset);

//stylesheet
var css = document.createElement("link");
css.setAttribute("rel", "stylesheet");
css.setAttribute("href", "css/stylesheet.css");
//head.appendChild(css);

//apparently this helps with things in IE
var iet = document.createElement("meta");
iet.setAttribute("http-equiv", "X-UA-Compatible");
iet.setAttribute("content", "IE=edge,chrome=1");
head.appendChild(iet);

//set title
var maintitle = "Will Gallia";
document.title = maintitle;

//if we don't support onhashchange, stop...
var onhc = true;
if(!("onhashchange" in window)) {
	document.write("This website needs things your browser doesn't have. I would suggest using Chrome.");
    onhc = false;
}

//add functions which in turn adds the script to call them...
// var funcs = document.createElement("script");
// funcs.src = "./js/functions.js";
// if(!snaps || !onhc) {
// 	head.appendChild(funcs);
// }

