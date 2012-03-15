#!/usr/bin/python
#coding:utf-8
#python2.6

import json
import sys
import re
import os
import shutil
import platform
import commands
import time

from config import *

revFieldP = re.compile('Last Changed Rev\:\s*(\d+)\s*')
jsKeyP = re.compile('([^"\s]\S+[^"])\s*:')
dateFieldP = re.compile('Last Changed Date\:\s*(.+)\n*')

subtypes = {
	'image' : re.compile('url\((.*)\)'),
	'css' : re.compile('\<link.*rel=\"stylesheet\".*href=\"(.*)\".*\/\>'),
	'js' : re.compile('\<script.*type=\"text\/javascript\".*src=\"(.*)\".*\>\<\/script\>'),
	'json' : re.compile('[^"\s]\S+[^"]\s*:\s*\'(.*)\'')
}

marks = {}

tmpfiles = []

class Compile(object):
	def __init__(self, rule, name):
		print 'Complie ', name, 60*'+'
		self.target = rule['target']
		self.source = rule['source']
		self.version = rule.get('version')
		self.subversion = rule.get('subversion')
		self.subtype = rule.get('subtype')
		self.markreplace = rule.get('markreplace')
		self.ifcompress = "compress" not in rule or rule["compress"]
		self.name = name
		self.compressfiles = []
		
		# 默认值处理
		if not self.subtype:
			self.subversion = False
		else:
			self.subreg = [v for k, v in subtypes.items()]
			
		# 文件夹的basename为空
		self.sourcename = os.path.basename(self.source)
		if not self.sourcename:
			# 文件夹 扩展名为空
			self.ext = None
		else:
			self.ext = os.path.splitext(self.sourcename)[1][1:]
		
		
		# 合并规则qzmin
		if self.ext == 'qzmin':
			self.loadQzmin()
		# 文件夹规则			
		elif self.ext is None:
			self.recursive = rule.get('recursive')
			self.allowext = rule.get('ext')
			self.blacklist = rule.get('blacklist')
			self.whitelist = rule.get('whitelist')
			if not self.allowext:
				self.allowext = allowext
			self.moveFiles()
		# 文件规则
		else:
			self.moveFile(self.source, self.target)
			
		self.compressor(self.compressfiles)
		
	def loadQzmin(self, format=True):
		print 'load qzmin start', self.name
		f = open(self.source)
		ll = [];
		for l in f.xreadlines():
			if format:
				ll.append(js2json(l))
			else:
				ll.append(l)
		print 'load qzmin finish', self.name
		self.combine(json.loads("".join(ll)))
		
	def combine(self, j):
		print 'combine start', self.name
		projects = j["projects"]
		results = []
		for p in projects:
			target = p["target"]
			files =  p["include"]
			spath = self.source
			tpath = self.target
			ver = 0
			t = []
			combineContent = []
			for f in files:
				fileName = os.path.basename(f)
				filepath = os.path.join(os.path.dirname(self.source), f)
				fileVer = self.getFileVer(filepath)
				#if self.version and fileVer > ver:
				if fileVer > ver:
					ver = fileVer
				for line in open(filepath).xreadlines():
					t.append(line);
				t.append('\r\n');
				combineContent.append("".join(t))
				del t[:]
			results.append("".join(combineContent))
			print 'combine finish', self.name
		
			#if not self.version:
			#	pass
			#else:
			self.createTmpVerFile(tpath, ver)
			#	tpath = self.getVersionName(spath, tpath, ver)
			self.createFile(tpath, results)
			
	def moveFiles(self):
		if not self.recursive:
			for f in os.listdir(self.source):
				ext = os.path.splitext(f)[1][1:]
				if not self.allowext or self.allowext and ext in self.allowext:
					sourcefile = os.path.join(self.source, f)
					if os.path.isfile(sourcefile):
						self.moveFile(sourcefile, os.path.join(self.target, f))
		else:
			for root, dirs, files in os.walk(self.source, True):
				for f in files:
					ext = os.path.splitext(f)[1][1:]
					if not self.allowext or self.allowext and ext in self.allowext:
						spath = os.path.join(root, f)
						tpath = os.path.join(self.target, os.path.relpath(root, self.source), f)
						self.moveFile(spath, tpath)
		
	def moveFile(self, spath, tpath):
		# 白名单
		if not self.whitelist or self.whitelist and os.path.basename(spath) in self.whitelist:
			pass
		else:
			return
		
		# 黑名单
		if self.blacklist and os.path.basename(spath) in self.blacklist:
			return
		
		# 需要更新版本号 并且 需要更新文件内容自版本
		if self.version and self.subversion:
			self.createSubRevFile(spath, tpath, self.subreg, True)
		elif not self.version and self.subversion:
			self.createSubRevFile(spath, tpath, self.subreg, False)
		elif self.version and not self.subversion:
			tpath = self.getVersionName(spath, tpath)
			self.doMoveFile(spath, tpath)
		elif not self.version and not self.subversion:
			self.doMoveFile(spath, tpath)
		
	def doMoveFile(self, source, target):
		mkdir(target)
		print 'copyfile %s to %s ' % (source, target)
		if not self.markreplace:
			shutil.copy(source, target)
		else:
			#if os.path.isdir(target):
			#	target = os.path.join(target, filename)
			output = self.replace(target, "".join([line for line in open(source).xreadlines()]))
			open(target, "w").write(output)

		self.compressfiles.append(target)
	
	def replace(self, target, output):
		print 'replace', target
		for m in marks:
			print 'replace', m, marks.get(m)
			output = output.replace(m, marks.get(m))
		return output
		print 'replace finish', target	
		
	def getVersionName(self, spath, tpath, ver = ''):
		filename = os.path.splitext(tpath)[0]
		ext = os.path.splitext(tpath)[1]
		if ver != '':
			pass
		else:
			if "Windows" not in platform.platform():
				ver = self.getFileVer(spath)
			else:
				ver = time.strftime("%Y-%m-%d",time.localtime())
		return '%s.%s%s' % (filename, ver, ext)
	
	def getFileVer(self, path):
		ver = self.getVerFromTmpFile(path)
		if ver is None:
			output = commands.getoutput("svn info %s" % path)
			ver = revFieldP.search(output)
			if ver:
				ver = ver.group(1)
			else:
				ver = ''
		return ver
		
	def getVerFromTmpFile(self, path):
		tpath = self.getTmpVerFileName(path)
		t = []
		if os.path.exists(tpath):
			for line in open(tpath).xreadlines():
				t.append(line);
			return "".join(t)
		else:
			return None
		
	def createFile(self, tpath, contents):
		mkdir(tpath)
		open(tpath, "w").write("".join([l for l in contents]))
		self.compressfiles.append(tpath)
		print "Create File", tpath
		
	def createTmpVerFile(self, tpath, ver):
		tpath = self.getTmpVerFileName(tpath)
		contents = []
		contents.append(str(ver))
		tmpfiles.append(tpath)
		self.createFile(tpath, contents)
	
	def getTmpVerFileName(self, tpath):
		filename = os.path.splitext(tpath)[0]
		tpath = '%s.ver' % (filename)
		return tpath
		
	def createSubRevFile(self, spath, tpath, regs, isVersion):
		contents = []
		selfver = self.getFileVer(spath)
		subver = 0
		for line in open(spath).xreadlines():
			for reg in regs:
				urlline = reg.search(line)
				if urlline:
					break
					
			if urlline:
				#imgurl = urlline.group(1).replace('"', '')
				imgurl = urlline.group(1)
				imgpath = os.path.join(os.path.dirname(spath), imgurl)
				imgver = self.getFileVer(imgpath)
				if imgver > subver:
					subver = imgver
				filename = os.path.splitext(imgurl)[0]
				ext = os.path.splitext(imgurl)[1]
				newname = '%s.%s%s' % (filename, imgver, ext)
				contents.append(line.replace(imgurl, newname))
			else:
				contents.append(line)
		
		if not isVersion:
			pass
		else:
			ver = '%s-%s' % (selfver, subver)
			tpath = self.getVersionName(spath, tpath, ver)
			self.createTmpVerFile(spath, ver)
			
		self.createFile(tpath, contents)
	
	def compressor(self, files):
		if ifCompress and self.ifcompress:
			for f in files:
				filetype = os.path.splitext(f)[1][1:]
				if filetype in ["js", "css"]:
					print 'compressor start', self.name, "-"*40
					if filetype == "js":
						cmd = 'java -jar %s --%s %s --%s_output_file %s.min' % (googleclosurePath, filetype, f, filetype, f)
					elif filetype == "css":
						cmd = 'java -jar %s %s -o %s.min --charset utf-8' % (yuicompiressorPath, f, f)
					print cmd
					os.system(cmd)
					t = []
					for line in open(f+".min").xreadlines():
						t.append(line);
					open(f,"w").write("".join(t))
					os.remove(f+".min")
					print 'compressor finish', self.name, "-"*40



