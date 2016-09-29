(function(angular) {
    'use strict';

    angular.module('spmiFrontEnd')
        .config(SettingRoute)

    function SettingRoute($stateProvider) 
    {
        $stateProvider
            .state('main.admin.setting', {
                url: '/setting',
                views: {
                    'content': {
                        templateUrl: 'app/admin/setting/views/detail.html',
                        controller: 'SettingController as vm'
                    }
                },
                resolve: {

                }
            })
    }
    
})(angular);