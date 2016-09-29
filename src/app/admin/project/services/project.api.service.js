(function(angular) {
	
	'use strict'
	
	angular.module('spmiFrontEnd')
		.factory('ProjectService', ProjectService)


	function ProjectService ($rootScope, $http, $state, $q, $cacheFactory, ngProgressFactory, Upload, API_HOST, FILE_HOST, CURRENT_USER) {
	
		var project = {}
		
		
		var $httpDefaultCache = $cacheFactory.get('$http');
		
		project.get = function (display, initiation, preparation, progress, grading
		, complete, terminated, page) {
			var deferred = $q.defer();
			var progress1 = ngProgressFactory.createInstance();
			progress1.start();
			$http.get(API_HOST + '/project/' + display + '/' + initiation + '/' 
				+ preparation + '/' + progress + '/' + grading + '/' + complete + '/' 
				+ terminated + '?page=' + page)
			.then(function(response) {
				progress1.complete();
				deferred.resolve(response.data);
			}, function(data) {
				progress1.complete();
				deferred.reject($rootScope.errorHandler(data));
			})
	
			return deferred.promise;
		};
		
		project.showLast = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/last/' + request)
				.then(function(response) {
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})

			return deferred.promise;
		};
		
		project.show = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/' + request)
				.then(function(response) {
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
	
			return deferred.promise;
		};
	
		project.store = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.post(API_HOST + '/project', request)
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
			return deferred.promise;
		};
	
		project.update = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();

			progress.start();
			$http.patch(API_HOST + '/project/' + request.id, request)
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
	
			return deferred.promise;
		};
	
		project.destroy = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.delete(API_HOST + '/project/' + request)
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
	
			return deferred.promise;
		};
		
		project.user = function (display, initiation, preparation, progress
			, grading, complete, terminated, page) {
			var deferred = $q.defer();
			var progress1 = ngProgressFactory.createInstance();
			progress1.start();
			$http.get(API_HOST + '/project/user/' + display + '/' + initiation + '/' 
			+ preparation + '/' + progress + '/' + grading + '/' + complete + '/' 
			+ terminated + '?page=' + page)
				.then(function(response) {
					progress1.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress1.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
			
			return deferred.promise
		};
        
        project.member = function (display, initiation, preparation, progress
			, grading, complete, terminated, page) {
			var deferred = $q.defer();
			var progress1 = ngProgressFactory.createInstance();
			progress1.start();
			$http.get(API_HOST + '/project/member/' + display + '/' + initiation + '/' 
			+ preparation + '/' + progress + '/' + grading + '/' + complete + '/' 
			+ terminated + '?page=' + page)
				.then(function(response) {
					progress1.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress1.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
			
			return deferred.promise
		};
        
        project.assessor = function (display, initiation, preparation, progress
			, grading, complete, terminated, page) {
			var deferred = $q.defer();
			var progress1 = ngProgressFactory.createInstance();
			progress1.start();
			$http.get(API_HOST + '/project/assessor/' + display + '/' + initiation + '/' 
			+ preparation + '/' + progress + '/' + grading + '/' + complete + '/' 
			+ terminated + '?page=' + page)
				.then(function(response) {
					progress1.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress1.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
			
			return deferred.promise
		};
	
		project.form = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/form/' + request)
				.then(function (response) {
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
			
			return deferred.promise
		};
		
		project.leader = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/leader/' + request)
				.then(function (response) {
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
				
			return deferred.promise
		};

		project.upload = function (request) {
			
		
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
           
            var attachments = [];
            var loopAttachment = function() {
                var promises = [];
                for (var i = 0; i < request.attachments.length; i++) {
                    
                    if (request.attachments[i].file) {
                        var temp = {
                            directory: 'attachment',
                            nik: CURRENT_USER.nik,
                            name: CURRENT_USER.name,
                            description: i,
                            file: request.attachments[i].file,
                        }
                        
                        var a = Upload.upload({
                            url: FILE_HOST + '/upload.php',
                            data: temp,
                        }).then(function(response) {
                            attachments.push({attachment: response.data})
                        });
                        
                        promises.push(a);
                        
                    } else {
                        var b = $q.defer();
                        attachments.push({attachment: request.attachments[i].attachment});
                        promises.push(b);
                    }
                    
                    
                } 
                
                return $q.all(promises);
            }
            
            
            loopAttachment().then(function() {
                //SUCCESS ATTACHMENTS UPLOAD
                
                var temp = {
                    directory: 'project',
                    nik: CURRENT_USER.nik,
                    name: CURRENT_USER.name,
                    description: 'project',
                    file: request.file,    
                }
                
                return Upload.upload({
                    url: FILE_HOST + '/upload.php',
                    data: temp,
                })
            }, function(data) {
                
                //ERROR ATTACHMENTS UPLOAD
                progress.complete();
                //console.log('error attachment upload');
                deferred.reject($rootScope.errorHandler(data));
                
            }).then(function(response) {
                
                //SUCCESS FORM UPLOAD
                //console.log('success form upload');
                
                console.log(attachments);
                
                for (var i = 0; i < request.attachments.length; i++) {
                    attachments[i].title = request.attachments[i].title;
                    attachments[i].description = request.attachments[i].description;    
                }
                
                
                request.attachments = attachments;
                //console.log(request.attachments);
                if (request.file) {
                    request.file = response.data;
                } else {
                  request.file = request.upload;  
                }
                
                //console.log(request);
                return $http.post(API_HOST + '/project/node/upload', request);
                
            }, function(data) {
                //ERROR FORM UPLOAD
                //console.log('error form upload');
                progress.complete();
                deferred.reject($rootScope.errorHandler(data));
            }).then(function(response) {
                //SUCCESS UPLOAD
                //console.log('success form insert');
                progress.complete();
                $httpDefaultCache.removeAll();
				deferred.resolve(response.data);
            }, function(data) {
                //console.log('error form insert');
                progress.complete();
                deferred.reject($rootScope.errorHandler(data));
            });
            
			return deferred.promise
		};
		
		
		
		project.validatingName = function(request){
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.post(API_HOST + '/project/validating/name', request)
				.then(function(response){
					progress.complete();
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				});
				
			return deferred.promise;
		}	
		
		project.mark = function(request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.patch(API_HOST + '/project/mark/' + request.id, request)
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll();
					deferred.resolve(response.data)
				}, function(response) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(response));
				});
			
			return deferred.promise;
		}
		
		
		project.delegate = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.post(API_HOST + '/project/node/delegate', request)
				.then(function (response) {
					progress.complete();
					$httpDefaultCache.removeAll()
					deferred.resolve(response.data)
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				})
	
			return deferred.promise
		};
		
		
		project.lock = function(request, lockStatus) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/node/lock/' + request + '/' + lockStatus).then(function(response) {
				progress.complete();
				$httpDefaultCache.removeAll();
				deferred.resolve(response.data);
			}, function(data) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(data));
			});
			
			return deferred.promise;
		}
		
		project.lockAll = function(id, lockStatus) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/lock/' + id + '/' + lockStatus)
				.then(function(response) {
					progress.complete();
					$httpDefaultCache.removeAll();
					deferred.resolve(response.data);
				}, function(data) {
					progress.complete();
					deferred.reject($rootScope.errorHandler(data));
				});
			
			return deferred.promise;
		}
		
		project.assess = function(request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.get(API_HOST + '/project/node/assess/' + request).then(function(response){
				progress.complete();
				deferred.resolve(response.data);
			}, function(data) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(data));
			});
			
			return deferred.promise;
		}
		
		project.score = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.post(API_HOST + '/project/node/score', request).then(function(response) {
				progress.complete();
				$httpDefaultCache.removeAll();
				deferred.resolve(response.data);
			}, function(data) {
				progress.complete();
				deferred.reject($rootScope.errorHandler(data));
			});
			
			return deferred.promise 
		}
        
        project.count = function(request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/project/count/' + request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                });
            return deferred.promise;
        }
        
        project.formAssess = function (request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.get(API_HOST + '/project/node/' + request) 
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                });
            return deferred.promise;
        }
        
        project.enrollLeader = function (request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.patch(API_HOST + '/project/enroll/leader/' + request.project_id, request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
                return deferred.promise;
        }
        
        project.enrollMember = function (request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.patch(API_HOST + '/project/enroll/member/' + request.id, request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data);
                }, function(data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }
        
        project.enrollAssessor = function (request) {
            var deferred = $q.defer();
            var progress = ngProgressFactory.createInstance();
            progress.start();
            $http.patch(API_HOST + '/project/enroll/assessor/' + request.id, request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data)
                }, function (data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
        }

		project.enrollAssessorNode = function (request) {
			var deferred = $q.defer();
			var progress = ngProgressFactory.createInstance();
			progress.start();
			$http.patch(API_HOST + '/project/node/enroll/assessor/' + request.id, request)
                .then(function(response) {
                    progress.complete();
                    deferred.resolve(response.data)
                }, function (data) {
                    progress.complete();
                    deferred.reject($rootScope.errorHandler(data));
                })
            return deferred.promise;
		}
        
        
	
		return project
	
	}
})(angular);