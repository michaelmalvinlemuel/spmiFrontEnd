(function () {

	angular
		.module('spmiFrontEnd')
		.factory('WorkService', ['$http', '$q', '$cacheFactory', WorkService])
		.factory('WorkFormService', ['$http', '$q', '$cacheFactory', WorkFormService])
		
	function WorkService ($http, $q, $cacheFactory){
	
		function WorkService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function() {
				var deferred = $q.defer()
				$http.get('/works')
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get('/works/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.store = function (request) {
				var deferred = $q.defer()
				$http.post('/work/store', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.update = function (request) {
				var deferred = $q.defer()
				$http.post('/work/update', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.post('/work/destroy', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.execute = function (request) {
				var deferred = $q.defer()
				$http.get('/work/execute/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.validatingName = function (request) {
				var deferred = $q.defer()
				$http.get('/work/validating/name/' + request.name + '/' + request.id)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.eventToggle = function (request) {
				var deferred = $q.defer()
				$http.post('/work/eventToggle', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.startAllEvent = function () {
				var deferred = $q.defer()
				$http.get('/work/startAllEvent')
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.pauseAllEvent = function () {
				var deferred = $q.defer()
				$http.get('/work/pauseAllEvent')
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.executeAllWork = function () {
				var deferred = $q.defer()
				$http.get('/work/executeAllWork')
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
		}
		
		return new WorkService()
	}
	
	function WorkFormService ($http, $q, $cacheFactory) {
		function WorkFormService(){
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function (request) {
				var deferred = $q.defer()
				$http.get('/workForms/get/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.show = function (request) {
				var deferred = $q.defer()
				$http.get('/workForms/' + request)
					.then(function(response){
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
				
			self.store = function (request) {
				var deferred = $q.defer()
				$http.post('/workForm/store', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
				
			self.update = function (request) {
				var deferred = $q.defer()
				$http.post('/workForm/update', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
				
			self.destroy = function (request) {
				var deferred = $q.defer()
				$http.post('/workForm/destroy', request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
				
		}
		
		return new WorkFormService()
	}

})()