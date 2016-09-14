define([
	"jquery"
	,"qvangular"
	,"text!./template.html"
	,"text!./styles.css"
	,"qlik"
	,"./lib/d3-timer"
	],
function($, qvangular, template, cssContent, qlik, d3timer) {
	'use strict';
// console.log(cssUI);
	$("<style>").html(cssContent).appendTo("head");
	return {
		template : template,
		// initialProperties : {
		// 	qHyperCubeDef : {
		// 		qDimensions : [],
		// 		qMeasures : [],
		// 		qInitialDataFetch : [{
		// 			qWidth : 2,
		// 			qHeight : 50
		// 		}]
		// 	}
		// },
		initialProperties: {
				qListObjectDef: {
						qShowAlternatives: true,
						qFrequencyMode: "V",
						qInitialDataFetch: [{
								qWidth: 2,
								qHeight: 50
							}]
				},
				fixed: true,
				width: 25,
				percent: true,
				selectionMode: "QUICK"
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				// dimensions : {
				// 	uses : "dimensions",
				// 	min : 1,
				// 	max : 1
				// },
				dimensions: {
											type: "items",
											translation: "Dimensions",
											ref: "qListObjectDef",
											min: 1,
											max: 1,
											items: {
													field: {
															type: "string",
															expression: "always",
															expressionType: "dimension",
															ref: "qListObjectDef.qDef.qFieldDefs.0",
															translation: "Field",
															show: function (data) {
																	return data.qListObjectDef && !data.qListObjectDef.qLibraryId;
															}
													}
												}
												//title for dimension
												//sort order items
				},
				// measures : {
				// 	uses : "measures",
				// 	min : 1,
				// 	max : 1
				// },
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
			//setup scope.table
			if ( !this.$scope.table ) {
				this.$scope.table = layout.qListObject.qDataPages[0].qMatrix; //qlik.table( this );
			}

			let valueList = layout.qListObject.qDataPages[0].qMatrix;

			//recalibrate list of values if user changes dim
			// var that = this;
			// this.$scope.$watch("layout", function (newVal, oldVal) {
			// 		console.log('newVal',newVal);
			// 		console.log('oldVal',oldVal );
			// 		// that.$scope.table = qlik.table( newVal );
			// });

			// get max value of dimensions to know when to restart loop

			// storing this to control variable reference inside of setInterval
			self = this;

			// initialize timerCount to select the first value
			let timerCount = 0;

			// create teh setInterval function to loop through values in list
			let t = setInterval(function() {

				let selected = valueList[timerCount][0];

console.log('timer', timerCount, 'selected', selected);

				if (selected.qText) {
					let selectedVal = [selected.qElemNumber];
console.log('selectedVal', selectedVal);

					// self.backendApi.selectValues(0, selectedVal, false);
				}


				timerCount ++;
				if (timerCount>10) {
					clearInterval(t)
				}
			}, 1000);



			//get collection of all values in dimension

			// check that sort order is respected

			// select first value

			// using a timer, loop through all value

			//fix bootstrap overflow

			console.log('scopey!',this.$scope);

			//watch inputs for changes
			this.$scope.changeInputDelay = function () {
				//I have no idea why but scope is only updated when a ng-change function is defined
					// console.log(this);
					// this.$scope.inputs.delay	=	this;
			};

		},
		controller : ['$scope',
		function($scope) {
			//set initial inputval
			$scope.inputs = {
				delay: 70
			};
		}]

	};

});
