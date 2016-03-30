#!/bin/ash

data_path="/www/data"

current=`cat "$data_path/curnetwork"`

item=`sed -n ${current}p $data_path/network`

stream=`echo $item | cut -d "|" -f 2 | sed -e "s/\~/ /g"`

while true
do
	wget -q -O - $stream | madplay --replay-gain=audiophile --attenuate=-15 -
	sleep 2
done
