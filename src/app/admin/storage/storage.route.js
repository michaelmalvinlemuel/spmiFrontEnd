(function(angular) {
    
    'use strict';
    
    angular
        .module('spmiFrontEnd')
        .config(PhysicalStorageRoute)
    
    function PhysicalStorageRoute($stateProvider) {
        $stateProvider
            .state('main.admin.storageCategory', {
                url: '/storageCategory',
                views: {
                    'content': {
                        templateUrl: 'app/admin/storage/views/list.category.html',
                        controller: 'StorageCategoryController as vm',
                    }
                },
                resolve: {
                    storageCategories: function(StorageCategoryService) {
                        return StorageCategoryService.get();
                    }
                },
            })
            
            .state('main.admin.storageCategory.create', {
                url: '/create',
                views: {
                    'content@main.admin': {
                        templateUrl: 'app/admin/storage/views/form.category.html',
                        controller: 'CreateStorageCategoryController as vm',
                        
                    }
                },
                resolve: {
                    storageCategories: function(StorageCategoryService) {
                        return StorageCategoryService.get();
                    }
                }
            })
            
            .state('main.admin.storageCategory.update', {
                url: '/:storageId',
                views: {
                    'content@main.admin': {
                        templateUrl: 'app/admin/storage/views/form.category.html',
                        controller: 'UpdateStorageCategoryController as vm',
                    }
                },
                resolve: {
                    storageCategories: function(StorageCategoryService) {
                        return StorageCategoryService.get();
                    },
                    storage: function($stateParams, StorageCategoryService) {
                        return StorageCategoryService.show($stateParams.storageId)
                    }
                },
            })
            
            .state('main.admin.storage', {
                url: '/storage',
                views: {
                    'content': {
                        templateUrl: 'app/admin/storage/views/tree.html',
                        controller: 'StorageController as vm',
                    }
                },
                resolve: {
                    storages: function(StorageService) {
                        return StorageService.explore();
                    }
                }
            })
    }
    
})(angular);