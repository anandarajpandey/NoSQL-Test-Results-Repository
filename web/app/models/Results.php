<?php
//A model that maps to the results collection
class Results extends Phalcon\Mvc\Collection
{
    public function getSource()
    {
        return "results";
    }
}