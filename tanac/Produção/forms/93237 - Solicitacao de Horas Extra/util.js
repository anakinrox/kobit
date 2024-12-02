function setMask(){
	$('.decimal-6').maskMoney( { precision:6, thousands:'.',decimal:','} );
	$('.decimal-5').maskMoney( { precision:5, thousands:'.',decimal:','} );
	$('.decimal-4').maskMoney( { precision:4, thousands:'.',decimal:','} );
	$('.decimal-3').maskMoney( { precision:3, thousands:'.',decimal:','} );
	$('.decimal-2').maskMoney( { precision:2, thousands:'.',decimal:','} );
	$('.decimal-1').maskMoney( { precision:1, thousands:'.',decimal:','} );
	$('.decimal-0').maskMoney( { precision:0, thousands:'.',decimal:','} );
	
	FLUIGC.calendar('.data-fluig');
	
	$('.decimal-6').css( "text-align", "right" );
	$('.decimal-5').css( "text-align", "right" );
	$('.decimal-4').css( "text-align", "right" );
	$('.decimal-3').css( "text-align", "right" );
	$('.decimal-2').css( "text-align", "right" );
	$('.decimal-1').css( "text-align", "right" );
	$('.decimal-0').css( "text-align", "right" );
	
	$('.data-fluig').css( "text-align", "center" );
	
}

function formatDecimal(val, pres){
	var fVal = parseFloat( val );
	return String((fVal).toFixed(pres)).replace('.', ',');
};

function converteMoeda(valor) {
	var inteiro = null, decimal = null, c = null, j = null;
	var aux = new Array();
	valor = "" + valor;
	c = valor.indexOf(".", 0);
	// encontrou o ponto na string
	if (c > 0) {
		// separa as partes em inteiro e decimal
		inteiro = valor.substring(0, c);
		decimal = valor.substring(c + 1, valor.length);
	} else {
		inteiro = valor;
	}

	// pega a parte inteiro de 3 em 3 partes
	for (j = inteiro.length, c = 0; j > 0; j -= 3, c++) {
		aux[c] = inteiro.substring(j - 3, j);
	}

	// percorre a string acrescentando os pontos
	inteiro = "";
	for (c = aux.length - 1; c >= 0; c--) {
		inteiro += aux[c] + '.';
	}
	// retirando o ultimo ponto e finalizando a parte inteiro

	inteiro = inteiro.substring(0, inteiro.length - 1);

	decimal = parseInt(decimal);
	if (isNaN(decimal)) {
		decimal = "00";
	} else {
		decimal = "" + decimal;
		if (decimal.length === 1) {
			decimal = "0" + decimal;
		}
	}

	valor = inteiro + "," + decimal;
	return valor;
}

function loadPaiFilhoCombo( combo, dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue ){
	
	console.log( combo, dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue  );

	var constraintsPai = new Array();
	var lstFilter = fildFilter.split(',');
	var lstFilterValue = fildFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
			constraintsPai.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var datasetPai = DatasetFactory.getDataset(dataSet, null, constraintsPai, null );
	
	if( datasetPai != undefined && datasetPai != null ){
		var pais = datasetPai.values;
		for ( var y in pais ) {
			var pai = pais[y];
			
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
			
			var orderFilhos = new Array();
			orderFilhos.push( fieldCodigo );						
			var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				var valDefault = $("#"+combo).val();
				$("#"+combo+" option").remove();
				var filhos = datasetFilhos.values;
				console.log('DataSet',datasetFilhos);
				console.log('DataSet',filhos);
				//$("#empresa").append("<option value='' ></option>");
				for ( var i in filhos ) {
					console.log('Linha DataSet.....',i);
					var filho = filhos[i];
					var den = '';					
					if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
						continue;
					} 
					if ( fieldDesc == '' ){
						den = filho[ fieldCodigo ];
					}else{
						den = filho[ fieldDesc ];
					}
					$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
				}
				$("#"+combo).val( valDefault );
			}
		}
	}
}

function getOptCombo( combo ){
	
	var optArray = new Array();
	$("#"+combo+" option").each(function () {
		optArray.push( $(this).val() );
	});
	return optArray;
}

function autoSize(){
	$('textarea').each(function (){
		$(this).on(
			 'keyup input keypress keydown change',
			 function(e) {
			  var tamanhoMin = $(this).attr('rows')
				* $(this).css('line-height').replace(
				  /[^0-9\.]+/g, '');
			  $(this).css({
			   'height' : 'auto'
			  });
			  var novoTamanho = this.scrollHeight
				+ parseFloat($(this).css("borderTopWidth"))
				+ parseFloat($(this).css("borderBottomWidth"));
			  if (tamanhoMin > novoTamanho)
			   novoTamanho = tamanhoMin;
			  $(this).css({
			   'height' : novoTamanho
			  });
			 }).css({
			'overflow' : 'hidden',
			'resize' : 'none'
		   }).delay(0).show(0, function() {
			var el = $(this);
			setTimeout(function() {
			 el.trigger('keyup');
			}, 100);
		   });
	})
}

function isNull( valor, padrao ){
	if ( isNaN( valor ) ){
		return padrao;
	}else{
		return valor;
	}
}		


