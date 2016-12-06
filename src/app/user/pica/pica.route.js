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
        .state('main.user.pica.detail', {
          url: '/:picaId',
          views: {
            'content@main.user': {
              templateUrl: 'app/user/pica/views/detail.html',
              controller: 'picadetailcontroller as vm',
            }
          },
          resolve: {
            users : function(UserService){
              return UserService.get();
            },
            picadetails: function(PicaService, $stateParams) {
              return PicaService.show($stateParams.picaId);
            }
          }
        })

    }
})(angular);
