var Resource = require('./resource');
var mongoose = require('mongoose');
var Q = require('q');
var _ = require('lodash');

function ViewModelBase(data) {
  var doc = data._doc;
  var omitKeys = _.filter(_.keys(doc), function(key) {
    return key.indexOf('_') === 0;
  });

  doc.id = doc._id;
  return _.omit(doc, omitKeys);
}

function RepositoryBase(Model, ViewModel) {
  this.index = function() {
    var def = Q.defer();
    Model.find({}).exec(function(err, vals) {
      if (err) {
        def.reject(err);
      }
      var results = vals.map(function(val) {
        return new ViewModel(val)
      });
      def.resolve(results);
    });
    return def.promise;
  };

  this.filter = function(id) {
    var def = Q.defer();
    Model.find({ belongs_to: id }).exec(function(err, vals) {
      if (err) {
        def.reject(err);
      }
      var results = vals.map(function(val) {
        return new ViewModel(val)
      });
      def.resolve(results);
    });
    return def.promise;
  }

  this.get = function(id) {
    var def = Q.defer();
    Model.findOne({_id: id}).exec(function(err, val) {
      if (err) {
        def.reject(err);
      }
      def.resolve(new ViewModel(val));
    });
    return def.promise;
  };

  this.update = function(id, values) {
    var def = Q.defer();
    Model.update({_id: id}, values,
      function(err) {
      if (err) {
        return def.reject(err);
      }
      return def.resolve({ success: true });
    });
    return def.promise;
  };

  this.create = function(body, parent_id) {
    if (parent_id !== null && parent_id !== undefined) {
      body.belongs_to = parent_id;
    }
    var def = Q.defer();
    var model = new Model(body);
    model.save(function(err) {
      if (err) {
        return def.reject(err);
      }
      return def.resolve({ success: true });
    })
    return def.promise;
  };

  return this;
}

function HyperMongoose (name, scheme, viewmodel) {
  var Model = mongoose.model(name, scheme);
  var ViewModel = viewmodel || ViewModelBase;
  var repo = new RepositoryBase(Model, ViewModel);

  return new Resource(name.toLowerCase(), repo);
}

HyperMongoose.ViewModelBase = ViewModelBase;
HyperMongoose.mongoose = mongoose;
module.exports = HyperMongoose;
