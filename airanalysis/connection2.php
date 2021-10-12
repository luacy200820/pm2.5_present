<meta http-equiv = "Content-Type" content="text/html ; charset=utf-8"/>

<?php

$db_server = 'localhost';
$db_name = 'db_show_day';
$db_user = 'root';
$db_passwd ='mtes';

//對資料庫連線
$db = mysqli_connect($db_server, $db_user , $db_passwd, $db_name);
if (mysqli_connect_error($db))
	echo "無法連線" .mysqli_connect_error();

//資料庫連線採UTF8
mysqli_set_charset($db,'utf-8');

//選擇資料庫
if (!@mysqli_select_db($db,'db_show_day'))
	die("無法使用資料庫")

?>
