/**
 * 多容器拖拽排序
 * tealin, 2010-9-21
 */
Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;
    var _workAreaWidth=false,
        _workAreaHeight=false,
        _width=false,
        _height=false;
    var curDragElementX, curDragElementY, dragStartX, dragStartY;
    J.ui = J.ui || {};
    /**
     * 拖拽排序封装
     * @class
     * @constructor
     * @memberOf ui
     * @name Sortables
     * @param dropTargets 需要拖拽排序的容器列表
     * @param str 排序后需要返回的字段
     
     */
    J.ui.Sortables = new J.Class(
    /**
     * @lends ui.Sortables.prototype
     */
    {
        /**
         * @ignore
         */
        init : function(dropTargets,sortStr,option){
            this.dropTargets=dropTargets.concat();
            this.sortStr=sortStr;
            this.option = option||{};
            this.limiteOption = this.option.limiteOption||{};
            this.dragController = {};
            this._isLock = false;
        },
        /**
         * 添加拖拽目标容器
         * @param {Object} targetObj targetObj = {el:HTMLElement,level:n} level越大，优先级越高
         */
        addDropTarget : function(targetObj){//targetObj = {el:HTMLElement,level:n} level越大，优先级越高
            this.dropTargets.push(targetObj);
        },
        /**
         * 设置一个dom节点, 用于展现拖拽效果
         * @param {HTMLElement} el
         */
        addEffect : function(el){
            this.effectEl = el;
        },
        /**
         * 移除一个拖拽目标容器
         * @param {HTMLElement} el
         */
        removeDropTarget : function(el){
            J.array.remove(this.dropTargets,el);
        },
        /**
         * 刷新拖拽目标容器, 更新其坐标
         */
        refreshDropTarget : function(target){
            var targetPos,
                xy,
                targetWidth,
                dropTargets = this.dropTargets,
                targetHeight;
            this.dropPos = [];
            if(!target){
                for(var i in dropTargets){
                    target = dropTargets[i].el;
                    targetPos = {};
                    xy = $D.getXY(target);
                    targetWidth = $D.getClientWidth(target);
                    targetHeight = $D.getClientHeight(target);
                    targetPos.x = xy[0];
                    targetPos.y = xy[1];
                    targetPos.w = targetWidth;
                    targetPos.h = targetHeight;
                    this.dropPos[i] = targetPos;
                }
            }else{
                for(var i in dropTargets){
                    dropTargetEl = dropTargets[i].el;
                    if(target.el === dropTargetEl){
                        targetPos = {};
                        xy = $D.getXY(dropTargetEl);
                        targetWidth = $D.getClientWidth(dropTargetEl);
                        targetHeight = $D.getClientHeight(dropTargetEl);
                        targetPos.x = xy[0];
                        targetPos.y = xy[1];
                        targetPos.w = targetWidth;
                        targetPos.h = targetHeight;
                        this.dropPos[i] = targetPos;
                        break;
                    }
                }
            }
        },
        /**
         * 添加一个被拖拽节点, 添加之后即可鼠标拖动该元素
         * @param {HTMLElement} el
         */
        addDragClass : function(el){
            var parentEl = el.parentNode, 
                apperceiveEl = el,
//              effectEl =this.effectEl||this.clone(apperceiveEl),//转移到beforeStart里创建
                effectEl = false,
                context = this,
                currentDropTarget = null,
                xyP = $D.getXY(parentEl),//父节点
                xyS = $D.getXY(apperceiveEl),
                addId = el.getAttribute(this.sortStr)||"",
                dropTargets = this.dropTargets,
                nextEl,
                preXY;//子节点
            
//          //获取模型的体积
//          var _width = $D.getClientWidth(apperceiveEl);
//          var _height = $D.getClientHeight(apperceiveEl);
//          var margin ={}; 
//              margin.top= parseInt($D.getStyle(apperceiveEl,"marginTop")||0);
//              margin.buttom= parseInt($D.getStyle(apperceiveEl,"marginbottom")||0);
//              margin.left= parseInt($D.getStyle(apperceiveEl,"marginLeft")||0);
//              margin.right= parseInt($D.getStyle(apperceiveEl,"marginRight")||0);
//          //修正盒子模型
//          _width += (margin.left+margin.right);
//          _height += (margin.top+margin.buttom);

            this.dropPos = [];
            var onDragBeforeStart = function(){
                _width = $D.getClientWidth(apperceiveEl);
                _height = $D.getClientHeight(apperceiveEl);
                var margin ={}; 
                margin.top= parseInt($D.getStyle(apperceiveEl,"marginTop")||0);
                margin.buttom= parseInt($D.getStyle(apperceiveEl,"marginbottom")||0);
                margin.left= parseInt($D.getStyle(apperceiveEl,"marginLeft")||0);
                margin.right= parseInt($D.getStyle(apperceiveEl,"marginRight")||0);
                //修正盒子模型
                _width += (margin.left+margin.right);
                _height += (margin.top+margin.buttom);
                //重新赋值,因为dropTarget是动态添加的
                dropTargets = this.dropTargets;
                //az 2011-6-8
                effectEl = context.effectEl || context.clone(apperceiveEl);
                context.dragController[addId].setEffect(effectEl);
                //重新设置XY.这里不能在dragstart设置,因为在发出start之前已经用了这个高度
                setStartXY();
                this.refreshDropTarget();
                //储存下个一个节点,以便恢复
                parentEl = apperceiveEl.parentNode;
                nextEl = apperceiveEl.nextSibling;
                
                document.body.appendChild(effectEl);
                
                $E.notifyObservers(context, "beforeStart");
            };
            var onDragStart = function(option){
                currentDropTarget = null;
                if(context.option.isDash){
                    apperceiveEl = context.cloneDashedEl(apperceiveEl);
                }else{
                    if(!J.browser.ie){
                        //$D.setStyle(apperceiveEl,"opacity",0.5);
                        $D.addClass(apperceiveEl,"ui_halfOpacity");
                    }
                }
                //J.out("drag开始");
                $E.notifyObservers(context, "start");
            };
            var onDragMove = function(option){
                var moveEvent = option.orientEvent;
                var moveX = moveEvent.pageX;
                var moveY = moveEvent.pageY;
                //减少计算
                if(Math.abs(moveX-preXY[0])+Math.abs(moveY-preXY[1])<1){
                    return;
                }else{
                    if(moveX-preXY[0]>0){
                        var direction = "right";
                    }else{
                        var direction = "left";
                    }
                    preXY = [moveX,moveY];
                }
                //父节点宽度
                var hitTarget = {el:null,level:-1,index:0};
                for(var i in this.dropPos){
                    if(
                        (moveX > this.dropPos[i].x)&&
                        (moveX < this.dropPos[i].x + this.dropPos[i].w)&&
                        (moveY > this.dropPos[i].y)&&
                        (moveY < this.dropPos[i].y + this.dropPos[i].h)
                        ){
                            var dropTargetObj = dropTargets[i];
                            var dropTarget = dropTargetObj.el;
                            var parentWidth = $D.getClientWidth(dropTarget);
                            //每行个数
                            var perRow = Math.floor(parentWidth/_width);
                            
                            //容器的XY
                            var dropTargetXY = $D.getXY(dropTarget);
                            //先对于容器的位置
                            var x = moveX - dropTargetXY[0];
                            var y = moveY - dropTargetXY[1];
                            //var fixX = preIndexXY[1]==indexY?(preXY[0]-moveX>0?(-0.3):0.3):0;
                            var indexY = Math.floor(y/_height);
                            if(direction=="right"){
                                var indexX = Math.ceil(x/_width);
                            }else if(direction=="left"){
                                var indexX = Math.floor(x/_width);
                            }
                            
                            var index = indexX+indexY*perRow;
                            if(hitTarget.level <dropTargetObj.level){
                                hitTarget.level = dropTargetObj.level;
                                hitTarget.el = dropTargetObj.el;
                                hitTarget.index = index;
                            }
                            /*
                            if(dropTarget.getAttribute('customAcceptDrop')){
                                $E.notifyObservers(dropTarget,'dragmove',option);
                                break;
                            }
                            
                            
                            
                            //修正IE下index找不到的时候插不到最后一个的错误
                            if(dropTarget.childNodes[index]){
                                dropTarget.insertBefore(apperceiveEl,dropTarget.childNodes[index]);
                            }else{
                                dropTarget.appendChild(apperceiveEl);
                            }
                            break;
                            */
                    }
                }
                currentDropTarget = hitTarget.el
                if(currentDropTarget){
                    if(currentDropTarget.getAttribute('customAcceptDrop')){
                        $E.notifyObservers(currentDropTarget,'dragmove',option);
                    }else if(currentDropTarget.childNodes[index]){//修正IE下index找不到的时候插不到最后一个的错误
                        currentDropTarget.insertBefore(apperceiveEl,currentDropTarget.childNodes[index]);
                    }else{
                        currentDropTarget.appendChild(apperceiveEl);
                    }
                }
//              try{
                    $E.notifyObservers(context, "move",option);
//              }catch(e){
//                  J.out("move error");
//              }
            };
            var onDragOverFlow = function(option){
                option.el=effectEl;
                $E.notifyObservers(context, "overFlowBorder",option);
            };
            var onDragEnd = function(option){
                var moveEvent = option.orientEvent;
                var moveX = moveEvent.pageX;
                var moveY = moveEvent.pageY;
                if(currentDropTarget && currentDropTarget.getAttribute &&currentDropTarget.getAttribute('customAcceptDrop')){
                    $E.notifyObservers(currentDropTarget, "drop",{'dragEl':el,"queue":queue,"pos":{x:moveX,y:moveY},"apperceiveEl":apperceiveEl,"nextEl":nextEl,"parentEl":parentEl,"currentDropTarget":currentDropTarget});
                }
                document.body.removeChild(effectEl);
                if(context.option.isDash){
                    context.removeDashedEl();
                    apperceiveEl = context.tempEl;
                }else{
                    if(!J.browser.ie){
                        //$D.setStyle(apperceiveEl,"opacity",1);
                        $D.removeClass(apperceiveEl,"ui_halfOpacity");
                    }                   
                }
                //返回队列
                var queue = [];
                for(var i in dropTargets){
                    queue[i] = [];
                    var childNodes = dropTargets[i].el.childNodes;
                    for(var k=0;k<childNodes.length;k++){
                        var node = childNodes[k];
                        if(!node.getAttribute){
                            break;
                        }
                        var attribute=childNodes[k].getAttribute(context.sortStr);
                        if(attribute){
                            queue[i].push(attribute);
                        }
                    }
                }
                //J.out("drag结束");
                try{
                    $E.notifyObservers(context, "end",{"queue":queue,"pos":option,"apperceiveEl":apperceiveEl,"nextEl":nextEl,"parentEl":parentEl});
                }catch(e){
                    J.out("drop error");
                }
                var containerEl=document.elementFromPoint(moveX, moveY);
                if(containerEl){
                    $E.notifyObservers(J.ui, "drop",{'dragEl':el,"pos":{x:moveX,y:moveY},"apperceiveEl":apperceiveEl,"dropEl":containerEl});
                }
            };
            //初始化XY
            var setStartXY = function(){
                //xyP = $D.getXY(parentEl);//父层坐标
                xyS = $D.getXY(apperceiveEl);//子层坐标
                var x = xyS[0];
                var y = xyS[1];
                preXY = [x,y];
                $D.setStyle(effectEl,"left",x+"px");
                $D.setStyle(effectEl,"top",y+"px");
            };
            
            var initDropPos = function(){//废弃，用refreshDropPos
                var target,
                    targetPos,
                    xy,
                    targetWidth,
                    targetHeight;
                this.dropPos = [];
                for(var i in dropTargets){
                    target = dropTargets[i].el;
                    targetPos = {};
                    xy = $D.getXY(target);
                    targetWidth = $D.getClientWidth(target);
                    targetHeight = $D.getClientHeight(target);
                    targetPos.x = xy[0];
                    targetPos.y = xy[1];
                    targetPos.w = targetWidth;
                    targetPos.h = targetHeight;
                    this.dropPos[i] = targetPos;
                }
            }
            
            this.dragController[addId] = new J.ui.Drag(el,effectEl,this.limiteOption);
            $E.addObserver(this.dragController[addId],"beforeStart",J.bind(onDragBeforeStart,this));
            $E.addObserver(this.dragController[addId],"start",J.bind(onDragStart,this));
            $E.addObserver(this.dragController[addId],"move",J.bind(onDragMove,this));
            $E.addObserver(this.dragController[addId],"overFlowBorder",J.bind(onDragOverFlow,this));
            $E.addObserver(this.dragController[addId],"end",J.bind(onDragEnd,this));
        },
        /**
         * 设置拖拽的边界限制
         * @param {Object} option
         * @see ui.Drag#setLimite
         */
        setLimite : function(option){
            for(var i in this.dragController){
                this.dragController[i].setLimite(option);
            }
        },
        /**
         * @private
         */
        cloneDashedEl : function(el){
            var dashedEl = $D.node("div");
            var className = this.option.className;
            if(className){
                $D.setClass(dashedEl,className);
            }else{
                $D.setStyle(dashedEl,"border","dashed 2px #fff");
                $D.setClass(dashedEl,el.className);
                $D.setStyle(dashedEl,"position","relative");
                $D.setStyle(dashedEl,"float","left");
                var width = el.offsetWidth - 10 * parseInt(dashedEl.style.borderWidth) + "px";
                var height = el.offsetHeight - 10 * parseInt(dashedEl.style.borderWidth) + "px"; 
                $D.setStyle(dashedEl,"width",width);
                $D.setStyle(dashedEl,"height",height);
            }
            this.dashedEl = dashedEl;
            if (el.nextSibling) {
                el.parentNode.insertBefore(dashedEl, el.nextSibling);
            }
            else {
                el.parentNode.appendChild(dashedEl);
            }
            this.tempEl = el;
            el.parentNode.removeChild(el);
            return dashedEl;
        },
        /**
         * @private
         */
        removeDashedEl : function(){
            if (this.dashedEl.nextSibling) {
                this.dashedEl.parentNode.insertBefore(this.tempEl, this.dashedEl.nextSibling);
            }
            else {
                this.dashedEl.parentNode.appendChild(this.tempEl);
            }
            this.dashedEl.parentNode.removeChild(this.dashedEl);
        },
        /**
         * @private
         */
        clone : function(el){
            var result;
            var jumpOut = false;
            var cloneEl = el.cloneNode(true);
            cloneEl.setAttribute("id","");
            $D.setStyle(cloneEl,"position","absolute");
            $D.setStyle(cloneEl,"zIndex","9999999");
            $D.setStyle(cloneEl,"background","none");
            return cloneEl;
        },
        /**
         * 锁定, 禁止拖动
         */
        lock: function(){
            this._isLock = true;
            for(var i in this.dragController){
                this.dragController[i].lock();
            }
        },
        /**
         * 解锁, 允许拖动
         */
        unlock: function(){
            this._isLock = false;
            for(var i in this.dragController){
                this.dragController[i].unlock();
            }
        },
        /**
         * 返回是否锁定
         */
        isLock: function(){
            return this._isLock;
        },
        /**
         * @private
         */
        forEachNode : function(arr,fun){
            var len = arr.length;
            if (typeof fun != "function") {
                throw new TypeError();
            }
            var thisp = arguments[2];
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    fun.call(thisp, arr[i], i, arr);
                }
            }
        }
        
    });
});
