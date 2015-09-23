'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var <%= model.camelCasePlural %> = require('../../app/controllers/<%= model.paramCasePlural %>.server.controller');

	// <%= model.titleCasePlural %> Routes
	app.route('/<%= model.paramCasePlural %>')
		.get(<%= model.camelCasePlural %>.list)
		.post(users.requiresLogin, <%= model.camelCasePlural %>.create);

	app.route('/<%= model.paramCasePlural %>/:<%= model.camelCaseSingular %>Id')
		.get(<%= model.camelCasePlural %>.read)
		.put(users.requiresLogin, <%= model.camelCasePlural %>.hasAuthorization, <%= model.camelCasePlural %>.update)
		.delete(users.requiresLogin, <%= model.camelCasePlural %>.hasAuthorization, <%= model.camelCasePlural %>.delete);

	// Finish by binding the <%= model.titleCaseSingular %> middleware
	app.param('<%= model.camelCaseSingular %>Id', <%= model.camelCasePlural %>.<%= model.camelCaseSingular %>ByID);
};
