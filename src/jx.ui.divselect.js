/* == J.ui.DivSelect =============================================
 * Copyright (c) 2010, Tencent.com All rights reserved.
 * version: 1.0
 * rehorn
 * -------------------------------------------- 2011-3-14 ----- */
 
Jet().$package(function (J) {
    var packageContext = this,
        $D = J.dom,
        $S = J.string,
        $E = J.event;
    J.ui = J.ui || {};
    /*
       * div模式select相关，可以移植到其他地方 示例： html:<div id="testdiv"></div> js:
       * divSelect.show("testdiv","test",selOptions,"",160,"test()");
       * 
       */
    /**
     * 
     * div模拟的下拉框, 直接 new一个实例即可
     * 
     * @memberOf ui
     * @name DivSelect
     * @class
     * @constructor
     * @param {String} objId 容器
     * @param {String} selectName 名称
     * @param {Object} dataObj 数据[数组]
     * @param {Object} selOption 默认项
     * @param {Number} width 宽度
     * @param {Boolean} isUpper
     * 
     * @example
     * html: &lt;div id="testdiv"&gt;&lt/div&gt; 
     * js: new DivSelect("testdiv","test",selOptions,"",160);
     * 
     */
     var DivSelect = J.ui.DivSelect = new J.Class(

     {
        /*
         * 主调函数 参数含义：容器，名称，数据[数组]，默认项，宽度 注意：数据格式
         */
        /** @ignore */
        init : function(objId, selectName, dataObj, selOption, width, isUpper) {

          this._selectName = selectName;
          this._dataObj = dataObj;
          this._selOption = selOption;
          this._isUpper = isUpper || false;

          // _divSelect = divSelect; ;
          var data = dataObj.data;
          var _Obj = document.getElementById(objId);
          if (!_Obj || typeof(_Obj) === "undefined") {
            return false;
          }
          var s1 = document.createElement("div");
          if (isNaN(width) || width == "") {
            width = 150;
          } else if (width < 26) {
            width = 26;
          }
          s1.style.width = width;
          var top = ""
          if(this._isUpper){
              s1.style.position = "relative";
              var height = (15*(data.length)); //每个item 15px
              top = "top:-"+((height>150?150:height)+4)+"px;";
          }

          var str = "";
          /*
           * //判断是否有数据
           */
          // 判断是否有数据
          if (data.length > 0) {
            // 有数据时显示数据选项列表
            str += "<input type='hidden' name='" + selectName
                + "' id='" + selectName + "' value='"
                + this.relv(selOption, data) + "'>";
            str += "<div id='_a_" + selectName + "' style='width:"
                + width
                + "px;height:18px; border:1px #728EA4 solid;'>";

            str += "<div id='_v_"
                + selectName
                + "' style='position:relative;float:left;left:2px;width:"
                + (width - 22)
                + "px;height:18px;font-size:12px;overflow:hidden;line-height:18px;'>"
                + this.reStr(data, selOption) + "</div>";
            str += "<div id='_arr_"
                + selectName
                + "' class='divSelect_arr' style='position:relative;float:right;right:0px;width:18px;height:18px;text-align:center;font-family:Webdings;font-size:16px;overflow:hidden;background-color:#FFF;cursor:pointer!important;cursor:hand;'></div>";
            str += "</div>";
            str += "<div id='_b_"
                + selectName
                + "' style='position:absolute; background-color:#FFFFFF; width:"
                + width
                + "px; height:"
                + this.height(data.length)
                + "px;border:1px #728EA4 solid;overflow-x:hidden;overflow-y:auto;display:none; z-index:99999;" + top + "'>";
            for (var i = 0; i < data.length; i++) {
              var style = data[i][0] == selOption
                  ? this.style(2)
                  : this.style(1);
              str += "<div id='_s_" + selectName + i
                  + "' style='" + style + "' >" + data[i][1]
                  + "</div>";
            }
            str += "</div>";
          } else {
            // 没有数据时显示一个空窗体
            str += "<input type='hidden' name='" + selectName
                + "' id='" + selectName + "' value='"
                + selOption + "'>";
            str += "<div id='_a_" + selectName + "' style='width:"
                + width
                + "px;height:18px; border:1px #728EA4 solid;'>";
            str += "<div id='_v_"
                + selectName
                + "' style='position:relative;float:left;left:2px;width:"
                + (width - 22)
                + "px;height:18px;font-size:12px;overflow:hidden;line-height:18px;'></div>";
            str += "<div id='_arr_"
                + selectName
                + "' class='divSelect_arr' style='position:relative;float:right;right:0px;width:18px;height:18px;text-align:center;font-family:Webdings;font-size:16px;overflow:hidden;background-color:#FFF;cursor:pointer!important;cursor:hand;'></div>";
            str += "</div>";
            str += "<div id='_b_"
                + selectName
                + "' style='position:absolute; background-color:#FFFFFF; width:"
                + width
                + "px; height:"
                + this.height(0)
                + "px;border:1px #728EA4 solid;overflow-x:hidden;overflow-y:auto;display:none; z-index:99999;'></div>";
          }

          s1.innerHTML = str;
          _Obj.appendChild(s1);

          var divSelectObj = this;

          var clickShowOption = function() {
            divSelectObj.showOptions();
          }

          $E.on($D.id('_v_' + selectName), "click", clickShowOption);
          $E.on($D.id('_arr_' + selectName), "click",
                  clickShowOption);
          if (data.length > 0) {
            var optionOver = function() {
              divSelectObj.css(this, 3);
            };
            var optionOut = function() {
              divSelectObj.css(this, 1);
            };
            var optionClick = function() {
              divSelectObj.selected(this);
            };
            for (var i = 0; i < data.length; i++) {
              $E.on($D.id('_s_' + selectName + i), "mouseover",
                  optionOver);
              $E.on($D.id('_s_' + selectName + i), "mouseout",
                  optionOut);
              $E.on($D.id('_s_' + selectName + i), "click",
                  optionClick);
            }

          }
        },
        /*
         * clickShowOption : function(){ divSelectObj.showOptions(); },
         */
        /**
         * 返回选定项的值
         * @param {String} n id
         * @return {String}
         */
        value : function(n) {
          n = n || this._selectName;
          return document.getElementById(n).value;
        },
        /**
         * 返回选定项的文本
         * @param {String} n id
         * @return {String}
         */
        text : function(n) {
          n = n || this._selectName;
          return document.getElementById("_v_" + n).innerHTML;
        },
        /**
         * 选中给节点
         * @param {HTMLElement} optionObj 
         */
        selected : function(optionObj) {
          var data = this._dataObj.data;
          var value = optionObj.innerHTML;
          for (var i = 0; i < data.length; i++) {
            if (data[i][1] === value) {
              $D.id(this._selectName).value = data[i][0];
            }
            $D.id('_s_' + this._selectName + i).style.cssText = this.style(1);
          }

          $D.id("_v_" + this._selectName).innerHTML = value;

          optionObj.style.cssText = this.style(2);
          this.hidden();
          $E.notifyObservers(this, "selectedChanged");
        },
        relv : function(v, d) {
          for (var i = 0; i < d.length; i++) {
            if (d[i][0] == v) {
              return v;
            }
          }
          if (v == null || v == "") {
            return d[0][0];
          }
        },
        reStr : function(d, m) {
          for (var i = 0; i < d.length; i++) {
            if (d[i][0] == m) {
              return d[i][1];
            }
          }
          if (m == null || m == "") {
            return d[0][1];
          }
        },
        /**
         * 获取列表的高度
         * @return {Number}
         */
        height : function(l) {
          var h;
          if (l > 10 || l < 1)
            h = 10 * 15;
          else
            h = l * 15;
          h += 2;
          return h;
        },
        showOptions : function(n) {
          n = n || this._selectName;
          var o = document.getElementById("_b_" + n)
          if (o.style.display == "none")
            o.style.display = "";
          else
            o.style.display = "none";

        },
        hidden : function() {
          document.getElementById("_b_" + this._selectName).style.display = "none";
        },
        style : function(m) {
          var cs = "";
          switch (m) {
            case 1 :
              cs = "height:15px; font-size:12px; line-height:15px; overflow:hidden; background-color:#FFFFFF; color:#000000; font-weight:normal;";
              break;
            case 2 :
              cs = "height:15px; font-size:12px; line-height:15px; overflow:hidden; background-color:#315DAD; color:#FFFFFF; font-weight:bold;";
              break;
            case 3 : //mouseover
              cs = "height:15px; font-size:12px; line-height:15px; overflow:hidden; background-color:#D8D8D8; color:#000000; font-weight:normal;";
              break;
          }
          return cs;
        },
        css : function(optionObj, type) {
          if (type === 1) {
            if ($D.id("_v_" + this._selectName).innerHTML != optionObj.innerHTML) {
              optionObj.style.cssText = this.style(type);
            }
          } else {
            if ($D.id("_v_" + this._selectName).innerHTML != optionObj.innerHTML) {
              optionObj.style.cssText = this.style(type);
            }
          }
        }
      });
      
});
    
    