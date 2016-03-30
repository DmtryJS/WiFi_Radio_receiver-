#!/bin/sh

path="/www/data"

action=`echo "$QUERY_STRING" | sed -n 's/^.*action=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`

echo "Content-type: text/html; charset=utf8\n"
echo ""

if [ $action == "statusnetwork" ] ; then
	echo "`cat $path/curnetwork` `cat $path/curnetworkmeta | sed 's/ /%20/g'`"
elif [ $action == "network" ] ; then
	echo "`cat $path/network | sed ':a;N;$!ba;s/\n/\;/g' | sed 's/\~/ /g' | sed 's/%250A//g'`"
elif [ $action == "curnetwork" ] ; then
	echo "`cat $path/curnetwork`" 
elif [ $action == "currentvol" ] ; then
	echo `amixer -c 0 sget Speaker Playback Volume`
fi