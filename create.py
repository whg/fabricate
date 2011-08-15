#!/usr/bin/env python

# - - - - - health warning - - - - - 
# this code is not very easy to read

import os
import json

def getlist(line):
	things = line.split(":")[1]
	return things.split(",")

items = []
tags = set()

for dirpath, dirnames, filenames in os.walk("sections"):
	for filename in filenames:
		
		with open(dirpath + "/" + filename, 'r') as f:
			
			lines = f.readlines()

			#do some checks
			assert lines[0][0:4] == "name"
			assert lines[1][0:4] == "cats"
			assert lines[2][0:4] == "tags"
						
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
			
			tempitem.append(("categories", categories))
			
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
						
			f.close()
			
	

#now write the items.json file...
with open("data/items.json", 'w') as f:
	json.dump(items, f, indent=True)
	
	
#now write tags.json
with open("data/tags.json", 'w') as f:
	json.dump(list(tags), f, indent=True)
	
print tags
