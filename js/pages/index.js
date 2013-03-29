Jx().$package('JxHome', function (J) {
	var $D = J.dom,
		$E = J.event,
		$FX = J.fx,
		pkg = this;
	
	var urlHash = {
		//'home': './home_nocanvas.html',
		'home': supportCanvas() ? './home.html' : './home_nocanvas.html',
		
		'doc': './doc/index.html',
		'demo': './demo/index.html',
		'download': './download.html',
		'about': './about.html'
	}, $ifm, $navUl, $lis, $doc;	
	
	function supportCanvas () {
		var canvas = document.createElement('canvas');
		return !!canvas.getContext;
	}
	
	function getViewport () {
		return {
			width: J.browser.ie > 0 ? document.documentElement.clientWidth : window.innerWidth,
			height: J.browser.ie > 0 ? document.documentElement.clientHeight : window.innerHeight
		}
	}
	//冒泡到 指定元素
	function bubbleTo (target, nodeName, key) {
		if (target == document.documentElement) {
			return null;
		}
		return (target.nodeName.toLowerCase() == nodeName && !!target.getAttribute(key)) ? target : bubbleTo(target.parentNode, nodeName, key)
	}
	
	function resize () {
		var vp = getViewport();
		$D.setStyle($doc, 'height', Math.max(400, vp.height) + 'px');
		$ifm.height = vp.height;
	}
	
	function navItemClick (e) {
		var tar = bubbleTo(e.target, 'li', 'data-key'),id;
		if (tar) {
			id = tar.getAttribute('data-key');
		}
		selectItem(id);
	}
	function selectItem(id){
		var url = urlHash[id],tar;
		if(!url){
			url = urlHash['home'];
			tar = document.getElementById('nav-home');
		}else{
			tar = document.getElementById('nav-'+id);
		}
		if (!!url && url!==$ifm.getAttribute('src')) {
			//$D.setStyle($ifm, 'opacity', 0);
			$ifm.setAttribute('src', url);
		}
		if (tar) {
			for (var i = 0; i < $lis.length; i ++) {
				$D.removeClass($lis[i], 'selected');
			}
			$D.addClass(tar, 'selected');
		}
	}
	
	this.init = function () {
		this.getEls();
		//this.setDataUrl();
		this.bind();
		resize();
		var hash=(location.hash || '#home').substr(1);
		selectItem(hash);
	}
	this.getEls = function () {
		$ifm = $D.id('ifm');
		$navUl = $D.id('nav-ul');
		$doc = $D.id('doc');
		$lis = $navUl.getElementsByTagName('li');
	}
	this.setDataUrl = function () {
		// var lis = $navUl.getElementsByTagName('li');
		// for (var i = 0; i < lis.length; i ++) {
			// var li = lis[i],
				// key = li.getAttribute('data-key');
			// if (!!urlHash[key]) {
				// li.setAttribute('data-url', urlHash[key]);	
			// }
		// }
	}
	this.bind = function () {
		$E.on($navUl, 'click', navItemClick);
		$E.on(window, 'resize', resize);
		$E.on($ifm, 'load', function () {
			// $FX.animate($ifm, {
				// opacity: 1
			// });
			resize();
		});
		$E.on(window, 'hashchange', function(){
			var hash=(location.hash || '#home').substr(1);
			selectItem(hash);
		});
	}
	
	$E.onDomReady(function () {
		pkg.init();
	})
});