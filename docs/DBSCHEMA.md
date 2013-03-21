Entities
========

![Database entities](http://plantuml.com:80/plantuml/img/dLInRjim4DqD-1y8ZKKJe6ks8gsH8OK1oq26eWD3NMJ24aKSJpPSm_zUag9CKfKwT974k-FZktUFqbmSUGsiG31zGwPWr_LglH8DDuRjmT3EnrsKiOeJa6p1VIi-l8dNnhsnLsEA3jZrzK7tv1F0AtQzkSypIWB_VOk7F3SI54sF-c-u4l04E8NBCGGN1tYHv8bNqXpV75Af0QeCQoCR2Fil6hAKEw048gbgCvICWdGQa9Fib4TtJRpALjAW5TP0-uoBL0QGTcw7M_RQYNnVkcx3mX_k7tgS6QYJn4wrLhzySDzZ8l3tKqhuV-F4BVz0lM_V0RSVEn0TLiCuGJTI-3usN527CoAxpHD9DcXLE7TuJ6LZp1ORYpGpzmc6e_NE3SJalq7o-dmWtXxFTWxI42XnUOKJDAEeVyTdK6ERSRnt5ZEcoFVbR7PVVpIZ3xp_Ilaxt_t2iJfp38uJkj-7nkrGm0GCutSDhZLFxEVLaVZCNFZsAuFRbel4EOg3rKPGZpvbpboN0VZ3UjvSh3AjYLVBFv8xLNmgsCC3AxuKgTMMIjAxue1IToObT-_CL3m-MhXXo4lPGVHPz63szIhOoeP7iTFOjanNkRMMCx6pO9SCFSOSUbpbLbdEfBebwav5YQcHQ5wSDp41iYZkJxTunFINEhBDY_DEve_u0m00)

Frequency of changes
====================

Below is the prediction of frequency of changes for each entity above. This information is used to normalize the database.

entity                  | frequency
------------------------|--------------------------------------------------------
TestResult              | 1 for 1 test
TestFramework           | 1 for 1000 of tests
TestSettings            | 1 for 10 of tests
ClientTestResult        | 8 for 1 test
ServerTestResult        | 4 for 1 test
File                    | 24 for 1 test
DatabaseClient          | 1 for 100 of tests
DatabaseClientSettings  | 1 for 10 of tests
Hardware                | 1 for 1000 of tests
OS                      | 1 for 1000 of tests
DatabaseServer          | 1 for 100 of tests
DatabaseServerSettings  | 1 for 10 of tests
Client                  | 1 for 10 of tests (aggregated from underlying entities)
Server                  | 1 for 10 of tests (aggregated from underlying entities)


The tags
========

Each OS, each database has it’s own set of parameters which can be tuned. It’s not possible to predict the whole set of parameters which can appear for the (new) database. So the database schema must be flexible to allow to enter any number of any parameters, but at the same time to allow effectively search over all of such parameters.

And the system should be able to recognize any new set of parameters as a new dimensions to filter or aggregate the results.

The solution to achieve this behaviour is using of the tags. Tags for every valuable parameter and for any valuable group of parameters.

This approach is used on Google Code Issue Tracker (and not only Issue Tracker). Each issue has only limited set of predefined properties, while all other properties are defined as labels. And the system knows that each new unique label prefix gives one new dimension to group the issues.

So the tags should be used by the system to search and group the results. But any actual data (as any formatted string) can be stored too.

Examples
--------

Hardware
--------

    CPUType-Xeon
    CPUFrequency-1_5GHz
    Cores-8
    Cores-gt4
    Threads-8
    RAMSize-32GB
    RAMSize-gt8GB
    Network-Gigabit
    NetworkMultiqueue-8

OS
---

    Family-Ubuntu
    Family-Linux
    Version-12.04
    Version-LTS
    Filesystem-Ext4
    RAID-0
    RAID-Software
    RAIDDisks-4
    NetworkInterrupts-DistributedOnCores

Database
--------

    Name-Aerospike
    Version-2.1.2
    Records-500M
    Mode-SSD
    SSDs-4
    ReplicationFireAndForget
    Replication-Async

Collections
===========

Names
-----

Database: **performance**

Test results collection: **results**

Performance results collection (obligatory fields)
----------------------------------

This is the main collection used everywhere (from UI). So it should be strongly defined. Here is the definition.

    {
        _id: ObjectId
        datetime: date		# timestamp when the test was performed
        name: string
        tags: [ string, ... ]	# ALL tags applicable for this test
        result: {
            runtime: int64				# test runtime in ms
            throughput: double			# test throughput in ops/sec
            read {
                ops: int64				# read operations performed
                retries: int64			# retries done
                successes: int64		# no of success operations
                failures: int64			# no of failed operations
                latency: {
                    avg: double			# average latency
                    min: double			# minimal latency
                    max: double			# maximal latency
                    95p: double			# 95 percentile latency
                    99p: double			# 99 percentile latency
                }
            }
            write {
                ops: int64				# write operations performed
                retries: int64			# retries done
                successes: int64		# no of success operations
                failures: int64			# no of failed operations
                latency: {
                    avg: double			# average latency
                    min: double			# minimal latency
                    max: double			# maximal latency
                    95p: double			# 95 percentile latency
                    99p: double			# 99 percentile latency
                }
            }
        }
    }

---

Test results collection
---

This draft is incomplete. The main question (suddenly, for Mongo) is how to normalize it. For example, OS and hardware are rarely changed between the tests, where can be hundreds of tests on the same hardware. So, this entities should be entered once and only referred. But number of records in the database, consistency settings, number of operations can be individual for each test. I.e. the next step should be to separate mostly constant and frequently changing data to optimize the DB structure.

    {
        _id: ObjectId
        datetime: date					# timestamp when the test was performed
        test {
            framework: {
                name: string			# test framework name, for example "YCSB"
                version: string			# test framework version
                buildtime: date			# date of the latest build
                tags: [string, ...]		# test framework tags
            }
            workload: {
                name: string			# name of the workload
                description: string		# description of the workload
                ops: int64				# expected number of operations
                readRatio: double		# ratio of read operations
                writeRatio: double		# ratio of write operations
                tags: [string, ...]		# test workload tags
            }
        }
        servers: [						# array of server's info
            {
                hardware {
                    ...
                }
                os {
                    ...
                }
                database {
                    ...
                }
                result: {
                    files: [fileref, ...]		# references to files
                }
            }, ...
        ]
        clients: [						# array of clients's info
            {
                hardware {
                    ...
                }
                os {
                    ...
                }
                database {
                    ...
                }
                result: {
                    runtime: int64		# test runtime on the client
                    throughput: double	# test throughput in ops/sec
                    ...
                    files: [fileref, ...]		# references to files
                }
            }, ...
        ]
        result: {
            runtime: int64				# test runtime in ms
            throughput: double			# test throughput in ops/sec
            read {
                ops: int64				# read operations performed
                retries: int64			# retries done
                successes: int64		# no of success operations
                failures: int64			# no of failed operations
                latency: {
                    avg: double			# average latency
                    min: double			# minimal latency
                    max: double			# maximal latency
                    95p: double			# 95 percentile latency
                    99p: double			# 99 percentile latency
                    distribution: [		# array of latency distribution intervals
                        {
                            end: double	# right open endpoint of the interval
                            ops: int64	# number of ops in the interval
                        }
                    ]
            }
            write {
                ops: int64				# write operations performed
                retries: int64			# retries done
                successes: int64		# no of success operations
                failures: int64			# no of failed operations
                ...
            }
            files: [fileref, ...]		# references to files attached to the test
        }
    }


