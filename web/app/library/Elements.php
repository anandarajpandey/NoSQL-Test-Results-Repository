<?php

class Elements extends Phalcon\Mvc\User\Component
{

    function getMenu()
    {
        $menu  = array(
            array('caption' => 'About', 'url' => '/' ),
            array('caption' => 'Latest tests', 'url' => '/results' ),
            array('caption' => 'Search tests', 'url' => '/results/search' ),
            array('caption' => 'Help me', 'url' => '/help' ),
        );
        foreach($menu as &$item){
            if($item['url'] == $_GET['q']){
                $item['current'] = true;
            }
        }
        unset($item);
        return $menu;
    }

}