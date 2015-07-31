'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * <%= model.name %> Schema
 */
var <%= model.name %>Schema = new Schema({
	
  <% model.elements.forEach(function(element) { %>
  <%= element.elementname %>: {
		type: <%= element.elementtype %>,
		required: 'Please fill <%= element.elementname %> name'
	},
  <% }); %>
  
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('<%= model.name %>', <%= model.name %>Schema);