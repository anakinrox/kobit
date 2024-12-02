function eraser(componente) {
	var campo = componente.split('___')[0];
	var seq = componente.split('___')[1];

	if (campo.indexOf("grp_fiscal_cliente") >= 0) {

		if (campo == "grp_fiscal_cliente_icms") {
			$('#des_grp_fisc_cli_icms___' + seq).val("");
			$('#grp_fiscal_cliente_icms___' + seq).val("");
		}
		if (campo == "grp_fiscal_cliente_st") {
			$('#des_grp_fisc_cli_st___' + seq).val("");
			$('#grp_fiscal_cliente_st___' + seq).val("");
		}
		if (campo == "grp_fiscal_cliente_ipi") {
			$('#des_grp_fisc_cli_ipi___' + seq).val("");
			$('#grp_fiscal_cliente_ipi___' + seq).val("");
		}
		if (campo == "grp_fiscal_cliente_pis") {
			$('#des_grp_fisc_cli_pis___' + seq).val("");
			$('#grp_fiscal_cliente_pis___' + seq).val("");
		}
		if (campo == "grp_fiscal_cliente_cofins") {
			$('#des_grp_fisc_cli_cofins___' + seq).val("");
			$('#grp_fiscal_cliente_cofins___' + seq).val("");
		}

	}

}

