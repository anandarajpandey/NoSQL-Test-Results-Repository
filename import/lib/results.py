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

import json

class Result:

    def __init__(self, args, mongo=None):
        """Inits document for the results collection"""
        self._resultdoc = {
            'datetime': _datetime(args),
            'name': args.name,
            'tags': [],
            'result': {},
        }
        (env_id, env_tags) = _get_env_tags(args, mongo)
        self._resultdoc['env_ref'] = env_id
        self._resultdoc['tags'].extend(uniq(env_tags))
        self._resultdoc['tags'].extend(uniq(_read_tags(args)))
        if args.tag:
            self._resultdoc['tags'].extend(uniq(args.tag))

    def resultdoc(self):
        return self._resultdoc

    def tags(self):
        return self._resultdoc.get('tags') or []

    def tag_prefixes(self):
        if not self._resultdoc.has_key('tags'):
            return []
        prefixes = set()
        for tag in self._resultdoc['tags']:
            prefixes.add(tag.split('-')[0])
        return list(prefixes)

    def __str__(self):
        return str(self._resultdoc)

def uniq(seq):
    return list(set(seq))

def _datetime(args):
    return args.time.replace(tzinfo=args.time_zone)

def _read_tags(args):
    if not args.tags_file:
        return
    print 'reading tags from %s' % args.tags_file.name
    for line in args.tags_file:
        tag = line.strip()
        if len(tag) > 0:
            yield tag

def _get_env_tags(args, mongo):
    if not mongo:
        return None, []
    if args.env_id:
        envdoc = mongo.read_env(args.env_id)
        if not envdoc:
            print 'environment %s is not found' % args.env_id
            return None, []
        else:
            print 'using environment %s' % args.env_id
            return args.env_id, envdoc.get('tags') or []
    elif args.env_file:
        print 'reading environment from %s' % args.env_file.name
        envdoc = json.load(args.env_file)
        oid = mongo.insert_env(envdoc)
        return oid, envdoc.get('tags') or []

