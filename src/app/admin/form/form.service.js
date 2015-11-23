(function() {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('FormService', FormService)
	
	function FormService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, Upload, API_HOST, FILE_HOST) {
		function FormService() {
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/form')
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
				$http.get(API_HOST + '/form/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise 
			}
			
			self.store = function(request){
				request.directory = 'form';
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				Upload.upload({
					url: FILE_HOST + '/upload.php',
					data: request,
				}).then(function(response) {
					delete request.file;
					delete request.directory;
					request.filename = response.data;
					return $http.post(API_HOST + '/form', request);
				}).then(function(response){
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				},  (function() {
					progress.complete();
					return $rootScope.errorHandler
				})());
				
				return deferred.promise;
			}
				
			self.update = function(request){
				request.directory = 'form';
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				
				if (request.file) {
					Upload.upload({
						url: FILE_HOST + '/upload.php', 
						data: request,
					}).then(function(response) {
						delete request.file;
						delete request.directory;
						request.filename = response.data;
						return $http.patch(API_HOST + '/form/' + request.id, request);
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})()).then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data);
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				} else {
					$http.patch(API_HOST + '/form/' + request.id, request).then(function(response) {
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data);
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				}
				return deferred.promise;
			}
				
			self.destroy = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/form/' + request)
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
				
			self.instruction = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/form/instruction/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise 
			}
				
			self.validatingNo = function(request) {
				
				console.log(encodeURIComponent(request.no))
				console.log(encodeURI(request.no))
				
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/form/validating/no/' + request.no + '/' + request.id)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})())
				return deferred.promise 
			}
				
			self.validatingDescription = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/form/validating/description/' + request.description + '/' + request.id)
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
		
		return new FormService()
	}
})();