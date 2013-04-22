<?php
//A model that maps to the products collection
class Charts
{
    /**
     * @param $tests
     * @param string $axe
     * @param array $groups
     * @param null $type
     * @return array|bool return data for draw column chart
     */
    public static function getColumnChartData($tests, $axe = '', $groups = array(), $type = null){
        //$chartData = array();
        $data = array('tests' => array($axe), 'axe' => array());
        foreach($tests as &$test){
            $test = new MongoId($test);
        }
        unset($test);

        switch($axe){
            case 'throughput':
                if(!empty($groups) && count($groups) > 0){
                    $results = Results::find(array('conditions' => array('_id' => array('$in' => $tests))));
                    foreach($results as $result){
                        $data['tests'][] = $result->name;
                    };
                    foreach($groups as $group){
                        $gresults = Results::find(array('conditions' => array('_id' => array('$in' => $tests), 'tags' => array('$all' => array($group)))));
                        $throughputs = array($group);
                        foreach($results as $result){
                            $isset = false;

                            foreach($gresults as $gresult){
                                if($gresult->name == $result->name){
                                    $isset = $gresult->result['throughput'];
                                }
                            }
                            $throughputs[] = $isset ? $isset : 0;
                        }

                        $data['axe'][] = $throughputs;
                    }
                    $return = array($data['tests']);
                    foreach($data['axe'] as $value){
                        $return[] = $value;
                    }
                    return $return;
                }else{
                    $data['axe'] = array($axe);
                    $results = Results::find(array('conditions' => array('_id' => array('$in' => $tests))));
                    foreach($results as $result){
                        $data['tests'][] = $result->name;
                        $data['axe'][] = $result->result['throughput'];
                    }
                    return array($data['tests'], $data['axe']);
                }
                break;
            case 'latency':
                $data['tests'] = array($type.' '.$axe);
                if(!empty($groups) && count($groups) > 0){
                    $results = Results::find(array('conditions' => array('_id' => array('$in' => $tests))));
                    foreach($results as $result){
                        $data['tests'][] = $result->name;
                    };
                    foreach($groups as $group){
                        $gresults = Results::find(array('conditions' => array('_id' => array('$in' => $tests), 'tags' => array('$all' => array($group)))));
                        $throughputs = array($group);
                        foreach($results as $result){
                            $isset = false;

                            foreach($gresults as $gresult){
                                if($gresult->name == $result->name){
                                    $isset = $gresult->result[$type]['latency']['avg'];
                                }
                            }
                            $throughputs[] = $isset ? $isset : 0;
                        }

                        $data['axe'][] = $throughputs;
                    }
                    $return = array($data['tests']);
                    foreach($data['axe'] as $value){
                        $return[] = $value;
                    }
                    return $return;
                }else{
                    $data['axe'] = array($type.' '.$axe);
                    $results = Results::find(array('conditions' => array('_id' => array('$in' => $tests))));
                    foreach($results as $result){
                        $data['tests'][] = $result->name;
                        $data['axe'][] = $result->result[$type]['latency']['avg'];
                    }
                    return array($data['tests'], $data['axe']);
                }
                break;
            default:
                return false;
        }

    }
}