(function () {
	
	'use strict'
	
	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', TaskRouter])
	
	function TaskRouter($stateProvider){
		$stateProvider
			.state('main.user.task', {
				url: '/task',
				views: {
					'content': {
						templateUrl: 'app/user/task/views/list.html',
						controller: 'TaskController as vm'
					}
				}, 
				resolve: {
					tasks: function(TaskService) {
						return TaskService.get();
					},
				},
			})
	
			.state('main.user.task.form', {
				url:'/:batchId',
				views: {
					'content@main.user': {
						templateUrl: 'app/user/task/views/form.html',
						controller: 'TaskFormController as vm'
					}
				},
				resolve: {
					task: function($stateParams, TaskService) {
						return TaskService.show($stateParams.batchId)
					},
				},
			})
	}

})();