/* global malarkey:false, moment:false */
(function(angular) {
    'use strict';
   
    angular.module('spmiFrontEnd')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        
        
        
        
        .constant('API_HOST', 'http://localhost:8000')
        .constant('FILE_HOST', 'http://localhost/spmi-file-handler')
        .constant('FILE_HOST', 'http://myspmi.umn.ac.id')
        

        .constant('APP_DEBUG', true)
        //.constant('APP_DEBUG', false)
        
        /**
        .constant('FILE_HOST', 'http://myspmi.umn.ac.id')
        .constant('API_HOST', 'http://45.55.231.19')
        */

        /** 
        .constant('API_HOST', 'http://weblogindonesia.com')
        .constant('FILE_HOST', 'http://myspmi.umn.ac.id')
        .constant('APP_DEBUG', false)
        */
        
})(angular);
