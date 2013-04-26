<?php

class Charts
{

    private static $tests;
    private static $axe;
    private static $groups;
    private static $latency_type;
    private static $result_data;
    /**
     * @param $tests
     * @param string $axe
     * @param array $groups
     * @param null $latency_type
     * @return array|bool return data for draw column chart
     */
    public static function getColumnChartData($tests, $axe = '', $groups = array(), $latency_type = null){

        self::$result_data = array();
        self::$tests = $tests;
        self::$axe = $axe;
        self::$groups = $groups;
        self::$latency_type = $latency_type;

        self::$result_data = array('tests' => array($axe), 'axe' => array());
        foreach(self::$tests as &$test){
            $test = new MongoId($test);
        }
        unset($test);

        if($axe){
            return self::getColumnChartDataByType();
        }else{
            return false;
        }

    }

    private static function getColumnChartDataByType(){
        if(!empty(self::$groups) && count(self::$groups) > 0){
            $results = Results::find(array('conditions' => array('_id' => array('$in' => self::$tests))));
            foreach($results as $result){
                self::$result_data['tests'][] = $result->name;
            };
            foreach(self::$groups as $group){
                $gresults = Results::find(array('conditions' => array('_id' => array('$in' => self::$tests), 'tags' => array('$all' => array($group)))));
                $throughputs = array($group);
                foreach($results as $result){
                    $isset = false;

                    foreach($gresults as $gresult){
                        if($gresult->name == $result->name){
                            $isset = self::getParam($gresult);
                        }
                    }
                    $throughputs[] = $isset ? $isset : 0;
                }

                self::$result_data['axe'][] = $throughputs;
            }
            $return = array(self::$result_data['tests']);
            foreach(self::$result_data['axe'] as $value){
                $return[] = $value;
            }
            return $return;
        }else{
            self::$result_data['axe'] = array(self::$latency_type.' '.self::$axe);
            $results = Results::find(array('conditions' => array('_id' => array('$in' => self::$tests))));
            foreach($results as $result){
                self::$result_data['tests'][] = $result->name;
                self::$result_data['axe'][] = self::getParam($result);
            }
            return array(self::$result_data['tests'], self::$result_data['axe']);
        }
    }

    private static function getParam($collection){
        if(self::$axe == 'throughput'){
            return $collection->result['throughput'];
        }else{
            return $collection->result[self::$latency_type]['latency']['avg'];
        }
    }
}