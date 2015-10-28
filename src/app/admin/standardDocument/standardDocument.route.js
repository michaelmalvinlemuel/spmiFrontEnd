(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', StandardDocumentRoute])
	
	function StandardDocumentRoute($stateProvider){
		$stateProvider
			.state('main.admin.standarddocument', {
				url: '/standarddocument',
				views: {
					'content': {
						templateUrl: 'app/admin/standardDocument/views/list.html',
						controller: 'StandardDocumentController'
					}
				}
			})
	
			.state('main.admin.standarddocument.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/standardDocument/views/form.html',
						controller: 'CreateStandardDocumentController'
					}
				}
			})
	
			.state('main.admin.standarddocument.update', {
				url: '/update/:standarddocumentId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/standardDocument/views/form.html',
						controller: 'UpdateStandardDocumentController'
					}
				}
			})
	}

})();