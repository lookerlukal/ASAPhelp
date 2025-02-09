<?php
$file = $_GET['file'];
if(preg_match('/\.inr$/i', $file)) {
    header('Content-Type: text/plain; charset=utf-8');
    readfile(urldecode($file));
    exit;
}
?> 