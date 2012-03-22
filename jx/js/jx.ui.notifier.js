/**
 * 桌面通知模块
 * 目前只有chrome的实现
 * 来自:　http://0xfe.muthanna.com/notifyme.html
 * azreal, 2010-9-11
 */
Jx().$package(function (J) {
    var $D = J.dom,
		$E = J.event;

	/**
	 * 通知类
	 */
	J.ui = J.ui || {};
    J.ui.Notifier = new J.Class({
    	/**
    	 * Returns "true" if this browser supports notifications.
    	 */
        hasSupport: function(){
        	if (window.webkitNotifications) {
	        	return true;
	      	} else {
	        	return false;
	      	}
        },
        /**
         *  Request permission for this page to send notifications. If allowed,
    	 *  calls function "cb" with true.
         */
        requestPermission: function(cb){
        	window.webkitNotifications.requestPermission(function() {
		        if (cb) { cb(window.webkitNotifications.checkPermission() == 0); }
		    });
        },
        /**
         * Popup a notification with icon, title, and body. Returns false if
    	 * permission was not granted.
    	 * if success , return a popup object.
         */ 
	    notify : function(icon, title, body) {
  			if (window.webkitNotifications.checkPermission() == 0) {
			    var popup = window.webkitNotifications.createNotification(icon, title, body);
			    popup.show();
			    return popup;
			}
	      return false;
	    }
        
    });



});
