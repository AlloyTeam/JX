//Jx Framework Dependency Configuration
Jx().$package(function(J){
	var TIME_STAMP='20111117001';
	J.loader.featureDetect = function(name){
		var UNDEF='undefined';
		switch(name){
			case 'dom':
				if(UNDEF===typeof J.dom || UNDEF===typeof J.dom.id){
					return false;
				}
				break;
			case 'event':
				if(UNDEF===typeof J.event || UNDEF===typeof J.event.on){
					return false;
				}
				break;
			case 'mini':
				if(UNDEF===typeof J.dom || UNDEF===typeof J.dom.mini){
					return false;
				}
				break;
			default:
				var ni,
					nis=name.split('.'),
					ns=J;
				for(var i=0,l=nis.length;i<l;i++){
					ni=nis[i];
					ns=ns[ni];
					if(UNDEF===typeof ns){
						return false;
					}
				}
		}
		return true;
	};
	J.loader.joinUrlByList = function(list){
		/*var cgi='http://pelli.www.qq.com/jx_loader/merge.php';
		return cgi+'?scripts='+list.join(',').toLowerCase();*/
		var cgi='http://cgi.qplus.com/qplusown/merge_script_resources';
		return cgi+'?scripts=["'+list.join('","').toLowerCase()+'"]&t='+TIME_STAMP;
	}
	var depends={
		'array':['base'],
		'base':[],
		'browser':[],
		'console':['base','dom','event','string','http','browser','array'],
		'cookie':[],
		'date':['format'],
		'development':['console'],
		'dom':['browser','base'],
		'event':['base','browser','array'],
		'event.eventParser':['base'],
		'event.eventProxy':['event','event.eventParser'],
		'format':[],
		'fx':['dom','event','base','array'],
		'http':['dom','event','browser'],
		'json':[],
		'mini':[],
		'number':['format'],
		'sound':['dom','event','browser','swfobject','base'],
		'string':[],
		'swfobject':[],
		'ui.BaseWindow':['dom','event','base','browser','string','array','ui.Drag','ui.MaskLayer','ui.Resize'],
		'ui.Boxy':['dom','event','base','ui.Panel','ui.MaskLayer','ui.Drag'],
		'ui.Bubble':['dom','string','event','base'],
		'ui.Button':['dom','string','event','base'],
		'ui.calendar':['dom','event','base'],
		'ui.ContextMenu':['dom','string','event','base','browser','ui.PopupBox'],
		'ui.DivSelect':['dom','string','event'],
		'ui.Drag':['dom','event','base','ui.MaskLayer','browser'],
		'ui.IframeScroller':['dom','event','browser'],
		'ui.iScroll':[],
		'ui.Loading':['dom','event','base'],
		'ui.Marquee':['dom','event','base'],
		'ui.MaskLayer':['dom','event','base','browser'],
		'ui.Notifier':['dom','event','base'],
		'ui.Pagination':['dom','event','base'],
		'ui.Panel':['dom','event','base'],
		'ui.PopupBox':['dom','event','base','ui.Panel'],
		'ui.Resize':['dom','event','base','ui.Drag'],
		'ui.RichEditor':['dom','event','browser','base'],
		'ui.Rotation':['dom','browser','base'],
		'ui.ScrollArea':['dom','event','base','browser'],
		'ui.ScrollBar':['dom','event','base','browser'],
		'ui.Sortables':['dom','browser','base','array','browser','ui.Drag'],
		'ui.Tab':['dom','event','array'],
		'ui.TextBox':['dom','string','event','base','ui.PopupBox','ui.Panel','ui.Button','browser'],
		'ui.Tooltip':['dom','string','array','event','fx','base','browser'],
		'ui.TouchScroller':['dom','event','base']
	};
	var sheets={
		'960grid':null,
		'reset':null,
		'typography':null,
		'ui.Boxy':'ui.Boxy',
		'ui.Bubble':'ui.Bubble',
		'ui.Button':'ui.Button',
		'ui.calendar':'ui.calendar',
		'ui.ContextMenu':'ui.ContextMenu',
		'ui.MaskLayer':'ui.MaskLayer',
		'ui.TextBox':'ui.TextBox'
	};
	J.loader.addDepends(depends);
	J.loader.addSheets(sheets);
});
