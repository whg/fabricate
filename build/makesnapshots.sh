#!/bin/bash

#this script must be called from the root directory
#preferably with 'make snaps'

#due to some incompatibility in phantomjs we can't append children
#so we have some workaround here...

#modify page so scripts get executed
cp snaps/index.html snaps/bindex.html
echo '<script src="js/functions.js"></script><script src="js/open.js"></script>' >> snaps/index.html

i=0
l=`cat snaps/tosnap | wc -l`
ll=`echo $l` #this removes whitespace
echo "creating snapshots... we have $ll to do"
ext=".html"

#python has kindly generated a list of the files
#that have been modified, only get snapshots of those...

for item in `cat snaps/tosnap`; do
	url="http://wgallia.local#!$item"
	printf "trying $url"
	
	#now call phantomjs with the right url...
	phantomjs build/phantom_snappers.js $url > snaps/$item$ext
	
	#increment and display
	i=$[$i+1]
	echo "   done: $i/$ll"
done

#go back to normal
mv snaps/bindex.html snaps/index.html
echo "put back to normal"