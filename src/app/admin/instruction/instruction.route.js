(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.config(InstructionRoute)
	
	function InstructionRoute($stateProvider){
		$stateProvider
			.state('main.admin.instruction', {
				url: '/instruction',
				views: {
					'content': {
						templateUrl: 'app/admin/instruction/views/list.html',
						controller: 'InstructionController as vm'
					}
				},
				resolve: {
					instructions: function(InstructionService){
						return InstructionService.get()
					}
				}
			})
	
			.state('main.admin.instruction.create', {
				url: '/create',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/instruction/views/form.html',
						controller: 'CreateInstructionController as vm'
					}
				},
				resolve: {
					standards: function(StandardService){
						return StandardService.get()
					}
				}
			})
	
			.state('main.admin.instruction.update', {
				url: '/:instructionId',
				views: {
					'content@main.admin' : {
						templateUrl: 'app/admin/instruction/views/form.html',
						controller: 'UpdateInstructionController as vm'
					}
				},
				resolve: {
					instruction: function($stateParams, InstructionService){
						return InstructionService.show($stateParams.instructionId);
					},
					standards: function(StandardService){
						return StandardService.get();
					}
				}
			})
	}

})();