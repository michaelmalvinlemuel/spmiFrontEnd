(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.factory('InstructionService', InstructionService)

	function InstructionService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, Upload, API_HOST, FILE_HOST) {
		
		function InstructionService(){
			
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/instruction')
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
				$http.get(API_HOST + '/instruction/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
			
			self.store = function(request){
				request.directory = 'instruction';
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
					return $http.post(API_HOST + '/instruction', request);
				}).then(function(response){
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				});
				
				return deferred.promise;
			}
			
			self.update = function(request){
				request.directory = 'instruction';
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
						return $http.patch(API_HOST + '/instruction/' + request.id, request);
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					}).then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data);
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				} else {
					$http.patch(API_HOST + '/instruction/' + request.id, request).then(function(response) {
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data);
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					})
				}
				return deferred.promise;
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.delete(API_HOST + '/instruction/' + request)
					.then(function(response){
						progress.complete();
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
			
			self.guide = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/instruction/guide/' + request)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
			
			self.validatingNo = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/instruction/validating/no/' + encodeURI(request.no) + '/' + request.id)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
			
			self.validatingDescription = function(request) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/instruction/validating/description/' + encodeURI(request.description) + '/' + request.id)
					.then(function(response){
						progress.complete();
						deferred.resolve(response.data)
					}, function(data) {
						progress.complete();
						deferred.reject($rootScope.errorHandler(data));
					});
				return deferred.promise;  
			}
		}
		
		return new InstructionService()
	}
})();