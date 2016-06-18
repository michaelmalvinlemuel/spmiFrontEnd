(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .factory('PaginationService', PaginationService)
    
    function PaginationService () {
    
        var pagination = {}
        
        pagination.paginate = function(vm, list, service) {
            
            vm.showLimit = 10;
            vm.currentPage = 1;
            
            vm.onShowChange = function() {
                function success(data) {
                    vm.total = data.total;
                    vm.currentPage = data.current_page;
                    list = data.data
                }
                
                function error(data) {
                    
                }
                
                var params = [
                    vm.showLimit,
                    vm.currentPage
                ]
                
                service.apply(this, params).then(success, error);
            
            }
            
        }
        
        return pagination;
        
    }
    
})(angular);