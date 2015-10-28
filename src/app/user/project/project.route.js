(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', ProjectRouter])
	
	function ProjectRouter($stateProvider){
		$stateProvider
			.state('main.user.project', {
				url: '/project',
				views: {
					'content': {
						templateUrl: 'app/user/project/views/list.html',
						controller: 'UserProjectController'
					}
				}
			})
	
			.state('main.user.project.detail', {
				url: '/:projectId',
				views: {
					'content@main.user': {
						templateUrl: 'app/user/project/views/detail.html',
						controller: 'DetailUserProjectController'
					}
				}
			})
			
			.state('main.user.project.detail.form', {
				url: '/:formId',
				views: {
					'content@main.user': {
						templateUrl: 'app/user/project/views/upload.html',
						controller: 'FormDetailUserProjectController'
					}
				}
			})
	}

})();