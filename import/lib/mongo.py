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
        tags_update_doc = {
            '$addToSet': {
                'tags' : { '$each': result.tags() },
                'prefixes': { '$each': result.tag_prefixes() }
            }
        }
        #print tags_update_doc
        self._db.tags.update({}, tags_update_doc)
        print 'updated tags'

    def insert_result(self, result):
        oid = self._db.results.insert(result.resultdoc())
        print 'inserted result %s' % str(oid)
        return oid

    def read_env(self, oid):
        return self._db.environments.find_one( { '_id': oid })

    def insert_env(self, envdoc):
        oid = self._db.environments.insert(envdoc)
        print 'inserted environment %s' % str(oid)
        return oid
