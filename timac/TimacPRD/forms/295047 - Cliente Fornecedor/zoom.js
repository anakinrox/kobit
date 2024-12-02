var ies_zoom = false;
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
	
	if( bloqueio ){
		if( $("#task").val() == "10" || $("#task").val() == "2" ){
			if( campo != 'zoom_lote_pgto' ){
				return false;
			}
		}else if( $("#task").val() == "66" ){
			if( campo != 'zoom_portador'
			 && campo != 'zoom_logradouro_cobranca' 
			 && campo != 'zoom_cidade_cobranca'
			 && campo != 'zoom_lote_pgto'
			 && campo != 'zoom_tipo_cliente'  ){
				return false;
			}
		}else if( $("#task").val() == "78" ){
			if( campo != 'zoom_cbo' ){
				return false;
			}
		}else{
			return false;
		}
	}
	
	if ( campo == 'zoom_portador' ){

		var filtroCPL = '';
		var largura = "default";
		if ( valor != null && valor != undefined ){
		 	filtroCPL = ',sqlLimit,1,cod_portador,'+ valor;
		 	largura = 'none';
		}

		modalzoom.open("Portador",
			"selectLogix",
			"cod_portador,Cod,ies_tip_portador,Tipo,nom_portador,Portador",
			"cod_portador,ies_tip_portador,nom_portador",
			"table,portador"+filtroCPL,
			componente, false, largura, null, null,
			"cod_portador");
	}
	

	if (campo == 'zoom_cgc_cpf' ) {
		
		if ( $('#num_cgc_cpf').val() != '' ){
			return false;
		}
		
		var filtroCPL = '';
		var largura = "default";
		
		if( $('#ies_nacional_internacional').val() == "N" && $('#ies_cpf_cnpj').val() == "" ){
			return false;
		}
		
		if ( $('#ies_cpf_cnpj').val() == 'CPF'){
			var filtroCPL = ',ies_fis_jur,F';
		}

		if ( $('#ies_cpf_cnpj').val() == 'CNPJ'){
			var filtroCPL = ',ies_fis_jur,J';
		}
		
		if ( $('#ies_nacional_internacional').val() == 'I'){
			filtroCPL += ',ies_pais,I';
		}else{
			filtroCPL += ',ies_pais,N';
		}
		
		var campos = "num_cgc_cpf,CGC / CNPJ,razao_social,Nome,cod_cliente_fornecedor,Codigo"; 
	    if( $("#ies_nacional_internacional").val() == "I" ){
	    	campos = "cod_cliente_fornecedor,Código,razao_social,Nome";
	    }

		modalzoom.open("Cliente / Fornecedor",
			"selectLogix",
			campos,
			"cod_cliente_fornecedor,num_cgc_cpf,razao_social",
			"table,kbt_v_cliente_fornecedor"+filtroCPL,
			componente, true, largura, null, null,
			"cod_cliente_fornecedor||'-'||num_cgc_cpf||'-'||razao_social");
	}
	
	if (campo == 'zoom_tipo_cliente' ){
		
		var filtroCPL = '';
		var largura = "default";
		if ( valor != null && valor != undefined ){
			filtroCPL = ',sqlLimit,1,cod_tip_cli,'+ valor;
			largura = 'none';
		}

		modalzoom.open("Tipo Cliente",
				"selectLogix",
				"cod_tip_cli,Cod.,den_tip_cli,Tipo",
				"cod_tip_cli,den_tip_cli",
				"table,tipo_cliente,order,den_tip_cli"+filtroCPL,
				componente, false, largura, null, null,
				"cod_tip_cli||'-'||den_tip_cli");
	}

	if (campo == 'zoom_tipo_fornecedor' ){
		modalzoom.open("Tipo Cliente",
				"selectLogix",
				"cod_tip_cli,Cod.,den_tip_cli,Tipo",
				"cod_tip_cli,den_tip_cli",
				"table,tipo_cliente,order,den_tip_cli",
				componente, false, 'default', null, null,
				"cod_tip_cli||'-'||den_tip_cli");
	}

	if ( campo == 'zoom_pais' ){

		var filtroCPL = '';
		var largura = "default";

		if( $('#ies_nacional_internacional').val() == 'I'  ){
			filtroCPL += ",___not___cod_pais,001"
		}else{
			filtroCPL += ",cod_pais,001"
		}
		
		modalzoom.open("Países",
			"selectLogix",
			"cod_pais,Cod,den_pais,País",
			"cod_pais,den_pais",
			"table,paises"+filtroCPL,
			componente, false, largura, null, null,
			"cod_pais||'-'||den_pais");
	}

	if ( ['zoom_cidade','zoom_cidade_cobranca','zoom_cidade_entrega'].indexOf( campo ) != -1 ){
		var filtroCPL = '';
		var largura = "default";
		if ( valor != null && valor != undefined ){
			filtroCPL = ',order,linha_db desc,sqlLimit,1,cidade_ibge,'+ valor;

			if (['cod_cidade','cod_cidade_cobranca'].indexOf( idCampoTexto ) != -1
			  || idCampoTexto.indexOf('cod_cidade_entrega') == 0 ){
				filtroCPL = ',sqlLimit,1,cod_cidade,'+ valor;
			}

			largura = 'none';
		}
		
		if( $('#ies_nacional_internacional').val() == 'I'  ){
			filtroCPL += ",___not___cod_pais,001"
		}else{
			filtroCPL += ",cod_pais,001"
		}
		
		if( $('#cod_pais').val() != "" ){
			filtroCPL += ',cod_pais,'+ $('#cod_pais').val();
		}
		
		modalzoom.open("Cidades",
			"selectLogix",
			"den_cidade,Cidade,den_uf,UF,den_pais,País",
			"cidade_ibge,cod_cidade,den_cidade,cod_uf,den_uf,cod_pais,den_pais",
			"table,fluig_v_cidade"+filtroCPL,
			componente, false, largura, null, null,
			"den_cidade||'-'||den_uf",
			"Cidade não cadastrada no Logix, favor entrar em contato com o responsável pelo cadastro" );
	}

	if ( campo == 'zoom_banco' ){
		
		var filtroCPL = '';
		var largura = "default";
		if ( valor != null && valor != undefined ){
			filtroCPL = ',sqlLimit,1,cod_banco,'+ valor;
			largura = 'none';
		}else{
			ies_zoom = true;			
		}	
		
		modalzoom.open("Bancos",
				"selectLogix",
				"cod_banco,Cod,nom_banco,Banco,origem,Nac/Int",
				"cod_banco,nom_banco",
				"table,kbt_v_bancos"+filtroCPL, //,origem,"+$("#ies_nacional_internacional").val(),
				componente, false, largura, null, null,
				"cod_banco");
		
		/*modalzoom.open("Bancos",
				"cadastro_bancos",
				"num_banco,Cod,nom_banco,Banco",
				"num_banco,nom_banco",
				"ativo,S,origem,"+$("#ies_nacional_internacional").val()+filtroCPL,
				componente, false, largura, null, null,
				"num_banco");*/
		
	}

	if ( campo == 'zoom_lote_pgto' ){

		var filtroCPL = '';
		var largura = "default";
		if ( valor != null && valor != undefined ){
		 	filtroCPL = ',sqlLimit,1,cod_lote_pgto,'+ valor;
		 	largura = 'none';
		}

		modalzoom.open("Lote Pagamento",
			"selectLogix",
			"cod_lote_pgto,Cod,nom_lote,Lote",
			"cod_lote_pgto,nom_lote",
			"table,lote_pagamento"+filtroCPL,
			componente, false, largura, null, null,
			"cod_lote_pgto");
	}

	if ( campo == 'zoom_cbo' ){

		var filtroCPL = '';
		var largura = "default";
		if ( valor != null && valor != undefined ){
			filtroCPL = ',sqlLimit,1,cod_cbo,'+ valor;
			largura = 'none';
		}

		modalzoom.open("Serviço Prestado (CBO)",
			"selectLogix",
			"cod_cbo,Cod,den_cbo,Serviço",
			"cod_cbo,den_cbo",
			"table,cbo"+filtroCPL,
			componente, false, largura, null, null,
			"den_cbo");
	}

	if ( ['zoom_logradouro','zoom_logradouro_cobranca','zoom_logradouro_entrega'].indexOf( campo ) != -1 ) {

		var filtroCPL = '';
		var largura = "default";
		if ( valor != null && valor != undefined ){
			filtroCPL = ',sqlLimit,1,tip_logradouro,'+ valor;
			largura = 'none';
		}

		modalzoom.open("Logradouro",
				"selectLogix", 
				"des_logradouro,Logradouro", 
				"tip_logradouro,des_logradouro", 
				"sqlLimit,50,table,vdp_tip_logradouro,order,des_logradouro"+filtroCPL,
				componente, false, largura, null, null,
				"tip_logradouro||'-'||des_logradouro" ); 
	}

	if ( campo == 'bt_representante'){
		//if ( $('#tipo_cadastro').val() == 'R') {
		//	return true;
		//}
		/*modalzoom.open("Representante",
				   "representante", 
				   "matricula,Matricula,cod_repres,Cod Repres,raz_social,Representante", 
				   "matricula,tipo_cadastro,cod_repres,raz_social",
				   "",
				   componente, false, "default", null, null,
			       "raz_social" ); */
		
		var filtroCPL = '';
		var largura = "default";
		if ( valor != null && valor != undefined ){
			filtroCPL = ',sqlLimit,1,cod_repres,'+ valor;
			largura = 'none';
		}
		
		modalzoom.open("Representante",
				"selectLogix", 
				"cod_repres,Cod Repres,raz_social,Representante", 
				"cod_repres,raz_social",
				"sqlLimit,50,table,kbt_v_representante,ies_situacao,N,order,raz_social"+filtroCPL,
				componente, false, largura, null, null,
				"cod_repres||'-'||raz_social" ); 
	}


	if ( campo == 'bt_documentos' ){

		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("colleagueId",  parent.WCMAPI.userCode, parent.WCMAPI.userCode, ConstraintType.MUST));
		var dsPapeis = DatasetFactory.getDataset("workflowColleagueRole", null, constraints, null);

		var papeis = '';
		if ( dsPapeis.values.length > 0 ){
			for ( var i = 0; i < dsPapeis.values.length > 0; i++ ){
				var concatena = '';
				if ( i != 0 ){
					concatena = '|';
				}
				papeis += concatena + dsPapeis.values[i]['workflowColleagueRolePK.roleId'];
			}
			
		}
		
		modalzoom.open("Tipos Documentos",
				   "selectPaiFilho", 
				   "tipo_documento,Tipo", 
				   "distinct,cod_tipo_documento,tipo_documento",
				   "dataset,ds_tipo_documento,table,edit_pool,___in___id_edit_pool,"+papeis,
				   componente, false, "default", null, null,
			       "seq_tipo_documento" );
	}
	
}

