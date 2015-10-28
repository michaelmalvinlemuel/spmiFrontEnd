(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', UniversityRoute])
	
	function UniversityRoute($stateProvider){
		$stateProvider
			.state('main.admin.university', {
				url: '/university',
				views: {
					'content': {
						templateUrl: 'app/admin/university/views/list.html',
						controller: 'UniversityController'
					}
				}
			})
	
			.state('main.admin.university.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/university/views/form.html',
						controller: 'CreateUniversityController'
					}
				}
			})
	
			.state('main.admin.university.update', {
				url: '/update/:universityId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/university/views/form.html',
						controller: 'UpdateUniversityController'
					}
				}
			})
	}

})();