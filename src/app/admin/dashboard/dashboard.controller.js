(function () {
	'use strict'
	angular
		.module('spmiFrontEnd')
		.controller('AdminController', AdminController)
		
	
	function AdminController ($state, $timeout, $auth, CURRENT_USER) {
		var admin = this
		
       
        
        
        
        
        
        
        
        
		admin.user = CURRENT_USER
	
		admin.logout = function(){
			$auth.logout().then(function(){
				CURRENT_USER = {}
				$state.go('login', {sender: 'system'});
			}, function(response){})
		}
	
		admin.line = {
			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
			series: ['Series A', 'Series B'],
			data: [
			[65, 59, 80, 81, 56, 55, 40],
			[28, 48, 40, 19, 86, 27, 90]
			],
			onClick: function (points, evt) {
			console.log(points, evt);
			}
		};
	
		admin.bar = {
			labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
			series: ['Series A', 'Series B'],
	
			data: [
			[65, 59, 80, 81, 56, 55, 40],
			[28, 48, 40, 19, 86, 27, 90]
			]
			
		};
	
		admin.donut = {
			labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
			data: [300, 500, 100]
		};
	
		admin.radar = {
			labels:["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
	
			data:[
				[65, 59, 90, 81, 56, 55, 40],
				[28, 48, 40, 19, 96, 27, 100]
			]
		};
	
		admin.pie = {
			labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
			data : [300, 500, 100]
		};
	
		admin.polar = {
			labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
			data : [300, 500, 100, 40, 120]
		};
	
		admin.dynamic = {
			labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
			data : [300, 500, 100, 40, 120],
			type : 'PolarArea',
	
			toggle : function () 
			{
				this.type = this.type === 'PolarArea' ?
				'Pie' : 'PolarArea';
			}
		};
	
		return admin;
	}

})();


