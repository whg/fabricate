#!/bin/bash

#this script must be called from the root directory
#preferably with 'make snaps'

#due to some incompatibility in phantomjs we can't append children in js
#so we have some workaround here...

#modify page so scripts get executed
# cp static/index.html static/bindex.html
# echo '<script src="js/functions.js"></script><script src="js/open.js"></script>' >> static/index.html

# sed 's|snaps = false|snaps = true|' load.js >tmpload.js
# mv load.js bload.js
# mv tmpload.js load.js

i=0
l=`cat snaps/tosnap | wc -l`
ll=`echo $l` #this removes whitespace
echo "creating snapshots... we have $ll to do"
ext=".html"

#python has kindly generated a list of the files
#that have been modified, only get snapshots of those...

for item in `cat snaps/tosnap`; do
	# url="http://wgallia.local#!$item"
    url="http://wgallia.com#!$item"
	printf "trying $url"
	
	#now call phantomjs with the right url...
	phantomjs build/phantom_snappers.js $url > snaps/$item$ext
	
	#increment and display
	i=$[$i+1]
	echo "   done: $i/$ll"
done

#go back to normal
# mv static/bindex.html static/index.html
# mv bload.js load.js
# echo "put back to normal"
