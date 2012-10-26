@echo off
:: clean build
echo "clean build..."
rd /s /q ..\build
md ..\build
:: marge css
echo "marge css..."
md ..\build\style
type ..\style\jx.960grid.css > ..\build\style\jx.all.css
type ..\style\jx.reset.css >> ..\build\style\jx.all.css
type ..\style\jx.typography.css >> ..\build\style\jx.all.css
type ..\style\jx.ui.boxy.css >> ..\build\style\jx.all.css
type ..\style\jx.ui.bubble.css >> ..\build\style\jx.all.css
type ..\style\jx.ui.button.css >> ..\build\style\jx.all.css
type ..\style\jx.ui.calendar.css >> ..\build\style\jx.all.css
type ..\style\jx.ui.contextmenu.css >> ..\build\style\jx.all.css
type ..\style\jx.ui.masklayer.css >> ..\build\style\jx.all.css
type ..\style\jx.ui.textbox.css >> ..\build\style\jx.all.css
::compress css
echo "compress css..."
java -jar ./compile/yuicompressor-2.4.7.jar --type css ../build/style/jx.all.css  -o  ../build/style/jx.all.min.css
:: marge js
echo "marge js..."
type ..\src\jx.core.js > ..\build\jx.uiless.js
type ..\src\jx.base.js >> ..\build\jx.uiless.js
type ..\src\jx.array.js >> ..\build\jx.uiless.js
type ..\src\jx.browser.js >> ..\build\jx.uiless.js
type ..\src\jx.dom.js >> ..\build\jx.uiless.js
type ..\src\jx.event.js >> ..\build\jx.uiless.js
type ..\src\jx.string.js >> ..\build\jx.uiless.js
type ..\src\jx.console.js >> ..\build\jx.uiless.js
type ..\src\jx.cookie.js >> ..\build\jx.uiless.js
type ..\src\jx.format.js >> ..\build\jx.uiless.js
type ..\src\jx.date.js >> ..\build\jx.uiless.js
type ..\src\jx.development.js >> ..\build\jx.uiless.js
type ..\src\jx.event.eventparser.js >> ..\build\jx.uiless.js
type ..\src\jx.event.eventproxy.js >> ..\build\jx.uiless.js
type ..\src\jx.fx.js >> ..\build\jx.uiless.js
type ..\src\jx.json.js >> ..\build\jx.uiless.js
type ..\src\jx.http.js >> ..\build\jx.uiless.js
type ..\src\jx.mini.js >> ..\build\jx.uiless.js
type ..\src\jx.number.js >> ..\build\jx.uiless.js
:: add ui
type ..\build\jx.uiless.js > ..\build\jx.all.js
type ..\src\jx.swfobject.js >> ..\build\jx.all.js
type ..\src\jx.sound.js >> ..\build\jx.all.js
type ..\src\jx.ui.masklayer.js >> ..\build\jx.all.js
type ..\src\jx.ui.drag.js >> ..\build\jx.all.js
type ..\src\jx.ui.resize.js >> ..\build\jx.all.js
type ..\src\jx.ui.basewindow.js >> ..\build\jx.all.js
type ..\src\jx.ui.panel.js >> ..\build\jx.all.js
type ..\src\jx.ui.boxy.js >> ..\build\jx.all.js
type ..\src\jx.ui.bubble.js >> ..\build\jx.all.js
type ..\src\jx.ui.button.js >> ..\build\jx.all.js
type ..\src\jx.ui.popupbox.js >> ..\build\jx.all.js
type ..\src\jx.ui.contextmenu.js >> ..\build\jx.all.js
type ..\src\jx.ui.divselect.js >> ..\build\jx.all.js
type ..\src\jx.ui.iframescroller.js >> ..\build\jx.all.js
type ..\src\jx.ui.loading.js >> ..\build\jx.all.js
type ..\src\jx.ui.marquee.js >> ..\build\jx.all.js
type ..\src\jx.ui.notifier.js >> ..\build\jx.all.js
type ..\src\jx.ui.pagination.js >> ..\build\jx.all.js
type ..\src\jx.ui.richeditor.js >> ..\build\jx.all.js
type ..\src\jx.ui.rotation.js >> ..\build\jx.all.js
type ..\src\jx.ui.scrollarea.js >> ..\build\jx.all.js
type ..\src\jx.ui.scrollbar.js >> ..\build\jx.all.js
type ..\src\jx.ui.sortables.js >> ..\build\jx.all.js
type ..\src\jx.ui.tab.js >> ..\build\jx.all.js
type ..\src\jx.ui.textbox.js >> ..\build\jx.all.js
type ..\src\jx.ui.tooltip.js >> ..\build\jx.all.js
type ..\src\jx.ui.touchscroller.js >> ..\build\jx.all.js
type ..\src\jx.ui.calendar.js >> ..\build\jx.all.js
type ..\src\jx.ui.iscroll.js >> ..\build\jx.all.js
:: compress js
echo "compress js..."
java -jar ./compile/compiler.jar --js ../build/jx.uiless.js  --js_output_file  ../build/jx.uiless.min.js
java -jar ./compile/compiler.jar --js ../build/jx.all.js  --js_output_file  ../build/jx.all.min.js
:: copy images
echo "copy images..."
md ..\build\style\image
copy ..\style\image\ ..\build\style\image\
md ..\build\style\swf
copy ..\style\swf\ ..\build\style\swf\
echo "done"
pause