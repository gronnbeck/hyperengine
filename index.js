var express = require('express');
var bodyParser = require('body-parser');
var Resource = require('./lib/resource');

function hyperengine(resources) {
  var app = express();
  app.use(bodyParser.json());
  var i, resource;
  for (i = 0; i < resources.length; i++) {
    resource = resources[i]

    app.get(resource.path, function(req, res) {
      resource.index().then(function(body){
        res.send(body.toJSON());
      });
    });

    app.get(resource.path + '/:id', function(req, res){
      var id = req.params.id;
      resource.get(id).then(function(body) {
        res.send(body.toJSON());
      });
    });

    app.post(resource.path, function(req, res) {
      var body = req.body;
      resource.create(body).then(function(body) {
        res.send(body);
      });
    });

    app.post(resource.path + '/:id', function(req, res) {
      var id = req.params.id;
      var body = req.body;
      resource.update(id, body).then(function(body) {
        res.send(body);
      });
    });

  }
  return app;
}

hyperengine.Resource = Resource;

module.exports = hyperengine;
