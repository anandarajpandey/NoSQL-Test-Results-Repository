<?php

class ApiController extends ControllerBase
{

    public function indexAction() {

    }

    public  function getColumnChartDataAction(){
        echo json_encode(Charts::getColumnChartData($_GET['tests'], $_GET['axes'], $_GET['group']));
        exit();
    }

    public function getResultsAction(){
        $formatted_results = array();
        $results = Results::find(array("conditions" => array("tags" => array('$all' => $_GET['tags']))));
        foreach($results as $result){
            $formatted_results[] = array(
                "id" => (string)$result->_id,
                "name" => $result->name,
                "throughput" => $result->result['throughput'],
                "read" => array("o" => $result->result['read']['ops'], "s" => $result->result['read']['successes']),
                "write" => array("o" => $result->result['write']['ops'], "s" => $result->result['write']['successes']),
            );
        }
        echo json_encode($formatted_results);
        exit();
    }

}

