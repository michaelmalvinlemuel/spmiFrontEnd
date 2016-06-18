(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .factory('StorageCategoryService', StorageCategoryService)
        
    
    function StorageCategoryService($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
        
        var storageCategory = {};
        var $httpDefaultCache = $cacheFactory.get('$http');
        
        storageCategory.get = function () {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/physical-category')
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data))
                })
            
            return deferred.promise;
        }
        
        storageCategory.show = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/physical-category/' + request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        storageCategory.store = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.post(API_HOST + '/physical-category/', request)
                .then(function(response) {
                    progress.complete();
                    $httpDefaultCache.removeAll();
                    deferred.resolve(response);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        storageCategory.update = function (request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.put(API_HOST + '/physical-category/' + request.id, request)
                .then(function(response){
                    progress.complete();
                    $httpDefaultCache.removeAll();
                    deferred.resolve(response)
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
		
        storageCategory.destroy = function (request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.delete(API_HOST + '/physical-category/' + request)
                .then(function(response) {
                    progress.complete();
                    $httpDefaultCache.removeAll();
                    deferred.resolve(response.data)
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        storageCategory.validate = function (request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.post(API_HOST + '/physical-category/validating/physical', request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
                
            return deferred.promise;
        }
        
        storageCategory.sub = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/physical-category/' + request + '/sub')
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        return storageCategory;
        
    }
    
})(angular);