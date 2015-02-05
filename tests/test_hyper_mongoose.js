var test = require('blue-tape');
var HyperMongoose = require('../lib/hyper-mongoose');
var engine = require('../index');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

test('ViewModelBase removes keys starting with _', function(t) {
  t.plan(1);
  var data = {
    '_id': 'this is key',
    str: 'this is a value'
  }

  var vm = new HyperMongoose.ViewModelBase(data);

  t.ok(_.has(vm, 'str'));
});

test('ViewModelBase standard maps _id to id', function(t) {
  t.plan(2)
  var val = 'this is key';
  var data = {
    '_id': val,
  }

  var vm = new HyperMongoose.ViewModelBase(data);
  t.ok(_.has(vm, 'id'));
  t.equal(vm.id, val);
});

test('hyperengine resource path using hyper mongoose', function(t) {
  t.plan(1);
  var PostSchema = new Schema({
    title: { type: String, index: { unique: true } },
    body: String
  });

  var resource = new HyperMongoose('Post', PostSchema);

  var app = engine([resource]);
  var routes = app._router.stack;
  var resourceRoutes = _.filter(routes, function(route) {
    if (route.route === undefined) return false;
    var path = route.route.path;
    return path === '/post' ||
           path === '/post/:post_id?';
  });

  t.equal(resourceRoutes.length, 2);

})