function setSelectedZoomItem(selectedItem) {
	// Trata campos pai filhos
	var campo = selectedItem.type.split('___')[0];
	var seq = selectedItem.type.split('___')[1];

	if (campo == "zoom_cgc_cpf") {
		
		if ( $("#ies_cpf_cnpj").val() == 'CPF') {
			var cgc_cpf = selectedItem.num_cgc_cpf.replace('/0000-','-');
		} else {
			var cgc_cpf = selectedItem.num_cgc_cpf.slice(1);
		}
		$('#cod_cliente_fornecedor').val( selectedItem.cod_cliente_fornecedor );
		$('#num_cgc_cpf').val( cgc_cpf );
		// $('#ies_operacao option').prop('disabled', false);
		// $('#ies_operacao').val('A');
		// $("#ies_operacao option[value='N']").prop('disabled', true);
		// $('.menu').show();

		consultaCpfCnpj();
		controleCpfCnpj();
		controlaCampoCEP();
	}

	if ( campo == "zoom_cidade" ){
		$('#cod_cidade_ibge').val( selectedItem.cidade_ibge );
		$('#cod_cidade').val( selectedItem.cod_cidade );
		$('#den_cidade').val( selectedItem.den_cidade );
		$('#uf').val( selectedItem.cod_uf );
		$('#cod_pais').val( selectedItem.cod_pais );
		$('#den_pais').val( selectedItem.den_pais );
		setPaisSancionado();
		// setMaskIE( $('#cod_uni_feder').val(), 'ins_estadual' );
	}

	if ( campo == "zoom_cidade_entrega" ){
		$('#cod_cidade_ibge_entrega___'+seq).val( selectedItem.cidade_ibge );
		$('#cod_cidade_entrega___'+seq).val( selectedItem.cod_cidade );
		$('#den_cidade_entrega___'+seq).val( selectedItem.den_cidade );
		$('#uf_entrega___'+seq).val( selectedItem.cod_uf );
		
		setIEendereco('cod_cidade_entrega___'+seq);
	}

	if ( campo == "zoom_cidade_cobranca" ){
		$('#cod_cidade_ibge_cobranca').val( selectedItem.cidade_ibge );
		$('#cod_cidade_cobranca').val( selectedItem.cod_cidade );
		$('#den_cidade_cobranca').val( selectedItem.den_cidade );
		$('#uf_cobranca').val( selectedItem.cod_uf );
	}

	if (campo == "zoom_logradouro") {		
		$('#tip_logradouro').val(selectedItem.tip_logradouro);
		$('#desc_logradouro').val(selectedItem.des_logradouro);
	}

	if (campo == "zoom_logradouro_cobranca") {		
		$('#tip_logradouro_cobranca').val(selectedItem.tip_logradouro);
		$('#desc_logradouro_cobranca').val(selectedItem.des_logradouro);
	}

	if (campo == "zoom_logradouro_entrega") {		
		$('#tip_logradouro_entrega___'+seq).val(selectedItem.tip_logradouro);
		$('#desc_logradouro_entrega___'+seq).val(selectedItem.des_logradouro);
		
		setIEendereco( '#desc_logradouro_entrega___'+seq );
	}

	if ( campo == "zoom_pais" ){
		$('#cod_pais').val( selectedItem.cod_pais );
		$('#den_pais').val( selectedItem.den_pais );
		
		$('#cod_cidade_ibge').val( "" );
		$('#cod_cidade').val( "" );
		$('#den_cidade').val( "" );
		$('#uf').val( "" );
		
		setPaisSancionado();
	}

	if ( campo == "zoom_banco" ){
		if( ies_zoom ){
			$('.clear_banco').val('');
			ies_zoom = false;
		}
		$('#num_banco').val( selectedItem.cod_banco );
		$('#nom_banco').val( selectedItem.nom_banco );
		$('#pagto_deposito_credito').val("S");
	}

	if ( campo == "zoom_lote_pgto" ){		
		$('#cod_lote_pgto').val( selectedItem.cod_lote_pgto );
		$('#nom_lote').val( selectedItem.nom_lote );
	}

	if ( campo == "zoom_portador" ){
		$('#cod_portador').val( selectedItem.cod_portador );
		$('#ies_tip_portador').val( selectedItem.ies_tip_portador );
		$('#nom_portador').val( selectedItem.nom_portador );
	}

	if ( campo == "zoom_cbo" ){
		$('#cod_cbo').val( selectedItem.cod_cbo );
		$('#den_cbo').val( selectedItem.den_cbo );
	}

	if (campo == "cod_cliente_grp_econ") {
		$('#cgc_cpf_grp_econ___'+seq).val( selectedItem.num_cgc_cpf );
		$('#cod_cliente_grp_econ___'+seq).val( selectedItem.cod_cliente );
		$('#nom_cliente_grp_econ___'+seq).val( selectedItem.nom_cliente );
	}

	if (campo == "bt_representante") {
		$('#cod_repres').val( selectedItem.cod_repres );
		$('#nom_repres').val( selectedItem.raz_social );

		//loadResposavel( selectedItem.cod_repres );
	}

	if (selectedItem.type == "zoom_tipo_cliente") {		
		$('#cod_tip_cliente').val(selectedItem.cod_tip_cli);
		$('#tipo_cliente').val(selectedItem.den_tip_cli);
	}
	
	if (campo == 'bt_documentos'){
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
		$('#cod_tipo_documento___'+seq).val( selectedItem.cod_tipo_documento );
		$('#tipo_documento___'+seq).val( selectedItem.tipo_documento );
	}	
	required();

}

