
function zoom(componente) {

	var filtroCPL = '';

	if (componente == 'bt_responsavel' || componente == 'bt_respon') {
		if( $('#aprov_unic').val() == "P" ){
			modalzoom.open("Papel",
					"workflowRole",
					"roleDescription,Nome",
					"workflowRolePK.roleId,roleDescription",
					"",
					componente, false, 'default', null, null,
					"roleDescription");
		}else{
			modalzoom.open("Responsavel",
				"colleague",
				"colleagueName,Nome",
				"colleaguePK.colleagueId,colleagueName",
				"active,true",
				componente, false, 'default', null, null,
				"colleagueName");
		}
	}
	

	if (componente == 'bt_papel') {

		modalzoom.open("Papel",
			"workflowRole",
			"roleDescription,Nome",
			"workflowRolePK.roleId,roleDescription",
			"",
			componente, false, 'default', null, null,
			"roleDescription");
	}
	
	var lstEmpresa = [];
	$("input[name*=cod_empresa___]").each(function (index) {
		lstEmpresa.push( $(this).val() );
	});
	lstEmpresa = lstEmpresa.join('|');
	
	if (componente == 'bt_familia') {

		filtroCPL = ',___in___cod_empresa,01|02|03|10';
		if ( lstEmpresa != '') {
			filtroCPL = ',___in___cod_empresa,' + lstEmpresa;
		}

		modalzoom.open("Familia",
			"selectLogix",
			"cod_empresa,Empresa,cod_familia,Codigo,den_familia,Nome",
			"cod_empresa,cod_familia,den_familia",
			"table,familia" + filtroCPL,
			componente, false, 'default', null, null,
			"cod_familia||'-'||den_familia");
	}
	
	if (componente == 'bt_item') {

		filtroCPL = ',___in___cod_empresa,02|10';
		if ( lstEmpresa != '') {
			filtroCPL = ',___in___cod_empresa,' + lstEmpresa;
		}

		modalzoom.open("Item",
			"selectLogix",
			"cod_empresa,Empresa,cod_item,Codigo,den_item,Nome",
			"cod_empresa,cod_item,den_item",
			"table,item,ies_situacao,A" + filtroCPL,
			componente, true, 'default', null, null,
			"cod_item||'-'||den_item");
	}

	if (componente == 'bt_grupo_estoque') {

		filtroCPL = ',___in___cod_empresa,01|02|03|10';
		if ( lstEmpresa != '') {
			filtroCPL = ',___in___cod_empresa,' + lstEmpresa;
		}

		modalzoom.open("Grupo Estoque",
			"selectLogix",
			"gru_ctr_estoq,Codigo,den_gru_ctr_estoq,Nome",
			"gru_ctr_estoq,den_gru_ctr_estoq",
			"table,grupo_ctr_estoq" + filtroCPL,
			componente, false, 'default', null, null,
			"gru_ctr_estoq||'-'||den_gru_ctr_estoq");
	}

	if (componente == 'bt_conta') {

		modalzoom.open("Conta",
			"selectLogix",
			"num_conta,Codigo,den_conta,Nome",
			"num_conta,den_conta",
			"table,plano_contas,___in___cod_empresa,01|10",
			componente, true, 'default', null, null,
			"num_conta||'-'||den_conta");
	}
	
	if (componente == 'bt_empresa') {

		modalzoom.open("Empresa",
			"selectLogix",
			"cod_empresa,Codigo,den_reduz,Nome",
			"cod_empresa,den_reduz",
			"table,empresa",
			componente, false, 'default', null, null,
			"cod_empresa||'-'||den_reduz");
	}

	if (componente == 'bt_tipo_despesa') {

		modalzoom.open("Tipo Despesa",
			"selectLogix",
			"cod_tip_despesa,Codigo,nom_tip_despesa,Nome",
			"cod_tip_despesa,nom_tip_despesa",
			"table,tipo_despesa,___in___cod_empresa,01|10",
			componente, false, 'default', null, null,
			"cod_tip_despesa||'-'||nom_tip_despesa");
	}

	if (componente == 'bt_grupo_despesa') {

		modalzoom.open("Grupo Despesa",
			"selectLogix",
			"gru_ctr_desp,Codigo,den_gru_ctr_desp,Nome",
			"gru_ctr_desp,den_gru_ctr_desp",
			"table,grupo_ctr_desp,___in___cod_empresa,01|10",
			componente, false, 'default', null, null,
			"gru_ctr_desp||'-'||den_gru_ctr_desp");
	}
	
	if (componente == 'bt_comprador') {

		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Comprador",
			"selectLogix",
			"cod_comprador,Codigo,nom_comprador,Comprador",
			"cod_comprador,nom_comprador",
			"table,kbt_v_comprador,sqlLimit,250,___in___cod_empresa,02|10" + filtroCPL,
			componente, false, largura, null, null,
			"cod_comprador||'-'||nom_comprador");
	}

	if (componente == 'bt_cnd_pgto') {

		var filtroCPL = '';
		var largura = "default";

		modalzoom.open("Cond. Pagamento",
			"selectLogix",
			"cnd_pgto,Codigo,des_cnd_pgto,Cond. Pagamento",
			"cnd_pgto,des_cnd_pgto",
			"table,cond_pgto_cap,sqlLimit,250" + filtroCPL,
			componente, false, largura, null, null,
			"cnd_pgto||'-'||des_cnd_pgto");
	}

	
}