function zoom(componente, idCampoTexto) {
	var valor = null;

	if (idCampoTexto != null & idCampoTexto != undefined) {
		valor = $('#' + idCampoTexto).val();
		if (valor == '') {
			return false;
		}
		if (idCampoTexto.split('___')[1] != null && idCampoTexto.split('___')[1] != undefined) {
			componente += '___' + idCampoTexto.split('___')[1];
		}
	}

	//trata campos pai filho
	var campo = componente.split('___')[0];
	var seq = componente.split('___')[1];

	if (campo.indexOf("grp_fiscal_cliente") >= 0) {

		var tributo = "";
		if (campo == "grp_fiscal_cliente_icms") tributo = "ICMS";
		if (campo == "grp_fiscal_cliente_st") tributo = "ICMS_ST";
		if (campo == "grp_fiscal_cliente_ipi") tributo = "IPI";
		if (campo == "grp_fiscal_cliente_pis") tributo = "PIS_REC";
		if (campo == "grp_fiscal_cliente_cofins") tributo = "COFINS_REC";



		modalzoom.open("Grupo Fiscal " + tributo,
			"selectLogix",
			"grp_fiscal_cliente,Código,des_grp_fisc_cli,Grupo Fiscal",
			"grp_fiscal_cliente,des_grp_fisc_cli",
			"table,kbt_grupo_fiscal_cliente,empresa," + $('#cod_empresa').val() + ",tributo_benef," + tributo,
			componente, false, "default", null, null,
			"grp_fiscal_cliente||'-'||des_grp_fisc_cli");

	}

	if (campo == 'zoom_portador' || campo == 'zoom_portador_emp') {

		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL = ',sqlLimit,1,cod_portador,' + valor;
			largura = 'none';
		}

		modalzoom.open("Portador",
			"selectLogix",
			"cod_portador,Cod,ies_tip_portador,Tipo,nom_portador,Portador",
			"cod_portador,ies_tip_portador,nom_portador",
			"table,portador" + filtroCPL,
			componente, false, largura, null, null,
			"cod_portador");
	}



	if (campo == 'bt_cliente' || campo == 'cod_cliente_grp_econ') {

		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL = ',cod_cliente,' + valor;
			largura = 'none';
		}

		modalzoom.open("Clientes",
			"selectLogix",
			"num_cgc_cpf,CGC / CNPJ,nom_cliente,Nome",
			"cod_cliente,num_cgc_cpf,nom_cliente",
			"table,kbt_v_clientes" + filtroCPL,
			componente, false, largura, null, null,
			"num_cgc_cpf||'-'||nom_cliente");
	}

	if (campo == 'bt_tip_cli') {
		modalzoom.open("Tipo Cliente",
			"selectLogix",
			"cod_tip_cli,Cod.,den_tip_cli,Tipo",
			"cod_tip_cli,den_tip_cli",
			"table,tipo_cliente,order,den_tip_cli",
			componente, false, 'default', null, null,
			"cod_tip_cli||'-'||den_tip_cli");
	}

	if (campo == 'bt_cidade') {

		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL = ',sqlLimit,1,cidade_ibge,' + $('#cod_cidade_ibge').val();
			largura = 'none';
		}

		modalzoom.open("Cidades",
			"selectLogix",
			"cod_cidade,Codigo,den_cidade,Cidade,den_uf,UF",
			"cidade_ibge,cod_cidade,den_cidade,cod_uf,den_uf,cod_pais,den_pais",
			"table,fluig_v_cidade" + filtroCPL,
			componente, true, largura, null, null,
			"den_cidade||'-'||den_uf");
	}

	if (campo == 'bt_representante') {
		// alert($("#tipo_cadastro_user").val());
		if ($("#tipo_cadastro_user").val() == 'R') {
			return true;
		}
		/*modalzoom.open("Representante",
				   "representante", 
				   "matricula,Matricula,cod_repres,Cod Repres,raz_social,Representante", 
				   "matricula,tipo_cadastro,cod_repres,raz_social",
				   "",
				   componente, false, "default", null, null,
				   "raz_social" ); */
		modalzoom.open("Representante",
			"selectLogix",
			"cod_repres,Cod Repres,raz_social,Representante",
			"cod_repres,raz_social",
			"sqlLimit,50,table,kbt_v_representante,ies_situacao,N,ies_nivel,03,order,raz_social",
			componente, false, "default", null, null,
			"cod_repres||'-'||raz_social");
	}

	if (componente == 'btnLogradouro') {
		modalzoom.open("Logradouro",
			"selectLogix",
			"des_logradouro,Logradouro",
			"tip_logradouro,des_logradouro",
			"sqlLimit,50,table,vdp_tip_logradouro,order,des_logradouro",
			componente, false, "default", null, null,
			"tip_logradouro||'-'||des_logradouro");
	}

	if (componente == 'btnRota') {
		modalzoom.open("Rota",
			"selectLogix",
			"cod_rota,Codigo,den_rota,Rota",
			"cod_rota,den_rota",
			"sqlLimit,50,table,rotas,order,cod_rota",
			componente, false, "default", null, null,
			"cod_rota||'-'||den_rota");
	}

	if (componente == 'btnPraca') {
		modalzoom.open("Praça",
			"selectLogix",
			"cod_praca,Codigo,den_praca,Rota",
			"cod_praca,den_praca",
			"sqlLimit,50,table,pracas,order,cod_praca",
			componente, false, "default", null, null,
			"cod_praca||'-'||den_praca");
	}

	if (componente == 'btnLocal') {
		modalzoom.open("Localidade",
			"selectLogix",
			"cod_local,Codigo,den_local,Localidade",
			"cod_local,den_local",
			"sqlLimit,50,table,rota_praca,order,cod_local,cod_rota," + $("#cod_rota").val() + ",cod_praca," + $("#cod_praca").val(),
			componente, false, "default", null, null,
			"cod_local||'-'||den_local");
	}

	if (componente == 'btnLista') {
		if ($("#tipo_cadastro_user").val() != "X") {
			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint("cod_repres", $("#cod_repres").val(), $("#cod_repres").val(), ConstraintType.MUST));
			var ds = DatasetFactory.getDataset("representante_compl", null, constraints, null);

			modalzoom.open("Lista de Preço",
				"representante_compl",
				"cod_lista,Codigo,den_lista,Lista Preço",
				"cod_lista,den_lista",
				"sqlLimit,50,tablename,lista,cod_empresa_lista," + $("#cod_empresa").val() + ',documentid,' + ds.values[0]['documentid'] + ',version,' + ds.values[0]['version'],
				componente, false, "default", null, null,
				"cod_lista||'-'||den_lista");
		} else {
			modalzoom.open("Lista de Preço",
				"selectLogix",
				"num_list_preco,Codigo,den_list_preco,Lista Preço",
				"num_list_preco,den_list_preco",
				"table,kbt_v_lista_preco_ativa,cod_empresa," + $("#cod_empresa").val(),
				componente, false, "default", null, null,
				"num_list_preco||'-'||den_list_preco");
		}
	}

	if (componente == 'btnEmpresaFiscal') {
		modalzoom.open("Empresa Fiscal",
			"empresa_comercial",
			"cod_empresa_matriz,Empresa,den_empresa_matriz,Empresa",
			"cod_empresa_matriz,den_empresa_matriz",
			"",
			componente, false, "default", null, null,
			"den_empresa_matriz");
	}


	if (campo == 'bt_documentos') {

		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("colleagueId", parent.WCMAPI.userCode, parent.WCMAPI.userCode, ConstraintType.MUST));
		var dsPapeis = DatasetFactory.getDataset("workflowColleagueRole", null, constraints, null);

		var papeis = '';
		if (dsPapeis.values.length > 0) {
			for (var i = 0; i < dsPapeis.values.length > 0; i++) {
				var concatena = '';
				if (i != 0) {
					concatena = '|';
				}
				papeis += concatena + dsPapeis.values[i]['workflowColleagueRolePK.roleId'];
			}

		}

		modalzoom.open("Tipos Documentos",
			"selectPaiFilho",
			"tipo_documento,Tipo",
			"distinct,cod_tipo_documento,tipo_documento",
			"dataset,ds_tipo_documento,table,edit_pool,___in___id_edit_pool," + papeis,
			componente, false, "default", null, null,
			"seq_tipo_documento");
	}


	if (campo == 'bt_pgto_sug') {
		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL = ',cod_cnd_pgto,' + valor;
			largura = 'none';
		}

		modalzoom.open("Condição Pagamentos",
			"selectLogix",
			"cod_cnd_pgto,Código,den_cnd_pgto,Descrição",
			"cod_cnd_pgto,den_cnd_pgto",
			"table,cond_pgto" + filtroCPL,
			componente, false, largura, null, null,
			"cod_cnd_pgto");
	}

	if (campo == 'bt_pgto') {
		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			filtroCPL = ',cod_cnd_pgto,' + valor;
			largura = 'none';
		}

		modalzoom.open("Condição Pagamentos",
			"selectLogix",
			"cod_cnd_pgto,Código,den_cnd_pgto,Descrição",
			"cod_cnd_pgto,den_cnd_pgto",
			"table,cond_pgto" + filtroCPL,
			componente, false, largura, null, null,
			"cod_cnd_pgto");
	}

}

