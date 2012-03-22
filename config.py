#coding:utf-8

"""
# 配置文本格式
'test': {
	'source' : './test/',
	'target' : './public/test/',
	'recursive' : True, #不填默认为False 开启为True
	'ext': ['html', 'htm'], #不填默认为任意后缀
},


文件配置项
必须 source,target,
可选 
version 是否添加版本号（默认为文件本身版本号，当subversion为true时，使用 '本文件版本-子文件版本最大值' 作为版本号）到文件名
subversion 是否依赖其他资源的版本号，是否需要更新文件内容相关资源的版本号
subtype 相关资源的类型 ['image'] 图片， ['json'] 配置类型，['js'] js文件 , ['css'] css文件
compress 是否进行压缩
markreplace 是否有版本、时间戳替换标记 [boolean]
	支持的mark类型  日期: '%Date%' 版本号: '%Version%'
	
	
qzmin配置项
必须 source,target,


文件夹配置项
必须 source,target
可选 
version 同上
subversion 同上
subtype 同上
compress 是否进行压缩
recursive 循环子文件夹
ext 扩张名白名单 [数组]
blacklist 文件黑名单 [数组]
whitelist 文件白名单 [数组]
markreplace 是否有版本、时间戳替换标记 [boolean]
	支持的mark类型  日期: '%Date%' 版本号: '%Version%'
relpath #输出的文件target会相对于此目录, 优先级高于全局变量relPath


"""


# 默认白名单
allowext = ['png', 'jpg', 'jpeg', 'gif', 'js', 'css']

#输出的文件target会相对于此目录，每次生成均会先删除此文件夹
relPath = './public/'

rules = {
	'config' : {
		'source' : './',
		'target' : './',
		'ext' : ['js'],
		'whitelist' : ['config.js'],
	},
	'js' : {
		'source' : './js/',
		'target' : './',
		'ext' : ['js'],
		'blacklist' : ['jx.loader2.js'],
	},
	'assets' : {
		'source' : './assets/',
		'target' : './assets/',
		'recursive' : True,
	},
	'all_js' : {
		'source' : './tools/jx.all.js.qzmin',
		'target' : './jx.all.js',
	},
	'uiless_js' : {
		'source' : './tools/jx.uiless.js.qzmin',
		'target' : './jx.uiless.js',
	},
	'all_css' : {
		'source' : './tools/jx.all.css.qzmin',
		'target' : './assets/jx.all.css',
	},
	'uiless_css' : {
		'source' : './tools/jx.uiless.css.qzmin',
		'target' : './assets/jx.uiless.css',
	},
	
	# [dom, event]
	'dom_event_js' : {
		'source' : './tools/jx.dom.event.js.qzmin',
		'target' : './solo_parts/jx.dom.event.js',
	},
	# [dom, event, fx]
	'dom_event_fx_js' : {
		'source' : './tools/jx.dom.event.fx.js.qzmin',
		'target' : './solo_parts/jx.dom.event.fx.js',
	},
}


# 编译模式，
# -default 必须，为默认编译模式，对按照后面数组规则顺序进行编译
modes = {
	'-default': ['config','js','assets','all_js','uiless_js','all_css','uiless_css'],
	'-solo': ['all_js', 'dom_event_js', 'dom_event_fx_js']
	#'-dev': [],
	#'-debug': [],
	#'-test': [],
	#'-publish': [],
}

googleclosurePath = './tools/compile/compiler.jar' 
yuicompiressorPath = './tools/compile/yuicompressor-2.4.6.jar'