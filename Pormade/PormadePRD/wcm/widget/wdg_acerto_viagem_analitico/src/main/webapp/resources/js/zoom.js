function zoom(componente, idCampoTexto) {

	var valor = null;

	console.log('Componente =>', componente);
	console.log('IdCampoTexto =>', idCampoTexto);

	if (idCampoTexto != null & idCampoTexto != undefined) {
		valor = $('#' + idCampoTexto).val();
		console.log('VALOR =>', valor);
		if (valor == '') {
			return false;
		}
		if (idCampoTexto.split('___')[1] != null && idCampoTexto.split('___')[1] != undefined) {
			componente += '___' + idCampoTexto.split('___')[1];
		}
	}

	// if (componente == 'bt_motorista') {

	// 	modalzoom.open("Motoristas",
	// 		"selectTableMySql",	
	// 		"motorista,Nome Motorista",
	// 		"distinct,cod_motorista,motorista",
	// 		"dataBase,java:/jdbc/FluigDS,table,fluig_v_acerto_viagem,sqlLimit,250,order,motorista",
	// 		componente, false, "full", null, null,
	// 		"cod_motorista||'-'||motorista");

	// }

	// if (componente == "bt_motorista") {
	// 	modalzoom.open("Motoristas",
	// 			   "cadastro_motorista", 
	// 			   "den_motorista,Motorista", 
	// 			   "cod_motorista,den_motorista", 
	// 			   "ativo,S",
	// 			   componente, false, "default", null, null,
	// 		     "den_motorista");
	// }

	if (componente == 'bt_motorista') {

		modalzoom.open("Motoristas",
			"selectTable",
			"mtc_cpf,CPF,mtc_nome,Nome Motorista",
			"mtc_id,mtc_cpf,mtc_rr,mtc_nome,mtc_situacao,mtc_cep,mtc_email,mtc_telefone,mtc_data_vencimento_exame_med,mtc_numero_cnh,mtc_data_vencimento_cnh,mtc_facebook,mtc_whatsapp,mtc_linkedin,mtc_twitter,mtc_instagram,mtc_bairro,mtc_cidade,mtc_pais,mtc_uf,mtc_numero_end,mtc_rua,mtc_inscricao_estadual,mtc_cnpj,mtc_rg,mtc_imagem,mtc_proprietario_motorista,mtc_whatsapp_cc",
			"dataBase,java:/jdbc/LogixDS,table,ptv_motorista_cadastro_mtc,banco,informix,sqlLimit,250,order,mtc_nome",
			componente, false, "full", null, null,
			"mtc_cpf||'-'||mtc_nome");
	}
	


	if (componente == 'bt_placa') {

	modalzoom.open("Placas",
		"selectTable",
		"vel_placa,Placa,vel_modelo,Modelo",
		"vel_id,vel_modelo,vel_placa,vel_cor,vel_ano,vel_renavam,vel_chassi,vel_tracionado,vel_eixos,vel_proprietario,vel_situacao,vel_imagem,vel_categoria_cav",
		"dataBase,java:/jdbc/LogixDS,table,ptv_veiculo_vel,banco,informix,sqlLimit,250,order,vel_placa",
		componente, false, "full", null, null,
		"vel_placa||'-'||vel_modelo");

	}
	
	if (componente == 'bt_proprietaria') {

		modalzoom.open("Proprietaria",
			"selectTable",
			"mtc_nome,Proprietaria",
			"mtc_id,mtc_nome,mtc_situacao,mtc_cep,mtc_email,mtc_telefone,mtc_data_vencimento_exame_med,mtc_numero_cnh,mtc_data_vencimento_cnh,mtc_facebook,mtc_whatsapp,mtc_linkedin,mtc_twitter,mtc_instagram,mtc_bairro,mtc_cidade,mtc_pais,mtc_uf,mtc_numero_end,mtc_rua,mtc_inscricao_estadual,mtc_cnpj,mtc_rg,mtc_imagem,mtc_proprietario_motorista,mtc_whatsapp_cc",
			"dataBase,java:/jdbc/LogixDS,table,ptv_motorista_cadastro_mtc,banco,informix,sqlLimit,250,order,mtc_nome,mtc_proprietario_motorista,P",
			componente, false, "full", null, null,
			"mtc_cpf||'-'||mtc_nome");

	}

	if (componente == 'bt_receita') {

	modalzoom.open("Tipo Receita",
		"tipo_receita_acerto_viagem",
		"tipo_receita,Tipo Receita",
		"cod_tipo_receita,tipo_receita,valor_padrao,valor_maximo,pct_comiss,fixo,tipo_frete,obriga_imagem",
		"",
		componente, false, "default", null, null,
		"tipo_receita");

	}

	if (componente == 'bt_despesa') {

		modalzoom.open("Tipo Despesa",
			"tipo_despesa_acerto_viagem",
			"tipo_despesa,Tipo Despesa",
			"cod_tipo_despesa,tipo_despesa,valor_padrao,valor_maximo,acumula,obriga_imagem",
			"",
			componente, false, "default", null, null,
			"tipo_despesa");
	}

	if (componente == 'bt_descarga') {

		modalzoom.open("Ajudante / Chapa",
			"ajudante_chapa",
			"nome,Ajudante,den_cidade_uf,Cidade",
			"cpf_ajudante,nome,telefone,den_cidade_uf",
			"",
			componente, false, "default", null, null,
			"nome");
	}

	if (componente == 'bt_abastecimento') {

		modalzoom.open("Posto",
			"posto_abastecimento",
			"cnpj_posto,CNPJ,nome_posto,Posto,telefone,Telefone,den_cidade_uf,Cidade",
			"cnpj_posto,nome_posto,den_cidade_uf,fatura,telefone,valor_litro",
			"",
			componente, false, "default", null, null,
			"nome_posto");
	}

	if( componente == 'bt_estado' ){
					
		// var filtroCPL = '';
		// var largura = "default";
		// if ( valor != null && valor != undefined ){
		// 	filtroCPL = ',cast(id as char(5)),'+valor;
		// 	largura = 'none';
		// }
		
		modalzoom.open("Estado",
					   "selectTable", 
					   "uf,UF,nome,Nome",
					   "distinct,uf,nome", 
					   "dataBase,java:/jdbc/CRMDS,table,fluig_v_cidade,banco,postgresql,sqlLimit,250",
					   componente, false, "default", null, null,
				       "cod_uf||'-'||uf" );
	}
	

	var campo = componente.split('___')[0];
	var row = componente.split('___')[1];
	console.log('campo =>', campo);
	console.log('row =>', row);
	
	if (campo == "btnConcorrente") {
		modalzoom.open("Concorrente",
				   "concorrente", 
				   "concorrente,Concorrente", 
				   "cod_concorrente,concorrente", 
				   "",
				   componente, false, "default", null, null,
			       "concorrente" );
	}
	

}

