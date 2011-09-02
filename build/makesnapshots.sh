#!/bin/bash

#this script must be called from the root directory
#prefereably with 'make snaps'

items=`cat data/index`
i=0
l=`cat data/index | wc -l`

#removes whitespace, as bash trims 
#arguments to functions, apperently
#thanks stack overflow
trim() { echo $1; }

ll=$(trim $l)
echo $l
ext=".html"

for item in $items; do
	url="http://fezz.in/whg/new#!$item"
	printf "trying $url"
	
	#now call phantomjs with the right url...
	phantomjs build/phantom_snappers.js $url > snaps/$item$ext
	
	#increment and display
	i=$[$i+1]
	echo "   done: $i/$ll"
done