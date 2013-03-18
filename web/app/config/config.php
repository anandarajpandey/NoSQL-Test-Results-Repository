<?php

include "config.loc.php";

$config['application'] = array(
    'controllersDir' => __DIR__ . '/../../app/controllers/',
    'modelsDir'      => __DIR__ . '/../../app/models/',
    'viewsDir'       => __DIR__ . '/../../app/views/',
    'pluginsDir'     => __DIR__ . '/../../app/plugins/',
    'libraryDir'     => __DIR__ . '/../../app/library/',
    'baseUri'        => '/web/',
);
$config['models'] = array(
    'metadata' => array(
        'adapter' => 'Memory'
    )
);


return new \Phalcon\Config($config);
