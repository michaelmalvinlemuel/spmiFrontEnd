(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .factory('StorageService', StorageService)
    
    function StorageService ($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
        
        var storage = {}
        var $httpDefaultCache = $cacheFactory.get('$http');
        
        storage.get = function () {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/physical')
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data))
                })
            
            return deferred.promise;
        }
        
        storage.create = function() {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/physical/create')
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            
            return deferred.promise;
        }
        
        
        
        storage.store = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.post(API_HOST + '/physical', request)
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
        
        storage.show = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/physical/' + request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        storage.edit = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/physical/' + request + '/edit')
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            
            return deferred.promise;
        }
        
        storage.update = function (request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.put(API_HOST + '/physical/' + request.id, request)
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
		
        storage.destroy = function (request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.delete(API_HOST + '/physical/' + request)
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
        
        storage.explore = function() {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/physical/explore')
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                });
            return deferred.promise;
        }
        
        
        
        
        
        
        return storage;
        
    }
    
    
})(angular);