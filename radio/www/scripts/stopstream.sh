#!/bin/ash

data_path="/www/data"

killall madplay
killall wget
killall playstream.sh
killall playback.sh
killall getstreammeta.sh

sleep 2

echo -n 0 > $data_path/curnetwork
echo -n "" > $data_path/curnetworkmeta