
var container = document.createElement("div")
container.setAttribute("id", "container")
body.appendChild(container)

/* - - - command prompt - - -  */

var keyboardcontainer = document.createElement("section")
keyboardcontainer.setAttribute("id", "keyboard_container")
container.appendChild(keyboardcontainer)

var keyinstructions = document.createElement("p")
keyinstructions.className = "instructions"
keyinstructions.innerHTML = "you can navigate this site with your keyboard"
keyboardcontainer.appendChild(keyinstructions)

/* var keyinstructions = "you can navigate this site with your keyboard" */

var promptcontainer = document.createElement("div")
promptcontainer.setAttribute("id", "prompt_container")
keyboardcontainer.appendChild(promptcontainer)

var ps1 = document.createElement("span")
ps1.innerHTML = "$"
ps1.className = "command_line"
promptcontainer.appendChild(ps1)

var command = document.createElement("input")
command.className = "command_line"
promptcontainer.appendChild(command)

var promptinfo = document.createElement("div")
promptinfo.setAttribute("id", "prompt_info")
promptinfo.innerHTML = "info"
promptcontainer.appendChild(promptinfo)

var commandresult = document.createElement("div")
commandresult.setAttribute("id", "command_result")
commandresult.className = "command_line"
keyboardcontainer.appendChild(commandresult)

function writeinstructions() {

	var icounter = 0;
	
	command.value = ""
	
	var t = setInterval(function() {
		command.value += keyinstructions.charAt(icounter++)
		
		if(icounter == keyinstructions.length) {
			clearInterval(t)		
/* 			asdf) */
/* 			setTimeout(writeinstructions, 1200) */
			keyinstructions = "you can..."
		}
		log(icounter + "yoooooo")
	}, 75)
}

/* writeinstructions() */

command.focus()

/* - - - items - - -  */

var itemscontainer = document.createElement("section")
itemscontainer.setAttribute("id", "items_container")
container.appendChild(itemscontainer)

var highlighted = []
var sections = []

//add items
xmlreq("data/items.json", function(req) {
	
	var items = parseJSON(req.responseText)
	
	//add the items to DOM
	for (var i = 0; i < items.length; i++) {
		
		//create the elements
		var holdingdiv = document.createElement("div")
		holdingdiv.className = "item"
		holdingdiv.role = ""	
		
		//add link to child's title
		holdingdiv.title = items[i].link	
		
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

		//the tags
		for (var j = 0; j < items[i].tags.length; j++) {
			var tagtd = document.createElement("td")
			var tag = document.createElement("div")
			tag.className = "tag " + items[i].tags[j]
			tagtd.appendChild(tag)
			row.appendChild(tagtd)
			
			//set title of div to tag names
			holdingdiv.role+= items[i].tags[j] + ((j < items[i].tags.length-1) ? "," : "")
			
		}
		
		
		//append elements
		itemtable.appendChild(row)
		holdingdiv.appendChild(itemtable)
		itemscontainer.appendChild(holdingdiv)
		
		holdingdiv.onmouseover = function() {
			var ts = this.role.split(',')
			for (var k = 0; k < ts.length; k++) {
				var t = document.getElementById(ts[k].toString())
				t.className += " light"
				highlighted.push(t)
			}
			this.firstChild.className+= " highlight"
		} 
		
		holdingdiv.onmouseout = function() {
			for (var k = 0; k < highlighted.length; k++) {
				highlighted[k].className = "key_item"
			}
			this.firstChild.className = "item"

		}
		
		
		holdingdiv.onmousedown = function() {
			log(this.title)
			location.hash = this.title
		}
		
	}
}) 


/* - - - keys - - -  */

var keycontainer = document.createElement("section")
keycontainer.setAttribute("id", "key_container")
container.appendChild(keycontainer)

xmlreq("settings/tag_types.json", function(req) {
	//add title
	var ktitle = document.createElement("h3")
	ktitle.innerHTML = "Key:"
	keycontainer.appendChild(ktitle)
	
	var items = parseJSON(req.responseText)
	
	for (var i = 0; i < items.length; i++) {
		
		//create the elements
		var keydiv = document.createElement("div")
		keydiv.className = "key_item"
		keydiv.setAttribute("id", items[i].name.toLowerCase())
		
		var p = document.createElement("p")
		p.innerHTML = items[i].name + ":"
		
		var tag = document.createElement("div")
		tag.className = "tag " + items[i].name.toLowerCase()
		
		keydiv.appendChild(p)
		keydiv.appendChild(tag)
		keycontainer.appendChild(keydiv)
	} 
})

/*
var footer = document.createElement("footer")
footer.innerHTML = "if you want to have a laugh, check out the source"
container.appendChild(footer)
*/

command.focus()
command.focus()

command.onblur = function() {
	log("blurrr")
}

var disable_command = false

document.onkeydown = function(e) {

	//block arrow keys if users has quit the command line
	if(e.keyCode > 36 && e.keyCode < 41) {
		return
	}
	
	command.focus() 
	
	log(e.keyCode + " and " + e.charCode)
	
	

	switch(e.keyCode) {
	
		case 13: //enter
			log(command.value)
			command.value = ""
			break
			
		case 9: //tab
			if(!disable_command) {
				
				autocomplete(command.value, commandresult)
			
				e.preventDefault()
				return false
			}
			break
			
		case 27: //esc
			disable_command = true;
			command.blur()
			break
			
		default:
			disable_command = false
			break
	}
	

}

log("end go")