(function() {
	
	'use strict';
	
	angular.module('spmiFrontEnd.window')
		.controller('WindowController', WindowController)
		
	function WindowController($window) {
		var vm = this;
		
		vm.message = $window.message;
		
		return vm;
	}
})();