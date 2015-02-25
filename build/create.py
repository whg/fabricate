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

def lowercasenospace(word):
	w = word.lower()
	return w.translate(None, " ")

#returns a list of the contents of all files
#in the passed directory
def readfiles(directory):
	
	files = dict()
#	files = []
	for dirpath, dirnames, filenames in os.walk(directory):
		for filename in filenames:
			try:
				int(filename.split('.')[0])
			except:
				continue

			with open(dirpath + "/" + filename, 'r') as f:
				files[filename] = f.readlines()
				#files.append(f.readlines())
#	print len(files)
	#return files
#	print [e[1] for e in sorted(files.items())]
	return [e[1] for e in sorted(files.items())]#, key = lambda x: x[0]sorted(files)

#make sure each file has the correct headers
#if not, ignore and don't use
def checkfiles(files):
	for i, lines in enumerate(files):
		if (lines[0][0:4] != "name"
				or lines[1][0:4] != "cats"
				 or lines[2][0:4] != "tags"):
			del files[i]
			print "not adding", lines[0][6:].strip()

#this creates the items JSON objects
def additems(files):
	
	for lines	in files:			
							
		#do name
		itemname = lines[0].split(":")[1].strip()			
		tempitem = [("name", itemname)]
	
		#make link; name in lowercase with no space
		link = lowercasenospace(itemname)
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
		
		print "added", itemname
		
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
		f.close()

#create index for search engines
#this creates a page that is very plain;
#so we have a nice search result...
def crawlablehomepage():
	itemnames = [ i['name'] for i in items ]
	
	with open("static/homehead.html") as f:
		head = f.readlines()
			
	with open("static/crawl.html", 'w') as f:
	
		for line in head:
			f.write(line)
# 		f.write("\n<h3>Projects include:</h3>\n")
# 		for item in itemnames:
# 			f.write('<a href="/#!' + item.lower() + '">' + item + '</a>\n')			
# 		f.write("<h3>Tags</h3>\n")
# 		for tag in tags:
# 			f.write('<a href="/#!' + tag.lower() + '">' + tag + '</a>\n')
# 		f.write("</body>\n</html>")
		
		f.close()
		
#this makes a list of all sections; items, cats and tags
#and writes them to a index file...
def makeindex():
	allthings = []
	allthings = [item["link"].lower() for item in items ]

    # remove the cats and tags because 
    # allthings.extend([cat.lower() for cat in cats])
	# allthings.extend([tag.lower() for tag in tags])
	
	with open("data/index", 'w') as f:
		for thing in allthings:
			f.write(thing + "\n")
		f.close()

#the depends file contains the links that each item has
#this is used when tests are carried out on items to see
#if they have been modified, if so all pages depending on 
#them must be too...
def makedepends():
	with open("data/depends", 'w') as f:
		for item in items:
			tl = [lowercasenospace(c) for c in item['cats']]
			tl.extend([lowercasenospace(t) for t in item['tags']])
			f.write(item["name"] + ":" + ",".join(tl)+"\n")
			
	f.close()		
		
		
if __name__ == "__main__":

	files = readfiles(os.getcwd() + "/content/sections")	
	checkfiles(files)
	additems(files)
	addcatsandtags()
	crawlablehomepage()
	makeindex()
	makedepends()
		
	#all data is stored in one json file
	writeJSON(dict(data), "data/data.json")
		

