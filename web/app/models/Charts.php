<?php
//A model that maps to the products collection
class Charts
{
    /**
     * @param array $tests
     * @param array $axes
     * @param array $group
     * @return array $chartData
     * return data for draw column chart
     */
    public static function getColumnChartData($tests, $axes = array(), $group = array()){
        //$chartData = array();
        $data = array();
        $data[] = array('Database', $axes[0]);
        foreach($tests as $test_id){
            $result = Results::findById($test_id)->toArray();
            $data[] = array($result['name'],$result['result']['throughput']);
        }
        return $data;
    }
}