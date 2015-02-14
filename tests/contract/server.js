var engine = require('../../.');
var Q = require('q');
var express = require('express');
var HyperMongoose = engine.HyperMongoose;
var mongoose = HyperMongoose.mongoose;
var Schema = mongoose.Schema;

// CONFIGS
var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/blogapi';
var httpPort = process.env.PORT || 8008;

mongoose.connect(mongoURI);

var Post = new HyperMongoose('Post', new Schema({
  title: String,
  body: String,
  posted_by: String,
  user: { type: String, ref: 'User', required: true },
  created: Date,
  updated: Date,
  published: Date
}));

var Comment = new HyperMongoose('Comment', new Schema({
    user: String,
    body: String,
    created: Date,
    belongs_to: { type: String, ref: 'Post', required: true }
}));

var User = new HyperMongoose('User', new Schema({
  name: String,
  username: String,
  joined: Date
}));

Post.link(User, 'user');
Post.sublink(Comment);

var app = express();
var hyper = engine([Post, User]);

app.use(function(req, res, next) {
  console.log(req.headers);
  console.log(req.path)
  next();
});

app.use('/', hyper);
app.listen(httpPort, function() {
  console.log('Running on port: ' + httpPort);
  var test = require('blue-tape');
  var traverson = require('traverson')
  var api = traverson.jsonHal.from('http://localhost:' + httpPort);

  return api.newRequest()
      .follow('res:post', 'post[0]')
      .withTemplateParameters({name: 'traverson'})
      .getResource(function(error, document) {
      if (error) {
        console.error('No luck :-)')
        console.error(error);
      } else {
        console.log(JSON.stringify(document))
      }
  });
});
