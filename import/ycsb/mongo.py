import pymongo

class Mongo:

    def __init__(self, args):
        self._args = args
        self._db = pymongo.Connection(self._args.mongo, tz_aware=True).performance

    def insert_result(self, result):
        oid = self._db.results.insert(result._doc)
        print 'inserted result %s' % str(oid)
        return oid