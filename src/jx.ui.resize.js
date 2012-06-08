/**
 * Resize 模块
 */
Jx().$package(function (J) {
    J.ui = J.ui || {};
    var $D = J.dom,
        $E = J.event;

    var id = 0;
    var handleNames = {
        t: "t",
        r: "r",
        b: "b",
        l: "l",
        rt: "rt",
        rb: "rb",
        lb: "lb",
        lt: "lt"
    };
        
    var clientHeight = 0;
    var clientWidth = 0;
    /**
    * resize类
    * 
    * @memberOf ui
    * @class
    * @name Resize
    * @constructor
    * @param {Element} apperceiveEl 监听resize动作的元素
    * @param {Element} effectEl 展现resize结果的元素
    * @param {Object} option 其他选项，如:dragProxy,size,minWidth...
    * 
    */
    J.ui.Resize = new J.Class(
    /**
     * @lends ui.Resize.prototype
     */
    {
        /**
         * @ignore
         */
        init: function (apperceiveEl, effectEl, option) {
            var context = this;
            option = option || {};

            this.apperceiveEl = apperceiveEl;
            if (effectEl === false) {
                this.effectEl = false;
            } else {
                this.effectEl = effectEl || apperceiveEl;
            }
            
            this.size = option.size || 5;
            this.minWidth = option.minWidth || 0;
            this.minHeight = option.minHeight || 0;
            this._dragProxy = option.dragProxy;
            this.isLimited = option.isLimited || false;
            if (this.isLimited) {
                this._leftMargin = option.leftMargin || 0;
                this._topMargin = option.topMargin || 0;
                this._rightMargin = option.rightMargin || 0;
                this._bottomMargin = option.bottomMargin || 0;
            }

            this._left = this.getLeft();
            this._top = this.getTop();
            this._width = this.getWidth();
            this._height = this.getHeight();

            this.id = this.getId();

            var styles = {
                t: "cursor:n-resize; z-index:1; left:0; top:-5px; width:100%; height:5px;",
                r: "cursor:e-resize; z-index:1; right:-5px; top:0; width:5px; height:100%;",
                b: "cursor:s-resize; z-index:1; left:0; bottom:-5px; width:100%; height:5px;",
                l: "cursor:w-resize; z-index:1; left:-5px; top:0; width:5px; height:100%;",
                rt: "cursor:ne-resize; z-index:2; right:-5px; top:-5px; width:5px; height:5px;",
                rb: "cursor:se-resize; z-index:2; right:-5px; bottom:-5px; width:5px; height:5px;",
                lt: "cursor:nw-resize; z-index:2; left:-5px; top:-5px; width:5px; height:5px;",
                lb: "cursor:sw-resize; z-index:2; left:-5px; bottom:-5px; width:5px; height:5px;"
            };

            this._onMousedown = function () {
                $E.notifyObservers(context, "mousedown", { width: context._width, height: context._height });
            };
            this._onDragEnd = function () {
//                J.out("this._width： " + context._width);
//              J.out("this._height： " + context._height);
                $E.notifyObservers(context, "end", {
                    x: context.getLeft(),
                    y: context.getTop(),
                    width: context.getWidth(),
                    height: context.getHeight()
                });
            };

            for (var p in handleNames) {
                var tempEl = $D.node("div", {
                    "id": "window_" + this.id + "_resize_" + handleNames[p]
                });

                this.apperceiveEl.appendChild(tempEl);
                $D.setCssText(tempEl, "position:absolute; overflow:hidden; background:url(" + J.path + "style/image/transparent.gif);" + styles[p]);
                if (this._dragProxy) {
                    //$E.on(tempEl, "mousedown", this._onMousedown);
                } else {

                }

                this["_dragController_" + handleNames[p]] = new J.ui.Drag(tempEl, false);

            }



            // 左侧
            this._onDragLeftStart = function (xy) {
                $E.notifyObservers(context, "mousedown", { width: context._width, height: context._height });
                context._startLeft = context._left = context.getLeft();
                context._startWidth = context._width = context.getWidth();
                context._startHeight = context._height = context.getHeight();
            };
            this._onDragLeft = function (xy) {
                var w = context._startWidth - xy.x;
                var x = context._startLeft + xy.x;
                if (w < context.minWidth) {
                    w = context.minWidth;
                    x = context._startLeft + (context._startWidth - w);
                }
                if (context.isLimited && (x - context._leftMargin) < 0) {
                    x = context._leftMargin;
                    w = context._startLeft + context._startWidth - context._leftMargin;
                }
                context.setLeft(x);
                context.setWidth(w);
                $E.notifyObservers(context, "resize", { width: context._width, height: context._height });

            };

            // 上侧
            this._onDragTopStart = function (xy) {
                $E.notifyObservers(context, "mousedown", { width: context._width, height: context._height });
                context._startTop = context._top = context.getTop();
                context._startHeight = context._height = context.getHeight();
            };
            this._onDragTop = function (xy) {
                var h = context._startHeight - xy.y;
                var y = context._startTop + xy.y;
                if (h < context.minHeight) {
                    h = context.minHeight;
                    y = context._startTop + (context._startHeight - h);
                }
                if (context.isLimited && (y - context._topMargin) < 0) {
                    y = context._topMargin;
                    h = context._startTop + context._startHeight - context._topMargin;
                }
                context.setTop(y);
                context.setHeight(h);
                $E.notifyObservers(context, "resize", { width: context._width, height: context._height });
            };



            // 右侧
            this._onDragRightStart = function (xy) {
                 $E.notifyObservers(context, "mousedown", { width: context._width, height: context._height });
                context._startWidth = context._width = context.getWidth();
                context._startLeft = context._left = context.getLeft();
                context._startHeight = context._height = context.getHeight();
                clientWidth = qqweb.layout.getClientWidth();
            };
            this._onDragRight = function (xy) {
                var w = context._startWidth + xy.x;
                if (w < context.minWidth) {
                    w = context.minWidth;
                }
                var clientWidth = $D.getClientWidth() || 0;
                var maxWidth = clientWidth - context._startLeft - context._rightMargin;
                if (context.isLimited && maxWidth < w) {
                    w = maxWidth;
                }
                context.setWidth(w);
                $E.notifyObservers(context, "resize", { width: context._width, height: context._height });
            };


            // 下侧
            this._onDragBottomStart = function (xy) {
                $E.notifyObservers(context, "mousedown", { width: context._width, height: context._height });
                context._startHeight = context._height = context.getHeight();
                context._startTop = context._top = context.getTop();
                clientHeight = $D.getClientHeight();
            };
            this._onDragBottom = function (xy) {
                var h = context._startHeight + xy.y;
                if (h < context.minHeight) {
                    h = context.minHeight;
                }
                var clientHeight = $D.getClientHeight() || 0;
                var maxHeight = clientHeight - context._startTop - context._bottomMargin;
                if (context.isLimited && maxHeight < h) {
                    h = maxHeight;
                }
                context.setHeight(h);
                $E.notifyObservers(context, "resize", { width: context._width, height: context._height });
            };

            // 左上
            this._onDragLeftTopStart = function (xy) {
                context._onDragLeftStart(xy);
                context._onDragTopStart(xy);
            };
            this._onDragLeftTop = function (xy) {
                context._onDragLeft(xy);
                context._onDragTop(xy);
            };

            // 左下
            this._onDragLeftBottomStart = function (xy) {
                context._onDragLeftStart(xy);
                context._onDragBottomStart(xy);
            };
            this._onDragLeftBottom = function (xy) {
                context._onDragLeft(xy);
                context._onDragBottom(xy);
            };


            // 右下
            this._onDragRightBottomStart = function (xy) {
                context._onDragRightStart(xy);
                context._onDragBottomStart(xy);
            };
            this._onDragRightBottom = function (xy) {
                context._onDragRight(xy);
                context._onDragBottom(xy);
            };

            // 右上
            this._onDragRightTopStart = function (xy) {
                context._onDragRightStart(xy);
                context._onDragTopStart(xy);
            };
            this._onDragRightTop = function (xy) {
                context._onDragRight(xy);
                context._onDragTop(xy);
            };



            $E.addObserver(this["_dragController_" + handleNames.t], "start", this._onDragTopStart);
            $E.addObserver(this["_dragController_" + handleNames.t], "move", this._onDragTop);
            $E.addObserver(this["_dragController_" + handleNames.t], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.r], "start", this._onDragRightStart);
            $E.addObserver(this["_dragController_" + handleNames.r], "move", this._onDragRight);
            $E.addObserver(this["_dragController_" + handleNames.r], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.b], "start", this._onDragBottomStart);
            $E.addObserver(this["_dragController_" + handleNames.b], "move", this._onDragBottom);
            $E.addObserver(this["_dragController_" + handleNames.b], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.l], "start", this._onDragLeftStart);
            $E.addObserver(this["_dragController_" + handleNames.l], "move", this._onDragLeft);
            $E.addObserver(this["_dragController_" + handleNames.l], "end", this._onDragEnd);



            $E.addObserver(this["_dragController_" + handleNames.rb], "start", this._onDragRightBottomStart);
            $E.addObserver(this["_dragController_" + handleNames.rb], "move", this._onDragRightBottom);
            $E.addObserver(this["_dragController_" + handleNames.rb], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.rt], "start", this._onDragRightTopStart);
            $E.addObserver(this["_dragController_" + handleNames.rt], "move", this._onDragRightTop);
            $E.addObserver(this["_dragController_" + handleNames.rt], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.lt], "start", this._onDragLeftTopStart);
            $E.addObserver(this["_dragController_" + handleNames.lt], "move", this._onDragLeftTop);
            $E.addObserver(this["_dragController_" + handleNames.lt], "end", this._onDragEnd);

            $E.addObserver(this["_dragController_" + handleNames.lb], "start", this._onDragLeftBottomStart);
            $E.addObserver(this["_dragController_" + handleNames.lb], "move", this._onDragLeftBottom);
            $E.addObserver(this["_dragController_" + handleNames.lb], "end", this._onDragEnd);
        },
        /**
         * 设置effectEl的宽度
         * @param {Number} w
         */
        setWidth: function (w) {
            $D.setStyle(this.effectEl, "width", w + "px");
            this._width = w;
        },
        /**
         * 设置effectEl的高度
         * @param {Number} h
         */
        setHeight: function (h) {
            $D.setStyle(this.effectEl, "height", h + "px");
            this._height = h;
        },
        /**
         * 设置effectEl的x坐标
         * @param {Number} x
         */
        setLeft: function (x) {
            $D.setStyle(this.effectEl, "left", x + "px");
            this._left = x;
        },
        /**
         * 设置effectEl的y坐标
         * @param {Number} y
         */
        setTop: function (y) {
            $D.setStyle(this.effectEl, "top", y + "px");
            this._top = y;
        },
        /**
         * 获取effectEl的宽度
         * @return {Number}
         */
        getWidth: function () {
            return parseInt($D.getStyle(this.effectEl, "width"));
        },
        /**
         * 获取effectEl的高度
         * @return {Number}
         */
        getHeight: function () {
            return parseInt($D.getStyle(this.effectEl, "height"));
        },
        /**
         * 获取effectEl的x
         * @return {Number}
         */
        getLeft: function () {
            return parseInt($D.getStyle(this.effectEl, "left"));
        },
        /**
         * 获取effectEl的y
         * @return {Number}
         */
        getTop: function () {
            return parseInt($D.getStyle(this.effectEl, "top"));
        },
        /**
         * @private
         */
        getId: function () {
            return id++;
        },
        /**
         * 锁定resize
         */
        lock: function () {
            for (var p in handleNames) {
                this["_dragController_" + handleNames[p]].lock();
            }
        },
        /**
         * 解锁resize
         */
        unlock: function () {
            for (var p in handleNames) {
                this["_dragController_" + handleNames[p]].unlock();
            }
        },
        /**
         * 显示触发resize的节点
         */
        show: function () {
            for (var p in handleNames) {
                this["_dragController_" + handleNames[p]].show();
            }
        },
        /**
         * 隐藏触发resize的节点
         */
        hide: function () {
            for (var p in handleNames) {
                this["_dragController_" + handleNames[p]].hide();
            }
        },
        /**
         * 设置resize的限定边界
         */
        setLimite : function(option){
            option = option || {};
            this.isLimited = option.isLimited || true;
            if (this.isLimited) {
                this._leftMargin = option.leftMargin || 0;
                this._topMargin = option.topMargin || 0;
                this._rightMargin = option.rightMargin || 0;
                this._bottomMargin = option.bottomMargin || 0;
            }
        },
        /**
         * 设置最小宽高
         */
        setMinLimite : function(option){
            option = option||{};
            this.minWidth = option.minWidth||0;
            this.minHeight = option.minHeight||0;
        }
    });



});
