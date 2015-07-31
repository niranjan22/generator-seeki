'use strict';

// <%= view.modelname %> controller
angular.module('<%= view.modelparampluralname %>').controller('<%= view.modelpluralname %>Controller', ['$scope', '$stateParams', '$location', 'Authentication', '<%= view.modelpluralname %>',
	function($scope, $stateParams, $location, Authentication, <%= view.modelpluralname %>) {
		$scope.authentication = Authentication;

		// Create new <%= view.modelname %>
		$scope.create = function() {
			// Create new <%= view.modelname %> object
			var <%= view.modelname.toLowerCase() %> = new <%= view.modelpluralname %> ({
        <% view.controls.forEach(function(control) { %>
        <%= control.modelelement %>: this.<%= control.modelelement %>,
        <% }); %>      
        created: Date.now
  
			});

			// Redirect after save
			<%= view.modelname.toLowerCase() %>.$save(function(response) {
				$location.path('<%= view.modelparampluralname %>/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing <%= view.modelname %>
		$scope.remove = function(<%= view.modelname.toLowerCase() %>) {
			if ( <%= view.modelname.toLowerCase() %> ) { 
				<%= view.modelname.toLowerCase() %>.$remove();

				for (var i in $scope.<%= view.modelpluralname %>) {
					if ($scope.<%= view.modelpluralname.toLowerCase() %> [i] === <%= view.modelname.toLowerCase() %>) {
						$scope.<%= view.modelpluralname.toLowerCase() %>.splice(i, 1);
					}
				}
			} else {
				$scope.<%= view.modelname.toLowerCase() %>.$remove(function() {
					$location.path('<%= view.modelparampluralname %>');
				});
			}
		};

		// Update existing <%= view.modelname %>
		$scope.update = function() {
			var <%= view.modelname.toLowerCase() %> = $scope.<%= view.modelname.toLowerCase() %>;

			<%= view.modelname.toLowerCase() %>.$update(function() {
				$location.path('<%= view.modelparampluralname %>/' + <%= view.modelname.toLowerCase() %>._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of <%= view.modelname %>
		$scope.find = function() {
			$scope.<%= view.modelpluralname.toLowerCase() %> = <%= view.modelpluralname %>.query();
		};

		// Find existing <%= view.modelname %>
		$scope.findOne = function() {
			$scope.<%= view.modelname.toLowerCase() %> = <%= view.modelpluralname %>.get({ 
				<%= view.modelname.toLowerCase() %>Id: $stateParams.<%= view.modelname.toLowerCase() %>Id
			});
		};
	}
]);