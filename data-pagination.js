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
	function selectValues ( scope, position ) {

		/*situations to handle
			-base case: initial position (0) increment by 1
			-edge cases
			-0 to length-1 => increment 1
			-1 to length => decrement 1
			-at length => increment 1 so return to 0
			-at 0 => decrement 1 so go to length
		*/

		let posOffset = scope.timerVars.currSelectedPos + position,
			nextSelectedPosShifted = posOffset,//posOffset<0 ? scope.timerVars.valueList.length : (posOffset>scope.timerVars.valueList.length ? 0 : posOffset),
			selected = scope.timerVars.valueList[nextSelectedPosShifted][0];

		scope.timerVars.currSelectedPos = posOffset;
console.log('next', scope.timerVars.currSelectedPos, 'position', position, 'stored val', nextSelectedPosShifted, 'total', scope.timerVars.valueList.length);

		scope.timerVars.selectedVal = selected;

// console.log('timer', timerCount, 'selected', selected);

		if (selected.qText) {
			let selectedVal = [selected.qElemNumber];
// console.log('selectedVal', selectedVal);

			// This selects the next value
			scope.backendApi.selectValues(0, selectedVal, false);
		}


		// scope.timerVars.nextSelectedPos = nextSelectedPosShifted + 1;
		// if (scope.timerVars.nextSelectedPos>scope.timerVars.valueList.length) {
		// 	scope.timerVars.nextSelectedPos = 0;
		// }
	}

	function runTimer ( scope ) {
		// initialize timerCount to select the first value
		// let timerCount = 0;

		// create teh setInterval function to loop through values in list
		let t = setInterval(function() {

			selectValues( scope, 1 );
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
					app_this.$scope.timerVars.currSelectedPos 	= 0;

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

// console.log('launch this',scope);
				//if timer is running, stop it and switch the flag
				if (scope.timerVars.running === true) {
					clearInterval(scope.timerVars.timerID);
					scope.timerVars.running = false;
				} else {
				//if the timer isn't running yet, kick it off and store the value
					selectValues ( scope, 0 );
					scope.timerVars.timerID = runTimer( scope );
					scope.timerVars.running = true;
				}
			}

			app_this.$scope.stepPosition = function ( direction ) {
				let scope = this;

				//if timer is running, stop it and switch the flag
				if (scope.timerVars.running === true) {
					clearInterval( scope.timerVars.timerID );
					scope.timerVars.running = false;
					selectValues ( scope, direction );
				} else {
					selectValues ( scope, direction );
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
