(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('GuideService', GuideService)

	function GuideService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, Upload, API_HOST, FILE_HOST) {
		
		function GuideService() {
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function (){
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/guide')
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise; 
			}
			
			self.show = function(request){
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/guide/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise;
			}
				
			self.store = function(request){
				request.directory = 'guide';
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
					return $http.post(API_HOST + '/guide', request);
				}).then(function(response){
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, (function() {
					progress.complete();
					return $rootScope.errorHandler
				})());
				
				return deferred.promise;
			}
			
			self.update = function(request){
				request.directory = 'guide';
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
						return $http.patch(API_HOST + '/guide/' + request.id, request);
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
					$http.patch(API_HOST + '/guide/' + request.id, request).then(function(response) {
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
			
			self.destroy = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/guide/' + request)
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
			
			self.standardDocument = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/guide/standardDocument/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise; 
			}
			
			self.validatingNo = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/guide/validating/no/' + encodeURI(request.no) + '/' + request.id)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, (function() {
						progress.complete();
						return $rootScope.errorHandler
					})());
				return deferred.promise; 
			}
			
			self.validatingDescription = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/guide/validating/description/' + encodeURI(request.description) + '/' + request.id)
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
		
		return new GuideService()
	}
})();