<?php

class ApiController extends ControllerBase
{

    public function indexAction() {

    }

    public  function getColumnChartDataAction(){
        echo json_encode(array("test"=>"1"));
        exit();
    }

}

