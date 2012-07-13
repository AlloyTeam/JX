var http = require('http'),
	url = require('url'),
	fs = require('fs');

process.on('uncaughtException', function (err) {
	console.log('Caught exception: ' + err);
});

function css2js(text){
	text=text.replace(/\s+/g,' ').replace(/\/\*.*?\*\//g,'').replace(/('|\\)/g,'\\$1').replace(/\}\s*/g,'}\\\n').replace(/(^\s+|\\\s*$)/g,'');
	text=text.replace(/url\((?:\.\/)?([^\):]+)\)/g,'url(http://qplus1.idqqimg.com/jx/style/$1)');
	text='(function(styleText){\
var d=document,n=d.createElement(\'style\'),s,t;\
n.type=\'text/css\';\
if(s=n.styleSheet){\
s.cssText=styleText;\
}else{\
t=d.createTextNode(styleText);\
n.appendChild(t);\
}\
(d.head || d.documentElement).appendChild(n);\
})(\n\''+text+'\');';
	return text;
}

function joinCss(res,keys){
	var keyArr=keys.split(',');
	function callback(err, data){
		if(err){
			console.info(err);
			res.end('Abort!\n');
			return;
		}
		res.write(data);
		next();
	}
	function next(){
		var key=keyArr.shift();
		if(key!==undefined){
			fs.readFile('../style/jx.'+key+'.css',callback);
		}else{
			res.end();
		}
	}
	res.writeHead(200, {'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'max-age=3600'});
	next();
}

function joinJs(res,keys){
	var keyArr=keys.split(',');
	function cssCallback(err, data){
		if(err){
			console.info(err);
			res.end('Abort!\n');
			return;
		}
		res.write(css2js(data.toString()));
		next();
	}
	function jsCallback(err, data){
		if(err){
			console.info(err);
			res.end('Abort!\n');
			return;
		}
		res.write(data);
		next();
	}
	function next(){
		var key=keyArr.shift();
		if(key!==undefined){
			if(/\.css$/.test(key)){ //js-ed css file
				fs.readFile('../style/jx.'+key,cssCallback);
			}else{
				fs.readFile('../src/jx.'+key+'.js',jsCallback);
			}
		}else{
			res.end();
		}
	}
	res.writeHead(200, {'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'max-age=3600'});
	next();
}

http.createServer(function (req, res) {
	var pathname=url.parse(req.url).pathname;
	console.info('Receive request:' + pathname);
	var m=pathname.match(/^\/merge\/([\w,.]+)\/jx\.custom\.(css|js)\b/);
	if(m){
		if('css'===m[2]){
			joinCss(res,m[1]);
		}else{ //js
			joinJs(res,m[1]);
		}
	}else{
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.end('404 Not Found\n');
	}
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');