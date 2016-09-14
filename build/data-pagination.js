define([
	"jquery"
	,"qvangular"
	,"text!./template.html"
	,"text!./styles.css"
	,"qlik"
	],
function($, qvangular, template, cssContent, qlik) {
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
		paint: function ( ) {
			//setup scope.table
			if ( !this.$scope.table ) {
				this.$scope.table = qlik.table( this );
			}

			//recalibrate list of values if user changes dim
			var that = this;
			this.$scope.$watch("this", function (newVal, oldVal) {
					// console.log('newVal',newVal);
					that.$scope.table = qlik.table( newVal );
			});

			//watch inputs for changes
			this.$scope.changeInputDelay = function () {
					console.log(this);
					// this.$scope.inputs.delay	=	this;
					// this.backendApi.selectValues(0, [this.row[0].qElemNumber], true);
			};


			//get collection of all values in dimension

			// check that sort order is respected

			// select first value

			// using a timer, loop through all value

			//fix bootstrap overflow

			console.log('scopey!',that.$scope);
			// console.log('table',that.$scope.table);

			// $( "#slider" ).slider({
			// 	value:100,
			// 	min: 0,
			// 	max: 500,
			// 	step: 50
			// 	// ,slide: function( event, ui ) {
			// 	// 	$( "#amount" ).val( "$" + ui.value );
			// 	// }
			// });
			// $( "#amount" ).val( "$" + $( "#slider" ).slider( "value" ) );
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
