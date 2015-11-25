(function () {
	
	'use strict'
	
	angular.module('spmiFrontEnd')
		.factory('TaskService', TaskService)


	function TaskService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, Upload, API_HOST, FILE_HOST) {
		
		function TaskService(){
			
			var self = this;
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/task').then(function(response){
					progress.complete();
					console.log(response.data);
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
				
				return deferred.promise;
			}
			
			self.show = function (batchId) {
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				$http.get(API_HOST + '/task/' + batchId).then(function(response){
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
				
				return deferred.promise;
			}
			
			//for subordinate task browse
			self.retrive = function (userId, jobId, display, progress, complete, overdue, page) {
				var deferred = $q.defer();
				var progress1 = ngProgressFactory.createInstance();
				progress1.start();
				$http.get(API_HOST + '/task/retrive/' + userId + '/' + jobId + '/' + 
					display + '/' + progress + '/' + complete + '/' + overdue + '?page=' + page)
				.then(function(response){
					progress1.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress1.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
				
				return deferred.promise;
			}
			
			self.update = function (request) {
				//console.log(request);
				
				var deferred = $q.defer();
				var progress = ngProgressFactory.createInstance();
				progress.start();
				request.directory = 'task';
				$http.get(API_HOST + '/authenticate')
				.then(function(response) {
					request.nik = response.data.user.nik;
					request.name = response.data.user.name;
					
					return Upload.upload({
						url: FILE_HOST + '/upload.multiple.php',
						data: request
					})
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
				.then(function(response){
					request.files = response.data;
					console.log(request);
					return $http.patch(API_HOST + '/task/' + request.batch_id, request)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})

				return deferred.promise;
			}
		}
		
		return new TaskService();
	}

})();