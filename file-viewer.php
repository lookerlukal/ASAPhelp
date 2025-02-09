<?php
$file = $_GET['file'];
if(preg_match('/\.INR$/', $file)) {
    header('Content-Type: text/plain');
    readfile($file);
}
?> 