function setSelectedZoomItem(selectedItem) {
	// Trata campos pai filhos
	var campo = selectedItem.type.split('___')[0];
	var seq = selectedItem.type.split('___')[1];

	if (campo == "bt_cliente") {
		loadDadosCliente(selectedItem.cod_cliente);
	}

	if (campo == "zoom_portador") {
		$('#cod_portador').val(selectedItem.cod_portador);
		$('#ies_tip_portador').val(selectedItem.ies_tip_portador);
		$('#nom_portador').val(selectedItem.nom_portador);
	}

	if (campo == "zoom_portador_emp") {
		$('#cod_portador_emp').val(selectedItem.cod_portador);
		$('#ies_tip_portador_emp').val(selectedItem.ies_tip_portador);
		$('#nom_portador_emp').val(selectedItem.nom_portador);
	}

	if (campo == "bt_cidade") {
		$('#cod_cidade').val(selectedItem.cod_cidade);
		$('#den_cidade').val(selectedItem.cod_cidade.trim() + ' - ' + selectedItem.den_cidade);
		$('#cod_uni_feder').val(selectedItem.cod_uf);
		$('#den_uni_feder').val(selectedItem.den_uf);
		$('#cod_pais').val(selectedItem.cod_pais);
		$('#den_pais').val(selectedItem.den_pais);
		setMaskIE($('#cod_uni_feder').val(), 'ins_estadual');
	}

	if (campo == "cod_cliente_grp_econ") {
		$('#cgc_cpf_grp_econ___' + seq).val(selectedItem.num_cgc_cpf);
		$('#cod_cliente_grp_econ___' + seq).val(selectedItem.cod_cliente);
		$('#nom_cliente_grp_econ___' + seq).val(selectedItem.nom_cliente);
	}

	if (campo == "btnLista") {
		if ($("#tipo_cadastro_user").val() != "X") {
			//var seq = wdkAddChild('lista_preco');
			//$('#cod_empresa_list_preco___'+seq).val( selectedItem.cod_empresa );
			$('#num_list_preco').val(selectedItem.cod_lista);
			$('#den_list_preco').val(selectedItem.den_lista);
		} else {
			$('#num_list_preco').val(selectedItem.num_list_preco);
			$('#den_list_preco').val(selectedItem.den_list_preco);
		}
	}

	if (campo == "btnEmpresaFiscal") {
		var seq = wdkAddChild('empresa_fiscal');
		$('#cod_empresa_fiscal___' + seq).val(selectedItem.cod_empresa_matriz);
	}


	if (campo == "bt_representante") {
		$('#cod_repres').val(selectedItem.cod_repres);
		$('#nom_repres').val(selectedItem.raz_social);

		loadRepDefault();
		loadListaDefault();
	}

	if (selectedItem.type == "btnLogradouro") {
		$('#tip_logradouro').val(selectedItem.tip_logradouro);
		$('#desc_logradouro').val(selectedItem.des_logradouro);
	}

	if (selectedItem.type == "bt_tip_cli") {
		$('#cod_tip_cli').val(selectedItem.cod_tip_cli);
		$('#den_tip_cli').val(selectedItem.den_tip_cli);
	}


	if (selectedItem.type == "btnRota") {
		$('#cod_rota').val(selectedItem.cod_rota);
		$('#den_rota').val(selectedItem.den_rota);
		$('#cod_local').val("");
		$('#den_local').val("");
	}

	if (selectedItem.type == "btnPraca") {
		$('#cod_praca').val(selectedItem.cod_praca);
		$('#den_praca').val(selectedItem.den_praca);
		$('#cod_local').val("");
		$('#den_local').val("");
	}

	if (selectedItem.type == "btnLocal") {
		$('#cod_local').val(selectedItem.cod_local);
		$('#den_local').val(selectedItem.den_local);
	}

	if (campo == 'bt_documentos') {
		// var qtd = 0;
		// $("input[name^=cod_tipo_documento___]").each(function (index, value) {
		// 	if ( this.value == selectedItem.cod_tipo_documento ){
		// 		qtd++;
		// 	}
		// });

		// if ( qtd != 0 ){
		// 	toast('Tipo de Documento já incluído!','warning');
		// 	return false;
		// }

		var seq = wdkAddChild('documentos');
		$('#cod_tipo_documento___' + seq).val(selectedItem.cod_tipo_documento);
		$('#tipo_documento___' + seq).val(selectedItem.tipo_documento);
	}

	if (campo == 'bt_pgto_sug') {
		$('#cod_cnd_pgto_sug').val(selectedItem.cod_cnd_pgto);
		$('#den_cnd_pgto_sug').val(selectedItem.cod_cnd_pgto + ' - ' + selectedItem.den_cnd_pgto);
	}

	if (campo == 'bt_pgto') {
		$('#cod_cnd_pgto').val(selectedItem.cod_cnd_pgto);
		$('#den_cnd_pgto').val(selectedItem.cod_cnd_pgto + ' - ' + selectedItem.den_cnd_pgto);
	}

	if (campo.indexOf("grp_fiscal_cliente") >= 0) {

		/*if( campo == "grp_fiscal_cliente_icms" 	){
			$('#des_grp_fisc_cli_icms___'+ seq).val( selectedItem.des_grp_fisc_cli ) ;
			$('#grp_fiscal_cliente_icms___' + seq).val( selectedItem.grp_fiscal_cliente ) ;
		}
		if( campo == "grp_fiscal_cliente_st" 		){
			$('#des_grp_fisc_cli_st___'+ seq).val( selectedItem.des_grp_fisc_cli ) ;
			$('#grp_fiscal_cliente_st___' + seq).val( selectedItem.grp_fiscal_cliente ) ;			
		}
		if( campo == "grp_fiscal_cliente_ipi" 		){
			$('#des_grp_fisc_cli_ipi___'+ seq).val( selectedItem.des_grp_fisc_cli ) ;
			$('#grp_fiscal_cliente_ipi___' + seq).val( selectedItem.grp_fiscal_cliente ) ;			
		}	*/
		if (campo == "grp_fiscal_cliente_pis") {
			$('#des_grp_fisc_cli_pis').val(selectedItem.des_grp_fisc_cli);
			$('#grp_fiscal_cliente_pis').val(selectedItem.grp_fiscal_cliente);
		}
		if (campo == "grp_fiscal_cliente_cofins") {
			$('#des_grp_fisc_cli_cofins').val(selectedItem.des_grp_fisc_cli);
			$('#grp_fiscal_cliente_cofins').val(selectedItem.grp_fiscal_cliente);
		}

	}
}

