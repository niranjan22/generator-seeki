'use strict';

// <%= model.pascalCasePlural %> controller
angular.module('<%= model.paramCasePlural %>').controller('<%= model.pascalCasePlural %>Controller', ['$scope', '$stateParams', '$location', 'Authentication', '<%= model.pascalCasePlural %>',  <% if(qservices) { %> '<%= qservices %>', <% } %>
	function($scope, $stateParams, $location, Authentication, <%= model.pascalCasePlural %> <% if(services) { %>, <%= services %> <% } %>) {
		$scope.authentication = Authentication;

		// Create new <%= model.pascalCaseSingular %>
		$scope.create = function() {
			// Create new <%= model.pascalCaseSingular %> object
			var <%= model.camelCaseSingular %> = new <%= model.pascalCasePlural %> ({
        <% model.elements.forEach(function(element) { %><%= element.elementname %>: this.<%= element.elementname %>,
        <% }); %>      
        created: Date.now
			});

			// Redirect after save
			<%= model.camelCaseSingular %>.$save(function(response) {
				$location.path('<%= model.paramCasePlural %>/' + response._id);

				// Clear form fields
        <% model.elements.forEach(function(element) { %>$scope.<%= element.elementname %>= null;
        <% }); %>             
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

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

		// Update existing <%= model.pascalCaseSingular %>
		$scope.update = function() {
			var <%= model.camelCaseSingular %> = $scope.<%= model.camelCaseSingular %>;

			<%= model.camelCaseSingular %>.$update(function() {
				$location.path('<%= model.paramCasePlural %>/' + <%= model.camelCaseSingular %>._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of <%= model.pascalCasePlural %>
		$scope.find = function() {
			$scope.<%= model.camelCasePlural %> = <%= model.pascalCasePlural %>.query();
		};

		// Find existing <%= model.pascalCaseSingular %>
		$scope.findOne = function() {
      <%= model.pascalCasePlural %>.get({ 
				<%= model.camelCaseSingular %>Id: $stateParams.<%= model.camelCaseSingular %>Id
			})
      .$promise.then(function(data) {
        <% model.elements.forEach(function(element) { %><% if(element.elementtype == "Date"){ %>data.<%= element.elemetname %> = moment(data.<%= element.elemetname %>).format('YYYY-MM-DD');
        <% } %><% }); %>
        $scope.<%= model.camelCaseSingular %> = data;
      }, function(reason) {
        console.log('Failed: ' + reason);
      });      
      
      
		};
	}
]);