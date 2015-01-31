var express = require('express');
var bodyParser = require('body-parser');
var Resource = require('./lib/resource');

function hyperengine(resources) {
  var app = express();
  app.use(bodyParser.json());
  var i, resource;
  for (i = 0; i < resources.length; i++) {
    resource = resources[i]
    app.use(function (req, res, next) {
      var match = resource.match(req.path, req.method, req.body);
      if (match === false) return next();

      if (req.method === 'GET') {
        match.then(function(match){
          return res.send(match.toJSON());
        });
      }
      else if (req.method === 'POST') {
        match.then(function(match) {
            return res.send(match)
        });
      }
      else {
        throw Error('HTTP Method not implemented in Hyperengine: ' + req.method);
      }
    });
  }
  return app;
}

hyperengine.Resource = Resource;

module.exports = hyperengine;
