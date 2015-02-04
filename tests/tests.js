var test = require('tape');
var Resource = require('../lib/resource');


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

var _ = require('lodash');
var engine = require('../index');

test('hyperengine resource path setup', function(t) {
  t.plan(2);
  var resource = new Resource('res', {});
  var subresource = new Resource('subres', {});
  var linkedResource = new Resource('linked', {});

  resource.sublink(subresource);

  var app = engine([resource]);
  var routes = app._router.stack;
  var resourceRoutes = _.filter(routes, function(route) {
    if (route.route === undefined) return false;
    var path = route.route.path;
    return path === '/res' ||
           path === '/res/:res_id?';
  });

  t.equal(resourceRoutes.length, 2);

  var subResourceRoutes = _.filter(routes, function(route) {
    if (route.route === undefined) return false;
    var path = route.route.path;
    return path === '/res/:res_id?/subres' ||
           path === '/res/:res_id?/subres/:subres_id?'
  });

  t.equal(subResourceRoutes.length, 2);

});
