3
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

	if (campo == 'bt_responsavel' 
		&& ( $('#task').val() == "0"
			|| $('#task').val() == "1"
			|| $('#task').val() == "4" ) ) {

		modalzoom.open(
			"Consulta Resposável",
			"colleague",
			"colleagueId,Matricula,colleagueName,Responsavel",
			"colleagueId,colleagueName",
			"",
			componente, false, "default", null, null,
			"colleagueName");
	}

	  if (componente == 'bt_uf') {
		    modalzoom.open('Unidade Funcional',
		      'selectLogix',
		      'cod_uni_funcio,Codigo,den_uni_funcio,Operação',
		      'cod_uni_funcio,den_uni_funcio',
		      'table,unidade_funcional,cod_empresa,' + $('#empresa').val(),
		      componente, false, 'default',  null, null,
		      'cod_uni_funcio'
		    );
		  }

	
	if (campo == 'cod_item') {

		modalzoom.open(
			"Item",
			"selectLogix", 
			"cod_item,Codigo,den_item,Item,ies_tip_item,Tip Item", 
			"",
			"table,item,ies_situacao,A,ies_ctr_estoque,S,cod_empresa,"+$('#empresa').val(),
			componente, false, "default", null, null,
			"cod_item||'-'||den_item" );
		
			// eis_v_estoque_local
	}
	
	if( campo == "local_est_original" ){
	
		if( $('#local_est_original___'+seq).val() == "" ){
			
			modalzoom.open(
					"Item",
					"selectLogix", 
					"cod_local,Codigo,den_local,Local", 
					"cod_local,den_local",
					"table,local,cod_empresa,"+$('#empresa').val(),
					componente, false, "default", null, null,
					"cod_local||'-'||den_local" );
		}
			
	}

}

function setSelectedZoomItem(selectedItem) {
	console.log('selectedItem.type', selectedItem.type);
	console.log('selectedItem', selectedItem);

	var campo = selectedItem.type.split('___')[0];
	var seq = selectedItem.type.split('___')[1];

	if (campo == 'bt_responsavel') {
		$('#cod_responsavel').val(selectedItem.colleagueId);
		$('#nome_responsavel').val(selectedItem.colleagueName);
	}

	if (selectedItem.type == 'bt_uf') {
		$('#cod_uni_funcio').val(selectedItem.cod_uni_funcio);
	}
	  
	if (campo == 'local_est_original') {
		$('#local_est___'+seq).val(selectedItem.cod_local);		
	}
	
	if (campo == 'cod_item') {

		var achou = false;
		$("input[name*=cod_item___]").each(function(index, value){	
			var linha = $(this).attr('id').split('___')[1];
			if( $('#cod_item___' + linha).val() == selectedItem.cod_item ){
				achou = true;
				return true;
			}
		});
		
		if( achou ){
			alert( 'Item já selecionado para este inventário.' );
			return false;
		}
		
		var SQL = 	"	select "+
					"		a.cod_empresa, "+
					"		a.cod_item, "+
					"		a.cod_local, "+
					"		nvl( a.num_lote, '' ) as num_lote, " +
					"		a.ies_situa_qtd, "+
					"		sum(a.qtd_saldo) qtd_saldo "+
					"	from estoque_lote_ender a"+					
					"	where a.cod_empresa = '"+ $('#empresa').val() +"'" +
					"		and a.cod_item = '" + selectedItem.cod_item + "'"+
					"	group by 1,2,3,4,5";

		console.log(SQL);
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixDS' ,null, ConstraintType.MUST));

		var dataSet = DatasetFactory.getDataset("select", null, constraints, null);

		console.log('estoque: ', dataSet);

		if (dataSet != undefined 
		 && dataSet != null
		 && dataSet.values.length > 0 ){
			for (var i = 0; i < dataSet.values.length; i++) {
				var seq = addFilho('tbl_filhos');
				$('#cod_den_item___' + seq).val(selectedItem.cod_item.trim()+" "+selectedItem.den_item);
				$('#cod_item___' + seq).val(selectedItem.cod_item);
				$('#den_item___' + seq).val(selectedItem.den_item);
				$('#local_est___'+ seq).val(dataSet.values[i].cod_local);
				
				var lote = dataSet.values[i].num_lote;
				if( lote == null || lote == "null" ){
					lote = "";
				}
				 
				$('#lote___'+ seq).val(lote);
				$('#local_est_original___'+ seq).val(dataSet.values[i].cod_local);
				$('#lote_original___'+ seq).val(dataSet.values[i].num_lote);
				$('#qtd_estoque___'+ seq).val(dataSet.values[i].qtd_saldo.replace('.',','));
				$('#ies_ctr_lote___' + seq).val(selectedItem.ies_ctr_lote);
				$('#ies_original___' + seq).val("S");
				
				$('#ies_situa_qtd_original___'+ seq).val(dataSet.values[i].ies_situa_qtd);
				$('#ies_situa_qtd___'+ seq).val(dataSet.values[i].ies_situa_qtd);
				
				
			}
		}else{
			var seq = addFilho('tbl_filhos');
			$('#cod_den_item___' + seq).val(selectedItem.cod_item.trim()+" "+selectedItem.den_item);
			$('#cod_item___' + seq).val(selectedItem.cod_item);
			$('#den_item___' + seq).val(selectedItem.den_item);
			$('#local_est___'+ seq).val('');
			$('#lote___'+ seq).val('');
			$('#local_est_original___'+ seq).val('');
			$('#lote_original___'+ seq).val('');
			$('#qtd_estoque___'+ seq).val('0,00');
			$('#ies_ctr_lote___' + seq).val(selectedItem.ies_ctr_lote);
			$('#ies_original___' + seq).val("S");
			$('#ies_situa_qtd_original___'+ seq).val('');
			$('#ies_situa_qtd___'+ seq).val('');
		}
		
		console.log(SQL);
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("table", 'item_custo', 'item_custo', ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("cod_item", selectedItem.cod_item, selectedItem.cod_item, ConstraintType.MUST));

		var dataSet = DatasetFactory.getDataset("selectLogix", ['eis_f_get_custo_ult_entr(cod_empresa,cod_item) as cus_unit_medio'], constraints, null);

		console.log('item_custo: ', dataSet);

		if (dataSet != undefined && dataSet != null){
			if (dataSet.values.length > 0 ){
				$('#custo_item___'+ seq).val(dataSet.values[0]['cus_unit_medio'].replace('.',','));
			}
		}
		trataPF();
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