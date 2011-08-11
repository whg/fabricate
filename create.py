#!/usr/bin/env python

# - - - - - health warning - - - - - 
# this code is not very easy to read

import os
import json

items = []

for dirpath, dirnames, filenames in os.walk("sections"):
	for filename in filenames:
		
		with open(dirpath + "/" + filename, 'r') as f:
			
			lines = f.readlines()

			#do some checks
			assert lines[0][0:4] == "name"
			assert lines[1][0:4] == "tags"
						
			#do name
			itemname = lines[0].split(":")[1].strip()			
			tempitem = [("name", itemname)]

			#make link; name in lowercase with no space
			link = itemname.lower()
			link = link.translate(None, ' ')
			tempitem.append(("link", link))
			
			#tags are added to dictionary as a list
			tagsline = lines[1].split(":")[1]
			tagsline = tagsline.split(",")
			tags = []
			for tag in tagsline:
				tags.append(tag.strip())
			
			tempitem.append(("tags", tags))
			
			#now add temp item as a dictionary (json object)			
			items.append(dict(tempitem))	

			
			#get the rest of the content and put it in a string
			content = "".join(lines[3:])
			
			with open("data/" + link, 'w') as g:
				g.write(content)
				g.close()
						
			f.close()
			

#now write the items.json file...
with open("data/items.json", 'w') as f:
	json.dump(items, f, indent=True)