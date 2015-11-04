(function() {
    'use strict';
    
    

    /*
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", 'http://localhost:8000/auth/token', false);
    xhReq.send(null);
    */
    
    angular
        .module('spmiFrontEnd', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 
            'ngAria', 'restangular', 'ui.router', 'ui.bootstrap', 'toastr', 'ngFileUpload', 
            'satellizer', 'chart.js', 'angularBootstrapNavTree', 'pdf'])
        
        
        //.constant("CSRF_TOKEN", xhReq.responseText)
     

})();
