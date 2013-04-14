#   YCSB to MongoDB import tool
#   Copyright (C) 2013 Thumbtack Technology Inc.
#
#   This program is free software: you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation, either version 3 of the License, or
#   (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
#
#   You should have received a copy of the GNU General Public License
#   along with this program.  If not, see <http://www.gnu.org/licenses/>.

import os
import re
import datetime

from results import Result


def avg(seq):
    return sum(seq) / float(len(seq))

def same(x):
    return x

def scale1k(x):
    return x / 1000.0


# each string is inherently a regex, and those regexes should be mutually
# exclusive. The order of putting items in fold_functions defines the order
# of columns
fold_functions = {}
fold_functions['RunTime']               = max, same
fold_functions['Throughput']            = sum, same
fold_functions['Operations']            = sum, same
fold_functions['Retries']               = sum, same
fold_functions['Return=0']              = sum, same
fold_functions['Return=[^0].*']         = sum, same
fold_functions['AverageLatency']        = avg, scale1k
fold_functions['MinLatency']            = min, scale1k
fold_functions['MaxLatency']            = max, scale1k
fold_functions['95thPercentileLatency'] = max, same
fold_functions['99thPercentileLatency'] = max, same
metrics = fold_functions.keys()
# specify order and columns for the operation codes
overall_metrics = ['RunTime', 'Throughput']
other_metrics = [x for x in metrics if x not in overall_metrics]
operations = {}
operations['OVERALL'] = overall_metrics
operations['INSERT']  = other_metrics
operations['READ']    = other_metrics
operations['UPDATE']  = other_metrics
operations['CLEANUP']  = other_metrics


# special wrapper over dict to get rid of
# silly defensive ifs like
#    oc = ... # operation code
#    if not(oc in stats):
#        stats[oc] = {}
#    if not(mt in stats[oc]):
#        stats[oc][mt] = {}
#    # now it is safe to access
#    stats[oc][mt][cn] = float(m1.group(3))
class NestedDict(dict):
    def __getitem__(self, key):
        if key in self: return self.get(key)
        return self.setdefault(key, NestedDict())


def total(metric_values, metric):
    try:
        return fold_functions[metric][0](metric_values[metric].values())
    except ValueError:
        return None # eg max on empty seq

def one(metric_values, metric, client):
    try:
        result = metric_values[metric][client]
        return result or 0.0
    except ValueError:
        return 0.0

def get_metric(metric_values, metric, client=None):
    if client:
        return one(metric_values, metric, client)
    else:
        return total(metric_values, metric)

#def phorm(operations, stats, title, aggregate):
#    row = [title]
#    ops_keys = operations.keys()
#    for operation, metrics_values in sorted(stats.items(), key=lambda x: ops_keys.index(x[0])):
#        for metric in operations[operation]:
#            row.append(aggregate(metrics_values, metric))
#    return row

def parse_results(args, result):
    """grabs all *.out, extract statistics from there and merge into result"""
    ##ops_keys = operations.keys()
    regexps = map(re.compile, metrics)
    # trying each regexp for each line is TERRIBLY slow, therefore
    # we need to obtain searchable prefix to make preprocessing
    prefixes = map(lambda mt: str(re.search('\w+', mt).group(0)), metrics)
    # other stuff
    stats = NestedDict()
    clients = []
    items = sorted(filter(lambda x: str(x).endswith('.out'), os.listdir(args.path)))
    pcn = re.compile(r'.*?-c(\d)\.out')
    pln = re.compile(r'\[(\w+)\], (.*?), (\d+(\.\d+)?([eE]\d+)?)')
    # gather stats from all files=items
    for item in items:
        print 'reading %s' % item
        with open(os.path.join(args.path, item)) as file:
            m0 = pcn.search(item)
            if m0:
                client = m0.group(1)
                clients.append(client)
                for line in file:
                    for i in range(len(prefixes)):
                        pr = prefixes[i]
                        if pr in line:
                            m1 = (regexps[i]).search(line)
                            m2 = pln.search(line)
                            if m1 and m2:
                                operation = m2.group(1) # operation code
                                # cl = m2.group(2) # column
                                metric = metrics[i]
                                transform = fold_functions[metric][1]
                                if stats[operation][metric][client]:
                                    stats[operation][metric][client] += transform(float(m2.group(3)))
                                else:
                                    stats[operation][metric][client] = transform(float(m2.group(3)))
    # stats is the dictionary like this:
    #OVERALL RunTime {'1': 1500.0, '3': 2295.0, '2': 1558.0, '4': 2279.0}
    # ...
    #UPDATE Return=1 {'1': 477.0, '3': 488.0, '2': 514.0, '4': 522.0}
    #print stats
    resultdoc = result.resultdoc()
    resultdoc['result']['runtime'] = total(stats['OVERALL'], 'RunTime')
    resultdoc['result']['throughput'] = total(stats['OVERALL'], 'Throughput')
    resultdoc['result']['read'] = operation_stats(stats['READ'])
    resultdoc['result']['write'] = operation_stats(stats['UPDATE'])
    client_results = []
    for client in sorted(clients):
        client_results.append(client_stats(stats, client))
    resultdoc['clients'] = client_results
    #TODO inserts on load phase

def operation_stats(metrics_values, client=None):
    stats = {}
    stats['ops'] = get_metric(metrics_values, 'Operations', client)
    stats['retries'] = get_metric(metrics_values, 'Retries', client)
    stats['successes'] = get_metric(metrics_values, 'Return=0', client)
    stats['failures'] = get_metric(metrics_values, 'Return=[^0].*', client)
    latency = stats['latency'] = {}
    latency['avg'] = get_metric(metrics_values, 'AverageLatency', client)
    latency['min'] = get_metric(metrics_values, 'MinLatency', client)
    latency['max'] = get_metric(metrics_values, 'MaxLatency', client)
    latency['p95'] = get_metric(metrics_values, '95thPercentileLatency', client)
    latency['p99'] = get_metric(metrics_values, '99thPercentileLatency', client)
    return stats

def client_stats(stats, client):
    resultdoc = { 'result': {} }
    resultdoc['result']['runtime'] = one(stats['OVERALL'], 'RunTime', client)
    resultdoc['result']['throughput'] = one(stats['OVERALL'], 'Throughput', client)
    resultdoc['result']['read'] = operation_stats(stats['READ'], client)
    resultdoc['result']['write'] = operation_stats(stats['UPDATE'], client)
    return resultdoc

if __name__=='__main__':
    import pprint
    class DummyArgs:
        def __getattr__(self, item):
            if item == 'path':
                return '.'
            if item == 'time':
                return datetime.datetime.now()
            return None
    args = DummyArgs()
    result = Result(args)
    parse_results(args, result)
    print pprint.pprint(result.resultdoc())
