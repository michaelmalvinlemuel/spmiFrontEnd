(function(angular){
	
	'use strict'
	
	angular.module('spmiFrontEnd')
		.factory('Authorization', Authorization)
		
	//Authorization.$inject =  ['$rootScope', '$state','$http', '$timeout', '$q', '$auth', 'UserService', 'API_HOST' ]
	function Authorization ($log, $rootScope, $state, $timeout, $q, $auth, UserService, CURRENT_USER) {
		
		function Authorization(){
			var self = this
			
			//this wassent implement denied;
			self.isAuthenticated = function (sender){
				
				var deferred = $q.defer();
				$timeout(function(){
					//check authentication
					if($auth.isAuthenticated()) {
						
						return UserService.identity();
					
					} else {
						//users not login
						console.log('4');
						CURRENT_USER = {};
						$rootScope.errorHandler({status: 400})
					}
					
				}).then(function(data){
					
					
					if (typeof data.id !== "undefined") {
						
						//console.log('5');
						CURRENT_USER.id = data.id
						CURRENT_USER.name = data.name
						CURRENT_USER.type = data.type
						CURRENT_USER.status = data.status
						CURRENT_USER.nik = data.nik
						CURRENT_USER.email = data.email
						console.log(CURRENT_USER.status);
						
						if (CURRENT_USER.status === '2') {
							
							//console.log('6');
							if (CURRENT_USER.type === '1') {
								
								//console.log('7');
								//$state.go('main');	//<----------- this is our trouble
								deferred.resolve();
								
							} else if (CURRENT_USER.type === '2') {
								
								//console.log('8');
								console.log(sender);
                                if (sender === null) {
                                    $state.go('main.user', { sender: 'system'});    
                                }
                                
								deferred.resolve();
								
							} else {
								
								//console.log('9');
								$state.go('denied', { sender: 'system' });
								deferred.resolve();
								
							}
						} else {
							
							//console.log('10');
							$state.go('register.information');
							deferred.resolve();
							
						}
                        
					} else {
						
						//console.log('11');
						//$state.go('login', { sender: 'system' });
						deferred.resolve();
						
					}
				})
				
				return deferred.promise
			}
			
			self.authenticatedRedirection = function(sender) {
				var deferred = $q.defer()
				
				$timeout(function() {
					if ($auth.isAuthenticated()) {
						
						//console.log('12');
						//console.log('authenticated');
						if ($rootScope.fromState.name !=="") {
							//console.log('has previous route');
							
							//console.log($rootScope.toState.name);
							//console.log(sender);
							
							//console.log('13');
							if (sender) {
								//console.log('send by system');
								deferred.resolve();
							} else {
								//console.log('send by user');
								//console.log('14');
								$state.go($rootScope.fromState.name, $rootScope.fromState.fromStateParams);
								deferred.resolve();
								
							}
							
						} else {
							//console.log('new initiation');
							
							//console.log('15');
							if (CURRENT_USER.id) {
								//console.log('already cached')
								deferred.resolve();
							} else {
								
								//console.log('16');
								UserService.identity().then(function(data) {
									CURRENT_USER.id = data.id
									CURRENT_USER.name = data.name
									CURRENT_USER.type = data.type
									CURRENT_USER.status = data.status
									CURRENT_USER.nik = data.nik
									CURRENT_USER.email = data.email
									
									//console.log(CURRENT_USER.status);
									//user already verified
									
									//console.log('17');
									if (CURRENT_USER.status == '2') {
										
										//console.log('18');
										if (CURRENT_USER.type == '1') {
											
											//console.log('19');
											$state.go('main');
											deferred.resolve();
											
										} else {
											
											//console.log('20');
											deferred.resolve();
											$state.go('main.user');
											
										}
									} else {
										//console.log('this new registered user not verified yet');
										//console.log('21');
										$state.go('register.information');
										deferred.resolve();
										
									}
								})
							}
						}
					} else {
						//console.log('unauthenticated');
						
						console.log('22');
						if ($rootScope.toState.name == 'login') {
							//console.log('accessing login');
							//console.log('23');
							deferred.resolve();
							
						} else {
							//console.log('accessing other redirection');
							//console.log('24');
							if ($rootScope.toState.name == 'register' || $rootScope.toState.name == 'register.information') {
								//console.log('unlock register for guest');
								//console.log('25');
								deferred.resolve();
								
							} else {
								
								//console.log('26');
								$state.go('login', {sender: 'system'});
								deferred.resolve();
								
							}
						}
					}

				})
				
				return deferred.promise;
			}
			
		}
		
		return new Authorization();
	}
})(angular);