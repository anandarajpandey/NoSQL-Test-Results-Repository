<?php
//A model that maps to the products collection
class Charts
{
    /**
     * @param array $tests
     * @param array $axes
     * @param array $group
     * return data for draw column chart
     */
    public static function getColumnChartData($tests, $axes = array(), $group = array()){
        $chartData = array();
        $results = Results::find(array('$nin' => $tests));
        foreach($results as $result){
            //todo format response
        }
    }
}