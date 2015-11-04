(function () {
	
	angular.module('spmiFrontEnd')
		.controller('EndUserController',  EndUserController)	
		
	function EndUserController ($state, $auth, CURRENT_USER) {
		var user = this;
		user.debug = true
		user.user = CURRENT_USER
	
		user.logout = function () {
			$auth.logout().then(function(){
				$state.go('login');
			}, function(data){})
		}
		
		return user;
	}	
	
})();



