Внимание софт отсюда http://4pda.ru/forum/index.php?showtopic=731903 
я поменял дизайн, теперь веб интерфейс смотрится хорошо на всех устройствах, добавил фунционал стоп/плей, регулировку громкости.

Wi Fi радио, устройство способно проигрывать online радио станции без использования компьютера или мобильного телефона. 
Используется мобильный роутер, в моем случае это дешевый ультракомпактный мобильный роутер с алиэкспресс в HAME MPR-A1

http://ru.aliexpress.com/item/CEL-Mini-3G-4G-WiFi-Wlan-Hotspot-AP-Client-150Mbps-RJ45-USB-Wireless-Router-DEC10/32566084078.html?spm=2114.10010208.100005.1.6eYV53&isOrigTitle=true 

и звуковая карта с того же али за полтора бакса например такая 
http://ru.aliexpress.com/item/New-2014-USB-3D-Sound-Card-Mic-Speaker-Audio-Interface-Adapter-Virtual-7-1-Channel-for/1892350790.html



В принципе может использоватся любой роутер поддерживающий openWrt



!Настройка сетевого подключения.
Стоит цель настроить роутер в режиме wifi клиента. 
Первоначально к свежепрошитому роутеру можно подключится по телнет, ssh еще не работает, подключится можно с помощью putty, ip по умолчанию на LAN 192.168.1.1
После подключения устанавливаем пароль для текущего пользователя командой passwd. После перезагрузки устройства телнет больше не будет работать, но появится доступ по ssh.

В папке connect_settings лежит образцы файлов настройки сетевых интерфейсов network и wireless.
На устройстве эти конфигурационные файлы находятся в etc/config . Если нет опыта с консолью  linux то безболезненно перемещатся и праить конфиги можно используя программу WinSCP. 
В файле network, настраивается wan и lan интерфейсы в следующих строках

config interface 'lan'
	
	option ifname 'eth0.1'
	
	option force_link '1'
	
	option type 'bridge'
	
	option proto 'static'
	
	option netmask '255.255.255.0'
	
	option ip6assign '60'
	
	option macaddr '2e:67:fb:53:f4:2c'
	
	option ipaddr '192.168.100.101' //в моем случае ip на lan интерфесе следущий

настройка беспроводного интерфейса 

config interface 'wwan'
	
	option _orig_ifname 'wlan0'
	
	option _orig_bridge 'false'
	
	option proto 'static'
	
	option ipaddr '192.168.1.98'
	//в моем случае ip такой 
	option netmask '255.255.255.0'
	
	option gateway '192.168.1.1'
	//шлюз через который получаем интернет (ip адрес беспроводного роутера через который выходите в интернет)
	option dns '8.8.8.8' //гугл dns


Настройка парамметров безопасноти wi fi. Файл wireless


config wifi-device 'radio0'

	option type 'mac80211'

	option hwmode '11g'
	
	option path '10180000.wmac'
	
	option htmode 'HT20'

	option disabled '0'
	
	option channel '6'
	
	option txpower '20'
	
	option country '00'4



config wifi-iface
	
	option network 'wwan'
	
	option ssid 'default'
// SSID беспроводной сети к которой вы подключаетесь
	option encryption 'psk2' //механизм шифрования
 
 	option device 'radio0'

	option mode 'sta'

	option bssid '54:E6:FC:DC:A0:48'

	option key '1234111233' //ключ для доступа к беспроводной сети

После перезагрузки роутера в консоли командой ping например www.mail.ru следует убедится в правильной настройке интерфейсов.

!Настройка беспроводного радио.
Содержимое папки radio скопировать с помощью WinSCP на роутер. После этого установить необходимые права на файлы

chmod 755 /etc/init.d/webradio
chmod 755 /www/cgi-bin/webradio/items.cgi
chmod 755 /www/cgi-bin/webradio/update.cgi
chmod 755 /www/scripts/getstreammeta.sh
chmod 755 /www/scripts/playback.sh
chmod 755 /www/scripts/playstream.sh
chmod 755 /www/scripts/stopstream.sh
chmod 755 /www/scripts/streamcontrol.sh
chmod 755 /www/scripts/webradio.sh

включить радио в автозагрузку 

/etc/init.d/webradio enable

выполнить перезагрузку устройтва командой reboot

После этого по адрессу в моем случае 192.168.1.98 должен появится веб интерфейс и можно начинать пользоватся
 






