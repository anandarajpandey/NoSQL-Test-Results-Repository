<?php
//A model that maps to the products collection
class Tags extends Phalcon\Mvc\Collection
{
  public function getSource()
  {
    return "tags";
  }
}