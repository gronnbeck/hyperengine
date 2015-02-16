var test = require('tape');
var _ = require('lodash');
var HalResource = require('../../lib/engine2/HalResource');

test('HalResource constructor input', function (t) {
  t.equal(typeof HalResource, 'function', 'should be a function');
  t.throws(function() { new HalResource() }, Error, 'should throw exception if no input was given');
  t.throws(function() { new HalResource({})}, Error, 'should throw exception if name is not specified');

  t.end();
})

test('HalResource model', function (t) {
  var resource = new HalResource({ name: 'resource' });
  var json = resource.toJSON();

  t.equal(typeof json, 'object', 'should return an object');
  t.ok(_.has(json, '_links'), 'should contain a _links property');

  t.equal(json._links.self.href, '/resource', 'should contain self')
  t.end();
});

test('HalResource _links property of a subresource', function(t) {
  var resource = new HalResource({
    links: [{
      name: 'subResource',
      href: '/subresource',
      sub: true
    }],
    name: 'resource'
  });

  var json = resource.toJSON();

  t.ok(_.has(json._links, 'subResource'), 'should contain a link');
  t.ok(_.has(json._links.subResource, 'href'), 'should contain links with href');
  t.equal(json._links.subResource.href, '/resource/subresource', 'should be a sub path fo resource');
  t.end();
});

test('HalResource _links property with multiple subresources', function(t) {
  var resource = new HalResource({
    links: [{
      name: 'subResource1',
      href: '/subresource1',
      sub: true
    },
    {
      name: 'subResource2',
      href: '/subresource2',
      sub: true
    }],
    name: 'resource'
  });

  var json = resource.toJSON();

  t.equal(json._links.subResource1.href, '/resource/subresource1', 'should be a sub path for subresource1');
  t.equal(json._links.subResource2.href, '/resource/subresource2', 'should be a sub path fo subresource2');
  t.end();
});

test('HalResource _links property with a linked resource', function(t) {
  var resource = new HalResource({
    links: [{
      name: 'resource1',
      href: '/resource1'
    }],
    name :'resource2'
  });

  var json = resource.toJSON();

  t.equal(json._links.resource1.href, '/resource1', 'should be a path fo resource1');
  t.end()
});
