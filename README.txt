�������� ���� ������ http://4pda.ru/forum/index.php?showtopic=731903 
� ������� ������, ������ ��� ��������� ��������� ������ �� ���� �����������, ������� ��������� ����/����, ����������� ���������.

Wi Fi �����, ���������� �������� ����������� online ����� ������� ��� ������������� ���������� ��� ���������� ��������. 
������������ ��������� ������, � ���� ������ ��� ������� ���������������� ��������� ������ � ����������� � HAME MPR-A1

http://ru.aliexpress.com/item/CEL-Mini-3G-4G-WiFi-Wlan-Hotspot-AP-Client-150Mbps-RJ45-USB-Wireless-Router-DEC10/32566084078.html?spm=2114.10010208.100005.1.6eYV53&isOrigTitle=true 

� �������� ����� � ���� �� ��� �� ������� ����� �������� ����� 
http://ru.aliexpress.com/item/New-2014-USB-3D-Sound-Card-Mic-Speaker-Audio-Interface-Adapter-Virtual-7-1-Channel-for/1892350790.html



� �������� ����� ������������� ����� ������ �������������� openWrt



!��������� �������� �����������.
����� ���� ��������� ������ � ������ wifi �������. 
������������� � �������������� ������� ����� ����������� �� ������, ssh ��� �� ��������, ����������� ����� � ������� putty, ip �� ��������� �� LAN 192.168.1.1
����� ����������� ������������� ������ ��� �������� ������������ �������� passwd. ����� ������������ ���������� ������ ������ �� ����� ��������, �� �������� ������ �� ssh.

� ����� connect_settings ����� ������� ������ ��������� ������� ����������� network � wireless.
�� ���������� ��� ���������������� ����� ��������� � etc/config . ���� ��� ����� � ��������  linux �� ������������� ����������� � ������ ������� ����� ��������� ��������� WinSCP. 
� ����� network, ������������� wan � lan ���������� � ��������� �������

config interface 'lan'
	
	option ifname 'eth0.1'
	
	option force_link '1'
	
	option type 'bridge'
	
	option proto 'static'
	
	option netmask '255.255.255.0'
	
	option ip6assign '60'
	
	option macaddr '2e:67:fb:53:f4:2c'
	
	option ipaddr '192.168.100.101' //� ���� ������ ip �� lan ��������� ��������

��������� ������������� ���������� 

config interface 'wwan'
	
	option _orig_ifname 'wlan0'
	
	option _orig_bridge 'false'
	
	option proto 'static'
	
	option ipaddr '192.168.1.98'
	//� ���� ������ ip ����� 
	option netmask '255.255.255.0'
	
	option gateway '192.168.1.1'
	//���� ����� ������� �������� �������� (ip ����� ������������� ������� ����� ������� �������� � ��������)
	option dns '8.8.8.8' //���� dns


��������� ����������� ����������� wi fi. ���� wireless


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
// SSID ������������ ���� � ������� �� �������������
	option encryption 'psk2' //�������� ����������
 
 	option device 'radio0'

	option mode 'sta'

	option bssid '54:E6:FC:DC:A0:48'

	option key '1234111233' //���� ��� ������� � ������������ ����

����� ������������ ������� � ������� �������� ping �������� www.mail.ru ������� �������� � ���������� ��������� �����������.

!��������� ������������� �����.
���������� ����� radio ����������� � ������� WinSCP �� ������. ����� ����� ���������� ����������� ����� �� �����

chmod 755 /etc/init.d/webradio
chmod 755 /www/cgi-bin/webradio/items.cgi
chmod 755 /www/cgi-bin/webradio/update.cgi
chmod 755 /www/scripts/getstreammeta.sh
chmod 755 /www/scripts/playback.sh
chmod 755 /www/scripts/playstream.sh
chmod 755 /www/scripts/stopstream.sh
chmod 755 /www/scripts/streamcontrol.sh
chmod 755 /www/scripts/webradio.sh

�������� ����� � ������������ 

/etc/init.d/webradio enable

��������� ������������ ��������� �������� reboot

����� ����� �� ������� � ���� ������ 192.168.1.98 ������ �������� ��� ��������� � ����� �������� �����������
 






