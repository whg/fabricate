<?php
error_reporting(E_ERROR);

if(isset($_GET['_escaped_fragment'])) {
    $frag = urldecode($_GET['_escaped_fragment']);
    if($frag == '') {
        exit(file_get_contents('static/crawl.html'));
    }
    else {
        $file = file_get_contents(''.$frag.'.html');
        if($file) exit($file);
        else exit(file_get_contents('static/page_not_found.html'));
    }
}
else { //person not machine
    exit(file_get_contents('static/index.html'));
}

?>