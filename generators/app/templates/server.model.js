'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * <%= model.pascalCaseSingular %> Schema
 */
var <%= model.pascalCaseSingular %>Schema = new Schema({<% model.elements.forEach(function(element) { %>
<% if ( ['Schema.Types.ObjectId', 'File'].indexOf(element.elementtype)>-1 ) { %>
  <%= element.elementname %>: <% if (element.isarray === true){%>[<% }%>{type: Schema.Types.ObjectId, ref: '<%= element.schemaobjref %>'}<% if (element.isarray === true){%>]<% } %>,
<% } else if (element.elementtype === 'Nested') { %>
  <%= element.elementname %>: <% if (element.isarray === true){%>[<% } %>{
  <% element.elements.forEach(function(nestedelement) { %>
  <% if ( nestedelement.elementtype === 'Schema.Types.ObjectId' ) { %>
  <%= nestedelement.elementname %>:{type: <%= nestedelement.elementtype %>, ref: '<%= nestedelement.schemaobjref %>'},
  <% } else { %>
  <%= nestedelement.elementname %>: <%= nestedelement.elementtype %>,
  <% } %>
  <% }); %>
  }<% if (element.isarray === true){%>]<% } %>,
<% } else { %>
  <%= element.elementname %>: <%= element.elementtype %>,
<% } %><% }); %>
	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}
});
mongoose.model('<%= model.pascalCaseSingular %>', <%= model.pascalCaseSingular %>Schema);