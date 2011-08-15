
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

/* writeinstructions() */

command.focus()

/* - - - ITEMS - - -  */

var itemscontainer = document.createElement("section")
itemscontainer.setAttribute("id", "items")
container.appendChild(itemscontainer)

//keep track of highlighted elements
var highlighted = []

//all items are added to this list, 
//it's used for autocompletion
var sections = []

var categories = []

//add items to itemscontainer
//all events are handled in function
//checkhash callback is passed...
additems(itemscontainer, checkhash)


/* - - - KEY/CATEGORIES - - -  */

var keycontainer = document.createElement("section")
keycontainer.setAttribute("id", "key")
container.appendChild(keycontainer)

addkey(keycontainer, checkhash)

/* - - - TAGS - - -  */

var tagscontainer = document.createElement("section")
tagscontainer.setAttribute("id", "tags")
container.appendChild(tagscontainer)

addtags(tagscontainer)

/* log(JSON) */

/* - - - PAGE - - -  */

var pagecontainer = document.createElement("section")
pagecontainer.setAttribute("id", "page")
container.appendChild(pagecontainer)



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


log("end go")