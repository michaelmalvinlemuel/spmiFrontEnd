(function(angular) {
    'use strict';

    angular.module('spmiFrontEnd')
      .config(PicaRouter)

    function PicaRouter($stateProvider) {
      $stateProvider
        .state('main.user.pica', {
          url: '/pica',
          views: {
            'content': {
              templateUrl: 'app/user/pica/views/list.html',
              controller: 'PicaUserController as vm',
            }
          },
          resolve: {
            picas: function(PicaService) {
              return PicaService.get();
            }
          }
        })
    }
})(angular);
