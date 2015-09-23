'use strict';

//<%= model.titleCasePlural %> service used to communicate <%= model.titleCasePlural %> REST endpoints
angular.module('<%= model.paramCasePlural %>').factory('<%= model.pascalCasePlural %>', ['$resource',
	function($resource) {
		return $resource('<%= model.paramCasePlural %>/:<%= model.camelCaseSingular %>Id', { <%= model.camelCaseSingular %>Id: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);