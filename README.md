NoSQL Test Results Repository
=============================

Tool to collect YCSB performance test results into MongoDB.

Web UI to find, view and compare different test results and draw comparison charts.

Motivation
----------

[Thumbtack Technology](http://thumbtack.net/) done a series of performance tests with Yahoo! Cloud System Benchmark.
We got many results and don't want to lose them.

This tools is created to import raw results from YCSB log files into structured MongoDB storage, mark all the test with tags to be searchable, provide easy web access to the test results and draw comparison charts.

Later the tool can be extented to support not only performance but also failover tests, not only YCSB but other test tools.

For more details see [Intro presentation](https://docs.google.com/presentation/d/1rQuVmmD5XemGXKjdgTm4EEKCEREVNEEIoLVpTiHVLws/edit?usp=sharing).

Import
------

YCSB provides log files: stderr and stdout, for each client machine on which the YCSB was run.
It's required to extract key metrics from the stdout logs, to merge them together to get the total test metrics, to put the results to MongoDB.
Also each test has a set of additional files: a web console screenshots, a monitoring tool output - all such files should be stored to MongoDB too.
This is done by a Python command line tool.
Each test is marked by a huge amount of tags: for hardware, for OS, for database, for YCSB settings. These tags are used later to find necessary tests and to group tests results on charts.

Web UI
------

You can search, see details, draw comparison charts from Web UI written in Phalcon(PHP framework) and jQuery(javascript framework).
For example, see http://nosqltestrepo.dev.thumbtack.net

---

[Demo presentation](https://docs.google.com/presentation/d/1WZA73kh6dfPpaDj3ruhjVdXI2cLJm1HPp-mMo1V1ieE/edit?usp=sharing)
