
var dev = true

/* - - - generic helper functions and shorcuts - - -  */

if(typeof console == "undefined" || typeof console.log == "undefined") {
	console = { log: function() {} } 
}

function log(stuff) {
	if(dev) {
		console.log(stuff)
	}
}


var body = document.getElementsByTagName("body")[0]
var head = document.getElementsByTagName("head")[0]



/* - - - add stuff - - -  */

//charset
var charset = document.createElement("meta")
charset.setAttribute("charset", "utf-8")
document.head.appendChild(charset)

//stylesheet
var css = document.createElement("link")
css.setAttribute("rel", "stylesheet")
css.setAttribute("href", "css/stylesheet.css")
document.head.appendChild(css)

//apparently this helps with things in IE
var iet = document.createElement("meta")
iet.setAttribute("http-equiv", "X-UA-Compatible")
iet.setAttribute("content", "IE=edge,chrome=1")
document.head.appendChild(iet)

//set title
document.title = "wgallia"

//add functions which in turn adds the script to call them...
var funcs = document.createElement("script")
funcs.src = "js/functions.js"
document.head.appendChild(funcs)

