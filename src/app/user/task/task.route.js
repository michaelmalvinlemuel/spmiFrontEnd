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
						controller: 'TaskController'
					}
				}
			})
	
			.state('main.user.task.form', {
				url:'/:batchId',
				views: {
					'content@main.user': {
						templateUrl: 'app/user/task/views/form.html',
						controller: 'TaskFormController'
					}
				}
			})
	}

})();