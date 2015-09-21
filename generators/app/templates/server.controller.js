'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	<%= model.pascalCaseSingular %> = mongoose.model('<%= model.pascalCaseSingular %>'),
	_ = require('lodash');

/**
 * Create a <%= model.titleCaseSingular %>
 */
exports.create = function(req, res) {
	var <%= model.camelCaseSingular %> = new <%= model.pascalCaseSingular %>(req.body);
	<%= model.camelCaseSingular %>.user = req.user;

	<%= model.camelCaseSingular %>.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(<%= model.camelCaseSingular %>);
		}
	});
};

/**
 * Show the current <%= model.titleCaseSingular %>
 */
exports.read = function(req, res) {
	res.jsonp(req.<%= model.camelCaseSingular %>);
};

/**
 * Update a <%= model.titleCaseSingular %>
 */
exports.update = function(req, res) {
	var <%= model.camelCaseSingular %> = req.<%= model.camelCaseSingular %> ;

	<%= model.camelCaseSingular %> = _.extend(<%= model.camelCaseSingular %> , req.body);

	<%= model.camelCaseSingular %>.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(<%= model.camelCaseSingular %>);
		}
	});
};

/**
 * Delete an <%= model.titleCaseSingular %>
 */
exports.delete = function(req, res) {
	var <%= model.camelCaseSingular %> = req.<%= model.camelCaseSingular %> ;

	<%= model.camelCaseSingular %>.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(<%= model.camelCaseSingular %>);
		}
	});
};

/**
 * List of <%= model.titleCasePlural %>
 */
exports.list = function(req, res) { 
  var populateQuery = [{path:'user', select:'displayName'}];<% model.elements.forEach ( function (element) { %><% if (element.elementtype ==='Schema.Types.ObjectId') { %>
  populateQuery.push({path: '<%= element.elementname %>', select: '<%= element.populateelements.join(' ') %>' });<% } %><% }); %>
  
	<%= model.pascalCaseSingular %>.find().sort('-created').populate(populateQuery).exec(function(err, <%= model.camelCasePlural %>) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(<%= model.camelCasePlural %>);
		}
	});
};

/**
 * <%= model.titleCaseSingular %> middleware
 */
exports.<%= model.camelCaseSingular %>ByID = function(req, res, next, id) { 
  
  var populateQuery = [{path:'user', select:'displayName'}];<% model.elements.forEach ( function (element) { %><% if (element.elementtype ==='Schema.Types.ObjectId') { %>
  populateQuery.push({path: '<%= element.elementname %>', select: '<%= element.populateelements.join(' ') %>' });<% } %><% }); %>
  
	<%= model.pascalCaseSingular %>.findById(id).populate(populateQuery).exec(function(err, <%= model.camelCaseSingular %>) {
		if (err) return next(err);
		if (! <%= model.camelCaseSingular %>) return next(new Error('Failed to load <%= model.titleCaseSingular %> ' + id));
		req.<%= model.camelCaseSingular %> = <%= model.camelCaseSingular %> ;
		next();
	});
};

/**
 * <%= model.titleCaseSingular %> authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.<%= model.camelCaseSingular %>.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
