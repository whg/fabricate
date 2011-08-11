/* - - - - - - COMMAND LINE - - - - - -  */

var commands = ["cd", "move", "goto", "open", "home", "help", "back"]
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


/* - - - - - - HELPERS - - - - - -  */

function parseJSON(text) {
	return eval("(" + text + ")")
}

/* - - - XMLHttpResponse - - -  */
//thanks to ppk for these

function xmlreq(url,callback) {
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

