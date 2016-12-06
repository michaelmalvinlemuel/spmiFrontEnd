(function(angular) {
  'use strict';

  angular.module('spmiFrontEnd')
    .controller('AppraisalUserController', AppraisalUserController)

  function AppraisalUserController($state, appraisals) {
    var vm = this;

    vm.appraisals = appraisals;

    vm.highlight = function(score, value) {
        
        if (Math.floor(score) == value) {
            return {'border-width': '6px'};
        } else if (typeof score === 'undefined' && value == 0) {
            return {'border-width': '6px'}
        } else {
            return {'border-width': '1px'}
        }
    }
    
    return vm;
  }
})(angular);