def pickMode(modeRules):
	for ruleName in modeRules:
		v = rules[ruleName]
		if v.get("relpath"):
			v['target'] = os.path.join(v['relpath'], v['target'])
		else:
			v['target'] = os.path.join(relPath, v['target'])
		Compile(v, ruleName)
		
def js2json(fileline):
	l = jsKeyP.sub(lambda l:'"%s" : ' % l.group(1), fileline)
	return '"'.join(l.split('\''))
			
def mkdir(path):
	path = os.path.dirname(path)
	if not os.path.exists(path):
		os.makedirs(path)
		print "Create path", path
		
def rmdir(path):
	if os.path.exists(path):
		shutil.rmtree(path)
		print "rmdir dir", path

def cleanup():
	print "CleanUp start", 60 * '-'
	for file in tmpfiles:
		if os.path.exists(file):
			os.remove(file)
			print "removefile path", file
	print "CleanUp end", 60 * '-'
	
if __name__ == '__main__':
	print platform.platform()
	if len(sys.argv) > 1:
		argS = (" ").join(sys.argv[1:])
	else:
		argS = ""
	argS = argS.lower()
	
	if "-h" in argS or "-help" in argS:
		print '''Options and arguments:
-h             : Help
-noup          : Publish without svn up
-nocompress    : Publish without google closure
-debug    	   : Complie with Debug Mode Rules
For example:
	python compile.py -noup -nocompress 
	python compile.py -debug 
		'''
		sys.exit()

	if "-noup" in argS:
		pass
	else:
		if "Windows" not in platform.platform():
			os.system("svn up")
			
	if "-nocompress" in argS:
		ifCompress = False
	else:
		ifCompress = True
	
	# replace marks 
	if "Windows" not in platform.platform():
		output = commands.getoutput("svn info")
		REV = revFieldP.search(output).group(1)
		DATE = dateFieldP.search(output).group(1)[:19]
	else:
		REV = DATE = str(time.time())
	marks['%Date%'] = DATE
	marks['%Version%'] = REV

	# 默认编译模式
	mode = '-default'
	for cmd in sys.argv[1:]:
		if modes.get(cmd):
			mode = cmd
			break
		
	if modes.get(mode):
		rmdir(relPath)
		print mode, "Compile Mode on ", "-"*60
		pickMode(modes.get(mode))
			
	# 删除临时ver文件	
	cleanup()
	sys.exit()