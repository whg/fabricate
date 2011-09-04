#!/bin/bash

cd ~/wgallia
tar xf to_mod.tar.gz
rm to_mod.tar.gz
cd to_mod/

for file in `cat files`; do
	rsync -R ${file:2} ..
done

cd ..
rm -R to_mod