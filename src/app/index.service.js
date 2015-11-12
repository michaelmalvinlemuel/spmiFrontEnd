(function(){
	
	'use strict'
	
	angular
		.module('spmiFrontEnd')
		.factory('Authorization', Authorization)
		
	//Authorization.$inject =  ['$rootScope', '$state','$http', '$timeout', '$q', '$auth', 'UserService', 'API_HOST' ]
	function Authorization ($log, $rootScope, $state, $timeout, $q, $auth, UserService, CURRENT_USER) {
		
		function Authorization(){
			var self = this
			
			self.isAuthenticated = function (){
				
				var deferred = $q.defer()
				$timeout(function(){
					if($auth.isAuthenticated()){
						$log.info($auth.isAuthenticated())
						if (CURRENT_USER.id !== null && CURRENT_USER.id !== '' && CURRENT_USER.id !== undefined){
							$log.debug('Curent user exist: ' + CURRENT_USER.id)
							return CURRENT_USER
						} else {
							$log.warn('Curent user need to be fetched from database')
							return UserService.identity();
						}
					} else {
						$log.error('Current user not authenticated. login needed')
						deferred.reject()
						CURRENT_USER = {}
						$state.go('login');
					}
				},0).then(function(data){
					console.log(data)
					CURRENT_USER.id = data.id
					CURRENT_USER.name = data.name
					CURRENT_USER.type = data.type
					CURRENT_USER.status = data.status
					CURRENT_USER.nik = data.nik
					deferred.resolve()
				})
				
				return deferred.promise
			}
			
			self.authorize = function () {
				console.log('2 authorize')
				
				var deferred = $q.defer();
				UserService.identity()
					.then(function(response) {
						deferred.resolve();
						if ($rootScope.toState.data.type && $rootScope.toState.data.type.length > 0 &&
							!UserService.isInAnyRole($rootScope.toState.data.type)) {
		
							$state.go('main.denied')
						}
		
						if ($rootScope.toState.name == 'login') {
							$state.go($rootScope.fromState.name)
						}
		
					}, function(response) {
							deferred.resolve();
							$state.go('login')
					})
				
				return deferred.promise
			}
			
		}
		
		return new Authorization();
	}
})();