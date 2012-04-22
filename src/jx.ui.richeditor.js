/**
 * 富文本模块
 * @author azrael
 * 2011-5-16
 */
;Jx().$package(function (J) {
    var packageContext=this,
    $E = J.event, $D = J.dom, $B = J.browser;
/**
 * @class BaseEditor
 * 基本的富文本编辑器
 * @param {Object} option
 * @description
 * BaseEditor只处理编辑器自身的逻辑
 * 保存当前光标位置, 防止插入到页面其他地方
 * 
 * 富文本的扩展功能如设置字体样式/工具条等在RichEditor实现
 * @see J.ui.RichEditor
 * @example 
 * option = {
 *  appendTo: {HTMLElement} //富文本的容器
 *  className: {String},
 *  richClassName: {String},
 *  textClassName: {String},
 *  keepCursor: {Boolean} default: false //是否保存光标位置, 因为要进行保存选区和还原, 如果不关心光标位置, 则设置为false
 *  brNewline: {Boolean} default: false //使用统一使用br标签进行换行 
 *  clearNode: {Boolean} default: false //是否要对粘贴或拖拽进输入框的内容进行过滤, NOTE: opera只支持 ctrl+v 粘贴进来的内容
 *  nodeFilter: {Function} default: null //clearNode时过滤节点的函数, return true则不过滤该节点, 参数为 HTMLElement
 * }
 * example: 
 * new J.ui.BaseEditor({
 *       appendTo: el,
 *       className: 'rich_editor',
 *       keepCursor: true,
 *       brNewline: true,
 *       clearNode: true 
 *   });
 * 
 */
var BaseEditor = new J.Class(
{
    /**
     * 初始化代码
     */
    init: function(option){
        if(!option.appendTo){
            throw new Error('BaseEditor: appendTo is undefined.');
        }
        this.option = {
            keepCursor: option.keepCursor || false,
            brNewline: option.brNewline || false,
            clearNode: option.clearNode || false,
            nodeFilter: option.nodeFilter || null
        }
        var className = option.className || 'rich_editor'
        var container = this._container = $D.node('div', {
            'class': className
        });
        var divArea = this._divArea = $D.node('div', {
            'class': option.richClassName || (className + '_div')
        });
        var textArea = this._textArea = $D.node('textarea', {
            'class': option.textClassName || (className + '_text')
        });
        container.appendChild(divArea);
        container.appendChild(textArea);
        option.appendTo.appendChild(container);
        
        this.setState(true);
        this.clear();
        
        var context = this;
        
        // 私有方法
        this._private = {
            startTimeoutSaveRange : function(timeout){
                this.clearTimeoutSaveRange();
                this._keyupTimer = window.setTimeout(this.timeoutSaveRange, timeout || 0);
            },
            timeoutSaveRange : function(){
                context.saveRange(true);
            },
            clearTimeoutSaveRange : function(){
                if(this._keyupTimer){
                    window.clearTimeout(this._keyupTimer);
                    this._keyupTimer = 0;
                }
            },
            startTimeoutClearNodes : function(timeout){
                this.clearTimeoutClearNodes();
                this._clearNodesTimer = window.setTimeout(this.timeoutClearNodes, timeout || 0);
            },
            timeoutClearNodes : function(){
                context.clearNodes();
            },
            clearTimeoutClearNodes : function(){
                if(this._clearNodesTimer){
                    window.clearTimeout(this._clearNodesTimer);
                    this._clearNodesTimer = 0;
                }
            }
        };
        
        $E.on(divArea, 'blur', J.bind(BaseEditor.observer.onBlur, context));
        $E.on(divArea, 'mouseup', J.bind(BaseEditor.observer.onMouseup, context));
        $E.on(divArea, 'drop', J.bind(BaseEditor.observer.onDrop, context));
        $E.on(divArea, 'paste', J.bind(BaseEditor.observer.onPaste, context));
        $E.on(divArea, 'keyup', J.bind(BaseEditor.observer.onKeyup, context));
        if($B.ie){
            $E.on(divArea, 'keydown', J.bind(BaseEditor.observer.onBackspaceKeydown, context));
        }
        if($B.adobeAir){//air需要用keyup来监听ctrl+v
            $E.on(divArea, 'keyup', J.bind(BaseEditor.observer.onAdobeAirKeyup, context));
        }
        if(J.platform.linux && $B.firefox){
            //1. keydown事件在ubuntu的firefox用了中文输入法时不会触发
            $E.on(divArea, 'keypress', J.bind(BaseEditor.observer.onLinuxKeypress, context));
        }else if(J.platform.win && $B.opera){
            //1. windows的 opera的keydown事件无法阻止默认行为, 另外window的opera的 ctrl+ v的keyCode 是86
            //ubuntu的opera的ctrl+v的keyCode是118...
            $E.on(divArea, 'keypress', J.bind(BaseEditor.observer.onKeydown, context));
        }else {
            $E.on(divArea, 'keydown', J.bind(BaseEditor.observer.onKeydown, context));
        }
        $E.addObserver(this, 'Paste', J.bind(BaseEditor.observer.onEditorPaste, context));
        //hacky trick
        if($B.firefox){
            $E.on(divArea, 'keypress', J.bind(BaseEditor.observer.onKeypress, context));
        }
    },
    /**
     * 按键抬起操作
     */
    onKeyUp: function() {
        
    },
    isEnable: function(){
        return this._isEnable;
    },
    /**
     * 设置是否启用富文本
     * @param {Boolean} state
     */
    setState: function(state){
        this._isEnable = state;
        var textArea = this._textArea;
        var divArea = this._divArea;
        if(state){
            $D.show(divArea);
            $D.hide(textArea);
            textArea.readonly = true;
            divArea.setAttribute('contentEditable', true);
        }else{
            $D.hide(divArea);
            $D.show(textArea);
            textArea.readonly = false;
            divArea.setAttribute('contentEditable', false);
        }
    },
    /**
     * 指示编辑框是否可编辑
     * @return {Boolean}
     */
    isEditable: function(){
        return this._isEditable;
    },
    /**
     * 设置是否可编辑, true 可编辑, false 只读
     * @param {Boolean} isEditable
     */
    setEditable: function(isEditable){ 
        this._isEditable = isEditable;
        if(this._isEnable){
            this._divArea.setAttribute('contenteditable', isEditable);
        }else{
            this._textArea.readonly = !isEditable;
        }
    },
    /**
     * 销毁
     */
    destory: function(){
        $E.off(divArea, 'focus');
        $E.off(divArea, 'blur');
        $E.off(divArea, 'mousedown');
        $E.off(divArea, 'mouseup');
        $E.off(divArea, 'keyup');
        $E.off(divArea, 'paste');
        $E.off(divArea, 'drop');
        $E.off(divArea, 'keypress');
        $E.off(divArea, 'keydown');
            
        this.setState(false);
        this._container.parentNode.removeChild(this._container);
        for (var p in this) {
            if (this.hasOwnProperty(p)) {
                delete this[p];
            }
        }
    },
    /**
     * 返回编辑区的html
     * @return {String}
     */
    getHtml: function(){
        return this._divArea.innerHTML;
    },
    /**
     * 设置编辑区的内容
     * @param {String} html
     */
    setHtml: function(html){
        this._divArea.innerHTML = html;
    },
    /**
     * 清空编辑器 
     */
    clear: function(){
        if(this._isEnable){
            if(this.option.keepCursor){
                this.saveRange(true);
            }
            if($B.ie){
                this.setHtml('');
            }else{
                this.setHtml('<br/>');
            }
        }else{
            this.setText('');
        }
    },
    /**
     * 设置纯文本输入框的内容
     * @param {String} text
     */
    setText: function(text){
        this._textArea.value = text;
    },
    /**
     * 获取纯文本框的内容
     * NOTE: 如果要取得富文本里的纯文本内容, 请先调用save方法
     * @see save
     * @return {String}
     */
    getText: function(){
        return this._textArea.value;
    },
    /**
     * 判断输入框内容是否是空的
     * @param {Boolean} 
     */
    isEmpty: function(){
        if(this._isEnable){
            var html = this.getHtml();
            if(html === ''){
                return true;
            }else if(!$B.ie && html.toLowerCase() === '<br>'){
                return true;
            }else{
                return false;
            }
        }else{
            var text = this.getText();
            if(text === ''){
                return true;
            }else{
                return false;
            }
        }
    },
    /**
     * 
     */
    focus: function(){
        if(this._isEnable){
            this._divArea.focus();
            if(this.option.keepCursor){
                this.restoreRange();
            }
        }else{
            this._textArea.focus();
        }
    },
    /**
     * 
     */
    blur: function(){
        if(this._isEnable){
            this._divArea.blur();
        }else{
            this._textArea.blur();
        }
    },
    /**
     * 把编辑区的内容保存到文本框
     * NOTE: 这里只是简单的转换, 子类最好根据需要重写该方法
     */
    save: function(){
        this.setText(this.getHtml());
    },
    /**
     * 把纯文本框里的文本还原到富文本输入框
     * NOTE: 这里只是简单的转换, 子类最好根据需要重写该方法
     */
    restore: function(){
        this.setHtml(this.getText());
    },
    /**
     * 获取输入框中的选中区
     * @return {Range}, null
     */
    getRange: function(){
        return BaseEditor.getRange(this._divArea);
    },
    /**
     * 保存当前光标位置
     * 如果调用时确认当前光标是在输入框中, 不执行检测会节约些许性能
     * @param {Boolean} checkRange 指示是否检查range是否在文本框中
     * 
     */
    saveRange: function(checkRange){
        var lastRange = checkRange ? this.getRange() : BaseEditor.getRange();
        if(!lastRange){
            return;
        }
        this._lastRange = lastRange;
//        if(lastRange.getBookmark){// for ie
//            this._lastBookmark = lastRange.getBookmark();
//        }
    },
    /**
     * 还原保存的光标位置
     * NOTE: 调用时需确保光标是在输入框中
     */
    restoreRange: function(){
        if(this._lastRange){
            var selection = BaseEditor.getSelection();
            if(selection.addRange){
                /*
                 * 对于高级浏览器, 直接把原来的range添加到selection就可以还原选区了
                 */
                selection.removeAllRanges();
                selection.addRange(this._lastRange);
            }else{//ie
                //NOTE: ie还可以使用其专有的bookmark来还原, 
                //但是如果在输入框以外的地方选中了文字, 偶尔会出现还原失败的情况
                /*if(this._lastBookmark){ //ie 
                /*
                 * 这里的原理是:
                 * 1. 先把保存lastRange的bookmark
                 * 2. 把新的range的选中位置移动到上次保存的bookmark
                 * 3. 选中该range就能把上次保存的选区还原了
                 *
                    var range = BaseEditor.getRange();
                    if(range){
                        range.moveToBookmark(this._lastBookmark);
                        range.select();
                    }
                }*/
                /*
                 * 这里的原理是:
                 * 1. 先把保存lastRange, 如"ABCDEFG"中的"CDE"
                 * 2. 把新的range的结尾移动到lastRange的开头(即"C"的左边),
                 * 3. 然后调用 collapse(false)把光标的插入点移动到range的结尾
                 * 也就是把range的开头和结尾合并在一起, 因为新的range的开头都是在内容的起点
                 * 不这样处理的话, 调用select之后会选中"AB"(即选中"C"之前的所有内容)
                 * 4. 把range的结尾移动到lastRange的结尾(即"E"的右边)
                 * 5. 选中该range就能把上次保存的选区还原了(即选中"CDE")
                 */
                var range = BaseEditor.getRange();
                if(range){
                    //TODO 如果选中的内容是图片, 这里就会出错了
                    range.setEndPoint('EndToStart', this._lastRange);
                    range.collapse(false);
                    range.setEndPoint('EndToEnd', this._lastRange);
                    range.select();
//                    range.setEndPoint('EndToEnd', this._lastRange);
//                    range.setEndPoint('StartToStart', this._lastRange);
//                    range.select();
                }
//                这个方法说不定可以
//                this._lastRange.select();
            }
        }
    },
    /**
     * 在光标处插入一段html
     * NOTE:调用时需确保光标在输入框中
     * @param {String} html
     */
    insertHtml: function(html){
        if(html === ''){
            return;
        }
        var range = this.getRange();
        if(!range){//如果拿不到输入框中的range, 就直接添加到最后
            if(this.isEmpty()){
                this._divArea.innerHTML = html;
            }else{
                this._divArea.innerHTML += html;
            }
            range = BaseEditor.getRange();
            var divLastNode = this._divArea.lastChild;
            if(range.selectNode){
                range.setEndAfter(divLastNode);
                range.setStartAfter(divLastNode);
                var selection = BaseEditor.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }else if(range.moveToElementText){
                range.moveToElementText(divLastNode);
                range.collapse(false);
                range.select();
            }
        }else if(range.pasteHTML){//ie, ie9 也在这里
//            html += '<img style="display:inline;width:1px;height:1px;">';
            range.pasteHTML(html);
            range.collapse(false);
            range.select();
        }else if(range.createContextualFragment){//ie9竟然不支持这个方法
		    // 使用img标签是因为img是行内元素的同时, 又能设置宽高占位
            html += '<img style="display:inline;width:1px;height:1px;">';
            var fragment = range.createContextualFragment(html);
            var lastNode = fragment.lastChild;
			//如果已经选中了内容, 先把选中的删除
            range.deleteContents();
            range.insertNode(fragment);
            //插入后把开始和结束位置都放到lastNode后面, 然后添加到selection
            range.setEndAfter(lastNode);
            range.setStartAfter(lastNode);
            var selection = BaseEditor.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            //把光标滚动到可视区
//            if(lastNode.nodeType === 1){
//				  ff开了firbug的时候, 会导致样式错乱, 换用scrollTop的方式
//                lastNode.scrollIntoView();
//            }
            var divArea = this._divArea;
            var pos = $D.getRelativeXY(lastNode, divArea);
            divArea.scrollTop = pos[1] < divArea.scrollHeight ? divArea.scrollHeight : pos[1];
            // 删除附加的节点, 这里只能这样删, chrome直接remove节点会导致光标消失掉
            if(!$B.opera){//TODO opera的光标还原有问题, 要想办法解决
                document.execCommand('Delete', false, null);
            }
            if(BaseEditor.contains(divArea, lastNode)){//for opera
                divArea.removeChild(lastNode);
            }
        }
        if(this.option.keepCursor){
            //插入后把最后的range设置为刚刚的插入点
            this.saveRange();
        }
    },
    /**
     * 往纯文本框插入一段文本
     * @param {String} text
     */
    insertText: function(text){
        if(text === ''){
            return;
        }
        var textArea = this._textArea;
        if($B.ie){
            var range = BaseEditor.getRange();
            if(range){
                range.text = text;
            }else{
                textArea.value += text;
            }
        }else{
            if(J.isUndefined(textArea.selectionStart)){
                textArea.value += text;
            }else{
                var value = textArea.value,
                    start = textArea.selectionStart, 
                    end = textArea.selectionEnd,
                    cursorPoint = start + text.length;
                textArea.value = value.substring(0, start) + text + value.substring(end);
                textArea.setSelectionRange(cursorPoint, cursorPoint);
            };
            
        }
    },
    /**
     * 将输入框里的内容在光标处换行
     * NOTE: 执行该方法前, 需保证光标已经在输入框
     */
    newline: function(){
        if(this._isEnable){
            this.insertHtml('<br/>');
        }else{
            this.insertText('\n');
        }
    },
    /**
     * 清理节点, 把除了br,img之外的节点都清理掉
     */
    clearNodes: function(){
        /* 
         * 这里的原理是:
         * 倒序遍历输入框的直接子节点
         * 1. 如果是文本节点则跳过
         * 2. 如果是element,且不是br,则用其包含的文本保存替换该节点
         * 3. 如果是其他, 如comment,则移除
         * 最后把光标位置还原
         */
        var divArea = this._divArea;
        var text, textNode, cursorNode;
        var childNodes = divArea.childNodes;

        for(var c = childNodes.length - 1, node; c >= 0; c--){
            node = childNodes[c];
            if(node.nodeType === 3){//text
                
            }else if(node.nodeType === 1){//element
                if(node.nodeName !== 'BR'){
                    if(this.option.nodeFilter && this.option.nodeFilter(node)){
                        //nodeFilter返回true则不过滤
                    }else{
                        text = node.textContent || node.innerText || '';//innerText for ie
                        if(text !== ''){
                            textNode = document.createTextNode(text);
                            if(!cursorNode){
                                cursorNode = textNode;
                            }
                            divArea.replaceChild(textNode, node);
                        }else{
                            divArea.removeChild(node);
                        }
                    }
                    
                }
            }else{//comment etc.
                divArea.removeChild(node);
            }
        }
        if(cursorNode){//清除多余标签后还原光标位置
            var selection = BaseEditor.getSelection();
            if(selection.extend){//ff, chrome 要先扩展选区, 然后把选区开头合并到结尾
                //NOTE: chrome 拷贝某些html会有问题
                selection.extend(cursorNode, cursorNode.length);
                selection.collapseToEnd();
            }
        }
    }
});

BaseEditor.observer = {
    onBlur: function(e){
        //本来想在blur的时候保存range, 但是执行这个事件的时候,
        //光标已经不在输入框了, 也许ie可以用onfocusout事件来做
//        this.saveRange();
        this._private.clearTimeoutSaveRange();
    },
    onMouseup: function(e){
        if(this.option.keepCursor){
            this.saveRange();
        }
    },
    onLinuxKeypress: function(e){//only for linux firefox
        var keyCode = Number(e.keyCode), charCode = Number(e.charCode);
        var altKey = e.altKey, ctrlKey = e.ctrlKey, shiftKey = e.shiftKey;
        if(charCode === 118 && (ctrlKey && !altKey && !shiftKey)){// ctrl + v
            $E.notifyObservers(this, 'Paste', e);
        }else if(keyCode === 13 && this.option.brNewline){//enter no matter ctrl or not
            e.preventDefault();
            this.newline();
        }
    },
    onAdobeAirKeyup: function(e){//only for air ctrl+v
        var keyCode = Number(e.keyCode);
        var altKey = e.altKey, ctrlKey = e.ctrlKey, shiftKey = e.shiftKey;
        if(keyCode === 86 && (ctrlKey && !altKey && !shiftKey)){// ctrl + v
            $E.notifyObservers(this, 'Paste', e);
        }
    },
    onBackspaceKeydown: function(e){//for ie
        var keyCode = Number(e.keyCode);
        var altKey = e.altKey, ctrlKey = e.ctrlKey, shiftKey = e.shiftKey;
        if(keyCode === 8 && (!ctrlKey && !altKey && !shiftKey)){//BackSpace
            //ie 在输入框中选中了图片后按回退键, 跟点浏览器的后退按钮一个效果 >_<
            var selection = BaseEditor.getSelection();
            if (selection.type.toLowerCase() === 'control') {
                e.preventDefault();
                selection.clear();
            }
        }
    },
    onKeydown: function(e){//normal browser
        var keyCode = Number(e.keyCode);
        var altKey = e.altKey, ctrlKey = e.ctrlKey, shiftKey = e.shiftKey;
        if(keyCode === 86 && (ctrlKey && !altKey && !shiftKey)){// ctrl + v
            //1. opera没有onpaste事件, 因此只能监控ctrl+v的粘贴
            //2. ie剪贴板里有图片时, 监听不到onpaste事件
            $E.notifyObservers(this, 'Paste', e);
        }else if(keyCode === 13 && this.option.brNewline){//enter no matter ctrl or not
            e.preventDefault();
            this.newline();
        }
    },
    onKeyup: function(e){
        //TODO 判断如果是某些按键(如空格)就立即保存
        var keyCode = Number(e.keyCode);
        if(keyCode === 16 || keyCode === 17 || keyCode === 18){
            //排除掉单纯的shift,ctrl,alt键
        }else if(this.option.keepCursor){
            //延时进行保存, 避免连续输入文字的时候做了太多次操作
            this._private.startTimeoutSaveRange(100);
        }
        this.onKeyUp(e);
    },
    onKeypress: function(e) {
        this.onKeyUp(e);
    },
    onPaste: function(e){
        if(this.option.clearNode){
            //这里延时200毫秒, 如果onEditorPaste执行的时候也过滤的话,就可以取消这次了
            this._private.startTimeoutClearNodes(200);
        }
    },
    onDrop: function(e){
        if(this.option.clearNode){
            //因为发出这个事件的时候, 内容还没有粘贴到输入框, 所以要延时
            this._private.startTimeoutClearNodes();
        }
    },
    onEditorPaste: function(e){
        if($E.notifyObservers(this, 'EditorPaste', e)){//如果EditorPaste的监听者返回了false, 则不进行过滤处理
            if(this.option.clearNode){
                //因为发出这个事件的时候, 内容还没有粘贴到输入框, 所以要延时
                this._private.startTimeoutClearNodes();
            }
        }
    }
    
};

/**
 * 获取当前页面的selection对象
 * @return {Selection}
 */
BaseEditor.getSelection = function() {
    //先判断ie专有的, 因为ie9对range的支持不完全啊>_<
    return (document.selection) ? document.selection : window.getSelection();
};

/**
 * 获取选中区, 如果传入了container, 则返回container的range
 * @param {HTMLElement} container, 目标range的容器, 可选
 * @return {Range}, null
 */
BaseEditor.getRange = function(container) {
    var selection = BaseEditor.getSelection();
    if (!selection) {
        return null;
    }
    var range = selection.getRangeAt ? (selection.rangeCount ? selection
                .getRangeAt(0) : null) : selection.createRange();
    if(!range){
        return null;
    }
    if(container){
        if(BaseEditor.containsRange(container, range)){
            return range;
        }else{
            return null;
        }
    }else{
        return range;
    }
    
};

/**
 * 判断一个节点是否是某个父节点的子节点, 
 * 默认不包含parent === child的情况
 * @param {HTMLElement} parent
 * @param {HTMLElement} child
 * @param {Boolean} containSelf 指示是否可包含parent等于child的情况
 * @return {Boolean} 包含则返回true
 */
BaseEditor.contains = function(parent, child, containSelf){
    if(!containSelf && parent === child){
        return false;
    }
    if(parent.compareDocumentPosition){//w3c
        var res = parent.compareDocumentPosition(child);
        if(res == 20 || res == 0){
            return true;
        }
    }else{
        if(parent.contains(child)){//ie
            return true;
        }
    }
    return false;
};
/**
 * 判断一个range是否被包含在container中
 * @param {HTMLElement} container
 * @param {Range} range
 * @return {Boolean}
 */
BaseEditor.containsRange = function(container, range){
    var rangeParent = range.commonAncestorContainer || (range.parentElement && range.parentElement()) || null;
    if(rangeParent){
        return BaseEditor.contains(container, rangeParent, true);
    }
    return false;
};

/**
 * @class RichEditor
 * 富文本编辑器
 * @param {Object} option
 * @description
 * RichEditor实现了富文本的扩展功能如设置字体样式/工具条等
 * 包装了BaseEditor
 * @see J.ui.BaseEditor
 * @example 
 * option = {
 *  appendTo: {HTMLElement} //富文本的容器
 *  keepCursor: {Boolean} default: false //是否保存光标位置, 因为要进行保存选区和还原, 如果不关心光标位置, 则设置为false
 *  brNewline: {Boolean} default: false //使用统一使用br标签进行换行 
 *  clearNode: {Boolean} default: false //是否要对粘贴或拖拽进输入框的内容进行过滤, NOTE: opera只支持 ctrl+v 粘贴进来的内容
 * }
 */
var RichEditor = new J.Class({ extend: BaseEditor}, 
{
    init: function(option){
        var context = this;
        /**
         * 简化对父类方法的调用,每个子类都要有一个
         * @param func,String 方法名称
         * @ignore
         */
        this.callSuper = function(func){
            var slice = Array.prototype.slice;
            var a = slice.call(arguments, 1);
            RichEditor.superClass[func].apply(context, a.concat(slice.call(arguments)));
        };
        
        //调用父层初始化方法
        this.callSuper("init",option);
    }
    //TODO 未完成
});

J.ui = J.ui || {};
J.ui.BaseEditor = BaseEditor;
J.ui.RichEditor = RichEditor;

// end
});