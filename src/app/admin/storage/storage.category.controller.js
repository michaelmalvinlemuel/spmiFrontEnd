(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('StorageCategoryController', StorageCategoryController)
        .controller('CreateStorageCategoryController', CreateStorageCategoryController)
        .controller('UpdateStorageCategoryController', UpdateStorageCategoryController)
        
    
    function StorageCategoryController ($state, storageCategories, StorageCategoryService) {
        
        var vm = this;
        
        vm.categories = storageCategories;
        
        vm.update = function(id) {
            $state.go('main.admin.storageCategory.update', {storageId: id});
        }
        
        vm.destroy = function(id, index) {
            var cnf = confirm("Apakah Anda yakin ingin menghapus Master Lokasi ini?");
            if (cnf == true) {
                StorageCategoryService.destroy(id).then(function() {
                    vm.storages.splice(index, 1);
                })
            }
        }
        return vm;
    }
    
    function CreateStorageCategoryController ($scope, $state, $timeout, storageCategories, StorageCategoryService) {
        
        var vm = this,
            timeoutPhysicalPromise;
        
        vm.existiStorageCategory = null;
        vm.loadingStorageCategory = null;
        vm.storageCategories = storageCategories;
        
        
        
        $scope.$watch('vm.input.physical', function() {
            var validInput = $scope.StorageCategoryForm.physical.$invalid;
            var dirtyInput = $scope.StorageCategoryForm.physical.$dirty;
            
            if (!validInput && dirtyInput) {
                $timeout.cancel(timeoutPhysicalPromise);
                vm.loadingStorageCategory = true;
                timeoutPhysicalPromise = $timeout(function() {
                    StorageCategoryService.validate(vm.input).then(function(data) {
                        (data.length > 0) ? vm.existStorageCategory = true : vm.existStorageCategory = false;
                        vm.loadingStorageCategory = false;
                    })
                }, 1000)
            }   
        })
        
        vm.submit = function() {
            $scope.StorageCategoryForm.physical.$setDirty();
            $scope.StorageCategoryForm.physical_address_category_id.$setDirty();
            
            ($scope.StorageCategoryForm.$valid) ? StorageCategoryService.store(vm.input)
                .then(function() {
                    $state.go('main.admin.storageCategory', null, {reload: true});
                }) : vm.validated = true;
        }
        
        
        return vm;
           
    }
    
    function UpdateStorageCategoryController($scope, $state, $timeout, storage, storageCategories, StorageCategoryService) {
        
        var vm = this,
            timeoutPhysicalPromise;
        
        vm.existiStorageCategory = null;
        vm.loadingStorageCategory = null;
        
        vm.storageCategories = storageCategories;
        
        vm.input = storage;
        
        $scope.$watch('vm.input.physical', function() {
            var validInput = $scope.StorageCategoryForm.physical.$invalid;
            var dirtyInput = $scope.StorageCategoryForm.physical.$dirty;
            
            if (!validInput && dirtyInput) {
                $timeout.cancel(timeoutPhysicalPromise);
                vm.loadingStorageCategory = true;
                timeoutPhysicalPromise = $timeout(function() {
                    StorageCategoryService.validate(vm.input).then(function(data) {
                        (data.length > 0) ? vm.existStorageCategory = true : vm.existStorageCategory = false;
                        vm.loadingStorageCategory = false;
                    })
                }, 1000)
            }   
        })
        
        vm.submit = function() {
            $scope.StorageCategoryForm.physical.$setDirty();
            $scope.StorageCategoryForm.physical_address_category_id.$setDirty();
            
            ($scope.StorageCategoryForm.$valid) ? StorageCategoryService.update(vm.input)
                .then(function() {
                    $state.go('main.admin.storageCategory', null, {reload: true});
                }) : vm.validated = true;
        }
        
        return vm;
        
    }
})(angular);