(function () {

	angular
		.module('spmiFrontEnd')
		.factory('GuideService', ['$http', '$q', '$cacheFactory', 'Upload', 'API_HOST', GuideService])

	function GuideService ($http, $q, $cacheFactory, Upload, API_HOST) {
		
		function GuideService() {
			var self = this
			var $httpDefaultCache = $cacheFactory.get('$http');
			
			self.get = function (){
				var deferred = $q.defer()
				$http.get(API_HOST + '/guide')
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.show = function(request){
				var deferred = $q.defer();
				$http.get(API_HOST + '/guide/' + request).then(function(response){
					deferred.resolve(response.data)
				});
				return deferred.promise;
			}
				
			self.store = function(request){
				var deferred = $q.defer()
				Upload.upload({
					url: API_HOST + '/guide',
					data: request,
				})
				.then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response)
				}, function(response){
					deferred.reject(response)
				});
				
				return deferred.promise;
			}
			
			self.update = function(request){
				var deferred = $q.defer()
				Upload.upload({
					url: API_HOST + '/guide/' + request.id,
					data: request,
					transformRequest: function(request){
						request._method = 'PUT';
						return request;
					},
				}).then(function(response){
					$httpDefaultCache.removeAll()
					deferred.resolve(response)
				});
				
				return deferred.promise;
			}
			
			self.destroy = function(request) {
				var deferred = $q.defer();
				$http.delete(API_HOST + '/guide/' + request)
					.then(function(response){
						$httpDefaultCache.removeAll()
						deferred.resolve(response)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise;
			}
			
			self.standardDocument = function (request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/guide/standardDocument/' + request)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.validatingNo = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/guide/validating/no/' + request.no + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					});
				return deferred.promise; 
			}
			
			self.validatingDescription = function(request) {
				var deferred = $q.defer()
				$http.get(API_HOST + '/guide/validating/description/' + request.description + '/' + request.id)
					.then(function(response){
						deferred.resolve(response.data)
					}, function(response){
						deferred.reject(response)
					})
				return deferred.promise 
			}
		}
		
		return new GuideService()
	}
})()