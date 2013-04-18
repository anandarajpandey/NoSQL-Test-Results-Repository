<?php
//A model that maps to the products collection
class Charts
{
    /**
     * @param array $tests
     * @param string $axe
     * @param array $group
     * @return array $chartData
     * return data for draw column chart
     */
    public static function getColumnChartData($tests, $axe = '', $group = array()){
        //$chartData = array();
        $data = array();
        if($axe == 'throughput'){
            $data[] = array('Test', $axe);
        }else{
            $data[] = array('Test', 'Read latency', 'Write latency');
        }

        foreach($tests as $test_id){
            $result = Results::findById($test_id)->toArray();
            if($axe == 'throughput'){
                $data[] = array($result['name'],$result['result']['throughput']);
            }else{
                $data[] = array($result['name'],$result['result']['read']['latency']['avg'],$result['result']['write']['latency']['avg']);
            }

        }
        return $data;
    }
}