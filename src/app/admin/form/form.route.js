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
						controller: 'FormController as vm'
					}
				},
				resolve:{
					forms: function(FormService){
						return FormService.get();
					}
				}
			})
	
			.state('main.admin.form.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/form/views/form.html',
						controller: 'CreateFormController as vm'
					}
				},
				resolve: {
					standards: function(StandardService){
						return StandardService.get()
					}
				}
			})
	
			.state('main.admin.form.update', {
				url: '/update/:formId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/form/views/form.html',
						controller: 'UpdateFormController as vm'
					}
				},
				resolve: {
					form: function($stateParams, FormService){
						return FormService.show($stateParams.formId);
					},
					standards: function(StandardService){
						return StandardService.get();
					}
				}
			})
	}

})();