from mod_python import apache

def index(req, one="", two=""):
    
    req.content_type="text/html"
    req.write("i am a python with " + nn + "<br/>")
    req.write("gg is " + gg)
    
