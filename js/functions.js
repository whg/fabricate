/* - - - - - - COMMAND LINE - - - - - -  */

var open_commands = ["cd", "move", "goto", "open"]
var misc_commands = ["home", "help", "back"]
var commands = open_commands.concat(misc_commands)

commands = commands.sort()


function autocomplete(input, result) {

	//clear result
	result.innerHTML = ""
	var r = []

	//first split the command into tokens
	var tokens = input.split(" ")
	
	//base command :. autocomplete command
	if(tokens.length == 1) {
		
		r = findcompletions(tokens[0], commands)
		
		//print out results...
		if(r.length == 1) {
			command.value = r[0] + " "
		} 
		else {
			result.innerHTML = r.join(" ")
		}	
	}
	
	//if multiple tokens, process last one 
	else {

		var lastword = tokens.pop()
		r = findcompletions(lastword, sections)
		
		if(r.length == 1) {
			//add only completion to prompt
			tokens.push(r[0])
		} 
		else {
			//return prompt to original
			tokens.push(lastword)		
			//and write options
			result.innerHTML = r.join(" ")
		}		
		
		//write the prompt, with either corrected or original
		command.value = tokens.join(" ")

	}

}

//find completions to input_word with list compare_against
//a list of possible completions is returned
//for ease, input can be of the wrong case and still be completed
function findcompletions(input_word, compare_against) {
	
	var results = []
	
	for (var i = 0; i < compare_against.length; i++) {
		var moveon = false
		for (var j = 0; j < input_word.length; j++) {
			if(input_word.length <= compare_against[i].length) {
				if(input_word.toLowerCase().charAt(j) != compare_against[i].toLowerCase().charAt(j)) {
					moveon = true
				}	
			} 
			else {
				moveon = true
			}
		}
		
		if(!moveon) {
			results.push(compare_against[i])
		}
	}
	return results
}

// - - -  process the command - - - 
//takes the input and does stuff...

function processcommand(input) {	
	var tokens = input.split(" ")
	if(tokens[0] == "" && tokens.length == 1) {
		return
	} 
	var command = tokens[0]
	var argument = input.substr(input.indexOf(" ")+1, input.length-1)

	log("command = " + "'" + command + "'")
	log("argument = " + argument)
	
	//move
	for (var i = 0; i < open_commands.length; i++) {
		if(command === open_commands[i]) {
			for (var j = 0; j < sections.length; j++) {
				//check for valid argument
				if(argument == sections[j]) {
					showpage(lowercasenospace(argument), pagecontainer)
					return
				}
			}
			//if argument is not valid, display message
			commandresult.innerHTML = argument + ": could not find page"
			return
		}
	}
	
	//if we get here, command is not valid
	commandresult.innerHTML = command + ": command not found"
	
	
}

/* - - - - - - CREATION - - - - - -  */

//fetches and displays the keys

function addkey(parent, cb) {
	xhreq("settings/categories.json", function(req) {
		//add title
		var ktitle = document.createElement("h3")
		ktitle.innerHTML = "Key:"
		parent.appendChild(ktitle)
		
		var items = parseJSON(req.responseText)
		
		for (var i = 0; i < items.length; i++) {
			
			//create the elements
			var keydiv = document.createElement("div")
			keydiv.className = "key_item"
			keydiv.setAttribute("id", items[i].name.toLowerCase())
			
			var p = document.createElement("p")
			p.innerHTML = items[i].name + ":"
			
			var tag = document.createElement("div")
			tag.className = "dot " + items[i].name.toLowerCase()
			
			keydiv.appendChild(p)
			keydiv.appendChild(tag)
			parent.appendChild(keydiv)
			
			//add to categories array
			categories.push(items[i].name)
			
			keydiv.onmouseover = function() {
				var itemdivs = getitemdivs()
				var thistag = this.getAttribute("id")
				highlighted = []
				
				for (var i = 0; i < itemdivs.length; i++) {
					var cats = itemdivs[i].role.split(',')
					for (var j = 0; j < cats.length; j++) {
						if(thistag === cats[j]) {
							itemdivs[i].firstChild.className = "item dark"
							this.className = "key_item light"
							highlighted.push(itemdivs[i])
						}
					}
				}
			}
			
			keydiv.onmouseout = function() {
				for(var i = 0; i < highlighted.length; i++) {
					highlighted[i].firstChild.className = "item"
				}
				highlighted = []
				this.className = "key_item"
			}
			
			keydiv.onclick = function() {
				pagecontainer.innerHTML = ""
				for(var i = 0; i < highlighted.length; i++) {
					location.hash = this.getAttribute("id")
					appendpage(highlighted[i].name, pagecontainer)
				}
			}
			
		}
		
		//now call callback
		if(cb) {
			cb()
		} 
	})
}

//fetches and displays all items...
//data is appended to parent argument

