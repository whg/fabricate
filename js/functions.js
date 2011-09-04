/* - - - - - - COMMAND LINE - - - - - -  */

var open_commands = ["cd", "move", "goto", "open"];
var misc_commands = ["help", "back", "forward"];
var commands = open_commands.concat(misc_commands);

commands = commands.sort();


function autocomplete(input, result) {

	//clear result
	result.innerHTML = "";
	var r = [];

	//first split the command into tokens
	var tokens = input.split(" ");
	
	//base command :. autocomplete command
	if(tokens.length == 1) {
		
		r = findcompletions(tokens[0], commands);
		
		//print out results...
		if(r.length == 1) {
			command.value = r[0] + " ";
		} 
		else {
			result.innerHTML = r.join(" ");
		}	
	}
	
	//if multiple tokens, process the last  
	else {

		var lastword = tokens.pop();
		r = findcompletions(lastword, sections);
		
		if(r.length == 1) {
			//add only completion to prompt
			tokens.push(r[0]);
		} 
		else {
			//return prompt to original
			tokens.push(lastword);
			//and write options
			result.innerHTML = r.join(" ");
		}		
		
		//write the prompt, with either corrected or original
		command.value = tokens.join(" ");

	}
	//this is some housework
	promptinfo.innerHTML = "info";

}

//find completions to input_word with list compare_against
//a list of possible completions is returned
//for ease, input can be of the wrong case and still be completed
function findcompletions(input_word, compare_against) {
	
	var results = [];
	
	for (var i = 0; i < compare_against.length; i++) {
		var moveon = false;
		for (var j = 0; j < input_word.length; j++) {
			if(input_word.length <= compare_against[i].length) {
				if(input_word.toLowerCase().charAt(j) != compare_against[i].toLowerCase().charAt(j)) {
					moveon = true;
				}	
			} 
			else {
				moveon = true;
			}
		}
		
		if(!moveon) {
			results.push(compare_against[i]);
		}
	}
	return results;
}

// - - -  process the command - - - 
//takes the input and does stuff...

function processcommand(input) {	
	var tokens = input.split(" ");
	
	if(tokens[0] == "" && tokens.length == 1) {
		//if there is no command...
		return;
	} 
	
	var command = tokens[0];
	var argument = 0;
	if(tokens.length > 1) {
		argument = input.substr(input.indexOf(" ")+1, input.length-1);
	}

	log("command = " + "'" + command + "'");
	log("argument = " + argument);
		
	/* 	- - - HISTORY COMMANDS - - -  */

	if(command == "back") {
		//if no argument go back one page
		if(!argument) {
			window.history.back();
			return;
		}		
		//if there is an argument, parse it
		else {
			//history.go() doesn't throw an error when passed NaN,
			//so there is no error checking here as everything happens gracefully
			window.history.go(-(parseInt(argument)));
			return;
		}
	}
	
	if(command == "forward") {
		if(!argument) {
			window.history.forward();
			return;
		}	else {
			window.history.go(parseInt(argument));
			return;
		}
	}
	
				
	/* 	- - - MOVE COMMANDS - - -  */

	for (var i = 0; i < open_commands.length; i++) {
		if(command === open_commands[i]) {
			for (var j = 0; j < sections.length; j++) {
				//check for valid argument
				if(argument == sections[j]) {
					var elem = document.getElementById(lowercasenospace(argument));
					showpage(elem);
					location.hash = "!" + lowercasenospace(argument);
					return;
				}
			}
			//if argument is not valid, display message
			commandresult.innerHTML = argument + ": could not find section";
			return;
		}
	}
	
	
	//if we get here, command is not valid
	commandresult.innerHTML = command + ": command not found";
	
	
}

/* - - - - - - CREATION - - - - - -  */

var performdata = function () {
	xhreq("./data/data.json", function(req) {
		
		var data = parseJSON(req.responseText);
		
		// add all content
		additems(data.items, itemcontainer);
		addcats(data.cats, catscontainer);
		addtags(data.tags, tagscontainer);
		
		//move to the right page if we have a hash
		checkhash();
		
	});
}


/* - - - ADD ITEMS - - -  */
// creates the items and adds the event handling functions
// attributes:
// 						id = name
//						tags = tags
//						cats = cats
//						items = self/name 

