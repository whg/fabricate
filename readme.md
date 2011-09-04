fabricate
=========

A collection of JavaScript, Python and shell scripts that makes a website 
-------------------------------------------------------------------------

Fabricate reads a set of text files with headers containing their names and tags and them makes a JSON object that JavaScript can read and work with. Items can be associated with categories and tags. 

Uplading to the server is done from some shell scripts and files are uploaded intelligently, meaning that if a file has not been modified since the last upload, the file won't we reuploaded.

This is/will be powering [wgallia.com](http://wgallia.com).