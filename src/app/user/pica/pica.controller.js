(function(angular) {
  'use strict';

  angular.module('spmiFrontEnd')
    .controller('PicaUserController', PicaUserController)

  function PicaUserController($state, picas) {
    var vm = this;

    vm.picas = picas;
    
    return vm;
  }
})(angular);