function additems(items, parent) {

	//add the items to DOM
	for (var i = 0; i < items.length; i++) {
		
		var a = document.createElement("a");
		a.href = "#!" + items[i].link;
		
		//create the elements
		var holdingdiv = document.createElement("div");
		holdingdiv.className = "item";
		holdingdiv.role = "";
		
		holdingdiv.setAttribute("id", items[i].link);
		holdingdiv.setAttribute("items", items[i].link);
		
		var itemtable = document.createElement("table");
		itemtable.className = "item";
		
		//add name to table title: this is what 
		//shows when the mouse hovers over the element...
		itemtable.title = items[i].name;
	
		var row = document.createElement("tr");
		
		//fill the elements, first the name
		var name = items[i].name;
		var title = document.createElement("td");
		title.innerHTML = "<h2>" + name + "</h2>";
		row.appendChild(title);
				

		//the item's categories
		for (var j = 0; j < items[i].cats.length; j++) {
			var tagtd = document.createElement("td");
			var tag = document.createElement("div");
			tag.className = "dot " + lowercasenospace(items[i].cats[j]);
			tagtd.appendChild(tag);
			row.appendChild(tagtd);
		}
		
		var itemcats = arraytostring(items[i].cats);
		holdingdiv.setAttribute("cats", itemcats);
		
		//the item's tags
		var itemtags = arraytostring(items[i].tags);
		holdingdiv.setAttribute("tags", itemtags);
		
		//append elements
		itemtable.appendChild(row);
		holdingdiv.appendChild(itemtable);
		a.appendChild(holdingdiv);

		//add to parent (function argument)
		parent.appendChild(a);
		
		//add the item to sections list
		sections.push(items[i].name);
		
		/* 		- - - 	MOUSEOVER - - -  */
		
		holdingdiv.onmouseover = function() {
		
			//find the cats
			var cs = this.getAttribute("cats").split(",");
			//highlight the cats, keep track of the highlighted ones,
			//with the element and the original class name
			for (var i = 0; i < cs.length; i++) {
				var t = document.getElementById(cs[i]);
				highlighted.push([t, t.className]);
				t.className += " dark";
			}
			
			//do the tags...
			//only relevant tags are shown, all others are hidden
			
			//first hide them all
			for (var i = 0; i < tagdivs.length; i++) {
				tagdivs[i].style.display = "none";
/* 				tagdivs[i].style.visibility = "hidden"; */
			}
			
			var ts = this.getAttribute("tags").split(",");
			for (var i = 0; i < ts.length; i++) {
				var t = document.getElementById(lowercasenospace(ts[i]));
				t.style.display = "inline-block";
				t.style.color = "white";
				t.style.backgroundColor = "#686868";
			}
			
			//style this one
			this.firstChild.className+= " light";
		} 
			
		/* 		- - - MOUSEOUT - - -  */
				
		holdingdiv.onmouseout = function() {
			
			//reset all highlighted back to original class
			for (var k = 0; k < highlighted.length; k++) {
				highlighted[k][0].className = highlighted[k][1];
			}
			highlighted = [];
			
			//reset tags
			for (var i = 0; i < tagdivs.length; i++) {
				tagdivs[i].style.display = "inline-block";
				tagdivs[i].className = "tag_item";
				tagdivs[i].style.color = "black";
				tagdivs[i].style.backgroundColor = "#eee";
			}
			
			this.firstChild.className = "item";
		}

		
	}
	
}

/* - - - ADD CATS - - -  */
//creates and adds categories
//has items attribute which container a list of 
//items the category is associated with

