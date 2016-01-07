(function(angular) {
    
    'use strict';
    
    angular.module('spmiFrontEnd')
        .controller('ModalAttachmentUploadController', ModalAttachmentUploadController)
        
    
    function ModalAttachmentUploadController($scope, $modalInstance, attachment) {
        
        var vm = this;
        
        vm.input = attachment
        
        vm.close = function() {
            $modalInstance.dismiss('cancel');
        }
        
        vm.submit = function() {
            $modalInstance.close(vm.input)
        }
        
        return vm;
        
    }
    
})(angular);