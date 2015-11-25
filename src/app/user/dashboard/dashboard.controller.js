(function () {
	'use strict'
	angular.module('spmiFrontEnd')
		.controller('EndUserController',  EndUserController)	
		
	function EndUserController ($state, $auth, CURRENT_USER, APP_DEBUG) {
		var user = this;

		user.user = CURRENT_USER
		user.debug = APP_DEBUG;
		
		user.logout = function(){
			$auth.logout().then(function(){
				CURRENT_USER = {}
				$state.go('login', {sender: 'system'});
			}, function(response){})
		}
		
		return user;
	}	
	
})();



