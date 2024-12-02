    function loadBody(){
    
    	console.log('loadBody.....', parent.$('#modal_tipo').val() );
    
     	if ( $('#nome_funcionario').val() == "" && $('#matricula').val() != "" ){
    		console.log(' Entrei antes do zoom....' );
			zoom( 'bt_matricula', 'matricula' );
		 }
    	
    }
    
    
	function getOptCombo( combo ){				
		var optArray = new Array();
		$("#"+combo+" option").each(function () {
			optArray.push( $(this).val() );
		});
		return optArray;
	}
	
	function loadDataSetCombo( combo, dataSet, fieldCodigo, fieldDesc, concatCodDesc, clear, blankLine, fildFilter, fildFilterValue, fieldFlag ){
		
		var constraintsFilhos = new Array();
		if ( fildFilter != undefined && fildFilter != "" && fildFilter != null 
			&& fildFilterValue != undefined  && fildFilterValue != "" && fildFilterValue != null ){
			var lstFilter = fildFilter.split(',');
			var lstFilterValue = fildFilterValue.split(',');
			for ( var j = 0; j < lstFilter.length; j ++ ){
				if ( lstFilter[j] != '' && lstFilter[j] != null ){
					constraintsFilhos.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
				}
			}
		}
		
		var orderFilhos = new Array();
		orderFilhos.push( fieldCodigo );						
		var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
		if ( datasetFilhos != null ){
			var valDefault = "";
			if ( $("#"+combo).val() != "" && $("#"+combo).val() != null && $("#"+combo).val() != undefined ){
				valDefault = $("#"+combo).val();
			}
			if( clear == 'S' ){
				$("#"+combo+" option").remove();
			}
			if( blankLine == 'S' ){
				$("#"+combo).append("<option value='' ></option>");
			}
			var filhos = datasetFilhos.values;
			for ( var i in filhos ) {
				var filho = filhos[i];
				var den = '';
				if (  valDefault == "" && ( filho[ fieldFlag ] || filho[ fieldFlag ] == 'on' ) ){
					valDefault = filho[ fieldCodigo ];
				}
				if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
					continue;
				} 
				if ( fieldDesc == '' ){
					den = filho[ fieldCodigo ];
				}else if ( concatCodDesc == "S" ){
					den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
				}else{
					den = filho[ fieldDesc ];
				}
				$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
			}
			if ( valDefault != '' ){
				$("#"+combo).val( valDefault );
			}
		}
	}		