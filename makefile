.PHONY: snaps install

all:
	python build/create.py
	bash build/makesnapshots.sh
	bash build/install.sh

create:
	python build/create.py

snaps:
	bash build/makesnapshots.sh

install:
	bash build/install.sh

clean:
	rm data/*
	rm snaps/*