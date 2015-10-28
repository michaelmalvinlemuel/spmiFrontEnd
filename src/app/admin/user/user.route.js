(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', UserRoute])
	
	function UserRoute($stateProvider){
		$stateProvider
			.state('main.admin.user', {
				url: '/user',
				views: {
					'content': {
						templateUrl: 'app/admin/user/views/list.html',
						controller: 'UserController'
					}
				}
			})
	
			.state('main.admin.user.create', {
				url: '/create',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/user/views/form.html',
						controller: 'CreateUserController'
					},
				}
			})
	
			.state('main.admin.user.update', {
				url: '/update/:userId',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/user/views/form.html',
						controller: 'UpdateUserController'
					},
				}
			})
	}

})();