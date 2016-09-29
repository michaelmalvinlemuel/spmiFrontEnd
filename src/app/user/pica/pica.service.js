(function(angular) {
  'use strict';

  angular.module('spmiFrontEnd')
    .factory('PicaService', PicaService)

  function PicaService($http, $q, $cacheFactory, ngProgressFactory, API_HOST) {
    var picaService = {}

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
    }

    return picaService;
  }

})(angular);