function addcats(cats, parent) {

	//add title
	var ktitle = document.createElement("h3");
	ktitle.innerHTML = "Key:";
	parent.appendChild(ktitle);

	
	for (var cat in cats) {
		
		var a = document.createElement("a");
		a.href = "#!" + lowercasenospace(cat);
		
		//create the elements
		var keydiv = document.createElement("div");
		keydiv.className = "cat_item";
		keydiv.setAttribute("id", lowercasenospace(cat));
/* 		keydiv.title = cat[0].toUpperCase() + cat.substr(1) */
		keydiv.title = cat;
		
		//set the items that are part of cat
		var catitems = arraytostring(cats[cat]);
		keydiv.setAttribute("items", catitems);
		
		//write the text, with the first letter uppercase
		var p = document.createElement("p");
		p.innerHTML = cat + ":";
		
		//add the dot...
		var tag = document.createElement("div");
		tag.className = "dot " + lowercasenospace(cat);
		
		//append all elements
		keydiv.appendChild(p);
		keydiv.appendChild(tag);
		a.appendChild(keydiv);
		parent.appendChild(a);
		
		//add to sections list
		sections.push(cat);
		
		/* 		- - - MOUSEOVER - - -  */
		
		keydiv.onmouseover = function() {
			var is = this.getAttribute("items").split(",");
			for (var i = 0; i < is.length; i++) {
				var it = document.getElementById(is[i]);
				it.firstChild.className+= " dark";
				highlighted.push(it);
			}
			this.className+= " light";
		}
		
		/* 		- - - MOUSEOUT - - -  */
		
		keydiv.onmouseout = function() {
			for(var i = 0; i < highlighted.length; i++) {
				highlighted[i].firstChild.className = "item";
			}
			highlighted = [];
			this.className = "cat_item";
		}
		
	}

}

/* - - - ADD TAGS - - -  */
//creates and adds tags
//each tag has items attribute, like the cats
//tags can be multiple words, but their id and link is
//always lowercase with no space

function addtags(tags, parent) {
	
	var t = document.createElement("h3");
	t.innerHTML = "Tags:";
/* 	parent.appendChild(t) */
	
	for (tag in tags) {
	
		var a = document.createElement("a");
		a.href = "#!" + lowercasenospace(tag);
		
		var tdiv = document.createElement("div");
		tdiv.className = "tag_item";
		tdiv.setAttribute("id", lowercasenospace(tag));
		tdiv.title = tag;
		
		//set the items that are part of tag
		var tagitems = arraytostring(tags[tag]);
		tdiv.setAttribute("items", tagitems);
		
		var span = document.createElement("span");
		span.innerHTML = tag;
		
		tdiv.appendChild(span);
		a.appendChild(tdiv);
		parent.appendChild(a);
		
		
		//add to sections
		sections.push(tag);
		//and tagdivs
		tagdivs.push(tdiv);

		
		/* 		- - - MOUSEOVER - - -  */
		
		tdiv.onmouseover = function() {
			var is = this.getAttribute("items").split(",");
			for (var i = 0; i < is.length; i++) {
				var it = document.getElementById(is[i]);
				it.firstChild.className+= " dark";
				highlighted.push(it);
			}
			
/* 			this.className += " light" */
			this.style.color = "white";
			this.style.backgroundColor = "#c9c9c9";
		}
		
		/* 		- - - MOUSEOUT - - -  */
		
		tdiv.onmouseout = function() {
			for(var i = 0; i < highlighted.length; i++) {
				highlighted[i].firstChild.className = "item";
			}
			highlighted = [];
			
/* 			this.className = "tag_item" */
			this.style.color = "black";
			this.style.backgroundColor = "#eee";
		}
		
	}
		
	parent.style.height = parent.offsetHeight;
}

window.onpushstate = function() {
	log("pushed state");
}

//fetches and displays page content inside parent
//by looking at the items attribute of the given element
//all items, cats and tags all have an items attribute, 
//items themselves have one, which is themselves
function showpage(element) {
/* 	hashset = element.getAttribute("id"); */
	pagecontainer.innerHTML = "";
	log("FIRED SHOWPAGE = " + element);
	var is = element.getAttribute("items").split(",");
	
	for(var i = 0; i < is.length; i++) {
		startedchange = true;
		appendpage(is[i], pagecontainer);
	}
	
	//make a new history instance if we are moving forward...
	///ie there is no 3rd argument
/* 	if(pushstate == "undefined") { */
		var obj = { "page": element.getAttribute("id") };
/* 		history.pushState(obj, "", ""); */
/* 		log("pushed ...." + pushstate); */
/* 	} */
	
	//set the title to the id of the element that called this.
/* 	settitle(element.getAttribute("id")); */
	
	
	//scale the images, wait for them to load... 
	//i think 0.8s is long enough
	setTimeout(function() { 
		if(pagecontainer.offsetWidth < 640) {
			scaleimages(pagecontainer);
			} 
			
			//this is something for the itoa section
			clickingascii();
		}, 800);
		
	log("showed");
}

