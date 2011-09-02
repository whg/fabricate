from mod_python import apache

import os
import urllib2

workingdir = os.path.dirname(__file__) + "/"

def getfile(filename):
	f = open(workingdir + filename, "r")
	lines = f.readlines()
	f.close()
	return "".join(lines)


######## MAIN #########

def index(req, _escaped_fragment_="nothing"):

	req.content_type = "text/html"
		
	#this is a user, using a browser
	if _escaped_fragment_ == "nothing":	
		return getfile("pages/index.html")
		
	#this is for the homepage
	elif _escaped_fragment_ == '':
		return getfile("pages/crawl.html")
		
	#any otherpage
	else:
		
		fragment = urllib2.unquote(_escaped_fragment_)
		
		try:
			return getfile("pages/" + fragment + ".html")
			
		except:
			return "oh nooo.....<br/> with " + fragment
		
		
# 		return "'" + _escaped_fragment_ + "'" 
		return os.path.dirname(__file__)
