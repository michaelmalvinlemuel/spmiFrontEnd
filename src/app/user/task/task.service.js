(function () {
	
	angular.module('spmiFrontEnd')
		.factory('TaskService', TaskService)


	function TaskService ($http, $q, $cacheFactory, Upload, API_HOST) {
		
		function TaskService(){
			
			var self = this;
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function (request) {
				var deferred = $q.defer();
				$http.get(API_HOST + '/task/' + request).then(function(response){
					console.log(response.data);
					deferred.resolve(response.data)
				}, function(response){
					deferred.reject(response.data)
				})
				
				return deferred.promise;
			}
			
			self.show = function (userId, batchId) {
				var deferred = $q.defer();
				$http.get(API_HOST + '/task/' + userId + '/batch/' + batchId).then(function(response){
					deferred.resolve(response.data)
				}, function(response){
					deferred.reject(response.data)
				})
				
				return deferred.promise;
			}
			
			self.retrive = function (userId, jobId, display, progress, complete, overdue, page) {
				var deferred = $q.defer();
				$http.get(API_HOST + '/task/retrive/' + userId + '/' + jobId + '/' + 
					display + '/' + progress + '/' + complete + '/' + overdue + '/?page=' + page)
				.then(function(response){
					$httpDefaultCache.removeAll();
					deferred.resolve(response.data)
				}, function(response){
					deferred.reject(response.data)
				})
				
				return deferred.promise;
			}
			
			self.update = function (request) {
				
			
				
				console.log(request);
				
				var deferred = $q.defer();
				Upload.upload({
					url: API_HOST + '/task/' + request.batch_id,
					data: request,
					transformRequest: function(request){
						request._method = 'PUT';
						return request;
					},
				}).then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response){
					deferred.reject(response.data)
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