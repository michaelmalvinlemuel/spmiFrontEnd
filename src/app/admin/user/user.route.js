(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(UserRoute)
	
	function UserRoute($stateProvider){
		$stateProvider
			.state('main.admin.user', {
				url: '/user',
				views: {
					'content': {
						templateUrl: 'app/admin/user/views/list.html',
						controller: 'UserController as vm'
					}
				},
				resolve: {
					users: function(UserService){
						return UserService.get();
					}
				}
			})
	
			.state('main.admin.user.create', {
				url: '/create',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/user/views/form.html',
						controller: 'CreateUserController as vm'
					},
				}
			})
	
			.state('main.admin.user.update', {
				url: '/:userId',
				views: {
					'content@main.admin': {
						templateUrl: 'app/admin/user/views/form.html',
						controller: 'UpdateUserController as vm'
					},
				},
				resolve: {
					user: function($stateParams, UserService){
						return UserService.show($stateParams.userId);
					}
				}
			})
	}

})();