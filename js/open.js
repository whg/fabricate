
var container = document.createElement("div")
container.setAttribute("id", "container")
document.body.appendChild(container)

/* - - - command prompt - - -  */

var keyboardcontainer = document.createElement("section")
keyboardcontainer.setAttribute("id", "keyboard")
container.appendChild(keyboardcontainer)

var keyinstructions = document.createElement("p")
keyinstructions.className = "instructions"
keyinstructions.innerHTML = "you can navigate this site with your keyboard"
keyboardcontainer.appendChild(keyinstructions)

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

var commandhelp = document.createElement("p")
commandhelp.innerHTML = "to use this thing, first you must turn it on..."
commandresult.appendChild(commandhelp)
commandhelp.style.display = "none"


/* - - - CONTAINERS - - -  */

var itemcontainer = document.createElement("section")
itemcontainer.setAttribute("id", "items")
container.appendChild(itemcontainer)

var catscontainer = document.createElement("section")
catscontainer.setAttribute("id", "cats")
container.appendChild(catscontainer)

var tagscontainer = document.createElement("section")
tagscontainer.setAttribute("id", "tags")
container.appendChild(tagscontainer)

var pagecontainer = document.createElement("section")
pagecontainer.setAttribute("id", "page")
container.appendChild(pagecontainer)

//sections are the names of items, cats and tags
var sections = []

//keep track of highlighted elements
var highlighted = []

//a list of the tagitem divs 
var tagdivs = []

//now get the data...
//this function then calls the adding funtions
getdata()

var hashset = ""
var startedchange = false

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
	
/* 	log(e.keyCode + " and " + e.charCode) */
	

	switch(e.keyCode) {
	
		case 13: //enter
			processcommand(command.value)
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
	
/* 	commandhelp.style.display = "inline" */
}



function writeinstructions() {

	var icounter = 0;
	
	command.value = ""
	
	var t = setInterval(function() {
		command.value += keyinstructions.charAt(icounter++)
		
		if(icounter == keyinstructions.length) {
			clearInterval(t)		
/* 			setTimeout(writeinstructions, 1200) */
			keyinstructions = "you can..."
		}
		log(icounter + "yoooooo")
	}, 75)
}

var hashcheck = setInterval(function() { 
/*
	log(hashset + " " + location.hash.substr(1))

	if(checkhash()) {
		clearInterval(hashcheck)
		log("cleared")
	}
*/
	if(hashset != location.hash.substr(1)) {
		
		var e = document.getElementById(location.hash.substr(1))
		
		if(e && !startedchange) {
			showpage(e, pagecontainer, false)
		}
	}
	log("a")
}, 150)

log("end go")