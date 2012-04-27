rmdir .\core /s/q
mkdir .\core

java -jar .\jsdoc-toolkit\jsrun.jar .\jsdoc-toolkit\app\run.js -c=jx-doc-config.conf
