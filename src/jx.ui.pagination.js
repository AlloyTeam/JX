Jx().$package(function (J) {
    var $D = J.dom,
        $E = J.event;
        
    J.ui = J.ui || {};

    /**
     * 【Pagination】
     * 
     * @class 
     * @memberOf ui
     * @name Pagination
     * @param {Object} option 参数对象 option:{el:DOM分页容器, count: 总数, prePage: 每页数量, type: 分页类型(1/2), callback: 回调}<br/>
     * option.type 分页类型,type=1:带省略号,有页码列表;type=2:无省略号,没页码列表
     * @since version 1.0
     * @description Jx.ui.Pagination是一个分页组件，当在页面上需要使用列表来展示较多数据时，可以使用该组件实现分页切换效果。
     */
     J.ui.Pagination = new J.Class(
     /**
     * @lends ui.Pagination.prototype
     */
     {
        /**
        * @ignore
        */
        init:function(option){
            this.pagebarEl = option.el;
            this.count = option.count;
            this.perPage = option.perPage || 10;
            this.callback = option.callback||function(){};
            this.type = option.type||1;
            this.maxPage = Math.ceil(this.count/this.perPage);
            this.currentPage=option.currentPage||1;
            var paginationEl = this.pagebarEl.children[0];
            this.pagelistEl = paginationEl.children[1];
            this.preEl = paginationEl.children[0];
            this.nextEl = paginationEl.children[2];
            
            
            if (this.maxPage > 1) {
                $D.show(this.pagebarEl);
            } else {
                $D.hide(this.pagebarEl);
            }
            //this.setPage(this.currentPage);
            this.turnTo(this.currentPage, true);
            $E.on(this.preEl,"click",J.bind(this.onPreElClick,this));
            $E.on(this.nextEl,"click",J.bind(this.onNextElClick,this));
        },
        
        /**
        * 重置分页组件
        * @param {Object} option 参数对象 option:{el:DOM分页容器, count: 总数, prePage: 每页数量, type: 分页类型(1/2), callback: 回调}
        * @return
        */
        reset : function(option){
            this.count = J.isNumber(option.count)?option.count:this.count;
            this.perPage = option.perPage ||this.perPage|| 10;
            this.callback = option.callback||this.callback||function(){};
            this.type = option.type||this.type||1;
            this.currentPage = option.currentPage||this.currentPage||1;
            this.maxPage = Math.ceil(this.count/this.perPage);
            if (this.maxPage > 1) {
                $D.show(this.pagebarEl);
            } else {
                $D.hide(this.pagebarEl);
            }
            this.setPage(this.currentPage);
        },
        
        /**
        * @private
        * 设置
        */
        setPage:function(page){
            var html = "", totalPage = this.maxPage;
            this.currentPage = page;

            if (page > totalPage || page < 1) {
                return;
            }
            //第一种模版,带省略号
            if(this.type == 1){
                if( totalPage > 8 ){
                    html += '<a class="w'+ ((page+'').length) + (page==1?' cur':"")+'" href="#" >1</a>';
                    if(page < 4){
                        for(var i=2; i<5; i++){
                            html += '<a class="w'+ ((i+'').length) +(i==page?' cur':"")+'" href="#" >'+i+'</a>';
                        }
                        html += '<span>...</span>';
                    }else if( (page+3) > totalPage){
                        html += '<span>...</span>';  
                        for(var i=(totalPage-3); i<totalPage; i++){
                            html += '<a class="w'+ ((i+'').length) +(i==page?' cur':"")+'" href="#" >'+i+'</a>';
                        }
                    }else{ 
                        html += '<span>...</span>';
                        for(var i=(page-1); i < (page+2); i++){
                            html += '<a class="w'+ ((i+'').length) +(i==page?' cur':"")+'" href="#" >'+i+'</a>';
                        }
                        html += '<span>...</span>';
                    }
                    html += '<a class="w'+ ((totalPage+'').length) +(page==totalPage?' cur':"")+'" href="#" >'+totalPage+'</a>';
                }else{
                    for( var i=1; i<=totalPage; i++){
                        html += '<a class="w'+ ((i+'').length) +(i==page?' cur':"")+'" href="#" >'+i+'</a>';
                    }
                }
    
                this.pagelistEl.innerHTML = html;
                $D.setStyle(this.pagebarEl,"width","auto");
                $D.setStyle(this.pagebarEl,"width",$D.getClientWidth(this.pagebarEl.children[0])+10+"px");
                var pagelink = $D.tagName("a",this.pagelistEl), i=0, len=pagelink.length;
                for (; i<len; i++) {
                    $E.on(pagelink[i],"click",J.bind(this.onPagesElClick,this));
                }
                
            }else if(this.type==2){//第二种模版,不带省略号
                html = page+"/"+totalPage;
                this.pagelistEl.innerHTML = html;
            }
            

            $D.removeClass(this.preEl,"preBtn_dis");
            $D.removeClass(this.nextEl,"nextBtn_dis");

            if(page == 1){
                $D.addClass(this.preEl,"preBtn_dis");
            } else if(page == totalPage){
                $D.addClass(this.nextEl,"nextBtn_dis");
            }
        },
        
        /**
        * 切换到 指定页
        * @param page {Number} 页码
        * @param force {Boolean} 内部使用参数，可以不填或false
        */
        turnTo: function(page, force){
            if (isNaN(page) || page < 1 || page > this.maxPage || (!force && page == this.currentPage)) {
                return;
            }

            this.setPage(page);
            this.callback({start:this.getStart(), end:this.getEnd()});
        },
        
        /**
        * @private 
        */
        onPagesElClick:function(e){
            e.stopPropagation();
            e.preventDefault();

            var page = +e.currentTarget.innerHTML;
            this.turnTo(page);
            /*if (isNaN(page) || page < 1 || page > this.maxPage || page == this.currentPage) {
                return;
            }

            this.setPage(page);
            this.callback({start:this.getStart(), end:this.getEnd()});*/
            //$E.notifyObservers(this.context, "SetPage", {start:this.getStart(), end:this.getEnd()});
        },
        
        /**
        * @private 
        */
        onPreElClick:function(e){
            e.stopPropagation();
            e.preventDefault();

            if (this.currentPage > 1) {
                this.currentPage--;
                this.setPage(this.currentPage);
                this.callback({start:this.getStart(), end:this.getEnd()});
                //$E.notifyObservers(this.context, "SetPage", {start:this.getStart(), end:this.getEnd()});
            }
        },
        
        /**
        * @private 
        */
        onNextElClick:function(e){
            e.stopPropagation();
            e.preventDefault();

            if (this.currentPage < this.maxPage) {
                this.currentPage++;
                this.setPage(this.currentPage);
                this.callback({start:this.getStart(), end:this.getEnd()});
                //$E.notifyObservers(this.context, "SetPage", {start:this.getStart(), end:this.getEnd()});
            }
        },
        
        /**
        * 获取当前页列表起始索引值
        * @param
        * @return {Number} 当前页列表起始索引值
        */
        getStart:function(){
            return (this.currentPage-1)*this.perPage;
        },
        
        /**
        * 获取当前页列表结束索引值
        * @param
        * @return {Number} 当前页列表结束索引值
        */
        getEnd:function(){
            var end = (this.currentPage*this.perPage)-1;
            if(end > this.count - 1)
                end = this.count - 1;
            return end;
        }
    });
});