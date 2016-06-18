(function(angular) {
    'use strict';

    angular
        .module('spmiFrontEnd')
        .config(IndexConfig)
        .factory('HttpInterceptor', HttpInterceptor)
        .value('CURRENT_USER', {})
        
    
    function HttpInterceptor($log, $q, $injector, $location){
		return {        
	
            responseError: function(response) {
                if (response.status === 400){
                    $log.error('Token Mismatch')
                    $injector.get('$state').transitionTo('login')
					return $q.reject(response)
				}	
                $log.error('Otherwise error')
                //$injector.get('$state').transitionTo('login')
                return $q.reject(response);
            }
		}
	}
    
    /** @ngInject */
    function IndexConfig($logProvider, toastrConfig, $httpProvider, $authProvider, API_HOST, FILE_HOST) {
       
        $authProvider.loginUrl = API_HOST + '/authenticate';
       
        // Enable log
        $logProvider.debugEnabled(true);
    
        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = true;
        toastrConfig.progressBar = true;
        
        $httpProvider.defaults.cache = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //$httpProvider.interceptors.push('HttpInterceptor')
  }

})(angular);
