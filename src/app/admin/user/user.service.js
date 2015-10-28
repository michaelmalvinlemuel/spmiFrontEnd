(function() {
	
	angular
		.module('spmiFrontEnd')
		.factory('UserService', ['$http', '$q', '$timeout', '$state', '$stateParams', '$cacheFactory', UserService])
		.factory('UserJobService', ['$http', '$q', '$cacheFactory', UserJobService])


	function UserService ($http, $q, $timeout, $state, $stateParams, $cacheFactory) {
		
		function UserService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			var _identity = undefined
			var _authenticated = false;
			
			
			self.isIdentityResolved = function() {
				return angular.isDefined(_identity);
			}
		
			self.isAuthenticated = function() {
				return _authenticated;
			}
			
			self.isInRole = function(role) {
				
				if (!_authenticated || !_identity.type) {
					return false;
				}
				var a = _identity.type;
				return _identity.type.indexOf(role) !== -1;
			}
		
			self.isInAnyRole = function(type) {
				if (!_authenticated || !_identity.type) {
					return false;
				}
	
				for (var i = 0; i < type.length; i++) {
					if (this.isInRole(type[i])) {
						return true;
					}
				}
	
				return false;
			}
		
			self.authenticate = function(identity) {
				_identity = identity;
				_authenticated = identity != null;
			}
			
			self.identity = function(force) {
				var deferred = $q.defer();
				if (force === true) _identity = undefined;
				$http.get('/user')
					.then(function (response) {
						_identity = response.data;
						_authenticated = true;
						deferred.resolve(_identity);
					}, function (response) {
						_identity = null;
						_authenticated = false;
						console.log('identity failure');
						deferred.reject(response);
					})
				return deferred.promise;
			}
	
			self.login = function (request) {
				var deferred = $q.defer();
				$http.post('/user/login', request)
					.then(function (response) {
						_identity = response.data;
						_authenticated = true;
						$httpDefaultCache.removeAll()
						deferred.resolve(_identity);
					}, function (response) {
						_identity = null;
						_authenticated = false;
						deferred.resolve(response.data);
					})
				return deferred.promise;
			}
	
			self.logout = function() {
				_identity = null;
				_authenticated = false;
				var deferred = $q.defer()
				$http.get('/user/logout')
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
	
			self.session = function() {
				return _identity
			}
	
			self.get = function () {
				var deferred = $q.defer()
				$http.get('/users')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get('/users/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.store = function (request) {
				var deferred = $q.defer()
				$http.post('/user/store', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.update = function (request) {
				var deferred = $q.defer()
				$http.post('/user/update', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.post('/user/destroy', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.validatingNik = function(request) {
				var deferred = $q.defer()
				$http.get('/user/validating/nik/' + request.nik + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.validatingEmail = function(request) {
				var deferred = $q.defer()
				$http.get('/user/validating/email/' + request.email + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.jobs = function(request) {
				var deferred = $q.defer()
				$http.get('/user/jobs/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.register = function(request) {
				var deferred = $q.defer();
				$http.post('/user/register', request)
					.then(function(response) {
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response) {
						deferred.reject(response)
					})
				return deferred.promise
			}
		}
		return new UserService()
	}
	
	function UserJobService ($http, $q, $cacheFactory) {
		function UserJobService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function (request) {
				var deferred = $q.defer()
				$http.get('/userjobs/get/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get('/userjobs/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.store = function (request) {
				var deferred = $q.defer()
				$http.post('/userjob/store', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.update = function (request) {
				var deferred = $q.defer()
				$http.post('/userjob/update', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.post('/userjob/destroy', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.validatingJob = function(request) {
				var deferred = $q.defer()
				$http.get('/userjob/validating/job/' + request.job_id + '/' + request.user_id + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;   
			}
		}
		return new UserJobService()
	}
})()