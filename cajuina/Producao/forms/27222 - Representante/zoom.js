

function getFiltroLista(campoBase) {

	var aFiltro = [];

	$("input[name*=" + campoBase + "___]").each(function (index) {
		aFiltro.push($(this).val());
	});
	if (aFiltro.length == '0') {
		$("hidden[name*=" + campoBase + "___]").each(function (index) {
			aFiltro.push($(this).val());
		});
	}
	return aFiltro.join('|');
}

//busca informações do dataset colleague
//o type é o nome do componente do html
function zoom(componente) {

	if (componente == 'bt_repres' && ($('#cod_repres').val() != '' && $('#cod_repres').val() != undefined)) {

		FLUIGC.toast({
			title: 'Representante: ',
			message: 'Não é permitido alterar o representante selecionada!',
			type: 'warning',
			timeout: 'fast'
		});
		return;
	}

	if (componente != 'bt_repres' && ($('#cod_repres').val() == '' || $('#cod_repres').val() == undefined)) {
		FLUIGC.toast({
			title: 'Representante: ',
			message: 'È necessário selecionar um representante!',
			type: 'warning',
			timeout: 'fast'
		});
		return;
	}

	if (componente == 'bt_empresa') {
		modalzoom.open('Empresa',
			'selectLogix',
			'cod_empresa,Código,den_reduz,Empresa',
			'cod_empresa,den_reduz',
			'table,empresa,___not______in___cod_empresa,' + getFiltroLista('cod_empresa'),
			componente, false, 'default', null, null);
	}



	if (componente == 'bt_lst_preco') {
		if (getFiltroLista('cod_empresa') == '') {
			FLUIGC.toast({
				title: 'Empresa: ',
				message: 'É necessario incluir uma empresa de operação!',
				type: 'warning',
				timeout: 'fast'
			});
			return;
		}

		modalzoom.open('Lista de Preço',
			'selectLogix',
			'cod_empresa,Empresa,num_list_preco,Lista,den_list_preco,Descrição',
			'cod_empresa,num_list_preco,den_list_preco,cod_empresa_num_list_preco',
			'table,kbt_v_lista_preco_ativa,___not______in___cod_empresa_num_list_preco,' + getFiltroLista('chave_lista') + ',___in___cod_empresa,' + getFiltroLista('cod_empresa'),
			componente, false, 'default', null, null);
	}

	if (componente == 'bt_repres') {

		modalzoom.open("Representante",
			"selectLogix",
			"cod_repres,Código,raz_social,Nome",
			"cod_repres,raz_social,nom_repres,nom_guerra",
			"table,kbt_v_representante",
			componente, false, 'default', null, null);
	}

	if (componente == 'bt_user' || componente == 'bt_user_principal') {
		modalzoom.open('Usuário',
			'colleague',
			'login,Login,colleagueName,Nome',
			'login,colleagueName,colleagueId',
			'',
			componente, false, 'default', null, null);
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


}

function getCheckbox(checked) {
	if (checked == "checkbox") {
		return true;
	} else {
		return false;
	}
}


function setSelectedZoomItem(selectedItem) {

	if (selectedItem.type == "bt_empresa") {
		var row = wdkAddChild('empresa');
		$('#cod_empresa___' + row).val(selectedItem.cod_empresa);
		$('#emp_reduz___' + row).val(selectedItem.den_reduz);
		fnFirstDefault('ies_empresa_default___' + row);
	}


	if (selectedItem.type == "bt_lst_preco") {
		var row = wdkAddChild('lista');
		$('#cod_empresa_lista___' + row).val(selectedItem.cod_empresa);
		$('#cod_lista___' + row).val(selectedItem.num_list_preco);
		$('#den_lista___' + row).val(selectedItem.den_list_preco);
		$('#chave_lista___' + row).val(selectedItem.cod_empresa_num_list_preco);
		fnFirstDefault('ies_lista_default___' + row);
	}

	if (selectedItem.type == "bt_repres") {
		$('#cod_repres').val(selectedItem.cod_repres);
		$('#raz_social').val(selectedItem.raz_social);
		$('#nom_repres').val(selectedItem.nom_repres);
		$('#nom_guerra').val(selectedItem.nom_guerra);
		$('#descricao').val(selectedItem.cod_repres + ' - ' + selectedItem.raz_social);
		$('#ecm-cardPublisher-documentDescription-input').val(selectedItem.raz_social);

	}

	if (selectedItem.type == "bt_user") {
		$('#login').val(selectedItem.login);
		$('#matricula').val(selectedItem.colleagueId);
		$('#nome_usuario').val(selectedItem.colleagueName);
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

}	
