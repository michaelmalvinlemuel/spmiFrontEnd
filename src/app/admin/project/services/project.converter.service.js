(function() {
	
	'use strict'
	
	angular.module('spmiFrontEnd')
		.factory('ProjectConverterService', ProjectConverterService)
		
	
	function ProjectConverterService() {
		
		var converter = {}
		
		converter.decimalConverter = function(nodes) {
			for ( var i = 0; i < nodes.length; i++ ) {
				if(angular.isArray(nodes[i].children)) {
					if (nodes[i].children.length > 0) {
						converter.decimalConverter(nodes[i].children);
					} else {
						nodes[i].weight = Number(nodes[i].weight);
					}
				} else {
					nodes[i].children = []
				}
			}
		};
		
		converter.dateConverter = function(object) {
			object.start = new Date(object.date_start).setHours(0,0,0,0);
			object.ended = new Date(object.date_ended).setHours(0,0,0,0);
		};
		
		converter.userConverter = function(input) {
			for (var i = 0 ; i < input.users.length ; i++){
				delete input.users[i].pivot;
				input.users[i].check = true;	
			}
			
			for (var i = 0 ; i < input.assessors.length ; i++){
				delete input.assessors[i].pivot;
				input.assessors[i].check = true;	
			}
		}
		
		converter.validateCheckpoint = function(input) {
			var msg = {},
				leader;
				
			msg.general = [];
			
			if (input.users.length == 0) {
				msg.general.push('Project ini harus terdiri dari user')
			} else {
				var counter = 0
				for(var i = 0 ; i < input.users.length ; i++) {
					if (input.users[i].leader == true) {
						leader = input.users[i]
						break;
					}
					counter++
				}
	
				if (counter == input.users.length) {
					msg.general.push('Project ini harus memiliki Pimpro');
				}
			}
			
			if (input.assessors.length == 0) {
				msg.general.push('Project ini harus memiliki assessors');
			}
			
			return msg;
		};
		
		converter.dateScoreConverter = function(node) {
			for (var i = 0; i < node.forms.forms.length; i++) {
				if (node.forms.forms[i].upload) {
					node.forms.forms[i].upload.created_at = new Date(node.forms.forms[i].upload.created_at);
					node.forms.forms[i].upload.updated_at = new Date(node.forms.forms[i].upload.updated_at);
				}
			}	
			
			for (var i = 0; i < node.forms.scores.length; i++) {
				node.forms.scores[i].created_at = new Date(node.forms.scores[i].created_at)
				node.forms.scores[i].updated_at = new Date(node.forms.scores[i].updated_at)
			}
		};
		
		converter.calculateScore = function(nodes) {
			
			for (var i = 0; i < nodes.length; i++) {
				
				console.log('-----------------BEGIN---------------');
				console.log(nodes[i].header);
				console.log('-----------------END---------------');
				
				//if(!typeof nodes[i].score)
				if (typeof nodes[i].weight === "undefined" && typeof nodes[i].score === "undefined") {
					
					console.log('a');
					var counter = 0;
					var totalWeight = 0;
					var totalScore = 0;
					
					for (var j = 0; j < nodes[i].children.length; j++) {
						console.log('b');
						if (typeof nodes[i].children[j].weight !== "undefined" && typeof nodes[i].children[j].score !== "undefined") {
							totalWeight += nodes[i].children[j].weight;
							console.log(nodes[i])
							if (nodes[i].children[j].score !== null) {
								totalScore += nodes[i].children[j].score.score * nodes[i].children[j].weight;	
							} else {
								totalScore += 0;
							}
							
							counter++;
							console.log('c');
						} else {
							nodes[i].score = {}
							nodes[i].score.score = 0;
							console.log('d');
							break;
						}
					}
					
					if (counter == nodes[i].children.length) {
						nodes[i].weight = totalWeight;
						nodes[i].score = {}
						nodes[i].score.score = totalScore / totalWeight;
						console.log('e');
					} else {
						converter.calculateScore(nodes[i].children);
						converter.calculateScore(nodes);
						console.log('f');
					}
				}
			}
		};
		
		converter.validateSubmit = function(input) {
			
			var msg = {},
				weight = 0,
				leader = {};
				
			msg.general = []
			msg.noChild = []
			msg.noForm = []
			msg.noWeight = []
				
			if (input.users.length == 0) {
				msg.general.push('Project ini harus terdiri dari user')
			} else {
				var counter = 0
				for(var i = 0 ; i < input.users.length ; i++) {
					if (input.users[i].leader == true) {
						leader = input.users[i]
						break;
					}
					counter++
				}
	
				if (counter == input.users.length) {
					msg.general.push('Project ini harus memiliki Pimpro');
				}
			}
			
			if (input.assessors.length == 0) {
				msg.general.push('Project ini harus memiliki assessors');
			}
	
			if (input.projects.length == 0) {
				msg.general.push('Project ini harus memiliki pekerjaan');
			};
			
			var pushLeader = function(node) {
				var counter = 0;
				for(var j = 0 ; j < node.delegations.length ; j++) {
					if (node.delegations[j].id == leader.id) {
						//do not push if leader already on delegation list
						break;
					}
					counter++;
				}
				
				//push if leader not on delegation list
				if (counter == node.delegations.length && node.delegations.length >= 0) {
					node.delegations.push(leader);
				}
			}
			
			var nodeChecking = function(nodes) {
				for (var i = 0 ; i < nodes.length ; i++) {
					//check if has children
					if (nodes[i].children.length > 0) {
						
						//push leader to delegation
						pushLeader(nodes[i]);
	
						nodeChecking(nodes[i].children);
	
					} else {
						//check if has form collection
						if (nodes[i].forms) {
							
							//checking form item
							if (nodes[i].forms.length == 0) {
								msg.noForm.push('Butir "' + nodes[i].index + nodes[i].header + '" harus memiliki minimal satu form');
							}
							
							if (nodes[i].weight) {	
								//if weight is zero and more than 100
								if (nodes[i].weight !== 0 && nodes[i].weight <= 100) {
									weight += nodes[i].weight;
									console.log(weight);
								} else {
									msg.noWeight.push('Butir "' + nodes[i].index + nodes[i].header + '" harus memiliki bobot lebih besar dari 0');
								}
								
								//push leader to delegation;
								pushLeader(nodes[i]);
	
							} else {
								//if has no weight
								msg.noWeight.push('Butir "' + nodes[i].index + nodes[i].header + '" harus ditentukan bobot pekerjaan')
							}
								
						} else {
							//if not have form collection and children
							msg.noChild.push('Butir "' + nodes[i].index + nodes[i].header + '" harus memiliki child atau form')
						}
					}
				}
			}
			
			nodeChecking(input.projects)
			
			if (weight !== 100) {
				msg.general.push('Bobot project ini tidak sama dengan 100 (' + weight + ')')
			}
			
			return msg;
		};
		
		return converter;
	}
})();