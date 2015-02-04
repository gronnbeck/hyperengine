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
    return repo.get(id).then(function(model) {
      var resource = new hal.Resource(model, path);
      return resource;
    });
  }.bind(this);

  var index = function() {
    return repo.index().then(function(collection) {
      var payload = {};
      payload[name] = collection;

      return new hal.Resource(payload, name);
    });
  };

  var create = function(data) {
    return repo.create(data);
  }

  var update = function(id, data) {
    return repo.update(id, data);
  }

  var link = function(resource) {
      this.links.push(resource);
  }.bind(this);

  return {
    name: name,
    link: link,
    links: this.links,
    index: index,
    get: get,
    create: create,
    update: update,
    path: '/' + name
  }
}

module.exports = Resource;
