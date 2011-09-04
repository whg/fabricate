#!/bin/bash 

tempfile="site.tar.gz"
tempplace="/tmp/"
file=$tempplace$tempfile

tar --exclude content/ -czf $file .
echo "created archive"

scp $file whg@fezz.in:wgallia/
echo "uploaded file"

rm $file

ssh whg@fezz.in "cd wgallia; tar xf $tempfile; rm $tempfile"
echo "unpacked and made at host"

