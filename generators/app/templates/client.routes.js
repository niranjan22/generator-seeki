'use strict';

//Setting up route
angular.module('<%= model.paramCasePlural %>').config(['$stateProvider',
	function($stateProvider) {
		// <%= model.titleCasePlural %> state routing
		$stateProvider.
		state('list<%= model.pascalCasePlural %>', {
			url: '/<%= model.paramCasePlural %>',
			templateUrl: 'modules/<%= model.paramCasePlural %>/views/list-<%= model.paramCasePlural %>.client.view.html'
		}).
		state('create<%= model.pascalCaseSingular %>', {
			url: '/<%= model.paramCasePlural %>/create',
			templateUrl: 'modules/<%= model.paramCasePlural %>/views/create-<%= model.paramCaseSingular %>.client.view.html'
		}).
		state('view<%= model.pascalCaseSingular %>', {
			url: '/<%= model.paramCasePlural %>/:<%= model.camelCaseSingular %>Id',
			templateUrl: 'modules/<%= model.paramCasePlural %>/views/view-<%= model.paramCaseSingular %>.client.view.html'
		}).
		state('edit<%= model.pascalCaseSingular %>', {
			url: '/<%= model.paramCasePlural %>/:<%= model.camelCaseSingular %>Id/edit',
			templateUrl: 'modules/<%= model.paramCasePlural %>/views/edit-<%= model.paramCaseSingular %>.client.view.html'
		});
	}
]);