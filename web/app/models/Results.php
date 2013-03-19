<?php
//A model that maps to the products collection
class Results extends Phalcon\Mvc\Collection
{
    public function getSource()
    {
        return "results";
    }
}