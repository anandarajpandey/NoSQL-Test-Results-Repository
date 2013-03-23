class Result:

    def __init__(self, args):
        """Inits document for the results collection"""
        self._resultdoc = {
            'datetime': _datetime(args),
            'name': args.name,
            'tags': [],

        }
        #TODO result['tags'].extend(_get_env_tags(args))
        self._resultdoc['tags'].extend(_read_tags(args))
        if args.tag:
            self._resultdoc['tags'].extend(args.tag)

    def resultdoc(self):
        return self._resultdoc

    def tags(self):
        if not self._resultdoc.has_key('tags'):
            return
        for tag in self._resultdoc['tags']:
            yield tag

    def tag_prefixes(self):
        if not self._resultdoc.has_key('tags'):
            return
        for tag in self._resultdoc['tags']:
            yield tag.split('-')[0]

    def __str__(self):
        return str(self._resultdoc)

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
