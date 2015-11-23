(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('JobService', JobService)


	function JobService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
		
		function JobService() {
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
	
			
			self.get = function () {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/job')
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise 
			}
			
			self.lite = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/job/lite/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise 
			}
			
			self.show = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/job/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise 
			}
			
			self.store = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.post(API_HOST + '/job', request)
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
				$http.patch(API_HOST + '/job/' + request.id, request)
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
			
			self.destroy = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/job/' + request)
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
			
			self.department = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/job/department/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise 
			}
			
			self.university = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/job/university/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise 
			}
			
			self.validating = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/job/validating/' + encodeURI(request.name) + '/' + request.department_id + '/' + request.id)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise 
			}
			
			self.users = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/job/users/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise
	
			}
			
			self.subs = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/job/subs/' + request)
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
		
		return new JobService()
	}
})();