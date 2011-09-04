.PHONY: snaps install

all:
	python build/create.py
	bash build/install.sh
	bash build/makesnapshots.sh

create:
	python build/create.py

snaps:
	bash build/makesnapshots.sh

install:
#	bash build/install.sh
	python build/install.py

clean:
	rm data/*
	rm snaps/*