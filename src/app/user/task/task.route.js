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
					tasks: function(CURRENT_USER, $q, UserService, TaskService){
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
				}
			})
	}

})();