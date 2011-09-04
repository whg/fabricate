#!/bin/bash

tar czf content.tar.gz content
echo "made tar"
scp content.tar.gz whg@fezz.in:wgallia
rm content.tar.gz
ssh whg@fezz.in "cd wgallia; tar xf content.tar.gz; rm content.tar.gz"