rmdir .\jx_ui /s/q
mkdir .\jx_ui

java -jar .\jsdoc-toolkit\jsrun.jar .\jsdoc-toolkit\app\run.js -c=jx-ui-doc-config.conf
