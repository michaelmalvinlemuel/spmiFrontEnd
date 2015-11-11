(function() {

	angular.module('spmiFrontEnd')
		.factory('ProjectService', ['$http', '$state', '$q', '$cacheFactory', 'Upload', 'API_HOST', ProjectService])


	function ProjectService ($http, $state, $q, $cacheFactory, Upload, API_HOST) {
	
		var project = {}
		
		
		var $httpDefaultCache = $cacheFactory.get('$http');
		
		project.flushNode = function() {
	
			this.createNode = function() {}
			this.updateNode = function() {}
			this.deleteNode = function() {}
	
			this.createNodeForm = function() {}
			this.deleteNodeForm = function() {}
	
			this.createNodeFormItem = function() {}
			this.updateNodeFormItem = function() {}
			this.deleteNodeFormItem = function() {}
	
			this.delegateNode = function() {}
			this.detailForm = function() {}
		};
		
		project.setUserId = function(userId) {
			this.userId = userId
		};
	
		project.setCreateNode = function(fn) {
			this.createNode = fn
		};
	
		project.setUpdateNode = function(fn) {
			this.updateNode = fn
		};
	
		project.setDeleteNode = function (fn) {
			this.deleteNode = fn
		};
	
	
		project.setCreateNodeForm = function(fn) {
			this.createNodeForm = fn
		};
	
		project.setDeleteNodeForm = function(fn) {
			this.deleteNodeForm = fn
		};
	
	
		project.setCreateNodeFormItem = function(fn){
			this.createNodeFormItem = fn
		};
	
		project.setUpdateNodeFormItem = function(fn) {
			this.updateNodeFormItem = fn
		};
	
		project.setDeleteNodeFormItem = function (fn) {
			this.deleteNodeFormItem = fn
		};
	
	
		project.setDelegateNode = function(fn) {
			this.delegateNode = fn
		};
	
		project.setDetailForm = function(fn) {
			this.detailForm = fn
		};
	
		project.createNode = this.createNode
		project.updateNode = this.updateNode
		project.deleteNode = this.deleteNode
	
		project.createNodeForm = this.createNodeForm
		project.deleteNodeForm = this.deleteNodeForm
	
		project.createNodeFormItem = this.createNodeFormItem
		project.updateNodeFormItem = this.updateNodeFormItem
		project.deleteNodeFormItem = this.deleteNodeFormItem
	
		project.delegateNode = this.delegateNode
		project.detailForm = this.detailForm
		
		project.userId = this.userId;
		
		project.get = function () {
			var deferred = $q.defer();
			$http.get(API_HOST + '/project')
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
		
		project.showLast = function (request) {
			var deferred = $q.defer();
			$http.get(API_HOST + '/projectsLast/' + request)
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response.data)
				})
	
			return deferred.promise;
		};
		
		project.show = function (request) {
			var deferred = $q.defer();
			$http.get(API_HOST + '/project/' + request)
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
	
		project.store = function (request) {
			var deferred = $q.defer();
			$http.post(API_HOST + '/project', request)
				.then(function(response) {
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
			return deferred.promise;
		};
	
		project.update = function (request) {
			var deferred = $q.defer();
			$http.patch(API_HOST + '/project/' + request.id, request)
				.then(function(response) {
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
	
		project.destroy = function (request) {
			var deferred = $q.defer();
			$http.delete(API_HOST + '/project/' + request)
				.then(function(response) {
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
		
		project.user = function (request) {
			var deferred = $q.defer()
			$http.get(API_HOST + '/project/user/' + request)
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response.data)
				})
			
			return deferred.promise
		};
	
		project.delegate = function (request) {
			var deferred = $q.defer()
			$http.post(API_HOST + '/project/delegate', request)
				.then(function (response) {
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response.data)
				})
	
			return deferred.promise
		};
	
		project.form = function (request) {
			var deferred = $q.defer()
			$http.get(API_HOST + '/project/form/' + request)
				.then(function (response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
			
				return deferred.promise
		};
		
		project.leader = function (request) {
			var deferred = $q.defer()
			$http.get(API_HOST + '/project/leader/' + request)
				.then(function (response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response.data)
				})
				
			return deferred.promise
		};
		
		project.upload = function (request) {
			
			var deferred = $q.defer()
			
			Upload.upload({
				url: API_HOST + '/project/upload',
				data: request,
			}).then(function(response){
				$httpDefaultCache.removeAll()
				deferred.resolve(response.data)
			}, function(response){
				deferred.reject(response.data)
			})
			return deferred.promise
		};
		
		project.validatingName = function(request){
			var deferred = $q.defer()
			$http.get(API_HOST + '/project/validating/name/' + request.name + '/' + request.id)
				.then(function(response){
					deferred.resolve(response.data)
				}, function(response){
					deferred.reject(response.data)
				});
			return deferred.promise;
		}
	
		return project
	
	}
})();