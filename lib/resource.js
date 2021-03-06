var hal = require('hal');
var _ = require('lodash');

function Resource (name, repo, path) {
  if (name === null || name === undefined || typeof name !== 'string') {
    throw Error('Resource name not specified. Cannot continue')
  }

  if (repo === null || repo === undefined) {
    throw Error('Repository missing for resource: ' + name)
  }

  this.links = [];
  this.sublinks = [];
  this.parent = undefined;
  this.name = name;
  this.repo = repo;
  this.key = this.name + '_id';
  if (path === null || path === undefined) {
    this.path = '/' + name;
    var id = '/:' + name.replace('/', '') + '_id?';
    this.path = this.path + id;
  } else {
    this.path = path;
  }
  this.indexPath = this.path.replace('/:' + this.name + '_id?', '');

  var formatPath = function(path, keys) {
    var k = _.keys(keys);
    var paramKey, i, key;
    for (var i = 0; i < k.length; i++) {
      key = k[i];
      paramKey = ':' + key + '?';
      path = path.replace(paramKey, keys[key]);
    }
    return path;
  }

  this.getPath = function(keys) {
    var path = this.path;
    return formatPath(path, keys);
  }.bind(this);

  this.getIndexPath = function(keys) {
    return formatPath(this.indexPath, keys);
  }.bind(this);



  var get = function(id, params) {
    return repo.get(id).then(function(model) {
      var links = function(resource) {
        var i, link, linkKey, linkVal, obj;
        for (i = 0; i < this.links.length; i++) {
          link = this.links[i].resource;
          linkKey = this.links[i].key;
          linkVal = model[linkKey];
          obj = {};
          obj[linkKey + '_id'] = linkVal;
          resource.link(link.name, link.getPath(obj));
        }
      }.bind(this);

      var sublinks = function(resource) {
        var i, link;
        for (i = 0; i < this.sublinks.length; i++) {
          link = this.sublinks[i];
          resource.link(link.name, link.getIndexPath(params));
        }
      }.bind(this);

      var path = this.getPath(params);
      var resource = new hal.Resource(model, path);

      links(resource);
      sublinks(resource);

      return resource;
    }.bind(this));
  }.bind(this);

  var index = function(keys) {
    var promise = undefined;
    if (this.parent != null) {
      var key = keys[this.parent.name + '_id'];
      promise = repo.filter(key);
    } else {
      promise = repo.index();
    }

    return promise.then(function(collection) {
      var indexPath = this.getIndexPath(keys);
      var resource = new hal.Resource({}, indexPath);
      var i;
      for (var i = 0; i < collection.length; i++) {
        resource.link(this.name,
          indexPath + '/' + collection[i].id)
      }
      return resource

    }.bind(this));
  };

  var create = function(data, parent) {
    return repo.create(data, parent);
  }

  var update = function(id, data) {
    return repo.update(id, data);
  }

  var link = function(resource, key) {
    this.links.push({resource: resource, key: key});
  }.bind(this);

  var sublink = function(resource) {
    var clone = resource.clone(this.path)
    clone.parent = this;
    this.sublinks.push(clone);
  }.bind(this);

  var clone = function(path) {
    path = path == null ? this.path : path + this.path;
    return new Resource(name, repo, path)
  };


  return {
    name: name,
    link: link,
    clone: clone,
    sublink: sublink,
    links: this.links,
    sublinks: this.sublinks,
    index: index,
    get: get,
    create: create,
    update: update,
    path: this.path,
    parent: this.parent,
    getPath: this.getPath,
    getIndexPath: this.getIndexPath
  }
}


module.exports = Resource;
