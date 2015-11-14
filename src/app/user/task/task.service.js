(function () {
	
	'use strict'
	
	angular.module('spmiFrontEnd')
		.factory('TaskService', TaskService)


	function TaskService ($http, $q, $cacheFactory, Upload, API_HOST, FILE_HOST) {
		
		function TaskService(){
			
			var self = this;
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function () {
				var deferred = $q.defer();
				$http.get(API_HOST + '/task').then(function(response){
					console.log(response.data);
					deferred.resolve(response.data)
				}, function(response){
					deferred.reject(response.data)
				})
				
				return deferred.promise;
			}
			
			self.show = function (batchId) {
				var deferred = $q.defer();
				$http.get(API_HOST + '/task/' + batchId).then(function(response){
					deferred.resolve(response.data)
				}, function(response){
					deferred.reject(response.data)
				})
				
				return deferred.promise;
			}
			
			//for subordinate task browse
			self.retrive = function (userId, jobId, display, progress, complete, overdue, page) {
				var deferred = $q.defer();
				$http.get(API_HOST + '/task/retrive/' + userId + '/' + jobId + '/' + 
					display + '/' + progress + '/' + complete + '/' + overdue + '/?page=' + page)
				.then(function(response){
					//$httpDefaultCache.removeAll();
					deferred.resolve(response.data)
				}, function(response){
					deferred.reject(response.data)
				})
				
				return deferred.promise;
			}
			
			self.update = function (request) {
				//console.log(request);
				
				var deferred = $q.defer();
				request.directory = 'task';
				$http.get(API_HOST + '/authenticate').then(function(response) {
					request.nik = response.data.user.nik;
					request.name = response.data.user.name;
					
					return Upload.upload({
						url: FILE_HOST + '/upload.multiple.php',
						data: request
					})
				}, function(response) {
					deferred.reject(response.data);
				})
				
				.then(function(response){
					//console.log(response);
					request.files = response.data;
					console.log(request);
					return $http.patch(API_HOST + '/task/' + request.batch_id, request)
				}, function(response){
					deferred.reject(response.data)
				})
				
				.then(function(response) {
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response.data);
				})
				
				
				return deferred.promise;
			
				
				/*
				var rq  = {
					url: API_HOST + '/task/update'
					, method: 'POST'
					, fields: request
				}
				
				
				rq['file'] = []
				rq['fileFormDataName'] = []
	
				var counter = 0
				for (var i = 0 ; i < files.length ; i++) {
					if(files[Object.keys(files)[i]]) {
						rq['file'][counter] = files[Object.keys(files)[i]] 
						rq['fileFormDataName'][counter] =  Object.keys(files)[i]
						counter++
					}
					
				}
				
				console.log(rq);
				console.log(
				{
					url: API_HOST + '/task/update',
					method: 'POST',
					fields: request
					, file: [files[1], files[7]]
					, fileFormDataName: ['document_1','document_7']
				}
				);
				return Upload.upload(rq)
				
				//return $http.post('/task/update', request);
				*/
			}
		}
		
		return new TaskService();
	}

})();