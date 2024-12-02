
function zoom(componente, idCampoTexto) {
	console.log('Componente.....' + componente);
	var valor = null;
	console.log('Quee coisa....', idCampoTexto);
	if (idCampoTexto != null & idCampoTexto != undefined) {
		valor = $('#' + idCampoTexto).val();
		console.log('VALOR....', valor);
		if (valor == '') {
			return false;
		}
		if (idCampoTexto.split('___')[1] != null && idCampoTexto.split('___')[1] != undefined) {
			componente += '___' + idCampoTexto.split('___')[1];
		}
	}

	/*var readOnly = $("#cnpj_cpf").attr('readonly');
	if( readOnly == undefined ){
		readOnly = false;
	}*/

	var campo = componente.split('___')[0];
	var seq = componente.split('___')[1];

	if (campo == 'bt_motorista') {

		modalzoom.open("Motoristas",
			"selectTable",
			"mtc_cpf,CPF,mtc_nome,Nome Motorista",
			"mtc_id,mtc_cpf,mtc_rr,mtc_nome,mtc_situacao,mtc_cep,mtc_email,mtc_telefone,mtc_data_vencimento_exame_med,mtc_numero_cnh,mtc_data_vencimento_cnh,mtc_facebook,mtc_whatsapp,mtc_linkedin,mtc_twitter,mtc_instagram,mtc_bairro,mtc_cidade,mtc_pais,mtc_uf,mtc_numero_end,mtc_rua,mtc_inscricao_estadual,mtc_cnpj,mtc_rg,mtc_imagem,mtc_proprietario_motorista,mtc_whatsapp_cc",
			"dataBase,java:/jdbc/LogixDS,table,ptv_motorista_cadastro_mtc,banco,informix,sqlLimit,250,order,mtc_nome",
			componente, false, "full", null, null,
			"mtc_cpf||'-'||mtc_nome");
	}

	if (campo == 'bt_placa') {

		modalzoom.open("Placas",
			"selectTable",
			"vel_placa,Placa,vel_modelo,Modelo",
			"vel_id,vel_modelo,vel_placa,vel_cor,vel_ano,vel_renavam,vel_chassi,vel_tracionado,vel_eixos,vel_proprietario,vel_situacao,vel_imagem,vel_categoria_cav",
			"dataBase,java:/jdbc/LogixDS,table,ptv_veiculo_vel,banco,informix,sqlLimit,250,order,vel_placa",
			componente, false, "full", null, null,
			"vel_placa||'-'||vel_modelo");
	
		}

}

function setSelectedZoomItem(selectedItem) {
	console.log('selectedItem.type', selectedItem.type);
	console.log('selectedItem', selectedItem);

	var campo = selectedItem.type.split('___')[0];
	var seq = selectedItem.type.split('___')[1];

	if (campo == 'bt_motorista') {
		$('#cod_motorista').val(selectedItem.mtc_id);
		$('#nome_motorista').val(selectedItem.mtc_nome);
	}

	if (campo == 'bt_placa') {
		$('#placa').val(selectedItem.vel_placa);
		$('#tipo').val(selectedItem.vel_modelo);
		$('#renavam').val(selectedItem.vel_renavam);
		
	}

	// calculatotal();

}

function loadDsCombo( combo, dataSet, fieldCodigo, fieldDesc, fieldFilter, fieldFilterValue, fieldOrder, clear, blankLine){

	console.log( 'Passo 001 tipo', $('#'+combo).is('select'), $('#'+combo).val(), $("#opt_"+combo).val()  );

	if( !$('#'+combo).is('select') ){
		return false;
	}

	var constraintsFilhos = new Array();
	var lstFilter = fieldFilter.split(',');
	var lstFilterValue = fieldFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
		constraintsFilhos.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var orderFilhos = new Array();
	var lstOrder = fieldOrder.split(',');
	for ( var j = 0; j < lstOrder.length; j ++ ){
		orderFilhos.push( lstOrder[j] );
	}	
	var fieldFilhos = new Array(fieldCodigo, fieldDesc);
	var datasetFilhos = DatasetFactory.getDataset(dataSet, fieldFilhos, constraintsFilhos, orderFilhos );
	console.log('datasetFilhos....',datasetFilhos);
	if ( datasetFilhos != null ){
		var valDefault = "";
		if ( $("#"+combo).val() != "" && $("#"+combo).val() != null && $("#"+combo).val() != undefined ){
		valDefault = $("#"+combo).val();
		} else if ( $("#opt_"+combo).val() != "" && $("#opt_"+combo).val() != null && $("#opt_"+combo).val() != undefined ){
			valDefault = $("#opt_"+combo).val();
		}
		if( clear != 'N' && clear != false ){
			$("#"+combo+" option").remove();
			if( blankLine == 'S' || blankLine == false || blankLine == undefined || blankLine == null ){
				$("#"+combo).append("<option value='' ></option>");
			}
		}
		var filhos = datasetFilhos.values;
		for ( var i in filhos ) {
			var filho = filhos[i];
			var den = '';

			if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
				continue;
			} 
			if ( fieldDesc == '' ){
				den = filho[ fieldCodigo ];
			}else{
				den = filho[ fieldDesc ];
				// den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
			}
			$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
		}
		console.log('valDefault.......',valDefault);
		if ( valDefault != '' ){
			$("#"+combo).val( valDefault );
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