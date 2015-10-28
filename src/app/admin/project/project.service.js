(function() {

	angular.module('spmiFrontEnd')
		.factory('ProjectService', ['$http', '$state', '$q', '$cacheFactory', 'Upload', ProjectService])


	function ProjectService ($http, $state, $q, $cacheFactory, Upload) {
	
		var project = {}
		
		var createNode = function() {}
		var updateNode = function() {}
		var deleteNode = function() {}
	
		var createNodeForm = function() {}
		var deleteNodeForm = function() {}
	
		var createNodeFormItem = function() {}
		var updateNodeFormItem = function() {}
		var deleteNodeFormItem = function() {}
	
		var delegateNode = function () {}
		var detailForm = function() {}
		
		var userId = ''
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
	
		project.createNodeForm = createNodeForm
		project.deleteNodeForm = deleteNodeForm
	
		project.createNodeFormItem = this.createNodeFormItem
		project.updateNodeFormItem = this.updateNodeFormItem
		project.deleteNodeFormItem = this.deleteNodeFormItem
	
		project.delegateNode = this.delegateNode
		project.detailForm = this.detailForm
		
		project.userId = this.userId;
		
		project.get = function () {
			var deferred = $q.defer();
			$http.get('/projects')
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
		
		project.showLast = function (request) {
			var deferred = $q.defer();
			$http.get('/projectsLast/' + request)
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
		
		project.show = function (request) {
			var deferred = $q.defer();
			$http.get('/projects/' + request)
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise;
		};
	
		project.store = function (request) {
			var deferred = $q.defer();
			$http.post('/project/store', request)
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
			$http.post('/project/update', request)
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
			$http.post('/project/destroy', request)
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
			$http.get('/project/user/' + request)
				.then(function(response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
			
			return deferred.promise
		};
	
		project.delegate = function (request) {
			var deferred = $q.defer()
			$http.post('/project/delegate', request)
				.then(function (response) {
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
	
			return deferred.promise
		};
	
		project.form = function (request) {
			var deferred = $q.defer()
			$http.get('/project/form/' + request)
				.then(function (response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
			
				return deferred.promise
		};
		
		project.leader = function (request) {
			var deferred = $q.defer()
			$http.get('/project/leader/' + request)
				.then(function (response) {
					deferred.resolve(response.data)
				}, function(response) {
					deferred.reject(response)
				})
				
			return deferred.promise
		};
		
		project.upload = function (request, file) {
			
			var deferred = $q.defer()
			Upload.upload({
				url: '/project/upload',
				method: 'POST',
				fields: request,
				file: file,
				fileFormDataName: 'document'
			}).then(function(response){
				$httpDefaultCache.removeAll()
				deferred.resolve(response)
			}, function(response){
				deferred.reject(response)
			})
			return deferred.promise
		};
		
		project.validatingName = function(request){
			var deferred = $q.defer()
			$http.get('/project/validating/name/' + request.name + '/' + request.id)
				.then(function(response){
					deferred.resolve(response)
				}, function(response){
					deferred.reject(response)
				});
			return deferred.promise;
		}
	
		return project
	
	}
})();