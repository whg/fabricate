#!/bin/bash 

tempfile="site.tar.gz"
tempplace="/tmp/"
file=$tempplace$tempfile

tar czf $file .
echo "created archive"

scp $file whg@fezz.in:wgallia/
echo "sent file"

rm $file

ssh whg@fezz.in "cd wgallia; tar xf $tempfile" | cat
echo "unpacked at host"
