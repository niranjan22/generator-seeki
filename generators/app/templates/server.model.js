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
    <% if ( element.elementtype === 'Schema.Types.ObjectId' ) { %>
    <%= element.elementname %>: {
      type: <%= element.elementtype %> ,
      ref: '<%= element.schemaobjref %>'
    }, 
    <% } else if (element.elementtype === 'Nested') { %>
    <%= element.elementname %>: [{
    <% element.elements.forEach(function(nestedelement) { %>
    <% if ( nestedelement.elementtype === 'Schema.Types.ObjectId' ) { %>
    <%= nestedelement.elementname %>:{
      type: <%= nestedelement.elementtype %> ,
      ref: '<%= nestedelement.schemaobjref %>'
    },
    <% } else { %>
    <%= nestedelement.elementname %>: {
      type: <%= nestedelement.elementtype %> ,
      required: 'Please fill <%= nestedelement.elementname %>'
    },    
    <% } %>
    <% }); %>
    }],
    <% } else { %>
    <%= element.elementname %>: {
      type: <%= element.elementtype %> ,
      required: 'Please fill <%= element.elementname %>'
    },
    <% } %>
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