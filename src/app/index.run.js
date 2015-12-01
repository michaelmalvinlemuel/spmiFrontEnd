(function() {
    'use strict';

    angular
        .module('spmiFrontEnd')
        .run(AppRun);

        /** @ngInject */
    function AppRun($rootScope, $state, $stateParams, $timeout, CURRENT_USER, APP_DEBUG, API_HOST, FILE_HOST) {
        
        $rootScope.APP_DEBUG = APP_DEBUG;
        $rootScope.CURRENT_USER = CURRENT_USER;
        $rootScope.API_HOST = API_HOST;
        $rootScope.FILE_HOST = FILE_HOST;
        $rootScope.FILE_TYPE = '.pdf,.doc,.docx,.xls,.xlsx';
        $rootScope.UPLOAD_MAX_SIZE = '2MB';
        
        $rootScope.pushIfUnique = function (parent, child) {
            var i = 0;
            var counter = 0;
                
            for (i = 0 ; i < parent.length ; i++) {
                if (angular.equals(parent[i], child)) {
                    break;
                    return -1
                }
                counter++
            }
            if (counter === parent.length) {
                parent.push(child)
                return counter
            }
        }

	
        $rootScope.findObject = function (parent, child) {
            var i = 0;
            var counter = 0;

            for (i = 0 ; i < parent.length ; i++) {
                if (angular.equals(parent[i], child)) {
                    return i
                }
                counter++
            }

            if (counter === parent.length) {
                return -1
            }
        }

	
        $rootScope.first = false
        $rootScope.toDenied = false;

        $rootScope.run = false
	
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams) {
		// track the state the user wants to go to; authorization service needs this
            
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            
            $rootScope.fromStateParams = fromStateParams;
            $rootScope.fromState = fromState;

        });
        
        $rootScope.errorHandler = function(response) {
                   
            switch (response.status) {
                case 400 :
                    $state.go('login', {
                        alert: {
                            header: 'Unidentified users',
                            message: 'User tidak teridentifikasi, harap melakukan login'
                        },
                        sender: 'system',
                    });
                break;
                
                case 401 :
                    $state.go('login', { 
                        alert: {
                            header: 'Token Expired',
                            message: 'Harap login ulang'
                        },
                    });
                break;
                
                case 403 :
                    $state.go('denied', {sender: 403});
                break;
                
                case 404 : 
                    $state.go('error');
                break;
                
                case 500 :
                    $state.go('error');
                break;
                
                case 503 :
                    $state.go('failure', {
                        alert: {
                           header: response.data.header,
                           message: response.data.header, 
                        },
                        sender: 503,
                    });
            }
        }
 
    }
    
    

})();
