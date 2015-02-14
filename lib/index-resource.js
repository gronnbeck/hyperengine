var hal = require('hal');

function IndexResource(resources, prefix) {
  prefix = prefix || 'res';

  var curies = [];
  var _links = { self: { href: '/' }, curies: curies };
  var index = { _links: _links };

  var curie = {
    name: prefix,
    href: '/{rel}',
    templated: true
  }
  curies.push(curie);

  resources.forEach(function(res) {
    var key = prefix + ':' + res.name;
    var href = res.getIndexPath();


    _links[key] = { href: href };
  });

  return index;
}

module.exports = IndexResource;
