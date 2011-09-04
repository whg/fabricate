
var container = document.createElement("div");
container.setAttribute("id", "container");
document.body.appendChild(container);

/* - - - command prompt - - -  */;

var keyboardcontainer = document.createElement("section");
keyboardcontainer.setAttribute("id", "keyboard");
container.appendChild(keyboardcontainer);

var keyinstructions = document.createElement("p");
keyinstructions.className = "instructions";
keyinstructions.innerHTML = "you can navigate this site with your keyboard";
keyboardcontainer.appendChild(keyinstructions);

var promptcontainer = document.createElement("div");
promptcontainer.setAttribute("id", "prompt_container");
keyboardcontainer.appendChild(promptcontainer);

var ps1 = document.createElement("span");
ps1.innerHTML = "$";
ps1.className = "command_line";
promptcontainer.appendChild(ps1);

var command = document.createElement("input");
command.className = "command_line";
promptcontainer.appendChild(command);

var promptinfo = document.createElement("div");
promptinfo.setAttribute("id", "prompt_info");
promptinfo.innerHTML = "info";
promptinfo.onmousedown = showinfo;
promptcontainer.appendChild(promptinfo);

var commandresult = document.createElement("div");
commandresult.setAttribute("id", "command_result");
commandresult.className = "command_line";
keyboardcontainer.appendChild(commandresult);

/*
var commandhelp = document.createElement("p");
commandhelp.innerHTML = "to use this thing, first you must turn it on...";
commandresult.appendChild(commandhelp);
commandhelp.style.display = "none";
*/


/* - - - CONTAINERS - - -  */;

var itemcontainer = document.createElement("nav");
itemcontainer.setAttribute("id", "items");
container.appendChild(itemcontainer);

var catscontainer = document.createElement("section");
catscontainer.setAttribute("id", "cats");
container.appendChild(catscontainer);

var tagscontainer = document.createElement("section");
tagscontainer.setAttribute("id", "tags");
container.appendChild(tagscontainer);

var pagecontainer = document.createElement("section");
pagecontainer.setAttribute("id", "page");
container.appendChild(pagecontainer);

//sections are the names of items, cats and tags;
var sections = [];

//keep track of highlighted elements;
var highlighted = [];

//a list of the tagitem divs;
var tagdivs = [];

//now get the data...;
//this function then calls the adding funtions;
performdata();

var hashset = "";
var startedchange = false;

command.focus();

var disable_command = false;

document.onkeydown = function(e) {
	
	if(disable_command && e.keyCode != 27) {
		return true;
	}
	
/* 	log(e.keyCode + " and " + e.charCode); */

	
	command.focus();
	
	

	switch(e.keyCode) {
	
		case 13: //enter;
			processcommand(command.value);
			command.value = "";
			break;
			
		case 9: //tab;
			if(!disable_command) {
				
				autocomplete(command.value, commandresult);
				
				e.preventDefault() //this is for firefox
				setTimeout(function() { command.focus() }, 100) //this is for opera
				return false //this is for IE;
				//not sure which one is for webkit browsers....
				//don't we love web development
			}
			break;
			
		case 27: //esc;
			if(!disable_command) {
				disable_command = true;
				command.blur();
				log("disabled");
			} 
			else {
				disable_command = false;;
				command.focus();
				log("enabled");
			}
			break;
			
	}

}




window.onresize = function() {
	scaleimages(pagecontainer);
}

//this event handles navigation...
window.onhashchange = function(e) {
	if(location.hash != "") {
		var elem = document.getElementById(location.hash.substr(2));
		showpage(elem);	
	}
	else {
		pagecontainer.innerHTML = "";
	}

}


