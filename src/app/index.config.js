(function() {
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
    function IndexConfig($logProvider, toastrConfig, $httpProvider, $authProvider, API_HOST) {
       
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
       // $httpProvider.defaults.useXDomain = true;
        //$httpProvider.defaults.xsftHeadername = 'X-XSRF-TOKEN'
        //$httpProvider.defaults.headers.common['X-XSRF-Token'] = ''//$scope.csrf
        //$httpProvider.defaults.headers.common['XSRF-Token'] = ''// $scope.csrf
        //$httpProvider.defaults.headers.common['X-CSRF-Token'] = ''//$scope.csrf
        //$httpProvider.defaults.withCredentials = true;
        
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        
        /*
        var interceptor = ['$log', '$location', '$q', '$injector', function($log, $location, $q, $injector){
            function success(response){
                return response;
            }
            
            function error(response){
                if(response.status === 400){
                    $injector.get('$state').transitionTo('login')
                    $log.error('Not authenticated and redirect to login')
                    return $q.reject(response)
                } else {
                    return $q.reject(response)
                }
            }
            
            return function(promise){
                return promise.then(success, error)
            }
        }]
        */
        
        $httpProvider.interceptors.push('HttpInterceptor')
  }

})();
