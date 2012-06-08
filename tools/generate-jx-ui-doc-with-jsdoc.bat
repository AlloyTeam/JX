rmdir .\ui /s/q
mkdir .\ui

java -jar .\jsdoc-toolkit\jsrun.jar .\jsdoc-toolkit\app\run.js -c=jx-ui-doc-config.conf
