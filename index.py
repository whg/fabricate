from mod_python import apache

import os

workingdir = os.path.dirname(__file__) + "/"

def getfile(filename):
	f = open(workingdir + filename, "r")
	lines = f.readlines()
	return "".join(lines)


######## MAIN #########

def index(req, _escaped_fragment_="nothing"):

	req.content_type = "text/html"
		
	if _escaped_fragment_ == "nothing":
	
		return getfile("pages/index.html")
		
	elif _escaped_fragment_ == '':
		return getfile("pages/crawl.html")
		
	else:
# 		return "'" + _escaped_fragment_ + "'" 
		return os.path.dirname(__file__)
