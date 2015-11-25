(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('WorkService', WorkService)
		.factory('WorkFormService',  WorkFormService)
		
	function WorkService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST){
	
		function WorkService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function() {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/work')
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise; 
			}
			
			self.lite = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/work/lite/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;
			}
			
			self.show = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/work/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;
			}
			
			self.store = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/work', request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise; 
			}
			
			self.update = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.patch(API_HOST + '/work/' + request.id, request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/work/' + request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise; 
			}
			
			self.execute = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/work/execute/' + request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;
			}
			
			self.validatingName = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/work/validating/name/' + encodeURI(request.name) + '/' + request.id)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;
			}
			
			self.eventToggle = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/work/event/' + request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;
			}
			
			self.startAllEvent = function () {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/work/event/start')
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;
			}
			
			self.pauseAllEvent = function () {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/work/event/pause')
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;
			}
			
			self.executeAllWork = function () {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/work/execute/all')
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;
			}
			
		}
		
		return new WorkService()
	}
	
	function WorkFormService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
		function WorkFormService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
		
				
			self.store = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/work/' + request.work_id + '/form', request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise; 
			}
				
			self.update = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.patch(API_HOST + '/work/' + request.work_id + '/form/' + request.form_id, request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise; 
			}
				
			self.destroy = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/work/' + request.work_id + '/form/' + request.form_id)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise; 
			}
				
		}
		
		return new WorkFormService()
	}

})();