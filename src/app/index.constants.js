/* global malarkey:false, moment:false */
(function() {
    'use strict';
   

    angular
        .module('spmiFrontEnd')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        
        
        .constant('API_HOST', 'http://localhost:8000')
        //.constant('FILE_HOST', 'http://localhost/spmi-file-handler')
        .constant('FILE_HOST', 'http://spmi.umn.ac.id')
        .constant('APP_DEBUG', true)
        
        
        /*
        .constant('API_HOST', 'http://weblogindonesia.com')
        .constant('FILE_HOST', 'http://spmi.umn.ac.id')
        .constant('APP_DEBUG', false)
        */
})();
