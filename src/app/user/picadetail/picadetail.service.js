(function(angular) {
  'use strict';

  angular.module('spmiFrontEnd')
    .factory('PicaDetailService', PicaDetailService)

  function PicaDetailService($rootScope, $http, $q, ngProgressFactory, API_HOST) {
    var picaDetailService = {};

    picaDetailService.get = function() {
      var deferred = $q.defer();
      var progress = ngProgressFactory.createInstance();
      progress.start();
      $http.get(API_HOST + '/dummy/picadetail')
          .then(function(response) {
              progress.complete();
              deferred.resolve(response.data);
          }, function(data) {
              progress.complete();
              deferred.reject($rootScope.errorHandler(data));
          });
      return deferred.promise;
    };
    return picaDetailService;
  }

})(angular);