<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$db = mysqli_connect('localhost', 'root', '', 'vayaterra') or die(mysqli_error($db));
mysqli_query($db,"SET NAMES UTF8") or die(mysqli_error($db));


?>