#!/bin/ash
echo "Content-type: text/html"
echo ""

data_path="/www/data"
script_path="/www/scripts"

if [ "$REQUEST_METHOD" == "POST" ]; then
	QUERY_STRING=`cat -`

	mode=`echo "$QUERY_STRING" | sed -n 's/^.*mode=\([^&]*\).*$/\1/p'`
	params=`echo "$QUERY_STRING" | sed "s/%7C/\|/g" | sed "s/%22/\"/g" | sed "s/%5B/\[/g" | sed "s/\+/ /g" | sed "s/%2C/\,/g" | sed "s/%7D/\}/g" | sed "s/%5D/\]/g" | sed "s/%2F/\//g" | sed "s/%3A/\:/g" | sed "s/%28/\(/g" | sed "s/%29/\)/g"`
	
	if [ $mode == "network" ] ; then
	
		id=`echo "$params" | sed -n 's/^.*id=\([^&]*\).*$/\1/p' | sed -e 's/%0A//g'`
		action=`echo "$params" | sed -n 's/^.*action=\([^&]*\).*$/\1/p'`
		
		if [ $action == "remove" ] ; then
			item=`sed -n ${id}p $data_path/network`
			title=`echo $item | cut -d "|" -f 1 | sed -e "s/\~/+/g" | sed -f $data_path/translit.sed`
			
			if [ -f "$data_path/title/${title}.mp3" ]; then
				rm "$data_path/title/${title}.mp3"
			fi
		fi

		data=`echo "$params" | sed -n 's/^.*data=\([^&]*\).*$/\1/p' | sed -e "s/%3B/\n/g" | sed -f $data_path/urldecode.sed | sed -e 's/ /\~/g'`
		
		echo -n "" > $data_path/network
		for item in $data
		do
			echo $item >> $data_path/network
		done

		if [ $action == "add" ] ; then
			item=`sed -n ${id}p $data_path/network`
			title=`echo -e $item | cut -d "|" -f 1 | sed -e "s/\~/+/g"`
			file=`echo -e $title | sed -f $data_path/translit.sed`
			
			rand="$((0x$(hexdump -n 1 -ve '"%x"' /dev/urandom) % 1000))$((0x$(hexdump -n 1 -ve '"%x"' /dev/urandom) % 1000))|$((0x$(hexdump -n 1 -ve '"%x"' /dev/urandom) % 1000))$((0x$(hexdump -n 1 -ve '"%x"' /dev/urandom) % 1000))"			
			
			encoding=`echo "$params" | sed -n 's/^.*encoding=\([^&]*\).*$/\1/p'`
						
			wget -q -O "$data_path/title/${file}.mp3" -U Mozilla "http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&client=t&tl=${encoding}&tk=${rand}&q=${title}"
			
		fi
		
		current=`echo "$params" | sed -n 's/^.*current=\([^&]*\).*$/\1/p' | sed -e 's/%0A//g'`
		echo -n $current > $data_path/curnetwork

		$script_path/playstream.sh 1>/dev/null 2>&1 &
		
	elif [ $mode == "playnetwork" ] ; then
	
		id=`echo "$params" | sed -n 's/^.*id=\([^&]*\).*$/\1/p' | sed -e 's/%0A//g'`
		echo -n $id > $data_path/curnetwork

		$script_path/playstream.sh 1>/dev/null 2>&1 &
	
	fi
  	
  	if [ $mode == "stopnetwork" ] ; then
									
			killall madplay 
			killall wget
			killall playstream.sh
			killall playback.sh
			killall getstreammeta.sh
			
	fi

	if [ $mode == "volCntrl" ] ; then 
		action=`echo "$params" | sed -n 's/^.*action=\([^&]*\).*$/\1/p'`
		
			`amixer -c 0 sset Speaker Playback Volume $action`	
			
	fi	
fi

echo ok