(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', WorkRoute])
	
	function WorkRoute($stateProvider){
		$stateProvider
			.state('main.admin.work', {
				url: '/work',
				views: {
					'content': {
						templateUrl: 'app/admin/work/views/list.html',
						controller: 'WorkController'
					}
				}
			})
	
			.state('main.admin.work.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/work/views/form.html',
						controller: 'CreateWorkController'
					}
				}
			})
	
			.state('main.admin.work.update', {
				url: '/update/:workId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/work/views/form.html',
						controller: 'UpdateWorkController'
					}
				}
			})
	}

})();