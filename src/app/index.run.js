(function() {
  'use strict';

  angular
    .module('spmiFrontEnd')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
