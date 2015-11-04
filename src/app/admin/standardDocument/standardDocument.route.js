(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', StandardDocumentRoute])
	
	function StandardDocumentRoute($stateProvider){
		$stateProvider
			.state('main.admin.standardDocument', {
				url: '/standardDocument',
				views: {
					'content': {
						templateUrl: 'app/admin/standardDocument/views/list.html',
						controller: 'StandardDocumentController as vm'
					}
				},
				resolve: {
					standardDocuments: function(StandardDocumentService){
						return StandardDocumentService.get()
					}
				}
			})
	
			.state('main.admin.standardDocument.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/standardDocument/views/form.html',
						controller: 'CreateStandardDocumentController as vm'
					}
				},
				resolve: {
					standards: function(StandardService){
						return StandardService.get()
					}
				}
			})
	
			.state('main.admin.standardDocument.update', {
				url: '/update/:standardDocumentId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/standardDocument/views/form.html',
						controller: 'UpdateStandardDocumentController as vm'
					}
				},
				resolve: {
					standardDocument: function($stateParams, StandardDocumentService){
						return StandardDocumentService.show($stateParams.standardDocumentId)
					},
					standards: function(StandardService){
						return StandardService.get();
					}
				}
			})
	}

})();