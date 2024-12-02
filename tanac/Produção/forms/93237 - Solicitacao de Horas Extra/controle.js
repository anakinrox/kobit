
var bloqEditaForm = false; 

function loadBody(){

	if( ['62','88','2','6'].indexOf( $('#task').val() ) > -1 ){
		readOnlyAll(true, '.abertura');
		bloqEditaForm = true;
	}
	
	$('.empresa_filtro').val( "" ) ;
	
	setMask();
	autoSize();
	totalizar();
}

function fnCustomDelete(oElement){
	 
	if( bloqEditaForm ){
		return false;
	}
    // Chamada a funcao padrao, NAO RETIRAR
    fnWdkRemoveChild(oElement);
 
}

function totalizar() {
	var totalHoras = 0.00;
	var totalSaldo = 0.00;
	$("input[name*=horas___]").each(function (index) {
		var seq = $(this).attr('id').split('___')[1];
		if( $("#horas___"+seq).val() != "" ){
			totalHoras += Math.round(parseFloat($("#horas___"+seq).val().replace('.', '').replace(',', '.')) * 1000) / 1000;
		}
		if( $("#saldo___"+seq).val() != "" ){
			totalSaldo += Math.round(parseFloat($("#saldo___"+seq).val().replace('.', '').replace(',', '.')) * 1000) / 1000;
		}
	});
	$("#horas_total").val( formatDecimal( totalHoras, 2 ) );
	$("#saldo_total").val( formatDecimal( totalSaldo, 2 ) );
}


var beforeSendValidate = function(numState, nextState) {
	
	
	var retorno = true;
	retorno = valida('.abertura');
	
		
	if( !retorno ){
		alert( 'Existem campos obrigatórios, favor verificar' );
		return false;
	}
	
	if( $( "input[name^=horas___]" ).length == 0 ){
		alert( 'Você deve informar ao menos um colaborador.' );
		return false;	
	};
	
	var periodo = $('#periodo_aquisitivo').val();
	
	var ano = ( new Date() ).getFullYear();
	var periodo_ini = ano+periodo.split('-')['0'];
	
	var periodo_fim = periodo.split('-')['1'];
	if( periodo_fim == "0115" ){
		var ano = ( new Date() ).getFullYear()+1;
		periodo_fim = ano+periodo_fim;
	}else{
		var ano = ( new Date() ).getFullYear();
		periodo_fim = ano+periodo_fim;
	} 
	var dataFora = [];
	$("input[name*=horas___]").each(function (index) {
		var seq = $(this).attr('id').split('___')[1];
		if( periodo_ini > $('#data_de___'+seq).val().split('/')[2]+$('#data_de___'+seq).val().split('/')[1]+$('#data_de___'+seq).val().split('/')[0]
		 || periodo_fim < $('#data_ate___'+seq).val().split('/')[2]+$('#data_ate___'+seq).val().split('/')[1]+$('#data_ate___'+seq).val().split('/')[0] ){
			dataFora.push( $('#data_de___'+seq).val() + ' - ' + $('#data_ate___'+seq).val() );			
		}
	});
	
	if( dataFora.length ){
		if( !confirm( 'Data(s) '+ dataFora.join() + ', fora do periodo aquisitivo, deseja continuar?' ) ){
	    	return false;
		};
	}
	
	if( !$("#ciente").is(':checked') ){
		throw "Você não marcou a flag de ciencia.";
	}
	
	return true;
	
}