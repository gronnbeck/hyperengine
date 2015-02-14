var hal = require('hal');

function IndexResource(resources) {
  var resource = new hal.Resource({}, '/');
  resources.forEach(function(res) {
    resource.link(res.name, res.getIndexPath());
  });
  return resource;
}

module.exports = IndexResource;
