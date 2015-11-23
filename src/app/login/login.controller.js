(function() {
	'use strict'
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
			if (typeof $stateParams.alert !== "undefined") {
				vm.alert = $stateParams.alert;
			} else {
				vm.alert = {};
			}
		}

		vm.submit = function () {
	
			$scope.LoginForm.email.$setDirty();
			$scope.LoginForm.password.$setDirty();
			
			if ($scope.LoginForm.$valid) {
				vm.input.email = $sanitize(vm.input.email);
				vm.input.password = $sanitize(vm.input.password);
				
				$auth.login(vm.input).then(function(data){
					return UserService.identity()
				}, function(data) {
					if (data.status == 401) {
						vm.alert.header = "Credential error"
						vm.alert.message = "Kombinasi username atau password Anda salah, silahkan coba lagi"
					}
					if (data.status == 500) {
						vm.alert.header = "Server Error 500"
						vm.alert.message = "Terjadi kesalahan pada server. Silahkan kontak administrator"
					}
					
					return undefined
				}).then(function(data){
					//console.log(data);
					
					if (typeof data !== "undefined") {
						CURRENT_USER.id = data.id
						CURRENT_USER.name = data.name
						CURRENT_USER.type = data.type
						CURRENT_USER.status = data.status
						CURRENT_USER.nik = data.nik
						CURRENT_USER.email = data.email
						
						if (data.status == 2){
							
							if(data.type == 1){
								
								$state.go('main');
								
							} else if(data.type == 2) {
									
								$state.go('main.user');
									
							} else {
								console.log('login redirect back')
								$state.go('denied', {sender: 'system'});
								
							}
						} else {
							console.log('login redirect back')
							$state.go('register.information', {sender: 'system'});
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