function setSelectedZoomItem(selectedItem) {

	if (selectedItem.type == 'bt_responsavel') {
		$('#responsavel').val(selectedItem.colleagueName);
		$('#cod_responsavel').val(selectedItem.colleagueId);
	}

	if (selectedItem.type == 'bt_respon') {
		if( $('#aprov_unic').val() == "P" ){
			$('#resp_aprov').val(selectedItem.roleDescription);
			$('#matricula_aprov').val('Pool:Role:' + selectedItem.roleId);
		}else{
			$('#resp_aprov').val(selectedItem.colleagueName);
			$('#matricula_aprov').val(selectedItem.colleagueId);
		}
	}

	if (selectedItem.type == 'bt_papel') {
		$('#papel').val(selectedItem.roleDescription);
		$('#cod_papel').val(selectedItem.roleId);
		$('#pool_papel').val('Pool:Role:' + selectedItem.roleId);
	}

	if (selectedItem.type == "bt_familia") {
		var row = wdkAddChild('familia');
		$('#cod_familia___' + row).val(selectedItem.cod_familia);
		$('#den_familia___' + row).val(selectedItem.den_familia);
	}

	if (selectedItem.type == "bt_item") {
		var row = wdkAddChild('item');
		$('#cod_item___' + row).val(selectedItem.cod_item);
		$('#den_item___' + row).val(selectedItem.den_item);
	}
	
	if (selectedItem.type == "bt_grupo_estoque") {
		var row = wdkAddChild('grupo_estoque');
		$('#cod_grupo_estoque___' + row).val(selectedItem.gru_ctr_estoq);
		$('#den_grupo_estoque___' + row).val(selectedItem.den_gru_ctr_estoq);
	}

	if (selectedItem.type == "bt_conta") {
		var row = wdkAddChild('conta');
		$('#cod_conta___' + row).val(selectedItem.num_conta);
		$('#den_conta___' + row).val(selectedItem.den_conta);
	}

	if (selectedItem.type == "bt_empresa") {
		var row = wdkAddChild('empresa');
		$('#cod_empresa___' + row).val(selectedItem.cod_empresa);
		$('#den_reduz___' + row).val(selectedItem.den_reduz);
	}
	
	if (selectedItem.type == "bt_tipo_despesa") {
		var row = wdkAddChild('tipo_despesa');
		$('#cod_tip_despesa___' + row).val(selectedItem.cod_tip_despesa);
		$('#nom_tip_despesa___' + row).val(selectedItem.nom_tip_despesa);
	}
	
	if (selectedItem.type == "bt_grupo_despesa") {
		var row = wdkAddChild('grupo_despesa');
		$('#gru_ctr_desp___' + row).val(selectedItem.gru_ctr_desp);
		$('#den_gru_ctr_desp___' + row).val(selectedItem.den_gru_ctr_desp);
	}
	
	if (selectedItem.type == 'bt_comprador') {
		$('#cod_comprador').val(selectedItem.cod_comprador);
		$('#nom_comprador').val(selectedItem.nom_comprador);
	}

	if (selectedItem.type == 'bt_cnd_pgto') {
		$('#cnd_pgto').val(selectedItem.cnd_pgto);
		$('#des_cnd_pgto').val(selectedItem.des_cnd_pgto);
	}

}

function fnCustomDelete(oElement) {
	fnWdkRemoveChild(oElement);
}
