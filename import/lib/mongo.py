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