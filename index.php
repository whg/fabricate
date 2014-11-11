<?php

if(isset($_GET['_escaped_fragment'])) {
    $frag = urldecode($_GET['_escaped_fragment']);
    if($frag == '') {
        exit(file_get_contents('snaps/static/crawl.html'));
    }
    else {
        $file = file_get_contents('snaps/'.$frag.'.html');
        if($file) exit($file);
        else exit(file_get_contents('snaps/static/page_not_found.html'));
    }
}
else { //person not machine
    exit(file_get_contents('snaps/static/index.html'));
}




?>