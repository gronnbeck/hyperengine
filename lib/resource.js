var hal = require('hal');

function Resource (name, repo) {
  if (name === null || name === undefined || typeof name !== 'string') {
    throw Error('Resource name not specified. Cannot continue')
  }

  if (repo === null || repo === undefined) {
    throw Error('Repository missing for resource: ' + name)
  }

  this.links = [];
  this.name = name;
  this.repo = repo;

  var get = function(id) {
    var path = name + '/' + id;
    var _get = function(model) {
      var resource = new hal.Resource(model, path);
      var i;
      for (i = 0; i < this.links.length; i++) {
          resource.link(this.links[i].name, path + '/' + this.links[i].name);
      }
      return resource;
    };
    return repo.get(id).then(_get.bind(this));
  }.bind(this);

  var index = function() {
    return repo.index().then(function(collection) {
      var payload = {};
      payload[name] = collection;

      return new hal.Resource(payload, name);
    });
  };

  var splitPath = function(path) {
    var split;
    if (typeof path === 'string') {
      split = path.split('/').reduce(function(mem, cur){
        if (cur.length > 0) mem.push(cur);
        return mem;
      }, []);
    } else {
      split = path;
    }
    return split;
  }

  var _get = function(path) {
    var split = splitPath(path);

    if (split.indexOf(this.name) !== 0) return false;

    if (split.length === 1) {
      return index();
    }
    else if (split.length === 2) {
      var id = split[1];
      return get();
    }
    else {
      var slice = split.slice(2, split.length);
      var i, link, linkMatch;
      for (i = 0; i < this.links.length; i++) {
          link = this.links[i];
          linkMatch = link.match(slice);
          if (linkMatch !== false) {
            return linkMatch;
          }
      }
    }

    return false;
  }.bind(this);

  var _post = function(path, data) {
    var split = splitPath(path);
    if (split.indexOf(this.name) !== 0) return false;
    if (split.length === 1) return repo.create(data);
    if (split.length === 2) return repo.update(split[1], data);
    return false;
  }.bind(this);

  var match = function(path, method, data) {
    method = method || 'GET';

    if (method === 'GET') return _get(path);
    else if (method === 'POST') return _post(path, data);
    else return false;

  }.bind(this);

  var link = function(resource) {
      this.links.push(resource);
  }.bind(this);

  return {
    name: name,
    link: link,
    links: this.links,
    match: match
  }
}

module.exports = Resource;
