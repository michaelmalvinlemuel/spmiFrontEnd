(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', StandardRoute])
	
	function StandardRoute($stateProvider){
		$stateProvider
			.state('main.admin.standard', {
				url: '/standard',
				views: {
					'content': {
						templateUrl: 'app/admin/standard/views/list.html',
						controller: 'StandardController'
					}
				}
			})
	
			.state('main.admin.standard.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/standard/views/form.html',
						controller: 'CreateStandardController'
					}
				}
			})
	
			.state('main.admin.standard.update', {
				url: '/update/:standardId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/standard/views/form.html',
						controller: 'UpdateStandardController'
					}
				}
			})
	}

})();