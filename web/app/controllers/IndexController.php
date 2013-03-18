<?php

class IndexController extends ControllerBase
{

    public function indexAction()
    {
        $this->view->setVar("title", "NoSQL Test Results Repository");
    }

}

