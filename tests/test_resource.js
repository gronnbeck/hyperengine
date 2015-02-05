var test = require('blue-tape');
var Resource = require('../lib/resource');
var Q = require('q');
var hal = require('hal');

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

test('resource get object model test', function(t) {

  var obj = { hello: 'world' };
  var get = function(id) {
    var def = Q.defer();
    def.resolve(obj);
    return def.promise;
  }
  var resource = new Resource('res', { get: get })
  var promise = resource.get();
  return promise.then(function(model){
    t.deepEqual(model, new hal.Resource(obj, resource.path));
  });

});
