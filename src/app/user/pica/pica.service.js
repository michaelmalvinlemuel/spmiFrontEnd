(function(angular) {
  'use strict';

  angular.module('spmiFrontEnd')
    .factory('PicaService', PicaService)

  function PicaService($rootScope, $http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
    var picaService = {};
    var $httpDefaultCache = $cacheFactory.get('$http');


    picaService.get = function() {
      var deferred = $q.defer();
      var progress = ngProgressFactory.createInstance();
      progress.start();
      $http.get(API_HOST + '/dummy')
          .then(function(response) {
              progress.complete();
              deferred.resolve(response.data);
          }, function(data) {
              progress.complete();
              deferred.reject($rootScope.errorHandler(data));
          });
      return deferred.promise;
    };

    picaService.store = function(request) {
        var deferred = $q.defer();
        var progress = ngProgressFactory.createInstance();
        
        progress.start();
        $http.post(API_HOST + '/dummy', request)
            .then(function(response) {
                progress.complete();
                $httpDefaultCache.removeAll();
                deferred.resolve(response.data);
            }, function(data) {
                progress.complete();
                deferred.reject($rootScope.errorHandler(data));
            })
        return deferred.promise;
    };
    
    picaService.show = function (request) {
        var deferred = $q.defer();
        var progress = ngProgressFactory.createInstance();
        progress.start();
        $http.get(API_HOST + '/dummy/' + request)
          .then(function(response){
            progress.complete();
            deferred.resolve(response.data)
          }, function(data) {
            progress.complete();
            deferred.reject($rootScope.errorHandler(data));
          })
        return deferred.promise 
      };

    picaService.visualize = function (id) {
      var deferred = $q.defer();
      var progress = ngProgressFactory.createInstance();
      progress.start();
      $http.get(API_HOST + '/dummy/visualize/' + id)
          .then(function(response) {
              progress.complete();
              deferred.resolve(response.data);
          }, function(data) {
              progress.complete();
              deferred.reject($rootScope.errorHandler(data));
          });
      return deferred.promise;
    };

    return picaService;
  }

})(angular);
