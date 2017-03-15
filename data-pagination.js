define([
	"jquery"
	,"qvangular"
	,"text!./data-pagination.html"
	,"text!./styles.css"
	,"qlik"
	],
function($, qvangular, template, cssContent, qlik) {
	'use strict';
// console.log(cssUI);
	$("<style>").html(cssContent).appendTo("head");

	function runTimer( scope ) {
		// initialize timerCount to select the first value
		// let timerCount = 0;

		scope.timerVars.running = true;

		// create teh setInterval function to loop through values in list
		let t = setInterval(function() {

			let selected = scope.timerVars.valueList[scope.timerVars.selectedPos][0];

// console.log('timer', timerCount, 'selected', selected);

			if (selected.qText) {
				let selectedVal = [selected.qElemNumber];
console.log('selectedVal', selectedVal);

				// This selects the next value
				scope.backendApi.selectValues(0, selectedVal, false);
			}


			scope.timerVars.selectedPos ++;
			if (scope.timerVars.selectedPos>scope.timerVars.valueList.length) {
				scope.timerVars.selectedPos = 0;
			}
//------------------hard coded to 5 seconds
		}, 5000);

		return t;
	}

	return {
		template : template,
		initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 2,
					qHeight : 500
				}]
			},
			selectionMode : "QUICK"
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1
					,max : 1
				},
				measures : {
					uses : "measures",
					min : 0,
					max : 1
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings"
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint: function ( $element, layout ) {


			let app_this = this,
				chartID = layout.qInfo.qId;

			// set layout variable to create id used to set the div id
			app_this.$scope.id= chartID;

// console.log('typeof valueList', typeof app_this.$scope.valueList);
			//initialize valuelist array
			app_this.$scope.timerVars = !app_this.$scope.timerVars ? {} : app_this.$scope.timerVars;



			//setup scope.table
			if ( !this.$scope.table ) {
				this.$scope.table = layout.qHyperCube.qDataPages[0].qMatrix; //qlik.table( this );
			}


// console.log('second valueList', typeof valueList);
// console.log('valueList declaration', app_this.$scope.valueList);


			//
			if(layout.qHyperCube.qDataPages[0] && $element.find('div#timer_' + chartID).length>0) {
				if (app_this.$scope.paint===true) {
					console.log('pagination already painted');
				} else {
					app_this.$scope.timerVars.valueList 	= layout.qHyperCube.qDataPages[0].qMatrix;

					//set initial selected position to zero, will be incremented to step back/forward
					app_this.$scope.timerVars.selectedPos 	= 0;

					//run only on initial paint at first
					//clearInterval(app_this.$scope.timerVars.timerID);
					// app_this.$scope.timerVars.timerID = runTimer( app_this.$scope );

					//mark the viz as painted
					app_this.$scope.paint 		= true;
				}
			}

console.log('timerVars', app_this.$scope.timerVars);
			// get max value of dimensions to know when to restart loop

// 			// storing this to control variable reference inside of setInterval
// 			self = this;


			app_this.$scope.launchInterval = function () {
				let scope = this;

console.log('launch this',scope);
				//if timer is running, stop it and switch the flag
				if (scope.timerVars.running === true) {
					clearInterval(scope.timerVars.timerID);
					scope.timerVars.running = false;
				} else {
				//if the timer isn't running yet, kick it off and store the value
					scope.timerVars.timerID = runTimer( scope );
				}
			}


			//get collection of all values in dimension

			// check that sort order is respected

			//fix bootstrap overflow

	// console.log('scopey!',this.$scope);

			//watch inputs for changes
			// this.$scope.changeInputDelay = function () {
			// 	//I have no idea why but scope is only updated when a ng-change function is defined
			// 		// console.log(this);
			// 		// this.$scope.inputs.delay	=	this;
			// };

		},
		controller : ['$scope',
		function($scope) {
			// //set initial inputval
			// $scope.inputs = {
			// 	delay: 70
			// };
		}]

	};

});
