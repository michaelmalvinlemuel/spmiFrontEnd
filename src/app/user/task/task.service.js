(function () {
	
	angular.module('spmiFrontEnd')
		.factory('TaskService', ['$http', 'Upload', TaskService])


	function TaskService ($http, Upload) {
		return {
			get: function (request) {
				return $http.get('/tasks/user/' + request)
			},
			show: function (userId, workId) {
				return $http.get('/tasks/' + userId + '/' + workId);
			},
			retrive: function (userId, jobId) {
				return $http.get('/tasks/retrive/' + userId + '/' + jobId)
			},
			update: function (request, files) {
				
				console.log(files);
	
				var rq  = {
					url: '/task/update'
					, method: 'POST'
					, fields: request
					//headers: {'Content-Type': 'multipart/form-data'}
					//, file: [files[1], files[7]]
					//, fileFormDataName: ['document_1','document_7']
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
					url: '/task/update',
					method: 'POST',
					fields: request
					, file: [files[1], files[7]]
					, fileFormDataName: ['document_1','document_7']
				}
				);
				return Upload.upload(rq)
				
				//return $http.post('/task/update', request);
			}
		}
	}

})()