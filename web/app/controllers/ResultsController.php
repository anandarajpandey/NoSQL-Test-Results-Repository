<?php

class ResultsController extends ControllerBase
{

    public function indexAction()
    {
        $this->view->setVar("title", "NoSQL Test Results Repository");

        $tags_collection = Tags::findFirst();
        $tags = $tags_collection->tags;
        $this->view->setVar("tags", $tags);

        $results = array();
        $results_resourse = Results::find(array("limit" => 10, "sort" => array("datetime" => 1)));
        foreach($results_resourse as $result){
            $results[] = $result;
        }
        $this->view->setVar("results", $results);
    }

    public function searchAction(){
        $this->view->setVar("title", "Search tests results");
    }

}

