var test = require('blue-tape');
var Resource = require('../lib/resource');
var Q = require('q');
var hal = require('hal');
var _ = require('lodash');

test('resource path test', function (t) {
    t.plan(1);
    var resource = new Resource('res', {});
    t.equal(resource.path, '/res/:res_id?');
});

test('subresource path test', function(t) {
  t.plan(1);
  var resource = new Resource('res', {});
  var subresource = new Resource('subres', {});
  resource.sublink(subresource);
  var sub = resource.sublinks[0];

  t.equal(sub.path, '/res/:res_id?/subres/:subres_id?');
});

test('resource link path test', function(t) {
  t.plan(2);
  var resource = new Resource('res', {});
  var resource2 = new Resource('res2', {});
  resource.link(resource2);

  t.equal(resource.path, '/res/:res_id?');
  t.equal(resource2.path, '/res2/:res2_id?');
});

var dummyRepo = {
  obj: { hello: 'world' },
  get: function(id) {
    var def = Q.defer();
    def.resolve(this.obj);
    return def.promise;
  }
}

test('resource get object model test', function(t) {
  var resource = new Resource('res', dummyRepo);
  var promise = resource.get();
  return promise.then(function(model){
    t.deepEqual(model, new hal.Resource(dummyRepo.obj, resource.path),
      'model should be a hal resource');
  });

});

test('resource get() has hal specifed _links', function (t) {
  var resource = new Resource('res', dummyRepo);
  var subresource = new Resource('subres', {});
  resource.link(subresource);
  var promise = resource.get();
  return promise.then(function(model) {
      t.ok(_.has(model, '_links'),
        'model should contain _links');

      t.ok(_.has(model._links, 'subres'),
        'model _links should refer to subresource')
  });
});
