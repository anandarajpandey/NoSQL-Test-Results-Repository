<?php

class ApiController extends ControllerBase
{

    public function indexAction() {

    }

    public  function getColumnChartDataAction(){
        echo json_encode(Charts::getColumnChartData($_GET['tests'], $_GET['axes'], $_GET['group']));
        exit();
    }

    public function getResults(){

    }

}

