(function() {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('UserService', UserService)
		.factory('UserJobService', UserJobService)


	function UserService ($rootScope, $http, $q, $timeout, $state, $stateParams, $cacheFactory, ngProgressFactory, API_HOST) {
		
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
				$httpDefaultCache.removeAll();
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				if (force === true) _identity = undefined;
				$http.get(API_HOST + '/authenticate')
					.then(function (response) {
						progress.complete();
						_identity = response.data.user;
						_authenticated = true;
						deferred.resolve(_identity);
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise;
			}
			
			

	
			self.login = function (request) {
		
				
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/user/login', {
						data: request,
						headers: {
							'Content-Type': 'text/plain'
						}
					})
					.then(function (response) {
						progress.complete();
						_identity = response.data;
						_authenticated = true;
						$httpDefaultCache.removeAll()
						deferred.resolve(response);
						//deferred.resolve(_identity);
					}, function (response) {
						_identity = null;
						_authenticated = false;
						//deferred.resolve(response.data);
					})
				return deferred.promise;
			}
	
			self.logout = function() {
				_identity = null;
				_authenticated = false;
				var deferred = $q.defer()
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/user/logout')
					.then(function(response){
						progress.complete();
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
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/user')
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;   
			}
			
			self.show = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/user/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;   
			}
			
			self.lite = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/user/lite/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;   
			}
			
			self.store = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/user', request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;   
			}
			
			self.update = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.patch(API_HOST + '/user/' + request.id, request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;   
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/user/' +  request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;   
			}
			
			self.validatingNik = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/user/validating/nik/' + request.nik + '/' + request.id)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;   
			}
			
			self.validatingEmail = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/user/validating/email/' + request.email + '/' + request.id)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;
			}
			
			self.jobs = function() {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/user/jobs')
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;   
			}
			
			self.register = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/register', request)
					.then(function(response) {
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise
			}
			
			self.administrator = function() {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/user/administrator')
					.then(function(response) {
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise
			}
		}
		return new UserService()
	}
	
	function UserJobService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
		function UserJobService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
					
			
			self.store = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/user/' + request.user_id + '/job', request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;   
			}
			
			self.update = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.patch(API_HOST + '/user/' + request.user_id + '/job/' + request.job_id, request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;   
			}
			
			self.destroy = function(request){
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/user/' + request.user_id + '/job/' + request.job_id)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;
			}
			
		}
		return new UserJobService()
	}
})();