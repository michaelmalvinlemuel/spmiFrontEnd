(function() {
    'use strict';

    angular
        .module('spmiFrontEnd')
        .controller('MainController', MainController);
    
    /** @ngInject */
    function MainController($state, $timeout, $auth) {
 
        var vm = this
        
        vm.load = function(){
            console.log($auth.isAuthenticated())
        }
        
        vm.load();
        
        
        return vm
    }
    
})();