function valida( lCampos, pnGrp ) {

	var retorno = true;
	var idFocu = '';
	
	var vnGrp = pnGrp;
	if( vnGrp == "" || vnGrp == undefined ){
		vnGrp = ".fluig-style-guide";	
	}
	
	console.log('Entrei valida....', lCampos, vnGrp);
		
	$( lCampos, vnGrp ).each(
		function() {
			
			if( $(this).attr('readonly') ){
				$(this).css({'background-color' : '#EEEEEE'});
			}else{
				$(this).css({'background-color' : '#FFFFFF'});
			}
			
			console.log( 'field-valida', $(this).val(), $(this).attr('field-valida'), $(this).attr('value-valida') );
			
			if( $(this).attr('field-valida') != "" && $(this).attr('field-valida') != undefined ){
				console.log('Entrou teste field', $( '#'+$(this).attr('field-valida') ).val(), 'X' , $(this).attr('value-valida'), 'X' ,  $(this).val() );
				if( $( '#'+$(this).attr('field-valida') ).val() == $(this).attr('value-valida')
				  && $(this).val() == "" ){
					
					$(this).css({'background-color' : '#FFE4C4'});
					//alert( $(this).attr('name') );
					console.log('Validado... ', $(this).attr('name') );
					retorno = false;
					if( idFocu == '' ){
						idFocu = $(this).attr('id');
					}
				}
				if( $(this).attr('value-valida') == "!" 
					&& $( '#'+$(this).attr('field-valida') ).val() != "" 
					&& $( '#'+$(this).attr('field-valida') ).val() != "0" 
					&& $( '#'+$(this).attr('field-valida') ).val() != "0,00"
					&& $(this).val() == "" ){
							
					$(this).css({'background-color' : '#FFE4C4'});
					//alert( $(this).attr('name') );
					console.log('Validado... ', $(this).attr('name') );
					retorno = false;
					if( idFocu == '' ){
						idFocu = $(this).attr('id');
					}
				}
			}else{
				//tratar se o campo for do tipo decimal e o valor for 0
				/*if ($(this).hasClass("decimal-2") || $(this).hasClass("decimal-0")){
					if ( $(this).val()=='0'  || $(this).val()=='0,00' ){
						if( !( $(this).hasClass("pf") && $(this).attr('name').split('___').length <= 1 ) ){
							
							$(this).css({'background-color' : '#FFE4C4'});
							retorno = false;
							if( idFocu == '' ){
								idFocu = $(this).attr('id');
							}
						}
					}
				}*/
				
				if( ( $(this).val() == ""
				   || $(this).val() == null
				   || $(this).val() == undefined ) ){
					console.log('Name', $(this).attr('name') );
					if( !( $(this).hasClass("pf") && $(this).attr('name').split('___').length <= 1 ) ){
							
						$(this).css({'background-color' : '#FFE4C4'});
						//alert( $(this).attr('name') );
						console.log('Validado... ', $(this).attr('name') );
						retorno = false;
						if( idFocu == '' ){
							idFocu = $(this).attr('id');
						}
					}
				}
				
			}
			
			//field-valida="cliente_especifico" value-valida="S"
			
	console.log('ENTROU4');		
		});
	if( idFocu != '' ){
		setTimeout("$('#"+idFocu+"').focus();", 1);
	}
	return retorno;	
}


function openProcess(processo) {
    
    var WCMAPI = window.parent.WCMAPI;
    														    
    var url = WCMAPI.getServerURL() + WCMAPI.getServerContextURL() + '/p/' + WCMAPI.getTenantCode() + '/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=' + processo;

    window.open(url, '_blank');
}


function readOnlyAll( tipo, grupo, aba ){
	console.log('Entrei Read Only....');
	
	if( grupo == undefined || grupo == "" ){
		var abaLocal = ".fluig-style-guide";
		if( aba == "" || aba == undefined || aba == null ){
			abaLocal = aba; 
		}
		$('input, select, textarea', $(aba) ).each(function(){
			var vnTIpo = tipo;
			if( $(this).hasClass('readonly') ){
				vnTIpo = true;
			}
			//console.log('Entrei Read Only campo....',$(this).attr('id'));
			if( $(this).is('select') ){			
				$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', vnTIpo);
			}else{
				$(this).attr('readonly',vnTIpo);
				
				$(this).removeClass('decimal-7');
				$(this).removeClass('decimal-6');
				$(this).removeClass('decimal-5');
				$(this).removeClass('decimal-4');
				$(this).removeClass('decimal-3');
				$(this).removeClass('decimal-2');
				$(this).removeClass('decimal-1');
				$(this).removeClass('decimal-0');
				$(this).removeClass('integer-0');
				$(this).removeClass('data-fluig');
				$(this).removeClass('decimal2');
				$(this).removeClass('dataFluig');
			}
		});
	}else{
		$(grupo).each(function(){
			var vnTIpo = tipo;
			if( $(this).hasClass('readonly') ){
				vnTIpo = true;
			}
			//console.log('Entrei Read Only campo....',$(this).attr('id'));
			if( $(this).is('select') ){			
				$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', vnTIpo);
			}else{
				$(this).attr('readonly',vnTIpo);
				
				$(this).removeClass('decimal-7');
				$(this).removeClass('decimal-6');
				$(this).removeClass('decimal-5');
				$(this).removeClass('decimal-4');
				$(this).removeClass('decimal-3');
				$(this).removeClass('decimal-2');
				$(this).removeClass('decimal-1');
				$(this).removeClass('decimal-0');
				$(this).removeClass('integer-0');
				$(this).removeClass('data-fluig');
				$(this).removeClass('decimal2');
				$(this).removeClass('dataFluig');
			}
		});
	}
	
}
