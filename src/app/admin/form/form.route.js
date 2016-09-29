(function (angular) {
	'use strict'
	angular.module('spmiFrontEnd')
		.config(FormRoute)
	
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
						return FormService.get({perPage: 10, currentPage:1});
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
						return StandardService.retrive()
					}
				}
			})
	
			.state('main.admin.form.update', {
				url: '/:formId',
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
						return StandardService.retrive();
					}
				}
			})
	}

})(angular);