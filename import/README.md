YCSB to MongoDB import tool
===========================

How it works
------------

This command line tool looks over the directory for .out files created by YCSB, extracts key metrics from them, aggregates metrics from multiple clients, produces a document and inserts it into MongoDB.

All the files from the directory are placed to Mongo's GridFS to be accosiated to the test and be accessible from the Web UI.

Each test has a timestamp (within the specified timezone), a name, a set of metrics, tags, reference to an environment and references to the files.

The enrironment is just a harware, OS and database description (a Mongo document), which is common for a series of tests. It has it's own tags which are copied to the test on insertion.
For the first test in the series for the same enviroment the environment should be defined as a JSON file. The following series tests can refer to the enviroment by it's document ID.

Also the tags can be added from a command line or from a file (each tag on a line).

Requirements
------------

* Python 2.7
* pymongo 2.2

Usage
-----

    usage: ycsb_import [-h] [--time [TIME]] [--time-zone [TIME_ZONE]] [-n [NAME]]
                       [-t [TAG [TAG ...]]] [--tags-file [TAGS_FILE]] [-e [ENV_ID]
                       | --env-file [ENV_FILE]] [--no-files] [--mongo [MONGO]]
                       [path]

    Imports YCSB .out files into MongoDB

    positional arguments:
      path                  path to directory with .out and other files

    optional arguments:
      -h, --help            show this help message and exit
      --time [TIME]         datetime of the test run in YYYY-MM-DDTHH:MM:SS format
      --time-zone [TIME_ZONE]
                            timezone for datetime
      -n [NAME], --name [NAME]
                            human-readable name of the test
      -t [TAG [TAG ...]], --tag [TAG [TAG ...]]
                            tag to add to the test result (use multiple times)
      --tags-file [TAGS_FILE]
                            read tags from the file, each tag in a line
      -e [ENV_ID], --env-id [ENV_ID]
                            id of the environment
      --env-file [ENV_FILE]
                            json file for the new environment
      --no-files            don't copy files from path to GridFS
      --mongo [MONGO]       mongoDB connection URI

Example
-------

    $ ls
    2012-12-27_22-38_mongodb_workloadb-c1.err  2012-12-27_22-38_mongodb_workloadb-c4.err  2012-12-27_22-38_mongodb_workloadb-c7.err
    2012-12-27_22-38_mongodb_workloadb-c1.out  2012-12-27_22-38_mongodb_workloadb-c4.out  2012-12-27_22-38_mongodb_workloadb-c7.out
    2012-12-27_22-38_mongodb_workloadb-c2.err  2012-12-27_22-38_mongodb_workloadb-c5.err  2012-12-27_22-38_mongodb_workloadb-c8.err
    2012-12-27_22-38_mongodb_workloadb-c2.out  2012-12-27_22-38_mongodb_workloadb-c5.out  2012-12-27_22-38_mongodb_workloadb-c8.out
    2012-12-27_22-38_mongodb_workloadb-c3.err  2012-12-27_22-38_mongodb_workloadb-c6.err  tags.txt
    2012-12-27_22-38_mongodb_workloadb-c3.out  2012-12-27_22-38_mongodb_workloadb-c6.out

    $ ~/work/NoSQL-Test-Results-Repository/import/ycsb_import --time 2012-12-27T22-38 --time-zone US/Pacific \
        -n "MongoDB, Async, SSD, Mostly Read" --tags-file tags.txt \
        --env-file ~/work/NoSQL-Test-Results-Repository/import/test/env_xeon_ssd_mongodb_async.json
    2012-12-27_22-38_mongodb_workloadb-c1.err is stored as 51724b7f137a002c2a000000
    2012-12-27_22-38_mongodb_workloadb-c1.out is stored as 51724b8c137a002c2a000002
    2012-12-27_22-38_mongodb_workloadb-c2.err is stored as 51724b8d137a002c2a000004
    2012-12-27_22-38_mongodb_workloadb-c2.out is stored as 51724b8e137a002c2a000006
    2012-12-27_22-38_mongodb_workloadb-c3.err is stored as 51724b90137a002c2a000008
    2012-12-27_22-38_mongodb_workloadb-c3.out is stored as 51724b91137a002c2a00000a
    2012-12-27_22-38_mongodb_workloadb-c4.err is stored as 51724b92137a002c2a00000c
    2012-12-27_22-38_mongodb_workloadb-c4.out is stored as 51724b92137a002c2a00000e
    2012-12-27_22-38_mongodb_workloadb-c5.err is stored as 51724b93137a002c2a000010
    2012-12-27_22-38_mongodb_workloadb-c5.out is stored as 51724b94137a002c2a000012
    2012-12-27_22-38_mongodb_workloadb-c6.err is stored as 51724b96137a002c2a000014
    2012-12-27_22-38_mongodb_workloadb-c6.out is stored as 51724b97137a002c2a000016
    2012-12-27_22-38_mongodb_workloadb-c7.err is stored as 51724b98137a002c2a000018
    2012-12-27_22-38_mongodb_workloadb-c7.out is stored as 51724b99137a002c2a00001a
    2012-12-27_22-38_mongodb_workloadb-c8.err is stored as 51724b9a137a002c2a00001c
    2012-12-27_22-38_mongodb_workloadb-c8.out is stored as 51724b9c137a002c2a00001e
    tags.txt is stored as 51724b9d137a002c2a000020
    reading environment from /home/gelin/work/NoSQL-Test-Results-Repository/import/test/env_xeon_ssd_mongodb_async.json
    inserted environment 51724b9e137a002c2a000022
    reading tags from tags.txt
    reading 2012-12-27_22-38_mongodb_workloadb-c1.out
    reading 2012-12-27_22-38_mongodb_workloadb-c2.out
    reading 2012-12-27_22-38_mongodb_workloadb-c3.out
    reading 2012-12-27_22-38_mongodb_workloadb-c4.out
    reading 2012-12-27_22-38_mongodb_workloadb-c5.out
    reading 2012-12-27_22-38_mongodb_workloadb-c6.out
    reading 2012-12-27_22-38_mongodb_workloadb-c7.out
    reading 2012-12-27_22-38_mongodb_workloadb-c8.out
    updated tags
    inserted result 51724b9e137a002c2a000023
