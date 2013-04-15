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
import mimetypes
import pymongo
import gridfs

mimetypes.add_type('text/plain', '.out', strict=False)
mimetypes.add_type('text/plain', '.err', strict=False)

def _mimetype(filename):
    type = mimetypes.guess_type(filename, strict=False)
    return type[0]

class Mongo:

    def __init__(self, args):
        self._args = args
        self._db = pymongo.Connection(self._args.mongo, tz_aware=True).performance

    def update_tags(self, result):
        """Updates the tags collection with the tags of the result"""
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
        """Inserts the result into results collection.
        Returns the oid of just inserted document."""
        oid = self._db.results.insert(result.resultdoc())
        print 'inserted result %s' % str(oid)
        return oid

    def read_env(self, oid):
        """Reads the environment document
        Returns the document."""
        return self._db.environments.find_one( { '_id': oid })

    def insert_env(self, envdoc):
        """Inserts the new environment document.
        Returns the oid if just inserted document."""
        oid = self._db.environments.insert(envdoc)
        print 'inserted environment %s' % str(oid)
        return oid

    def put_files(self):
        """Puts all files in the path defined in arguments to GridFS.
        Returns list of oids of just inserted files."""
        if self._args.no_files:
            return []
        files = sorted(os.listdir(self._args.path))
        fs = gridfs.GridFS(self._db)
        oids = []
        for filename in files:
            with open(os.path.join(self._args.path, filename)) as file:
                oid = fs.put(file, filename=filename, contentType=_mimetype(filename))
                oids.append(oid)
                print "%s is stored as %s" % (filename, str(oid))
        return oids
