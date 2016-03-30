#!/bin/ash

data_path="/www/data"
script_path="/www/scripts"


current=`cat "$data_path/curnetwork"`

item=`sed -n ${current}p $data_path/network`

title=`echo $item | cut -d "|" -f 1 | sed -e "s/\~/+/g" | sed -f $data_path/translit.sed`

killall wget 2> /dev/null
killall madplay 2> /dev/null
killall playback.sh 2> /dev/null
killall getstreammeta.sh 2> /dev/null

sleep 1

if [ -f "$data_path/title/${title}.mp3" ]; then

	madplay --attenuate=-15 "$data_path/title/${title}.mp3"

fi	

$script_path/playback.sh 1>/dev/null 2>&1 &

echo -n "" > $data_path/curnetworkmeta

sleep 5

$script_path/getstreammeta.sh 1>/dev/null 2>&1 &
	
