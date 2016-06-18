(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('ModalEditStorageController', ModalEditStorageController)
        .controller('ModalCreateStorageController', ModalCreateStorageController)
        
    function ModalEditStorageController($scope, $modalInstance, hierarchy, StorageService) {
        
        var vm = this;
        
        vm.input = {};
        vm.hierarchy = hierarchy;
        vm.limit = vm.hierarchy.length - 1;
        vm.isNew = false;
        vm.validated = false;
        
        for (var i = 0; i < vm.hierarchy.length; i++) {
            if (i == vm.hierarchy.length - 1 || i == 0) {
                vm.input = vm.hierarchy[i];
            }
        }
        
        
        vm.close = function() {
            $modalInstance.dismiss();
        }
        
        vm.submit = function() {
            StorageService.update(vm.input)
                .then(function(data) {
                    alert('Update berhasil');
                    $modalInstance.close(vm.input);
                })
        }

        
        return vm;
    }
    
    function ModalCreateStorageController ($scope, $modalInstance, hierarchy, sub, StorageService) {
        
        var vm = this;
        
        vm.isNew = true;
        vm.input = {};
        
        vm.hierarchy = hierarchy;
        vm.sub = sub;
        
        vm.limit = vm.hierarchy.length;
        vm.validated = false;
        
        
        vm.close = function() {
            $modalInstance.dismiss();
        }
        
        vm.submit = function() {
            vm.input.physical_address_id = vm.hierarchy[vm.hierarchy.length - 1].id;

            StorageService.store(vm.input)
                .then(function(data) {
                    alert('Insert berhasil');
                    $modalInstance.close(vm.input);
                })
                
        }
        
        return vm;
    }
    
    
    
})(angular);