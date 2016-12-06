(function(angular) {
    'use strict';

    angular.module('spmiFrontEnd')
      .config(PicaRouter)

    function PicaRouter($stateProvider) {
      $stateProvider
        .state('main.user.appraisal', {
          url: '/appraisal',
          views: {
            'content': {
              templateUrl: 'app/user/appraisal/views/list.html',
              controller: 'AppraisalUserController as vm',
            }
          },
          resolve: {
            appraisals: function(PicaService) {
              return PicaService.visualize(3);
            }
          }
        })
    }
})(angular);
