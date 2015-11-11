(function() {
	
	angular
		.module('spmiFrontEnd')
		.controller('LoginController', LoginController)
		
	function LoginController ($scope, $state, $stateParams, $sanitize, $auth, CURRENT_USER, UserService) {
		
		var vm = this
		
		vm.input = {}
		vm.validated = false
		vm.errorLogin = false
		vm.alert = {}
	
		vm.load = function () {
			
		}

		vm.submit = function () {
	
			$scope.LoginForm.email.$setDirty();
			$scope.LoginForm.password.$setDirty();
			
			if ($scope.LoginForm.$valid) {
				
				vm.input.email = $sanitize(vm.input.email);
				vm.input.password = $sanitize(vm.input.password);
				
				$auth.login(vm.input).then(function(data){
					return UserService.identity()
				}).then(function(data){
					CURRENT_USER.id = data.id
					CURRENT_USER.name = data.name
					CURRENT_USER.type = data.type
					CURRENT_USER.status = data.status
					CURRENT_USER.nik = data.nik
					if(data.status == 2){
						if(data.type == 1){
							$state.go('main');
						}
						if(data.type == 2){
							$state.go('main.user');
						}
						
					}
					
				}, function(){})
	
			} else {
				vm.validated = true;
			}
		}
	
		vm.register = function() {
			$state.go('register')
		}
	
		vm.load();
		
		return vm
	}
})();