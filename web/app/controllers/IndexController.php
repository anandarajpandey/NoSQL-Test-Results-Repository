<?php

class IndexController extends ControllerBase
{

    public function indexAction()
    {
        $this->view->setVar("title", "NoSQL Test Results Repository");

        $tags_collection = Tags::findFirst();
        $tags = $tags_collection->tags;
        $prefixes = $tags_collection->prefixes;
        $this->view->setVar("tags", $tags);
        $this->view->setVar("tags_prefixes", $prefixes);

        $results = array();
        $results_resourse = Results::find(array("limit" => 10, "sort" => array("datetime" => -1)));
        foreach($results_resourse as $result){
            $results[] = $result;
        }
        $this->view->setVar("results", $results);
    }

}

