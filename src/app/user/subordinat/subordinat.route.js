(function () {
	
	'use strict'
	
	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', SubordinatRouter])
	
	function SubordinatRouter($stateProvider){
		$stateProvider
			.state('main.user.subordinat', {
				url: '/subordinat',
				views: {
					'content': {
						templateUrl: 'app/user/subordinat/views/list.html',
						controller: 'SubordinatController as vm'
					}
				},
				resolve: {
					hierarchy: function(UserService) {
						return UserService.jobs();
					},
				},
			})
	}

})();