function additems(parent, cb) {
	xhreq("data/items.json", function(req) {
		
		var items = parseJSON(req.responseText)
		
		//add the items to DOM
		for (var i = 0; i < items.length; i++) {
			
			//create the elements
			var holdingdiv = document.createElement("div")
			holdingdiv.className = "item"
			holdingdiv.role = ""	
			
			//add link to child's title
			holdingdiv.name = items[i].link	
			
			var itemtable = document.createElement("table")
			itemtable.className = "item"
			
			//add name to table title: this is what 
			//shows when the mouse hovers over the element...
			itemtable.title = items[i].name
		
			var row = document.createElement("tr")
			
			//fill the elements, first the name
			var name = items[i].name
			var title = document.createElement("td")
			title.innerHTML = name
			row.appendChild(title)
			
			//also add name to sections list
			sections.push(name)		
	
			//the item's categories
			for (var j = 0; j < items[i].categories.length; j++) {
				var tagtd = document.createElement("td")
				var tag = document.createElement("div")
				tag.className = "dot " + items[i].categories[j]
				tagtd.appendChild(tag)
				row.appendChild(tagtd)
				
				//set title of div to tag names
				holdingdiv.role+= items[i].categories[j] + ((j < items[i].categories.length-1) ? "," : "")
			}
			
			holdingdiv.setAttribute("cats", holdingdiv.role)
				
			//append elements
			itemtable.appendChild(row)
			holdingdiv.appendChild(itemtable)
			
			//add to parent (function argument)
			parent.appendChild(holdingdiv)
			
			holdingdiv.onmouseover = function() {
				var ts = this.role.split(',')
				for (var k = 0; k < ts.length; k++) {
					var t = document.getElementById(ts[k].toString())
					t.className += " light"
					highlighted.push(t)
				}
				this.firstChild.className+= " dark"
			} 
			
			holdingdiv.onmouseout = function() {
				for (var k = 0; k < highlighted.length; k++) {
					highlighted[k].className = "key_item"
				}
				highlighted = []
				this.firstChild.className = "item"
	
			}
			
			
			holdingdiv.onmousedown = function() {
				location.hash = this.name
				showpage(this.name, pagecontainer)
				log(this.getAttribute("cats"))
			}
			
		}
		
		//now call callback
		if(cb) {
			cb()
		}
	}) 
}

function addtags(parent) {

	xhreq("data/tags.json", function(req) {
	
		var items = parseJSON(req.responseText)
		
		var t = document.createElement("h3")
		t.innerHTML = "Tags:"
		parent.appendChild(t)
		
		for (var i = 0; i < items.length; i++) {
			
			var tdiv = document.createElement("div")
			tdiv.className = "tag_item"
			tdiv.setAttribute("name", items[i])
			
			var span = document.createElement("span")
			span.innerHTML = items[i]
			
			tdiv.appendChild(span)
			parent.appendChild(tdiv)
			
		}
		
	})
}


//fetches and displays page content inside parent
function showpage(name, parent) {
	parent.innerHTML = ""
	appendpage(name, parent)
}

function appendpage(name, parent) {
	xhreq("data/" + name, function(req) {
		var article = document.createElement("article")	
		article.innerHTML += req.responseText
		parent.appendChild(article)
	})
}

/* - - - - - - HELPERS - - - - - -  */

function getitemtags(item) {
/* 	return  */
}

function parseJSON(text) {
	if(JSON) {
		return JSON.parse(text)
	}
	return eval("(" + text + ")")
}

function lowercasenospace(text) {
	return text.toLowerCase().split(" ").join("")
}

function checkhash() {
	//if there is a hash, load that page
	if(location.hash != "") {
		
		//do sections
		for (var i = 0; i < sections.length; i++) {
			if(location.hash == ("#" + lowercasenospace(sections[i]))) {
				showpage(lowercasenospace(sections[i]), pagecontainer)
				log("added " + sections[i])
				return
			}
		}
		
		//do categories
		for (var i = 0; i < categories.length; i++) {
			if(location.hash == ("#" + lowercasenospace(categories[i]))) {
				var itemdivs = getitemdivs()
				var thistag = lowercasenospace(categories[i])
				
				for (var j = 0; j < itemdivs.length; j++) {
					for (var k = 0; k < itemtags.length; k++) {
						if(itemtags[k] == thistag) {
							appendpage(itemdivs[j].name, pagecontainer)
						}
					}
				}
				
			}
		}
	}
}

//returns all items - their div
function getitemdivs() {
	var divs = document.getElementsByTagName("div")
	var itemdivs = []

	for (var i = 0; i < divs.length; i++) {
		if(divs[i].className === "item") {
			itemdivs.push(divs[i])
		}
	}
	
	return itemdivs
}

/* - - - XMLHttpResponse - - -  */
//thanks to ppk for these

function xhreq(url,callback) {
	var req = createXMLHTTPObject()
	if (!req) return
	
	//always use POST for request
	req.open("POST", url, true)
/* 	req.setRequestHeader('User-Agent','XMLHTTP/1.0') */
	
	//set callback
	req.onreadystatechange = function () {
		if (req.readyState != 4) return
		if (req.status != 200 && req.status != 304) {
			return
		}
		callback(req)
	}
	if (req.readyState == 4) return
	req.send()
}

var XMLHttpFactories = [
	function () {return new XMLHttpRequest()},
	function () {return new ActiveXObject("Msxml2.XMLHTTP")},
	function () {return new ActiveXObject("Msxml3.XMLHTTP")},
	function () {return new ActiveXObject("Microsoft.XMLHTTP")}
]

function createXMLHTTPObject() {
	var xmlhttp = false
	for (var i=0; i < XMLHttpFactories.length; i++) {
		try {
			xmlhttp = XMLHttpFactories[i]()
		}
		catch (e) {
			continue
		}
		break
	}
	return xmlhttp
}


//now add the script to add all the contentDocument
var go = document.createElement("script")
go.src = "js/open.js"
head.appendChild(go)

