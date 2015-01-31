var hyperengine = require('./index');
var Resource = hyperengine.Resource;
var Q = require('q');

var testRepo = {
  get: function(id) {
    var deferred = Q.defer();
    setTimeout(function() {
      deferred.resolve({ id: 1, hello: 'world'})
    }, 0);
    return deferred.promise;
  },
  index: function() {
    var deferred = Q.defer();
    deferred.resolve([{ id: 1, hello: 'world'}]);
    return deferred.promise;
  }
}

var colRepo = {
  get: function(id) {
    var deferred = Q.defer();
    setTimeout(function() {
      deferred.resolve({ id: 1, 'whois': 'collection'})
    }, 0);
    return deferred.promise;
  },
  index: function() {
    var deferred = Q.defer();
    deferred.resolve([]);
    return deferred.promise;
  },
  update: function(id, values) {
    var deferred = Q.defer();
    deferred.resolve({ id: 1, hello: 'world'});
    return deferred.promise;
  }
}

var collectionResource = new Resource('collections', colRepo)
var testResource = new Resource('tests', testRepo);

collectionResource.link(testResource);

var app = hyperengine([collectionResource]);


app.listen(8111, function() {
  console.log('Running')
})
