<?php
//A model that maps to the tags collection
class Tags extends Phalcon\Mvc\Collection
{
  public function getSource()
  {
    return "tags";
  }
}