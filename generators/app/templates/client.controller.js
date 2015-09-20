'use strict';

// <%= model.pascalCasePlural %> controller
angular.module('<%= model.paramCasePlural %>').controller('<%= model.pascalCasePlural %>Controller', ['$scope', '$modal', '$stateParams', '$location', '$log', '$filter', 'Authentication', '<%= model.pascalCasePlural %>'<% if( controller.services.length > 0 ) { controller.services.forEach ( function (service) { %>, '<%=service%>'<% }); } %>,
 	function($scope, $modal, $stateParams, $location, $log, $filter, Authentication, <%= model.pascalCasePlural %><% if( controller.services.length > 0 ) { controller.services.forEach ( function (service) { %>, <%= service %><% }); } %>) {
		$scope.authentication = Authentication;<% controller.lookups.forEach ( function (lookup) { %>
    $scope.<%= lookup.lookupname %> = <%= lookup.expression %><% }); %>

    $scope.<%= model.camelCaseSingular %>={};
    <% model.elements.forEach(function(element) { %><% if (element.elementtype === 'Nested') { %><% if (element.isarray === true) {%>
    $scope.<%= model.camelCaseSingular %>.<%= element.elementname %>=[];
    <% } else {%>
    $scope.<%= model.camelCaseSingular %>.<%= element.elementname %>={};
    <% } %><% } %><% }); %>

    <% model.elements.forEach(function(element) { %><% if (element.elementtype === 'Schema.Types.ObjectId') { %>
    $scope.<%= element.camelCaseSchemaobjref %>=<%= element.pascalCaseSchemaobjref %>.query();
    <% } %><% }); %>

    <% controller.methods.forEach ( function (method) { %>
    <% if (method.methodtype === 'create') { %>

		// Create new <%= model.pascalCaseSingular %>
		$scope.create = function() {
			// Create new <%= model.pascalCaseSingular %> object
			var <%= model.camelCaseSingular %> = new <%= model.pascalCasePlural %> (this.<%= model.camelCaseSingular %>);
      <% model.elements.forEach ( function (element) { %><% if (element.elementtype === 'Schema.Types.ObjectId') { %>
      <%= model.camelCaseSingular %>.<%= element.elementname %> = <%= model.camelCaseSingular %>.<%= element.elementname %>._id;
      <% } %><% }) %>
      <% model.elements.forEach ( function (element) { %><% if (element.elementtype === 'Nested') { %><% element.elements.forEach ( function (nestedelement) { %><% if (nestedelement.elementtype === 'Schema.Types.ObjectId') { %>
        <%= model.camelCaseSingular %>.<%= element.elementname %>.forEach ( function (<%= element.elementNameSingular %>) {
          <%= element.elementNameSingular %>.<%= nestedelement.elementname %> = <%= element.elementNameSingular %>.<%= nestedelement.elementname %>._id;
        });
      <% } %><% }) %><% } %><% }) %>
      <%= model.camelCaseSingular %>.created = Date.now;

			// Redirect after save
			<%= model.camelCaseSingular %>.$save(function(response) {
				//$location.path('<%= model.paramCasePlural %>/' + response._id);
        $location.path('<%= model.paramCasePlural %>');

				// Clear form fields
        <% model.elements.forEach(function(element) { %>
        $scope.<%= element.elementname %>= null;<% }); %>
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
    <% } %>

    <% if (method.methodtype === 'remove') { %>
		// Remove existing <%= model.pascalCaseSingular %>
		$scope.remove = function(<%= model.camelCaseSingular %>) {
			if ( <%= model.camelCaseSingular %> ) {
				<%= model.camelCaseSingular %>.$remove();

				for (var i in $scope.<%= model.camelCasePlural %>) {
					if ($scope.<%= model.camelCasePlural %> [i] === <%= model.camelCaseSingular %>) {
						$scope.<%= model.camelCasePlural %>.splice(i, 1);
					}
				}
			} else {
				$scope.<%= model.camelCaseSingular %>.$remove(function() {
					$location.path('<%= model.paramCasePlural %>');
				});
			}
		};
    <% } %>

    <% if (method.methodtype === 'update') { %>
		// Update existing <%= model.pascalCaseSingular %>
		$scope.update = function() {
			var <%= model.camelCaseSingular %> = $scope.<%= model.camelCaseSingular %>;
      <% model.elements.forEach ( function (element) { %><% if (element.elementtype === 'Schema.Types.ObjectId') { %>
      <%= model.camelCaseSingular %>.<%= element.elementname %> = <%= model.camelCaseSingular %>.<%= element.elementname %>._id;
      <% } %><% }) %>
      <% model.elements.forEach ( function (element) { %><% if (element.elementtype === 'Nested') { %><% element.elements.forEach ( function (nestedelement) { %><% if (nestedelement.elementtype === 'Schema.Types.ObjectId') { %>
        <%= model.camelCaseSingular %>.<%= element.elementname %>.forEach ( function (<%= element.elementNameSingular %>) {
          <%= element.elementNameSingular %>.<%= nestedelement.elementname %> = <%= element.elementNameSingular %>.<%= nestedelement.elementname %>._id;
        });
      <% } %><% }) %><% } %><% }) %>

			<%= model.camelCaseSingular %>.$update(function() {
				$location.path('<%= model.paramCasePlural %>/' + <%= model.camelCaseSingular %>._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
    <% } %>

    <% if (method.methodtype === 'find') { %>
		// Find a list of <%= model.pascalCasePlural %>
		$scope.find = function() {
			$scope.<%= model.camelCasePlural %> = <%= model.pascalCasePlural %>.query();
		};
    <% } %>

    <% if (method.methodtype === 'findOne') { %>
		// Find existing <%= model.pascalCaseSingular %>
		$scope.findOne = function() {
      <%= model.pascalCasePlural %>.get({
				<%= model.camelCaseSingular %>Id: $stateParams.<%= model.camelCaseSingular %>Id
			})
      .$promise.then(function(data) {<% model.elements.forEach(function(element) { %>
        <% if(element.elementtype == "Date"){ %>
        data.<%= element.elementname %> = $filter('date')(data.<%= element.elementname %>, 'yyyy-MM-dd');
        <% } %>
        <% if(element.elementtype == "Nested" && element.isarray === false){ %>
        <% element.elements.forEach(function(nestedelement) { %>
        <% if(nestedelement.elementtype == "Date"){ %>
        data.<%= element.elementname %>.<%= nestedelement.elementname %> = $filter('date')(data.<%= element.elementname %>.<%= nestedelement.elementname %>, 'yyyy-MM-dd');
        <% } %>
        <% }); %>
        <% } %>
        <% }); %>
        $scope.<%= model.camelCaseSingular %> = data;
      }, function(reason) {
        console.log('Failed: ' + reason);
      });
		};
    <% } %>

    <% if (method.methodtype === 'standAlone') { %>
    $scope.<%= method.methodname %> = function () {
      <%= method.methodcontent %>
    };
    <% } %>

    <% if (method.methodtype === 'Modal') { %>
    <% model.elements.forEach(function(element) { %><% if (element.elementtype === 'Nested') { %><% if (element.isarray === true) {%><% if (method.methodname === element.elementname) { %>
    $scope.add<%= element.elementNameSingular %> = function () {
      var modalInstance = $modal.open({
        animation: false,
        templateUrl: '<%= element.elementNameSingular %>Content.html',
        controller: '<%= element.elementNameSingular %>InstanceCtrl',
        size: 'lg',
        resolve: {
          <%= element.elementNameSingular %>: function () {
            var e = {};
            return e;
          }<% if (element.resolveLookups) {%><%= element.resolveLookups %><% } %>
        }
      });
      modalInstance.result.then(function (<%= element.elementNameSingular %>) {
        <%= method.methodcontent %>
        $scope.<%= model.camelCaseSingular %>.<%= element.elementname %>.push(<%= element.elementNameSingular %>);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    
    $scope.remove<%= element.elementNameSingular %> = function (index) {
      $scope.<%= model.camelCaseSingular %>.<%= element.elementname %>.splice(index,1);
    };
    
    <% } %><% } %> <% } %> <% }); %>
    <% } %>
    <% }); %>
	}
]);
<% model.elements.forEach(function(element) { %><% if (element.elementtype === 'Nested' && element.isarray === true) { %>
angular.module('<%= model.paramCasePlural %>').controller('<%= element.elementNameSingular %>InstanceCtrl', function ($scope, $modalInstance, <%= element.elementNameSingular %><% if (element.modelDependencies) { %><% element.modelDependencies.forEach( function (modelDependency) { %>, <%= modelDependency %> <% }) %>)<% } %>{
  $scope.<%= element.elementNameSingular %> = <%= element.elementNameSingular %>;<% if (element.modelDependencies){ %><% element.modelDependencies.forEach( function (modelDependency) { %>
  $scope.<%= modelDependency %> = <%= modelDependency %>;<% }) %><% } %>
  $scope.ok = function () {
    $modalInstance.close($scope.<%= element.elementNameSingular %>);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});<% } %><% }); %>