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
		initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 2,
					qHeight : 50
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1,
					max : 1
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
			$scope.inputs = 70;
console.log('scopey!',$scope);
		}]

	};

});
