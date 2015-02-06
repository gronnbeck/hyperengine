var express = require('express');
var bodyParser = require('body-parser');
var Resource = require('./lib/resource');
var HyperMongoose = require('./lib/hyper-mongoose');

function link (app, resource, path) {
  app.get(resource.path, function(req, res) {
    var id_name = resource.name + '_id';
    var id = req.params[id_name];
    if (id == null) {
      resource.index(req.params).then(function(body){
        res.send(body.toJSON());
      });
    }
    else {
      resource.get(id, req.params).then(function(body) {
        res.send(body.toJSON());
      });
    }
  });

  app.post(resource.path, function(req, res) {
    var id_name = resource.name + '_id';
    var id = req.params[id_name];
    var body = req.body;
    var parent = null;
    if (resource.parent != null) {
      parent = req.params[resource.parent.name + '_id'];
    }

    if (id == null) {
      resource.create(body, parent)
      .then(function(body) {
        res.send(body);
      });
    }
    else {
      resource.update(id, body).then(function(body) {
        res.send(body);
      });
    }
  });

  var i, subresource;
  for (i = 0; i < resource.sublinks.length; i++) {
    subresource = resource.sublinks[i]
    link(app, subresource, resource.path + '/:' + resource.name + '_id');
  }

  return app;
}

function hyperengine(resources) {
  var app = express();
  app.use(bodyParser.json());
  var i, resource;
  for (i = 0; i < resources.length; i++) {
    resource = resources[i]
    link(app, resource);
  }
  return app;
}

hyperengine.Resource = Resource;
hyperengine.HyperMongoose = HyperMongoose;
module.exports = hyperengine;
