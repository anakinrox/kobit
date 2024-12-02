function zoom(componente, idCampoTexto) {

	if (!editForm) { return false; }

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

	if (componente == 'bt_motorista') {

		modalzoom.open("Motoristas",
			"selectTable",
			"mtc_cpf,CPF,mtc_nome,Nome Motorista",
			"mtc_id,mtc_cpf,mtc_rr,mtc_nome,mtc_situacao,mtc_cep,mtc_email,mtc_telefone,mtc_data_vencimento_exame_med,mtc_numero_cnh,mtc_data_vencimento_cnh,mtc_facebook,mtc_whatsapp,mtc_linkedin,mtc_twitter,mtc_instagram,mtc_bairro,mtc_cidade,mtc_pais,mtc_uf,mtc_numero_end,mtc_rua,mtc_inscricao_estadual,mtc_cnpj,mtc_rg,mtc_imagem,mtc_proprietario_motorista,mtc_whatsapp_cc",
			"dataBase,java:/jdbc/LogixDS,table,ptv_motorista_cadastro_mtc,banco,informix,sqlLimit,250,order,mtc_nome",
			componente, false, "large", null, null,
			"mtc_cpf||'-'||mtc_nome");
	}

	if (componente == 'btnPlaca') {
		if ($('#data_infracao').val() == '' && $('#ind_acerto').val() == 'S') {
		 	FLUIGC.toast({
		 		message: 'Informe a data da carga!',
		 		type: 'warning'
			 });
		 	return false;
		}


		if ( $('#ind_acerto').val() == 'S' ){
			modalzoom.open("Placa",
		 	"selectMultasSBA",
		 	"placa,Placa,motorista,Motorista",
		 	"placa,cod_motorista,motorista",
		 	'data_carga,'+ $('#data_infracao').val().substring(0,10).split('/').reverse().join('-'),
		 	componente +'_S', false, "full", null, null,
		 	"placa");
		}

		if ( $('#ind_acerto').val() == 'N' ) {
			modalzoom.open("Placa",
			"selectTable",
			"vel_placa,Placa",
			"distinct,vel_placa",
			"dataBase,java:/jdbc/LogixDS,table,ptv_veiculo_vel,banco,informix,sqlLimit,250,order,vel_placa",
			componente +'_N', false, "large", null, null,
			"vel_placa");
		}

	}

	if (componente == 'btnInfracao') {
	modalzoom.open("Infração",
			"cadastro_infracao_transito",
			"infracao,Cod,descricao_infracao,Infração,gravidade,Gravidade",
			"infracao,descricao_infracao,amparo_legal,infrator,gravidade,orgao_competente,valor",
			"",
			componente, false, "full", null, null,
			"infracao");
	}

	if (componente == 'btnAuto') {
		modalzoom.open("Infração",
				"selectDataset",
				"num_infracao,Auto Infração",
				"num_infracao",
				"dataset,multas_sba,sqlLimit,250,___not___num_infracao,null",
				componente, false, "full", null, null,
				"num_infracao");
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

	if (selectedItem.type == "bt_motorista") {
		$('#cod_motorista').val(selectedItem.mtc_id);
		$('#motorista').val(selectedItem.mtc_nome);
		$('#matricula').val(selectedItem.mtc_cpf.replace(/[^a-z0-9]/gi,''));
	}

	if (selectedItem.type == "btnPlaca_S") {
		$('#placa').val(selectedItem.placa);
		$('#cod_motorista').val(selectedItem.cod_motorista);
		$('#motorista').val(selectedItem.motorista);
	}

	if (selectedItem.type == "btnPlaca_N") {
		$('#placa').val(selectedItem.vel_placa);
	}

	if (selectedItem.type == "btnInfracao") {		
		$('#cod_infracao').val(selectedItem.infracao);
		$('#infracao').val(selectedItem.descricao_infracao);
		$('#pontos').val(selectedItem.gravidade);
		$('#valor').val(selectedItem.valor.replace('.',','));
		$('#infrator').val(selectedItem.infrator);

		if ($('#ind_condutor').val() == 'S'){
			// var valor_caculado = selectedItem.valor * 2;
		// 	$('#valor_calculado').val( String((valor_caculado).toFixed(2)).replace('.', ',') );
			multiParcelas()
		} else {
			$('#valor_calculado').val( selectedItem.valor.replace('.',','));
		}

	}

	if (selectedItem.type == "btnAuto") {
		$('#auto_vinculado').val(selectedItem.num_infracao);
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