function setSelectedZoomItem(selectedItem) {

	console.log('selectedItem =>', selectedItem);

	if (selectedItem.type == 'bt_motorista') {

		$('#cod_motorista_' + $this.instanceId).val(selectedItem.mtc_cpf.replace(/\.|\-/g, ''));
		$('#motorista_' + $this.instanceId).val(selectedItem.mtc_nome);

	}

	if (selectedItem.type == 'bt_placa') {

		$('#placa_' + $this.instanceId).val(selectedItem.vel_placa);

	}
	
	if (selectedItem.type == 'bt_proprietaria') {

		$('#cod_proprietaria_' + $this.instanceId).val(selectedItem.mtc_id);
		$('#den_proprietaria_' + $this.instanceId).val(selectedItem.mtc_nome);

	}

	if (selectedItem.type == 'bt_receita') {

		$('#cod_receita_' + $this.instanceId).val(selectedItem.cod_tipo_receita);
		$('#den_receita_' + $this.instanceId).val(selectedItem.tipo_receita);

	}

	if (selectedItem.type == 'bt_despesa') {

		$('#cod_despesa_' + $this.instanceId).val(selectedItem.cod_tipo_despesa);
		$('#den_despesa_' + $this.instanceId).val(selectedItem.tipo_despesa);

	}

	if (selectedItem.type == 'bt_descarga') {

		$('#cod_ajudante_' + $this.instanceId).val(selectedItem.cpf_ajudante);
		$('#den_ajudante_' + $this.instanceId).val(selectedItem.nome);

	}

	if (selectedItem.type == 'bt_abastecimento') {

		$('#cod_posto_' + $this.instanceId).val(selectedItem.cnpj_posto);
		$('#den_posto_' + $this.instanceId).val(selectedItem.nome_posto);

	}

	if (selectedItem.type == 'bt_estado') {

		$('#estado_' + $this.instanceId).val(selectedItem.uf);
		$('#uf_' + $this.instanceId).val(selectedItem.nome);

	}
	

	// Trata campos filhos
	if (typeof selectedItem.type !== 'undefined') {
		var campo = selectedItem.type.split('___')[0];
		var seq = selectedItem.type.split('___')[1];
	}

	console.log('campo filho =>', campo);
	console.log('seq filho =>', seq);

	if (campo == "btnConcorrente") {
		$('#cod_concorrente___' + seq).val(selectedItem.cod_concorrente);
		$('#concorrente___' + seq).val(selectedItem.concorrente);
	}

}

//Deleta conteúdo dos campos
function del(componente, componenteFocus) {
	var x = 0;

	var lista = componente.split(",");

	console.log('Componentes Del =>', lista);

	if (document.getElementsByName(lista[x])[0] != null) {
		for (x; x < lista.length; x++) {
			document.getElementsByName(lista[x])[0].value = "";
		}
		if (componenteFocus != "")
			document.getElementsByName(componenteFocus)[0].focus();
	}
	else {
		alert("O campo nao esta habilitado.");
	}
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
				den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
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