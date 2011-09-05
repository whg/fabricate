# because pages are generated in JavaScript
# not a lot happens here, this is mostly used
# to serve Google with the correct page

from mod_python import apache

import os
import urllib2

workingdir = os.path.dirname(__file__) + "/"

def getfile(filename):
	f = open(workingdir + filename, "r")
	lines = f.readlines()
	f.close()
	return "\n".join(lines)

def index(req, _escaped_fragment_="nothing"):

	req.content_type = "text/html"
		
	#this is a user, using a browser
	if _escaped_fragment_ == "nothing":	
		return getfile("snaps/static/index.html")
		
	#this is for the homepage, when Google requests
	elif _escaped_fragment_ == '':
		return getfile("snaps/static/crawl.html")
		
	#any otherpage for Google
	else:
		
		fragment = urllib2.unquote(_escaped_fragment_)
		
		try:
			return getfile("snaps/" + fragment + ".html")
			
		except:
			return getfile("snaps/static/page_not_found.html")
		