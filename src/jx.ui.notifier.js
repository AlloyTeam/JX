/**
 * 桌面通知模块
 * 目前只有chrome的实现
 * 来自: http://0xfe.muthanna.com/notifyme.html
 * azreal, 2010-9-11
 */
Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;

    J.ui = J.ui || {};
    /**
     * chrome的桌面提醒封装
     * 
     * @memberOf ui
     * @class
     * @name Notifier
     * @constructor
     * 
     **/
    J.ui.Notifier = new J.Class(
    /**
     * @lends ui.Notifier.prototype
     */
    {
        /**
         * 如果浏览器支持桌面提醒, 返回true
         */
        hasSupport: function(){
            if (window.webkitNotifications) {
                return true;
            } else {
                return false;
            }
        },
        /**
         *  向浏览器请求使用桌面提醒, 若用户点击了同意, 则执行回到函数
         *  @param {Function} cb
         */
        requestPermission: function(cb){
            window.webkitNotifications.requestPermission(function() {
                if (cb) { cb(window.webkitNotifications.checkPermission() == 0); }
            });
        },
        /**
         * 弹出一个桌面提醒
         * @param {String} icon 图标的url
         * @param {String} title 标题
         * @param {String} body 提醒内容
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
