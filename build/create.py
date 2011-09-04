#!/usr/bin/env python


import os
import json

data = []
items = []
cats = set()
tags = set()

def getlist(line):
	things = line.split(":")[1]
	return things.split(",")

def readfiles(directory):
	
	files = []
	
	for dirpath, dirnames, filenames in os.walk(directory):
		for filename in filenames:
			
			with open(dirpath + "/" + filename, 'r') as f:
				
				files.append(f.readlines())
				
				f.close()
	
	return files
	
def checkfiles(files):
	for lines in files:
		assert lines[0][0:4] == "name"
		assert lines[1][0:4] == "cats"
		assert lines[2][0:4] == "tags"
	
def additems(files):
	
	for lines	in files:			
							
		#do name
		itemname = lines[0].split(":")[1].strip()			
		tempitem = [("name", itemname)]
	
		#make link; name in lowercase with no space
		link = itemname.lower()
		link = link.translate(None, " ")
		tempitem.append(("link", link))
		
		#categories are added to dictionary as a list
		catsline = getlist(lines[1])
		categories = []
		for category in catsline:
			categories.append(category.strip())
			cats.add(category.strip())
		
		tempitem.append(("cats", categories))
		
		#tags are also a list...
		#keep track of the different tags, by adding them to the tags set
		tagsline = getlist(lines[2])
		itemtags = []
		for tag in tagsline:
			itemtags.append(tag.strip())
			tags.add(tag.strip())
			
		tempitem.append(("tags", itemtags))
		
		#now add temp item as a dictionary (json object)			
		items.append(dict(tempitem))	
	
		
		#get the rest of the content and put it in a string
		content = "".join(lines[3:])
		
		#now write the file...
		with open("data/" + link, 'w') as g:
			g.write(content)
			g.close()

	data.append(("items", items))
		
		

#this creates a dictionary of each category and tag
#with it's corresponding item(s)
def addcatsandtags():
	
	catsdict = dict([(cat, []) for cat in cats])
	tagsdict = dict([(tag, []) for tag in tags])

	for item in items:
		name = item["link"]
		
		for cat in item["cats"]:
			catsdict[cat].append(name)
			
		for tag in item["tags"]:
			tagsdict[tag].append(name)

	
	data.extend([("cats", catsdict), ("tags", tagsdict)])
		
def addtags():
	data.append(("tags", list(tags)))
			
def writeJSON(content, filename):
	with open(filename, 'w') as f:
		json.dump(content, f, indent=True)
	
def crawlablehomepage():
	itemnames = [ i['name'] for i in items ]
	
	with open("templates/homehead.html") as f:
		head = f.readlines()
		
	
	with open("pages/crawl.html", 'w') as f:
	
		for line in head:
			f.write(line)
	
		f.write("\n<p>Projects include:</p>\n")
		
		for item in itemnames:
			f.write('<a href="#!' + item.lower() + '">' + item + '</a>\n')
			
		f.write("</body>\n</html>")
		
		f.close()
		
#this makes a list of all sections; items, cats and tags
#and writes them to a index file...
def makeindex():
	allthings = []
	allthings = [item["link"].lower() for item in items ]
	allthings.extend([cat.lower() for cat in cats])
	allthings.extend([tag.lower() for tag in tags])
	
	with open("data/index", 'w') as f:
		for thing in allthings:
			f.write(thing + "\n")
		f.close()
	

if __name__ == "__main__":

# 	dirname = os.path.dirname(__file__)
# # 	dirname = dirname[:-5]
# 	print os.getcwd() + "/sections"

	files = readfiles(os.getcwd() + "/content/sections")
	
	checkfiles(files)
	
	additems(files)

	addcatsandtags()
	
	crawlablehomepage()
	
	makeindex()
	
	#all data is stored in one json file
	writeJSON(dict(data), "data/data.json")
		

