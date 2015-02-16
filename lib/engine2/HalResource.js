var _ = require('lodash');

function HalResource(resource) {

  if (resource === null || resource === undefined) {
    throw Error("Missing input: No input was given.");
  }

  if (resource.name === null || resource.name === undefined) {
    throw Error('Missing input: Name must be specified.');
  }

  var __href = '/' + resource.name;
  var __idParam = resource.idParam || 'id';

  this.toJSON = function () {
    this._links = { self: { href: __href }};
    if (resource.links !== null && resource.links !== undefined) {
      this._links = _.reduce(resource.links, function(result, link) {
        var next = {};
        next[link.name] = { href: (link.sub ? __href + '' : '') + link.href };
        return _.assign(result, next);
      }.bind(this), {});
    }
    return this;
  }


  return this;
}

module.exports = HalResource;
