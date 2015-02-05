var test = require('blue-tape');
var Resource = require('../lib/resource');
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
