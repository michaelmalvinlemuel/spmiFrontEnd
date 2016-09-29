(function(angular) {
    'use strict';

    angular.module('spmiFrontEnd')
        .controller('SettingController', SettingController)

    function SettingController(SettingService) 
    {
        var vm = this;

        vm.clean = function () {
            SettingService.clean().then(function(data) {
                alert('berhasil bersih');
            })
        }

        vm.export = function () {
            SettingService.export().then(function(data) {
                alert('berhasil export');
            })
        }
        return vm;
    }
    
})(angular);