function loadResposavel(repres) {
	loadDsPfCombo('responsavel', 'representante', 'responsavel', 'responsavel', 'responsavel', 'cod_repres', repres, 'responsavel', 'S', 'N', 'ies_responsavel_default');
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


//Carrega combo a partir de dataset
//Exemplo chamada loadDsCombo('empresa_' + $this.instanceId, 'empresa_cad_item', 'cod_empresa_matriz', 'den_empresa_matriz', '', '', 'den_empresa_matriz', 'N', 'S', 'S');
function loadDsCombo(combo, dataSet, fieldCodigo, fieldDesc, fieldFilter, fieldFilterValue, fieldOrder, printCod, clear, addblank) {

	if (!$('#' + combo).is('select')) {
		return false;
	}

	var constraintsFilhos = new Array();
	var lstFilter = fieldFilter.split(',');
	var lstFilterValue = fieldFilterValue.split(',');
	for (var j = 0; j < lstFilter.length; j++) {
		console.log('Passo 00X', lstFilter[j], lstFilterValue[j]);
		if (lstFilter[j] != '' && lstFilter[j] != null) {
			constraintsFilhos.push(DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST));
		}
	}
	var orderFilhos = new Array();
	var lstOrder = fieldOrder.split(',');
	for (var j = 0; j < lstOrder.length; j++) {
		orderFilhos.push(lstOrder[j]);
	}
	var fieldFilhos = new Array(fieldCodigo, fieldDesc);
	var datasetFilhos = DatasetFactory.getDataset(dataSet, fieldFilhos, constraintsFilhos, orderFilhos);

	if (datasetFilhos != null) {
		// if (combo == 'ies_tip_fornec') {
		// 	alert('Val Cambo antes: ' + $("#" + combo).val());
		// }
		// if (combo == 'ies_tip_fornec') {
		// 	alert('Val CamboDepois: ' + $("#" + combo).val());
		// }

		var valDefault = "";
		if ($("#" + combo).val() != "" && $("#" + combo).val() != null && $("#" + combo).val() != undefined) {
			valDefault = $("#" + combo).val();
		}

		if (clear == 'S') {
			$("#" + combo + " option").remove();
		}


		if (addblank == 'S') {
			$("#" + combo).append("<option value='' ></option>");
		}
		var filhos = datasetFilhos.values;
		for (var i in filhos) {
			var filho = filhos[i];
			var den = '';

			if ($.inArray(filho[fieldCodigo].trim(), getOptCombo(combo)) > -1) {
				continue;
			}
			if (fieldDesc == '') {
				den = filho[fieldCodigo].trim();
			} else {
				if (printCod == 'S' || printCod == undefined) {
					den = filho[fieldCodigo].trim() + ' - ' + filho[fieldDesc].trim();
				} else {
					den = filho[fieldDesc].trim();
				}
			}
			$("#" + combo).append("<option value='" + filho[fieldCodigo].trim() + "' >" + den.trim() + "</option>");
		}
		if (valDefault != '') {
			$("#" + combo).val(valDefault);
		}
	}
}

//Parte da função loadDsCombo
function getOptCombo(combo) {
	var optArray = new Array();
	$("#" + combo + " option").each(function () {
		optArray.push($(this).val());
	});
	return optArray;
}
