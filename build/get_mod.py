
import os

cwd = os.getcwd() + "/"

store = open(".store", "r")

oldfiles = dict()
newfiles = dict()
toadd = []

#get the data for the current files,
#and put them in a dict
for dirpath, dirnames, filenames in os.walk("./content"):
	for f in filenames:
		path =  os.path.join(dirpath, f)
		stat = os.stat(path)
		newfiles[path] =  int(stat.st_mtime)


try:
#get data from .store and put in dict
    lines = [l.strip() for l in store.readlines()]
    for line in lines:
        path, time = line.split(" ")
        oldfiles[path] = time
except ValueError:
    print "bad store"


#check if file is new or modified
for npath, ntime in newfiles.iteritems():
	if npath in oldfiles:
		if ntime != int(oldfiles[npath]):
			print npath, "modified"
			toadd.append(npath)
	else:
		print npath, "is new"
		toadd.append(npath)
		
#write the files we need to copy...
with open("toadd", "w") as f:
	f.writelines([ta + "\n" for ta in toadd])
	f.close


#this part is to check if we need to generate new snapshots 

depends = dict()
with open("data/depends", 'r') as f:
	lines = f.readlines()
	depends = dict([(line.split(':')[0], line.split(':')[1].strip()) for line in lines])
	f.close()

#use a set for this as we don't want duplicates
tosnap = set()

for i in toadd:
	if i.find("/sections/") != -1:
		with open(i, 'r') as f:
			line = f.readline()
			name = line.split(':')[1]
			if name.strip() in depends:
				#add self
				tosnap.add(name.strip())
				#and all dependencies
                # for thing in depends[name.strip()].split(','):
                #     tosnap.add(thing)
				
				
with open("snaps/tosnap", 'w') as f:
	for snap in tosnap:
		f.write(snap.replace(' ', '').lower()  + "\n")
	f.close()

		
#close the store and open again this time for writing...
store.close()
store = open(".store", 'w')

#write the new store
for path, time in newfiles.iteritems():
	store.write(path + " " + str(time) + "\n")
				
#finish up
store.close()
			
