(function() {
    'use strict';

    angular
        .module('spmiFrontEnd')
        .run(AppRun);

        /** @ngInject */
    function AppRun($rootScope, $state, $stateParams, $timeout, API_HOST) {
        
        $rootScope.API_HOST = API_HOST;
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
	
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState) {
		// track the state the user wants to go to; authorization service needs this
    
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
            
            $rootScope.fromState = fromState;


        });
    }

})();
