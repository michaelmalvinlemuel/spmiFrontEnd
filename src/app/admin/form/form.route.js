(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', FormRoute])
	
	function FormRoute($stateProvider){
		$stateProvider
			.state('main.admin.form', {
				url: '/form',
				views: {
					'content': {
						templateUrl: 'app/admin/form/views/list.html',
						controller: 'FormController'
					}
				}
			})
	
			.state('main.admin.form.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/form/views/form.html',
						controller: 'CreateFormController'
					}
				}
			})
	
			.state('main.admin.form.update', {
				url: '/update/:formId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/form/views/form.html',
						controller: 'UpdateFormController'
					}
				}
			})
	}

})();