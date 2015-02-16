# HyperEngine Ardbeg 2

* Write my own hal resource model.
  * hal.js has not been maintained for over 2 years.
  * learn more about hal specification
* Build resource based on:
  * A Graph (programatically)
  * Route config (text)

## Build the resource graph
Need to specify this before thinking how to do this programatically.

A basic example of specifying a resource using a route config (inspired by MVC) frameworks:
```js
routes.add('/resource/{id}', Resource)
routes.add('/resource/{id}/subresource', SubResource)
```
In this example ``SubResourceController`` depends upon the ``{id}``-param of
``ResourceController``. This should neatly be represented in a graph.

It is important that the ``{id}``-param is not optional. This is to ease the
implementation of the first version of the resource graph.

The config above expects ``index``, ``get``, ``post``, ``put`` and ``delete``
to be implemented. If one or more is not implemented the framework should
return 404.


## ResourceController API

The different methods will expect different inputs
* index: void -> returns a list of objects
* get: id -> the specific object
* post:
  * resource with id -> updates the object at hand
  * resource without id -> creates a new object and
  if possible assigns it an id
* put:
  * resource with id -> updates the object as is. Will remove keys not present.
  * resource without id -> throws an exceptuon
* delete: id -> returns the deleted object
