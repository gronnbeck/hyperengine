var Resource = require('./resource');
var mongoose = require('mongoose');
var _ = require('lodash');

function ViewModelBase(data) {
  var omitKeys = _.filter(_.keys(data), function(key) {
      return key.indexOf('_') === 0;
    });

  data.id = data._id;

  return _.omit(data, omitKeys);
}

function RepositoryBase(Model, ViewModel) {
  this.index = function() {
    var def = Q.defer();
    Model.find({}).exec(function(err, vals) {
      if (err) {
        def.reject(err);
      }
      def.resolve(vals.map(function(val) { return new ViewModel(val) }));
    });
    return def.promise;
  };

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

  this.create = function(vals) {
    var def = Q.defer();
    var dish = new Model(val);
    Model.save(function(err) {
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
module.exports = HyperMongoose;