function loadResposavel( repres ){
	loadDsPfCombo('responsavel', 'representante', 'responsavel', 'responsavel', 'responsavel', 'cod_repres', repres, 'responsavel', 'S', 'N', 'ies_responsavel_default' );
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
			var fCodigo = filho[fieldCodigo].trim();
			if ($.inArray(fCodigo, getOptCombo(combo)) > -1) {
				continue;
			}
			if (fieldDesc == '') {
				den = fCodigo;
			} else {
				if (printCod == 'S' || printCod == undefined) {
					den = fCodigo + ' - ' + filho[fieldDesc];
				} else {
					den = filho[fieldDesc];
				}
			}
			$("#" + combo).append("<option value='" + fCodigo + "' >" + den + "</option>");
		}
		if (valDefault != '') {
			$("#" + combo).val(valDefault);
		}
	}
}

//Parte da função loadDsCombo
function getOptCombo( combo ){			
	var optArray = new Array();
	$("#"+combo+" option").each(function () {
		optArray.push( $(this).val() );
	});
	return optArray;
}

//Carrega dados do modal para seleção
var modalzoom = (function(){
	var zoommodal = null;
	var loading = FLUIGC.loading(window);
	return {
		open: function(title, dataset, fields, resultfields, filters, type, iniVazio, size, likefield, likevalue, searchby, msg = "") {

			// parent.$('#workflowView-cardViewer').css( 'zIndex', 1 );
	 		loading.show();
			
			var showfields = [];
			var globaldataset = [];
			var current = 0;
			var sqlLimit = 300;
			var tipo = type ;
			
			if ( size == '' || size == undefined || size == 'default' )
				size = "large";
			
			var id = 'modal-zoom-' + type;
			
			if (zoommodal != null) {
				zoommodal.remove();
				zoommodal = null;
				
				$(".table-zoom > thead").html("");
				$(".table-zoom > tbody").html("");
			}
			
			var html = "<body class='fluig-style-guide' >" +
				    "<div class='input-group'>" +
				    "<span class='input-group-addon'><span class='fluigicon fluigicon-search'></span></span>" +
				    "<input type='text' class='form-control' id='search' placeholder='Digite o texto e utilize o <Enter> para buscar'>" +
				    "</div>" +
				    "<div class='table-responsive' style='overflow: auto; height: 220px;'>" +
				    "<table class='table table-hover table-zoom'>" +
				    "<thead>" +
				    "</thead>" +
				    "<tbody>" +
				    "</tbody>" +
				    "</table>" +
				    "</div>" +
				    "</body>";
			
					var dosearch = function() {
				 		var url = urlrequest();
						$(".table-zoom > tbody").html("");

						loading.show();
				 		
						$.ajax({
				    		type: "GET",
				    		dataType: "json",
				    		url: url,
				    		data: "",
				    		error: function(XMLHttpRequest, textStatus, errorThrown) {
				    	    	console.log("dataset error", XMLHttpRequest, textStatus, errorThrown)
							},
				    	    success: function (data, status, xhr) {
				    	    	var dataset = data["invdata"];
				    	    	readydataset(dataset);
				    	    }
						});
					}			
			
					var urlrequest = function(){
					    var request = "/ecm/api/rest/ecm/dataset/",
					        json = {};
					    
					    if (dataset != null) {
					        request += "getDatasetZoom";
					        json.datasetId = dataset;
					    } else if(cardDatasetId != null){
					        request += "getCardDatasetValues";
					        json.cardDatasetId = cardDatasetId;
					    }
					    
					    if (resultfields != null && resultfields.length > 0 ){
					    	json.resultFields = trimarray(resultfields.split(","));
					    }
					    
					    if (filters != null && filters.length > 0 ){
					        json.filterFields = trimarray(filters.split(","));
							for (var x=0; x < json.filterFields.length; x++) {
								if( json.filterFields[x] == "sqlLimit" ){
									sqlLimit = json.filterFields[x+1];
								}
							}
					    }
					    
					    if (likefield != null && likefield.length > 0 && likevalue != null && likevalue.length > 0 ){
					        json.likeField = likefield;
					        json.likeValue = likevalue;
					    }
					    
					    var searchValue = $("#search").val();
					    if(searchValue && searchValue.length > 0) {
					    	json.searchValue = searchValue;
					    	
					    	if (searchby && searchby != "") {
						        json.searchField = searchby;
					    	} else {
					    		json.searchField = fields.split(",")[0];
					    	}					    	
					    }
					    
					    return request +="?json=" + encodeURIComponent(JSON.stringify(json));
					};			

					var trimarray = function (fields) {
				    	for(var i=0; i < fields.length; i++){
				    		fields[i] = fields[i].trim();
				    	}
				    	return fields;
				    }

					var readydataset = function(dataset) {
						
						globaldataset = dataset;
						
						if ( dataset.length == 1 && size == 'none' ){
							var row = dataset[0];
				 			row["type"] = type;
				 			row["size"] = size;
				 			setSelectedZoomItem(row);
							loading.hide();
							return true;
						}
						
						var linhas = 0;
						for (var i=0; i<dataset.length; i++) {
							var row = dataset[i];
							linhas += 1;
							var html = "<tr data-dataset=" + i + ">";
							for (var x=0; x<showfields.length; x++) {
								html += "<td>" + row[showfields[x]] + "</td>";								
							}
							html += "</tr>";
					 		$(".table-zoom > tbody").append(html);
						}
				 		$(".table-zoom > tbody > tr").click(function() {
				 			$(".table-zoom > tbody > tr").removeClass("active");
				 			$(this).addClass("active");
				 			current = $(this).data("dataset");
				 		});
				 		$(".table-zoom > tbody > tr").dblclick(function() {
				 			var row = globaldataset[$(this).data("dataset")];
				 			row["type"] = type;
							row["size"] = size;
				 			setSelectedZoomItem(row);
				 			zoommodal.remove();
				 		});
						$('#msg').remove();
				 		if ( linhas == sqlLimit ){
							$('#' +id + " .modal-footer").prepend( '<span id="msg"  name="msg" style="text-align: left;color: red;float: left;"><b> *Foram listados '+sqlLimit+' registros, refine sua busca!</b></span>'  );
						}
				 		if ( linhas == 0 ){
				 			$('#' +id + " .modal-footer").prepend( '<span id="msg"  name="msg" style="text-align: left;color: red;float: left;"><b> '+ msg +'</b></span>'  );
				 		}
				 		loading.hide();
					}

					if ( size == 'none' ){
						dosearch();
						return true;
					}
					
			var zoommodal = FLUIGC.modal({
			    title: title,
			    content: html,
			    formModal: false,
			    size: size,
			    id: id,
			    actions: [{
			        'label': 'Selecionar',
			        'classType': 'btn-success zoom-selected',
			        'autoClose': true,
			    },{
			        'label': 'Fechar',
			        'classType': 'zoom-fechar',
			        'autoClose': true
			    }]
			}, 
			function(err, data) {
			    if(err) {
					FLUIGC.toast({ title: 'Erro:', message: err, type: 'danger' });
			    } else {
					var searchtable = function (text) {
						var table = $('.table-zoom > tbody');
						table.find('tr').each(function(index, row) {
							var allCells = $(row).find('td');
							if(allCells.length > 0) {
								var found = false;
								allCells.each(function(index, td) {
									var regExp = new RegExp(text, 'i');
									if(regExp.test($(td).text())) {
										found = true;
										return false;
									}
								});
								if(found == true)$(row).show();else $(row).hide();
							}
						});
					}
					
					var setup = function(lista) {
						var l = lista.split(",");
						var html = "<tr>";
						for (var i=0; i<l.length; i++) {
							showfields.push(l[i]);
							html += "<th>" + l[i+1] + "</th>"
							i++;
						}
						html += "</tr>";
				 		$(".table-zoom > thead").append(html);
					}
					
					var timeout;
			 		$('#search').keyup(function() {
			 	    	clearTimeout(timeout);
			 	    	var keycode;
			 	    	if (window.event) {
			 	    		keycode = window.event.keyCode;
			 	    	} else if (event) {
			 	    		keycode = event.which;
			 	    	} else { 
			 	    		return true;
			 	    	}
			 	    	if (keycode == 13  && $("#search").val().length >= 3 ) {
							dosearch();
			 	    	} else {
			 	    		timeout = setTimeout(searchtable($(this).val()), 500);
			 	    	}			 			
			 		});		 		
					
			 		$('.zoom-selected').click(function() {
			 			var row = globaldataset[current];
			 			row["type"] = type;
						row["size"] = size;
			 			setSelectedZoomItem(row);
					});

			 		$('.zoom-fechar').click(function() {
			 			clearSelectedZoomItem(type);
					});			 		
			 		
			 		setup(fields);
			 		if ( !iniVazio )
			 			dosearch();
			 		else
			 			loading.hide();
			    }
			});			
			
		}
	}
})();