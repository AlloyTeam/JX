/* == J.ui.ContextMenu =============================================
 * Copyright (c) 2011, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-1-18 ----- */
 
 
 Jet().$package(function (J) {
    var $D = J.dom,
        $S = J.string,
        $E = J.event;
    
    var startId = 0,
        topZIndex = 9000000;
    
    var flashItemId = 0;
    var contextHash = {};
    var flashItemHash = {};
    
    var onSelfContextMenu = function(e){
        e.preventDefault();
        e.stopPropagation();
    };
    var stopPropagation = function(e){
        e.stopPropagation();
    };
    J.ui = J.ui || {};
    
    /**
     * 【ContextMenu】
     * 
     * @memberOf ui
     * @name ContextMenu
     * @class
     * @constructor
     * @param {Object} option 构造参数
     * {
     * id: '',//random
     * name: id,
     * container: document.body,
     * className: '' ,
     * width: null,
     * triggerEvent: 'contextmenu',
     * triggers: null,//HTMLElement数组 ,触发右键菜单的dom
     * items: []
     * }
     * 
     * @since version 1.0
     * @description
     * triggers 参数是指触发右键菜单显示的dom,
     * 右击该节点就显示菜单
     * 也可以不使用这个属性, 调用的地方自己控制显示隐藏菜单
     */
    var ContextMenu = J.ui.ContextMenu = new J.Class(
    /**
     * @lends ui.ContextMenu.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (option){
            var context = this;
            var id = this.id = 'context_menu_' + (option.id || (startId++));
            var name = option.name || id;
            var parent = this._parent = option.container || (option.parentMenu ? option.parentMenu._parent : null) || document.body;
            var className = option.className || '';
            this.parentMenu = option.parentMenu;
            var context = this;
            var container = this._el = $D.id(id) || $D.node('div', {
                id: id,
                'class': 'context_menu',
                style: 'display: none;'
            });
            var html = '<div class="context_menu_container "' + className + '"><ul id="'+ id +'_body" class="context_menu_item_list"></ul></div>';
//                html += '<div class="context_menu_outer_r"></div><div class="context_menu_outer_b"></div>'
//                + '<div class="context_menu_outer_rt"></div><div class="context_menu_outer_rb"></div><div class="context_menu_outer_lb"></div>';
            
            if(J.browser.ie){//遮ie的flash
                html += '<iframe class="context_menu_iframe" src="'+alloy.CONST.MAIN_URL+'domain.html"></iframe>';
            }
            container.innerHTML = html;
            parent.appendChild(container);
            
            if(option.width){
                $D.setStyle(container, 'width', option.width + 'px');
            }
            this._body = $D.id(id + '_body');
            $E.off(container, 'contextmenu');//防止绑定多个事件
            $E.on(container, 'contextmenu', onSelfContextMenu);
            $E.addObserver(document, 'beforeStart', function(){
                if(context.isShow()){
                    context.hide();
                }
            });
            this._popupBox = new J.ui.PopupBox({
                id: id,
                name: name,
                noCatchMouseUp: true,
                parentPopupBox: this.parentMenu ? this.parentMenu._popupBox : null,
                container: container
            });
            $E.addObserver(this._popupBox, 'hide', function(){
                context.hideSubmenu();
                $E.notifyObservers(context, 'onHide');
            });
            
            this.setZIndex(topZIndex);
            this._itemArr = [];
            this._key2Item = {};
            if(option.items){
                this._items_config= option.items;
                this.addItems(option.items);
            }
            if(option.triggers){
                var evnet = option.triggerEvent || 'contextmenu';
                /**
                 * @ignore
                 */
                var onTriggerContextMenu = function(e){
                    e.preventDefault();
                    context.show(e.clientX, e.clientY);
                };
                for(var i = 0, t; t = option.triggers[i]; i++){
//                    $E.off(t, 'contextmenu');//这里没必要
                    $E.on(t, evnet, onTriggerContextMenu);
                }
            }
            if(option.beforeShow){
                $E.addObserver(this, 'BeforeShow', option.beforeShow);
            }
            contextHash[id] = this;
        },
        /**
         * 获取改菜单的id
         */
        getId: function(){
            return this.id;
        },
        /**
         * 设置菜单的css类
         */
        setClass: function(className){
            $D.setClass(this._el, 'context_menu ' + className);
        },
        /**
         * 添加菜单项
         * @param {Object} option 
         * {<br/>
         *  title: 鼠标tips<br/>
            text: 菜单项的文字<br/>
            link: 指向链接<br/>
            icon: 图标的配置{ url, style, className }<br/>
            enable: 是否启用<br/>
            onClick: 点击处理函数<br/>
            argument: 点击处理函数接收的额外参数<br/>
         * }
         */
        addItem: function(option){
            var type = option.type || 'item';
            var item;
            option.parentMenu = this;
            switch(type){
            case 'item': 
                item = new ContextMenuItem(option);
                break;
            case 'flash': 
                item = new FlashContextMenuItem(option);
                break;
            case 'separator':
                item = new ContextMenuSeparator(option);
                break;
            case 'submenu':
                option.parentMenu = this;
                item = new ContextSubmenuItem(option);
                break;
            default:
                item = null;
                break;
            }
            if(item){
                this._body.appendChild(item.getElement());
                this._itemArr.push(item);
            }
        },
        /**
         * 批量添加菜单项
         * @param {Array} optionArray
         * @see ui.ContextMenu#addItem
         */
        addItems: function(optionArray){
            for(var i = 0, len = optionArray.length; i < len; i++){
                this.addItem(optionArray[i]);
            }
        },
        /**
         * 刷新, 重回菜单
         */
        refresh: function() {
            if(this._items_config) {
                this.clearItems();
                this.addItems(this._items_config);
            }
        },
        /**
         * 清空所有菜单项
         */
        clearItems: function(){
            var item = this._itemArr.shift();
            while(item){
                this._body.removeChild(item.getElement());
                item.destory();
                item = this._itemArr.shift();
            }
        },
        /**
         * 移除指定下标的菜单项
         * @param {Number} index
         */
        removeItemAt: function(index) {
            for(var i=0; i< this._itemArr.length;i++) {
                var item= this._itemArr[i];
                if(index==i && item) {
                    this._body.removeChild(item.getElement());
                    item.destory();
                    this._itemArr.splice(i,1);
                }
            }
        },
        /**
         * 获取指定下标的菜单项
         * @param {Number} index
         * @return {ContextMenuItem}, {ContextSubmenuItem}, {ContextMenuSeparator}
         */
        getItemAt: function(index){
            if(index < this._itemArr.length){
                if(index < 0){
                    index = this._itemArr.length + index;
                }
                return this._itemArr[index];
            }else{
                return null;
            }
        },
        /**
         * 获取菜单本身的dom
         * @return {HTMLElement}
         */
        getElement: function(){
            return this._el;
        },
        /**
         * 获取菜单主体的dom
         * @return {HTMLElement}
         */
        getBody: function(){
            return this._body;
        },
        /**
         * 设置菜单的层级
         * @param {Number} zIndex
         * 
         */
        setZIndex: function(zIndex){
            this._popupBox.setZIndex(zIndex);
        },
        /**
         * 获取菜单的层级
         * @return {Number}
         */
        getZIndex: function(zIndex){
            return this._popupBox.getZIndex();  
        },
        /**
         * 这两个方法可以用来保存临时数据,
         * show之前保存, 供给item的回调使用
         * @param {Object} arg
         */
        setArgument: function(arg){
            this._argument = arg;
        },
        /**
         * @return {Object}
         */
        getArgument: function(){
            return this._argument;
        },
        /**
         * 显示菜单
         * @param {Number} x
         * @param {Number} y
         * @param {Number} offset 菜单位置相对于给定xy的偏移, 0为不偏移
         * @param {HTMLElement} relativeEl 相对某一元素定位
         */
        show: function(x, y, offset, relativeEl){
            $E.notifyObservers(this, 'BeforeShow', this);
            var x = x || 0,
                y = y || 0,
                offset = typeof(offset) === 'undefined' ? 5 : offset;
            var popup = this._popupBox;
            var px = x + offset,
                py = y + offset;
            var rw = 0, rh = 0, ie = J.browser.ie;
            if(relativeEl){
                rw = $D.getOffsetWidth(relativeEl);
                rh = $D.getOffsetHeight(relativeEl);
                px += rw + 5;
                py -= 1;
                if(ie == 9 || ie == 8){
                    px += 2;
                }
            }
            popup.setX('-10000');
            popup.show();
            var w = $D.getClientWidth(this._el),
                h = $D.getClientHeight(this._el),
                bodyWidth = $D.getClientWidth(),
                bodyHeight = $D.getClientHeight();
            if(px + w > bodyWidth && x - w - offset > 0){
                if(rw){
                    px = x - w - offset - 5;
                    if(ie == 9 || ie == 8){
                        px += 2;
                    }
                }else{
                    px = x - w - offset;
                }
            }
            if(py + h > bodyHeight && y - h - offset > 0){
                if(rh){
                    py = y - h - offset + rh + 1;
                }else{
                    py = y - h - offset;
                }
            }
            popup.setXY(px, py);
            $E.notifyObservers(this, 'onShow', this);
        },
        /**
         * 隐藏菜单
         */
        hide: function(){
            this._popupBox.hide();
            $E.notifyObservers(this, 'onHide', this);
        },
        /**
         * 隐藏所有子菜单
         */
        hideSubmenu: function(){
            for(var i in this._itemArr){
                if(this._itemArr[i].getSubmenu){
                    this._itemArr[i].getSubmenu().hide();
                }
            }
        },
        /**
         * 指示菜单是否显示
         * @return {Boolean}
         */
        isShow: function(){
            return this._popupBox.isShow();
        },
        /**
         * 销毁菜单
         */
        destory: function(){
            this._el.innerHTML = '';
            $E.off(this._el, 'contextmenu');
            this.clearItems();
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
        
    });
    
    /**
     * 获取给定id的菜单, 无则返回null
     * @static
     * @function
     * @memberOf ui.ContextMenu
     * @name getMenu
     * @return {ui.ContextMenu},{Null}
     */
    ContextMenu.getMenu = function(id){
        return contextHash[id];
    };
    
    /**
     * 【ContextMenuItem】菜单项
     * @see ui.ContextMenu
     * 
     * @class 
     * @name ContextMenuItem
     * @constructor
     * @memberOf ui
     * @param {Object} option 参数对象
     * {
     * title: text,
     * text: '',
     * link: 'javascript:void(0);',
     * icon: null,
     * onClick: null 
     * }
     * icon 为object, 包括{url,className,style}其中一个
     * onClick的回调参数为event, contextMenuItem
     * @example 
     *  //item instanceOf ContextMenuItem
     * var onClick = function(event, item){
     * }
     * 
     * @since version 1.0
     * @description
     */
    var ContextMenuItem = J.ui.ContextMenuItem = new J.Class(
    /**
     * @lends ui.ContextMenuItem.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (opt){
            var option = {
                title: opt.title || opt.text || '',
                text: opt.text || '',
                link: opt.link || 'javascript:void(0);',
                icon: opt.icon || null,
                enable: typeof(opt.enable)==='undefined' ? true : opt.enable,
                onClick: opt.onClick || null,
                argument: opt.argument
            };
            
            this.option = option;
            this.parentMenu = opt.parentMenu;
            
            var liNode = this._el = $D.node('li', {
                'class': 'context_menu_item_container'
            });
            this.render();
            if(option.enable){
                this.enable();
            }else{
                this.disable();
            }
            var onClickFunc, context = this;
            if(option.onClick){
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                    if(context._isEnable){
                        option.onClick.call(this, e, context, context.parentMenu);
                    }
                }
            }else{
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                }
            }
            $E.on(liNode, 'click', onClickFunc);
        },
        /**
         * 设置菜单项的文本
         * @param {Object} text
         */
        setText: function(text, title){
            this.option.text = text;
            this.option.title = title || text;
            this.render();
        },
        /**
         * 设置菜单项的图标
         * @param {Object} icon
         *  { style, url, className }
         */
        setIcon: function(icon){
            this.option.icon = icon;
            this.render();
        },
        /**
         * 绘制菜单项的内容
         */
        render: function(){
            var option = this.option;
            var html = '<a class="context_menu_item" href="' + option.link + '" title="' + option.title + '">';
            if(option.icon){
                var icon = option.icon,
                    image = icon.url ? 'background-image: url(' + icon.url + ');' : '',
                    style = (icon.style || '') + image,
                    cls = icon.className || '';
                html += '<span class="context_menu_item_icon '+ cls +'" style="' + style + '"></span>';
            }
            html += '<span class="context_menu_item_text">' + option.text + '</span>';

            html += '</a>';
            this._el.innerHTML = html;
        },
        /**
         * 获取菜单项的dom
         * @return {HTMLElement} 
         */
        getElement: function(){
            return this._el;
        },
        /**
         * 显示该菜单项
         */
        show: function(){
            $D.show(this._el);
        },
        /**
         * 隐藏该菜单项
         */
        hide: function(){
            $D.hide(this._el);
        },
        /**
         * 禁用菜单项
         */
        disable: function(){
            this._isEnable = false;
            $D.addClass(this._el, 'context_menu_item_disable');
        },
        /**
         * 启用菜单项
         */
        enable: function(){
            this._isEnable = true;
            $D.removeClass(this._el, 'context_menu_item_disable');
        },
        /**
         * 销毁该菜单项
         */
        destory: function(){
            this._el.innerHTML = '';
            $E.off(this._el, 'click');
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });
    
    /**
     * 【FlashContextMenuItem】flash 菜单项,用于需要用到flash的时候,
     * 例如需要在右键菜单放置flash上传控件的时候
     * @see ui.ContextMenu
     * 
     * @class 
     * @name FlashContextMenuItem
     * @constructor
     * @memberOf ui
     * @param {Object} option 参数对象
     */
    var FlashContextMenuItem = J.ui.FlashContextMenuItem = new J.Class(
    /**
     * @lends ui.FlashContextMenuItem.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (opt){
            //TODO hard code flash上传按钮环境
            var option = {
                title: opt.title || opt.text || '',
                text: opt.text || '',
                link: opt.link || 'javascript:void(0);',
                icon: opt.icon || null,
                enable: typeof(opt.enable)==='undefined' ? true : opt.enable,
                onClick: opt.onClick || null,
                folderId: opt.folderId || -1, //右键所属的文件夹：特殊id desktop:-1,explorer:-2
                argument: opt.argument
            };
            
            this.option = option;
            this.parentMenu = opt.parentMenu;
            
            var liNode = this._el = $D.node('li', {
                'class': 'context_menu_item_container'
            });
                
            var flashLiNode = this._flashLi = $D.node('li', {
                'class': 'context_menu_item_container'
            });
            
            var itemId = this._itemId = 'context_menu_flashItem_' + (++flashItemId);
            var flashUlNode = this._flashUl = $D.node('ul', {
                'id': itemId,
                'class': 'context_menu_item_list context_menu_flashitem_item'
            });
            flashItemHash[flashItemId] = flashUlNode;
            flashUlNode.appendChild(flashLiNode);
            this.render();
            document.body.appendChild(flashUlNode);
            if(option.enable){
                this.enable();
            }else{
                this.disable();
            }
            var onClickFunc, context = this;
            if(option.onClick){
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                    if(context._isEnable){
                        option.onClick.call(this, e, context, context.parentMenu);
                    }
                }
            }else{
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                }
            }
            $E.on(liNode, 'click', onClickFunc);
            
            var context = this;
            var observer = {
                /**
                 * @ignore
                 */
                onShow: function(opt){
                    var xy = $D.getClientXY(context._el);
                    var offsetX = 0,
                        offsetY = 0;
                    if(J.browser.ie){
                        offsetX = 2;
                        offsetY = 2;
                        if(J.browser.ie == 6 || J.browser.ie == 7){
                            offsetY = 1;
                        }
                    }
                    $D.setXY(context._flashUl, xy[0] + offsetX + 'px', xy[1] + offsetY + 'px');
                    $D.setStyle(context._flashUl, 'width', $D.getClientWidth(context._el) + 'px');
                    $D.setStyle(context._flashUl, 'height', $D.getClientHeight(context._el) + 'px');
                    $D.setStyle(context._flashUl, 'zIndex', context.parentMenu.getZIndex() + 1);
                    if(alloy.portal.getLoginLevel() > 1 && alloy.storage.getDefaultDisk()){
                        context._flashUploader.showFileSelector();
                    }else{
                        context._flashUploader.hideFileSelector();
                    }
                },
                /**
                 * @ignore
                 */
                onHide: function(opt){
                    $D.setXY(context._flashUl, 0, 0);
                    $D.setStyle(context._flashUl, 'width', '1px');
                    $D.setStyle(context._flashUl, 'height', '1px');
                }
            };
            $E.addObserver(this.parentMenu, 'onShow', observer.onShow);
            $E.addObserver(this.parentMenu, 'onHide', observer.onHide);
        },
        /**
         * 未实现
         */
        setText: function(text, title){
        },
        /**
         * 未实现
         */
        setIcon: function(icon){
        },
        /**
         * 绘制菜单项
         */
        render: function(){
            var option = this.option;
            var elHtml = '<a class="context_menu_item" href="' + option.link + '"></a>';
            this._el.innerHTML = elHtml;
            
            var html = '<a class="context_menu_item" href="' + option.link + '" title="' + option.title + '">';
            if(option.icon){
                var icon = option.icon,
                    image = icon.url ? 'background-image: url(' + icon.url + ');' : '',
                    style = (icon.style || '') + image,
                    cls = icon.className || '';
                html += '<span class="context_menu_item_icon '+ cls +'" style="' + style + '"></span>';
            }
            html += '<div class="explorer_upload_holder2" style="padding:0 5px"></div>';
            html += '</a>';
            this._flashLi.innerHTML = html;
            
            var holder = $D.mini('.explorer_upload_holder2', this._flashLi)[0];
            var opt = {
                callback:'alloy.flashUploadManager.flashEventListener',
                mode: 0,
                autoshow: false,
                holder: holder,
                text: '<span class="context_menu_item_text">' + option.text + '</span>',
                width: '100%',
                height: '100%',
                extInfo: '{"folderId":'+ this.option.folderId +'}'
            }
            this._flashUploader = new alloy.flashUploadManager.FlashUploader(opt);
            
            $D.setXY(this._flashUl, 0, 0);
            $D.setStyle(this._flashUl, 'width', '1px');
            $D.setStyle(this._flashUl, 'height', '1px');
        },
        /**
         * 获取菜单项的dom
         * @return {HTMLElement}
         */
        getElement: function(){
            return this._el;
        },
        /**
         * 显示
         */
        show: function(){
            $D.show(this._el);
        },
        /**
         * 隐藏
         */
        hide: function(){
            $D.hide(this._el);
        },
        /**
         * 禁用
         */
        disable: function(){
            this._isEnable = false;
            $D.addClass(this._el, 'context_menu_item_disable');
        },
        /**
         * 启用
         */
        enable: function(){
            this._isEnable = true;
            $D.removeClass(this._el, 'context_menu_item_disable');
        },
        /**
         * 销毁
         */
        destory: function(){
            this._el.innerHTML = '';
            this._flashUl.innerHTML = '';
            document.body.removeChild(this._flashUl);
            $E.off(this._el, 'click');
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });
    
    /**
     * @static
     * @function
     * @name getItem
     * @memberOf ui.FlashContextMenuItem
     * @return {HTMLElement},{Null}
     */
    FlashContextMenuItem.getItem = function(id){
        return flashItemHash[id];
    };
    
    /**
     * 【ContextMenuSeparator】菜单项分隔符
     * @see ui.ContextMenu
     * 
     * @class 
     * @name ContextMenuSeparator
     * @constructor
     * @memberOf ui
     * @param {Object} option 参数对象
     */
    var ContextMenuSeparator = J.ui.ContextMenuSeparator = new J.Class(
    /**
     * @lends ui.ContextMenuSeparator.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (option){
            var html = '<span class="context_menu_separator"></span>';
            var liNode = this._el = $D.node('li', {
                'class': 'context_menu_separator_container'
            });
            liNode.innerHTML = html;
        },
        /**
         * 获取分隔符的dom
         */
        getElement: function(){
            return this._el;
        },
        /**
         * 显示
         */
        show: function(){
            $D.show(this._el);
        },
        /**
         * 隐藏
         */
        hide: function(){
            $D.hide(this._el);
        },
        /**
         * 销毁
         */
        destory: function(){
            this._el.innerHTML = '';
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
        }
    });
    /**
     * 【ContextSubmenuItem】子菜单项, 关联着一个子菜单
     * 
     * @class 
     * @name ContextSubmenuItem
     * @extends  ui.ContextMenuItem
     * @constructor
     * @memberOf ui
     * @param {Object} option 参数对象
     * {
     * title: text,
     * text: '',
     * link: 'javascript:void(0);',
     * icon: null,
     * items: null,//子菜单的菜单项, 必选项
     * subWidth: null,//子菜单的宽
     * subContainer: null //子菜单的容器
     * }
     * icon 为object, 包括{url,className,style}其中一个
     * 
     * @since version 1.0
     * @description
     */
    var ContextSubmenuItem = J.ui.ContextSubmenuItem = new J.Class({extend: ContextMenuItem}, 
    /**
     * @lends ui.ContextSubmenuItem.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (option){
            if(!option.items){
                throw new Error('J.ui.ContextSubmenuItem: option.items is null!');
            }
            option.title = option.title || option.text || '';
            var defaultOption = {
                title: null,
                text: '',
                autoHide: true,
                link: 'javascript:void(0);',
                icon: null,
                enable: true,
                subWidth: null,
                parentMenu: option.parentMenu
            };
            delete option.parentMenu;//不删除的话, extend会导致parentMenu指针不对
            option = this.option = J.extend(defaultOption, option);
            this.parentMenu = option.parentMenu;
            var liNode = this._el = $D.node('li', {
                'class': 'context_menu_item_container'
            });
            this.render();
            if(option.enable){
                this.enable();
            }else{
                this.disable();
            }
            var subOption = {
                parentMenu: option.parentMenu,
                width: option.subWidth,
                beforeShow: option.beforeShow,
                items: option.items
            };
            this._submenu = new ContextMenu(subOption);
                
            var onClickFunc, context = this;
            
            var submenuTimer = context.sunmenuTimer = 0, submenuHideTimeout = 200;
            /**
             * @ignore
             */
            var hideSubmenu = function(){
                if(context._submenu.isShow()){
                    context._submenu.hide();
                }
            };
            var observer = {
                /** @ignore */
                onItemMouseenter: function(e){
                    e.stopPropagation();
                    if(context._isEnable){
                        var xy = $D.getClientXY(this);
                        context._submenu.setZIndex(context.parentMenu.getZIndex());
                        context._submenu.show(xy[0], xy[1], 0, this);
                    }
                },
                /** @ignore */
                onItemMouseleave: function(e){
                    if(submenuTimer){
                        window.clearTimeout(submenuTimer);
                        submenuTimer = 0;
                    }
                    submenuTimer = window.setTimeout(hideSubmenu, submenuHideTimeout);
                },
                /** @ignore */
                onSubmenuMouseenter: function(e){
                    if(submenuTimer){
                        window.clearTimeout(submenuTimer);
                        submenuTimer = 0;
                    }
                    $D.addClass(liNode, 'context_menu_item_hover');
                },
                /** @ignore */
                onSubmenuMouseleave: function(e){
                    observer.onItemMouseleave(e);
                    //$D.removeClass(liNode, 'context_menu_item_hover');
                },
                /** @ignore */
                onSubmenuShow: function(){
                    $D.addClass(liNode, 'context_menu_item_hover'); 
                },
                /** @ignore */
                onSubmenuHide: function(){
                    $D.removeClass(liNode, 'context_menu_item_hover');
                }
            };
            
            var submenuEl = context._submenu.getElement();
            $E.on(liNode, 'mouseenter', observer.onItemMouseenter);
            if(option.autoHide){
                $E.on(liNode, 'mouseleave', observer.onItemMouseleave);
                $E.on(submenuEl, 'mouseenter', observer.onSubmenuMouseenter);
                $E.on(submenuEl, 'mouseleave', observer.onSubmenuMouseleave);
            }
            //$E.addObserver(context._submenu, 'onShow', observer.onSubmenuShow);
            $E.addObserver(context._submenu, 'onHide', observer.onSubmenuHide);
            if(option.onClick){
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                    if(context._isEnable){
                        option.onClick.call(this, e, context);
                        observer.onItemMouseenter.call(this, e);
                    }
                }
            }else{
                /**
                 * @ignore
                 */
                onClickFunc = function(e){
                    e.preventDefault();
                    observer.onItemMouseenter.call(this, e);
                }
            }
            $E.on(liNode, 'click', onClickFunc);
        },
        /**
         * 获取该菜单项关联的子菜单
         */
        getSubmenu: function(){
            return this._submenu;
        },
        /**
         * 绘制菜单项的内容
         */
        render: function(){
            var option = this.option;
            var html = '<a class="context_menu_item" href="' + option.link + '" title="' + option.title + '">';
            if(option.icon){
                var icon = option.icon,
                    image = icon.url ? 'background-image: url(' + icon.url + ');' : '',
                    style = (icon.style || '') + image,
                    cls = icon.className || '';
                html += '<span class="context_menu_item_icon '+ cls +'" style="' + style + '"></span>';
            }
            html += '<span class="context_menu_item_text">' + option.text + '</span><span class="context_menu_item_subicon"></span></a>';
            this._el.innerHTML = html;
        }
    });
});