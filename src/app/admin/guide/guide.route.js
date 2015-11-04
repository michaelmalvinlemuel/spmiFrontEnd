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
						controller: 'GuideController as vm'
					}
				},
				resolve: {
					guides: function(GuideService){
						return GuideService.get()
					}
				}
			})
	
			.state('main.admin.guide.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/guide/views/form.html',
						controller: 'CreateGuideController as vm'
					}
				},
				resolve: {
					standards: function(StandardService){
						return StandardService.get()
					}
				}
			})
	
			.state('main.admin.guide.update', {
				url: '/update/:guideId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/guide/views/form.html',
						controller: 'UpdateGuideController as vm'
					}
				},
				resolve: {
					guide: function($stateParams, GuideService){
						return GuideService.show($stateParams.guideId)
					},
					standards: function(StandardService){
						return StandardService.get()
					}
				}
			})
	}

})();