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
				
				var deferred = $q.defer();
				$timeout(function(){
					//check authentication
					if($auth.isAuthenticated()){
						//$log.info($auth.isAuthenticated())
						//if user already login and has cached by application
						if (CURRENT_USER.id !== null && CURRENT_USER.id !== '' && CURRENT_USER.id !== undefined){
							console.log('Curent user exist: ' + CURRENT_USER.id)
							return CURRENT_USER
						} else {
							//if user login and not cached by application
							console.log('Curent user need to be fetched from database')
							return UserService.identity();
						}
					} else {
						//users not login
						console.log('Current user not authenticated. login needed')
						CURRENT_USER = {};
						$rootScope.errorHandler({status: 400})
					}
				},0).then(function(data){
					
					if (typeof data !== "undefined") {
						CURRENT_USER.id = data.id
						CURRENT_USER.name = data.name
						CURRENT_USER.type = data.type
						CURRENT_USER.status = data.status
						CURRENT_USER.nik = data.nik
						CURRENT_USER.email = data.email
						
						if (CURRENT_USER.status == 2) {
							if (CURRENT_USER.type == 1) {
								deferred.resolve();
								console.log('administrator');
								//$state.go('main');
							} else {
								deferred.resolve();
								console.log('users');
								//$state.go('main.user');
							}
						} else {
							console.log('this new registered user not verified yet');
							deferred.resolve();
							$state.go('register.information');
						}
									
						deferred.resolve();
					} else {
						deferred.resolve();
					}
				})
				
				return deferred.promise
			}
			
			self.authenticatedRedirection = function(sender) {
				var deferred = $q.defer()
				
				$timeout(function() {
					if ($auth.isAuthenticated()) {
						console.log('authenticated');
						if ($rootScope.fromState.name !=="") {
							console.log('has previous route');
							
							console.log($rootScope.toState.name);
							console.log(sender);
							if (sender) {
								console.log('send by system');
								deferred.resolve();
							} else {
								console.log('send by user');
								deferred.resolve();
								$state.go($rootScope.fromState.name, $rootScope.fromState.fromStateParams);
							}
							
						} else {
							console.log('new initiation');
							if (CURRENT_USER.id) {
								console.log('already cached')
								deferred.resolve();
							} else {
								UserService.identity().then(function(data) {
									CURRENT_USER.id = data.id
									CURRENT_USER.name = data.name
									CURRENT_USER.type = data.type
									CURRENT_USER.status = data.status
									CURRENT_USER.nik = data.nik
									CURRENT_USER.email = data.email
									
									console.log(CURRENT_USER.status);
									//user already verified
									if (CURRENT_USER.status == 2) {
										
										if (CURRENT_USER.type == 1) {
											$state.go('main');
											deferred.resolve();
										} else {
											$state.go('main.user');
											deferred.resolve();
										}
									} else {
										console.log('this new registered user not verified yet');
										deferred.resolve();
										$state.go('register.information');
									}
									
									
									
								})
							}
						}
					} else {
						console.log('unauthenticated');
						
						if ($rootScope.toState.name == 'login') {
							console.log('accessing login');
							deferred.resolve();
						} else {
							console.log('accessing other redirection');
							if ($rootScope.toState.name == 'register' || $rootScope.toState.name == 'register.information') {
								console.log('unlock register for guest');
								deferred.resolve();
							} else {
								deferred.resolve();
								$state.go('login', {sender: 'system'});
							}
							
						}
					}

				})
				
				return deferred.promise;
				/*
				$timeout(function(){
					//check authentication
					console.log('-4');
					if($auth.isAuthenticated()){
						//if user already login try to go to unauthenticated page
						
						console.log('-3');
						//if current application cached user information
						if (CURRENT_USER.id !== null && CURRENT_USER.id !== '' && CURRENT_USER.id !== undefined){
							console.log('-2');
							console.log('Curent user exist: ' + CURRENT_USER.id)
							deferred.resolve(CURRENT_USER);
						} else {
							console.log('-1');
							//if user login and not cached by application
							console.log('Curent user need to be fetched from database')
							deferred.resolve(UserService.identity());
						}
					} else {
						console.log('0');
						//allow users to go to unautenticated page;
						CURRENT_USER = {}
						console.log($rootScope.toState.name);
						deferred.resolve();
						//$state.go($rootScope.toState.name, {alert: {}});
					}
					
					return deferred.promise;
					
				},0)
				
				.then(function (data) {
				
					console.log('1');
					console.log(data);
					//redirect back to from state if they already authenticated
					if (typeof data !== "undefined") {
						CURRENT_USER.id = data.id
						CURRENT_USER.name = data.name
						CURRENT_USER.type = data.type
						CURRENT_USER.status = data.status
						CURRENT_USER.nik = data.nik
						deferred.resolve();
						
						console.log('2');
						//when user has enter application and try accessing via url
						if ($rootScope.fromState.name !== "") {
							//if user ilegally access via url
							console.log('3');
							//$state.go($rootScope.fromState.name, $rootScope.fromStateParams)
						} else {
							
							console.log('4');
							if (CURRENT_USER.status == 2){
								console.log('5');
								if(CURRENT_USER.type == 1){
									console.log('6');
									$state.go('main');
								} else {
									console.log('7');
									if(CURRENT_USER.type == 2){
										console.log('8');
										$state.go('main.user');
									} else {
										console.log('9');
										$state.go('register.information');
									}
								}
		
							} else {
								console.log('10');
								$state.go('denied');
							}
						}
					} else {
						console.log('11');
						
						console.log('4');
						if (CURRENT_USER.status == 2){
							console.log('5');
							if(CURRENT_USER.type == 1){
								console.log('6');
								$state.go('main');
							} else {
								console.log('7');
								if(CURRENT_USER.type == 2){
									console.log('8');
									$state.go('main.user');
								} else {
									console.log('9');
									$state.go('register.information');
								}
							}
	
						} 
							
						deferred.reject();
						//$state.go('login');
					}
				})
				
				return deferred.promise
				*/
			}
			
		}
		
		return new Authorization();
	}
})();