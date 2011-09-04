
import os


cwd = os.getcwd() + "/"

store = open(".store", "r+")

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


#get data from .store and put in dict
lines = [l.strip() for l in store.readlines()]
for line in lines:
	path, time = line.split(" ")
	oldfiles[path] = time


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

#write the new store
for path, time in newfiles.iteritems():
	store.write(path + " " + str(time) + "\n")

#finish up
store.close()