function appendpage(name, parent) {
	xhreq("data/" + name, function(req) {
		var article = document.createElement("article");
		article.innerHTML += req.responseText;
		parent.appendChild(article);
		startedchange = false;
	});
}

/* - - - - - - HELPERS - - - - - -  */

function arraytostring(a) {
	var result = "";
	for (var i = 0; i < a.length; i++) {
		result+= lowercasenospace(a[i]) + ((i < a.length-1) ? "," : "");
	}
	return result;
}

function settitle(word) {
	document.title = maintitle + " : " +  word;
}

var parseJSON = function (text) {
	if(JSON) {
		return JSON.parse(text);
	}
	return eval("(" + text + ")");
}

function lowercasenospace(text) {
	return text.toLowerCase().split(" ").join("");
}

function checkhash() {
	//if there is a hash, load that page
	if(location.hash != "") {
	
		var elem = document.getElementById(location.hash.substr(2));
		log("FROM CHECKHASH");
		if(elem) {
			showpage(elem);
			return true;
		}
	}
}

/* - - - INFO FOR PROMPT - - -  */

var keyboardinfo =
"<p>Format: &lt;command> &lt;argument><br/> </p>\
<p>e.g. open visual </p> \
<p>Use tab to autocomplete both commands and arguments. \
Arguments can be items, sections or tags.</p> \
-<br/> \
<p>To open a page, use either open, goto, cd or move</p> \
<p>History navigation can be done with back and forward, \
if an argument is given then it will move that number of pages.</p> \
-<br/> \
<p>To resume normal keyboard functionality in your browser, press ESC</p> \
</p>";

function showinfo() {
	if(promptinfo.innerHTML == "info") {
		commandresult.innerHTML = keyboardinfo;
		promptinfo.innerHTML = "close";
	}
	else {
		commandresult.innerHTML = "";
		promptinfo.innerHTML = "info";
	}
}

var icounter = 0;
var typer;
function writeinstructions() {
	log(keyinstructions);
	log(commandresult);
	typer = setInterval(function() {
		commandresult.innerHTML += keyboardinfo.charAt(icounter++);
		
		if(icounter == keyinstructions.length) {
			clearInterval(typer);
		}
	}, 75);
}

/* - - - IMAGES - - -  */

//sets all images in document to the width of fit_element
function scaleimages(fit_element) {
	var imgs = document.getElementsByTagName("img");
	for(var i = 0; i < imgs.length; i++) {
		if(imgs[i].className == "fit" || imgs[i].className == "fits") {
			imgs[i].style.width = fit_element.offsetWidth + "px";
		}
	}
}

function clickingascii() {
	
	var imgs = document.getElementsByTagName("img");
	
	for (var i = 0; i < imgs.length; i++) {
		if(imgs[i].getAttribute("type") == "ascii") {
			imgs[i].onmousedown = function() {
				if(this.getAttribute("type") == "ascii")  {
					this.src = "/new/images/atoi/" + this.name + "_img.jpg";
					this.setAttribute("type", "img");
				}
				else {
					this.src = "/new/images/atoi/" + this.name + "_ascii.png";
					this.setAttribute("type", "ascii");
				}	
			}
			imgs[i].onmouseover = function() { this.style.cursor = "pointer" };
		}
	}

}

/* - - - XMLHttpResponse - - -  */
//thanks to ppk for these

var xhreq = function (url,callback) {
	var req = createXMLHTTPObject();
	if (!req) return;
	
	//always use POST for request
	req.open("POST", url, true);
	
	//set callback
	req.onreadystatechange = function () {
		if (req.readyState != 4) return;
		if (req.status != 200 && req.status != 304) {
			return;
		}
		callback(req);
	}
	if (req.readyState == 4) return;
	req.send(null);
}	

var XMLHttpFactories = [
	function () {return new XMLHttpRequest()},
	function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	function () {return new ActiveXObject("Microsoft.XMLHTTP")}
];

var createXMLHTTPObject = function () {
	var xmlhttp = false;
	for (var i=0; i < XMLHttpFactories.length; i++) {
		try {
			xmlhttp = XMLHttpFactories[i]();
		}
		catch (e) {
			continue;
		}
		break;
	}
	return xmlhttp;
}


//now add the script to add all the contentDocument
var go = document.createElement("script");
go.src = "./js/open.js";
/* head.appendChild(go); */

