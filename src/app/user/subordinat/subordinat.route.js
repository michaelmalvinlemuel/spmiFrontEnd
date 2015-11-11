(function () {

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
					hierarchy: function(CURRENT_USER, UserService) {
						if ( CURRENT_USER.id ) {
							return UserService.jobs(CURRENT_USER.id);
						} else {
							return UserService.identity().then(function(data) {
								return UserService.jobs(data.id);
							})
						}
					},
				},
			})
	}

})();