(function () {

	angular
		.module('spmiFrontEnd')
		.config(['$stateProvider', InstructionRoute])
	
	function InstructionRoute($stateProvider){
		$stateProvider
			.state('main.admin.instruction', {
				url: '/instruction',
				views: {
					'content': {
						templateUrl: 'app/admin/instruction/views/list.html',
						controller: 'InstructionController'
					}
				}
			})
	
			.state('main.admin.instruction.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/instruction/views/form.html',
						controller: 'CreateInstructionController'
					}
				}
			})
	
			.state('main.admin.instruction.update', {
				url: '/update/:instructionId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/instruction/views/form.html',
						controller: 'UpdateInstructionController'
					}
				}
			})
	}

})();