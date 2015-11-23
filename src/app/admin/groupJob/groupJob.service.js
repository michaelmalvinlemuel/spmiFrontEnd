(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('GroupJobService', GroupJobService)
		.factory('GroupJobDetailService', GroupJobDetailService)

	function GroupJobService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {

		function GroupJobService() {
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/groupJob')
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise
			}
			
			self.show = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/groupJob/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise
			}
				
			self.store = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/groupJob', request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise
			}
				
			self.update = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.patch(API_HOST + '/groupJob/' + request.id, request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise
			}
			
			self.destroy = function (request){
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/groupJob/' + request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise
			}
				
			self.validatingName = function (request){
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/groupJob/validating/name/' + encodeURI(request.name) + '/' + request.id)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())		
				return deferred.promise
			}
		}
	
		return new GroupJobService()
	}
	
	function GroupJobDetailService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
		
		function GroupJobDetailService(){
			var self = this;
			var $httpDefaultCache = $cacheFactory.get('$http');
	
			
			self.store = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/groupJob/' + request.groupJob_id + '/job', request).then(function(response){
					progress.complete();
					$httpDefaultCache.removeAll();
					deferred.resolve(response.data);
				}, (function() {
					progress.complete();
					return $rootScope.errorHandler
				})())
				
				return deferred.promise
			}
			
			self.update = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.patch(API_HOST + '/groupJob/' + request.groupJob_id + '/job/' + request.job_id, request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll();
						deferred.resolve(response.data);
				}, (function() {
					progress.complete();
					return $rootScope.errorHandler
				})())
				
				return deferred.promise
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/groupJob/' + request.groupJob_id + '/job/' + request.job_id)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll();
						deferred.resolve(response.data);
				}, (function() {
					progress.complete();
					return $rootScope.errorHandler
				})())
				
				return deferred.promise
			}
		}
		return new GroupJobDetailService();
	}
})();