import pymongo

class Mongo:

    def __init__(self, args):
        self._args = args
        self._db = pymongo.Connection(self._args.mongo, tz_aware=True).performance

    def update_tags(self, result):
        tagsdoc = self._db.tags.find_one()
        if not tagsdoc:
            tagsdoc = { 'tags': [], 'prefixes': [] }
        tagsdoc['tags'] = list(set(tagsdoc['tags']).union(result.tags()))
        tagsdoc['prefixes'] = list(set(tagsdoc['prefixes']).union(result.tag_prefixes()))
        self._db.tags.save(tagsdoc)
        print 'updated tags'

    def insert_result(self, result):
        oid = self._db.results.insert(result.resultdoc())
        print 'inserted result %s' % str(oid)
        return oid