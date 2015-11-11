(function () {

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
					tasks: function(CURRENT_USER, UserService, TaskService){
						if(CURRENT_USER.id){
							return TaskService.get(CURRENT_USER.id)	
						} else {
							return UserService.identity().then(function(data){
								return TaskService.get(data.id);
							}); 
						}
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
					task: function($stateParams, CURRENT_USER, UserService, TaskService){
						console.log('ini anjing:' + $stateParams.batchId);
						if(CURRENT_USER.id){
							return TaskService.show(CURRENT_USER.id, $stateParams.batchId)
						} else {
							return UserService.identity().then(function(data){
								
								return TaskService.show(data.id, $stateParams.batchId)
							})
						}
					},
				},
			})
	}

})();