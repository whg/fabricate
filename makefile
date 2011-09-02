.PHONY: snaps

all:
	python build/create.py

snaps:
	bash build/makesnapshots.sh

install:
	bash build/install.sh

clean:
	rm data/*
	rm snaps/*