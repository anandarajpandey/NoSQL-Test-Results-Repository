<?php

class HelpController extends ControllerBase
{

    public function indexAction()
    {
        $this->view->setVar("title", "Help me");
    }

}