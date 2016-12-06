(function(angular){
    'use strict';
    
    angular.module('spmiFrontEnd')
    .config(picaDetailRouter)

    function picaDetailRouter($stateProvider) {
        $stateProvider
        .state('main.user.picadetail',{
            url:'/picadetail',
            views:{
                'content': {
                    templateUrl: 'app/user/picadetail/views/list.html',
                    controller: 'picaDetailController as vm'
                }
            },
            resolve: {
                DetailsPica:function(PicaDetailService){
                    return PicaDetailService.get();
                },
            }
        })
    }
})(angular);