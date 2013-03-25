<?php

class IndexController extends ControllerBase
{

    public function indexAction()
    {
        $this->view->setVar("title", "NoSQL Test Results Repository");
        $tags = array();
        foreach(Tags::find() as $tag){
            $tags[] = $tag->name;
        }
        $this->view->setVar("tags", $tags);
    }

}

