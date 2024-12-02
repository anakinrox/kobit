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

	
	if (componente == 'bt_zona') {

		modalzoom.open(
			"Zona",
			"selectTableSQLserver", 
			"zona,Zona", 
			"distinct,zona",
			"dataBase,java:/jdbc/CorporeDS,table,vw_fluig_estrutura,sqlLimit,250",
			componente, false, "default", null, null,
			"zona" );
	}

	if (componente == 'bt_area') {

		modalzoom.open(
			"Area",
			"selectTableSQLserver", 
			"area,Area", 
			"distinct,area",
			"dataBase,java:/jdbc/CorporeDS,table,vw_fluig_estrutura,sqlLimit,250",
			componente, false, "default", null, null,
			"area" );
	}

	if (componente == 'bt_setor') {

		modalzoom.open(
			"Setor",
			"selectTableSQLserver", 
			"setor,Setor", 
			"distinct,setor",
			"dataBase,java:/jdbc/CorporeDS,table,vw_fluig_estrutura,sqlLimit,250",
			componente, false, "default", null, null,
			"setor" );
	}

	if (componente == 'bt_user') {

		modalzoom.open("Usuario Abertura",
			"colleague", 
			"login,Matricula,colleagueName,Usuário", 
			"login,colleagueName", 
			"active,true",
			componente, false, "default", null, null,
			"colleagueName" );
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

	if (selectedItem.type == 'bt_user') {
		$('#matricula_' + $this.instanceId).val(selectedItem.colleagueId);
		$('#nome_usuario_' + $this.instanceId).val(selectedItem.colleagueName);
	}

	if (selectedItem.type == 'bt_zona') {
		$('#zona_' + $this.instanceId).val(selectedItem.zona);
	}

	if (selectedItem.type == 'bt_area') {
		$('#area_' + $this.instanceId).val(selectedItem.area);
	}

	if (selectedItem.type == 'bt_setor') {
		$('#setor_' + $this.instanceId).val(selectedItem.setor);
	}

	if (selectedItem.type == 'bt_user') {
		$('#matricula_' + $this.instanceId).val(selectedItem.login);
		$('#nome_usuario_' + $this.instanceId).val(selectedItem.colleagueName);
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

function loadDsCombo(combo, dataSet, fieldCodigo, fieldDesc, fieldFilter, fieldFilterValue, fieldOrder, printCod, clear, addblank) {

	console.log('Passo 001 tipo', $('#' + combo).is('select'));

	if (!$('#' + combo).is('select')) {
		return false;
	}

	if (printCod == undefined) {
		printCod = 'S';
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

	// console.log(constraintsFilhos);
	// console.log(datasetFilhos.values);

	if (datasetFilhos != null) {

		if (clear == 'S') {
			$("#" + combo + " option").remove();
		}

		var valDefault = "";
		if ($("#" + combo).val() != "" && $("#" + combo).val() != null && $("#" + combo).val() != undefined) {
			valDefault = $("#" + combo).val();
		}

		if (addblank == 'S') {
			$("#" + combo).append("<option value='' ></option>");
		}

		var filhos = datasetFilhos.values;
		for (var i in filhos) {
			var filho = filhos[i];
			var den = '';

			if ($.inArray(filho[fieldCodigo], getOptCombo(combo)) > -1) {
				continue;
			}
			if (fieldDesc == '') {
				den = filho[fieldCodigo];
			} else {
				if (printCod == 'S') {
					den = filho[fieldCodigo] + ' - ' + filho[fieldDesc];
				} else {
					den = filho[fieldDesc];
				}
			}
			$("#" + combo).append("<option value='" + filho[fieldCodigo] + "' >" + den + "</option>");
		}
		console.log('valDefault.......', valDefault);
		if (valDefault != '') {
			$("#" + combo).val(valDefault);
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