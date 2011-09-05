.PHONY: snaps install

all:
	python build/create.py
	bash build/install_core.sh
	python build/get_mod.py
	bash build/makesnapshots.sh
	bash build/send_mod.sh

create:
	python build/create.py


install_core:
	bash build/install_core.sh

update:
	python build/create.py
	python build/get_mod.py
	bash build/makesnapshots.sh
	bash build/send_mod.sh

clean:
	rm data/*
	echo "nothing here" > .store