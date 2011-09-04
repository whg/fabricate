#!/bin/bash

mkdir to_mod

for file in `cat toadd`; do
	#copy the file, preserving the directory structure
	rsync -R $file ./to_mod
done
echo "copied files"

mv toadd to_mod/files
tar czf to_mod.tar.gz to_mod/
rm -R to_mod/
echo "tarred"

scp to_mod.tar.gz whg@fezz.in:wgallia
rm to_mod.tar.gz
ssh whg@fezz.in "bash wgallia/build/unpack_at_host.sh"
echo "sent and unpacked"

