(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', GuideRoute])
	
	function GuideRoute($stateProvider){
		$stateProvider
			.state('main.admin.guide', {
				url: '/guide',
				views: {
					'content': {
						templateUrl: 'app/admin/guide/views/list.html',
						controller: 'GuideController'
					}
				}
			})
	
			.state('main.admin.guide.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/guide/views/form.html',
						controller: 'CreateGuideController'
					}
				}
			})
	
			.state('main.admin.guide.update', {
				url: '/update/:guideId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/guide/views/form.html',
						controller: 'UpdateGuideController'
					}
				}
			})
	}

})();