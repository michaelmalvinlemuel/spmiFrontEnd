(function () {

	angular
		.module('spmiFrontEnd')
		.factory('WorkService', ['$http', '$q', '$cacheFactory', 'API_HOST', WorkService])
		.factory('WorkFormService', ['$http', '$q', '$cacheFactory', 'API_HOST', WorkFormService])
		
	function WorkService ($http, $q, $cacheFactory, API_HOST){
	
		function WorkService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function() {
				var deferred = $q.defer()
				$http.get(API_HOST + '/work')
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/work/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise;
			}
			
			self.store = function (request) {
				var deferred = $q.defer()
				$http.post(API_HOST + '/work', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
			
			self.update = function (request) {
				var deferred = $q.defer()
				$http.patch(API_HOST + '/work/' + request.id, request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise;
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.delete(API_HOST + '/work/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
			
			self.execute = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/work/execute/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise;
			}
			
			self.validatingName = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/work/validating/name/' + request.name + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise;
			}
			
			self.eventToggle = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/work/event/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise;
			}
			
			self.startAllEvent = function () {
				var deferred = $q.defer()
				$http.get(API_HOST + '/work/event/start')
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise;
			}
			
			self.pauseAllEvent = function () {
				var deferred = $q.defer()
				$http.get(API_HOST + '/work/event/pause')
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise;
			}
			
			self.executeAllWork = function () {
				var deferred = $q.defer()
				$http.get(API_HOST + '/work/execute/all')
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise;
			}
			
		}
		
		return new WorkService()
	}
	
	function WorkFormService ($http, $q, $cacheFactory, API_HOST) {
		function WorkFormService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
		
				
			self.store = function (request) {
				var deferred = $q.defer()
				$http.post(API_HOST + '/work/' + request.work_id + '/form', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
				
			self.update = function (request) {
				var deferred = $q.defer()
				$http.patch(API_HOST + '/work/' + request.work_id + '/form/' + request.form_id, request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
				
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.delete(API_HOST + '/work/' + request.work_id + '/form/' + request.form_id)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response.data)
					});
				return deferred.promise; 
			}
				
		}
		
		return new WorkFormService()
	}

})()