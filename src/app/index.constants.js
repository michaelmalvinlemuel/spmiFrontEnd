/* global malarkey:false, moment:false */
(function() {
    'use strict';
   

    angular
        .module('spmiFrontEnd')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('API_HOST', 'http://localhost:8000')

})();
