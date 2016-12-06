(function() {
	
	'use strict';
	
	angular.module('spmiFrontEnd')
		.controller('WindowProjectController', WindowProjectController)
		
	function WindowProjectController($window) {
		
		var vm = this;
		
		vm.msg = $window.message;
		
		return vm;
	}
	
})();