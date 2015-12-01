(function () {
	'use strict'
	angular.module('spmiFrontEnd')
		.controller('EndUserController',  EndUserController)	
		
	function EndUserController ($state, $auth, CURRENT_USER) {
		var user = this;

		user.user = CURRENT_USER
		
		user.logout = function(){
			$auth.logout().then(function(){
				CURRENT_USER = {}
				$state.go('login', {sender: 'system'});
			}, function(response){})
		}
		
		return user;
	}	
	
})();



