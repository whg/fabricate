
var dev = true;

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
head.appendChild(css);

var fonts = document.createElement("link");
fonts.setAttribute("rel", "stylesheet");
fonts.setAttribute("href", "http://fonts.googleapis.com/css?family=Marvel")
/* head.appendChild(fonts) */

//apparently this helps with things in IE
var iet = document.createElement("meta");
iet.setAttribute("http-equiv", "X-UA-Compatible");
iet.setAttribute("content", "IE=edge,chrome=1");
head.appendChild(iet);

//set title
var maintitle = "wgallia";
document.title = maintitle;

//add functions which in turn adds the script to call them...
var funcs = document.createElement("script");
funcs.src = "./js/functions.js";
/* head.appendChild(funcs); */

