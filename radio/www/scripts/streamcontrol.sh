#!/bin/ash

data_path="/www/data"
script_path="/www/scripts"

total=`wc -l $data_path/network | awk '{print $1}'`
current=`cat "$data_path/curnetwork"`

if [ "$1" == "up" ]; then
	current=$((current+1))
else
	current=$((current-1))
fi

if [ "$current" -gt "$total" ]; then
	current=1
elif [ "$current" -lt 1 ]; then
	current=$total
fi

echo -n $current > $data_path/curnetwork

$script_path/playstream.sh 1>/dev/null 2>&1 &
	
