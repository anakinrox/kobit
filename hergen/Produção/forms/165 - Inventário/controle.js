var editForm = true;

function loadBody(){

	console.log('loadBody.........'+$('#task').val());
	
	loadDsCombo('empresa', 'empresa', 'cod_empresa', 'den_empresa', '', '', 'cod_empresa desc', 'S', 'N' );

	setMask();
	console.log('1');

	if( $('#task').val() == "" || $('#task').val() == null || $('#task').val() == undefined ){
		$('input').attr('readonly',false);
		return true;
	}
	
	displayFields();
	trataPF();
	setEmpresa();
	calculaTotal();

}

var beforeSendValidate = function(numState,nextState){
	
	var task = $('#task').val();

	if (!valida('.valida')){		
		return false;
	}

	if ( numState == "1"){
		$('#gestor').val('N');

		if ( $('#usuario').val() == 'pablo' ){
			$('#gestor').val('S');
		}
	}

	if( numState != "0" && numState != "1"  ){
		var itemSemLocal = "";
		var itemSemLote = "";
		var itemSemSit = "";
		$("input[name*=cod_item___]").each(function(index, value){	
			var linha = $(this).attr('id').split('___')[1];
			if( $('#status___' + linha).val() != 'I' ){
				if( $('#local_est___' + linha).val() == "" ){
					itemSemLocal += " "+$('#cod_item___' + linha).val()
				}
				if( $('#lote___' + linha).val() == "" && $('#ies_ctr_lote___' + linha).val() == "S" ){
					itemSemLote += " "+$('#cod_item___' + linha).val()
				}
				if( $( '#ies_situa_qtd___'+ linha ).val() == "" ){
					itemSemSit += " "+$('#cod_item___' + linha).val()
				}
			}
		});
		
		if( itemSemLocal != "" ){
			alert( "Itens sem local informado"+itemSemLocal );
		}
		if( itemSemLote != "" ){
			alert( "Itens sem lote informado! "+itemSemLote );
		}
		if( itemSemSit != "" ){
			alert( "Itens sem situação informada! "+itemSemSit );
		}
		
		if( itemSemLocal != "" || itemSemLote != "" || itemSemSit != "" ){
			return false;
		}  
			
	}

	//if (numState == 4){
		calculaTotal();
	//}

	if (nextState == 33){
		if ($('#descricao').val() == ''){
			alert( "Necessário informar uma descrição no follow up! ");
			return false;
		}
	}
	
	validaStatus( task );
	
	// var task = $('#task').val();

	// if (task == 4 ){
	// 	if ( $('#motorista').val() == '' ){
	// 		alert('Motorista não informados');
	// 		return false;
	// 	}
	// }

	return true;
	
}

function setEmpresa(){
	if( $('#empresa').val() != "" && $('#empresa').val() != undefined && $('#empresa').val() != null ){
		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("cod_empresa", $('#empresa').val(), $('#empresa').val(), ConstraintType.MUST) );
		var ds = DatasetFactory.getDataset('empresa', null, ct, null );
		console.log('cod_papel......', ds);
		if( ds != null ){
			if( ds.values[0]["matricula_aprov_estoque"] == "null" 
			 || ds.values[0]["matricula_aprov_estoque"] == undefined 
			 || ds.values[0]["matricula_aprov_estoque"] == null ){
				$('#matricula_aprov_empresa').val( "" );
			}else{
				$('#matricula_aprov_estoque').val( ds.values[0]["matricula_aprov_estoque"] );
			}
		}
	}
}



function displayFields () {


	
	/*$('.follow_up').hide();*/
	$('.custo_ajuste').hide();
	invCego();

	if( $('#task').val() == 4 || $('#task').val() == 8 || $('#task').val() == 38 ){
		$('.custo_ajuste').show();

	}
	
	if( $('#task').val() == 8 ){
		readOnlyAll(true);
		
		$("tr[id^=linha_filhos___]").each(function (index, value) {
			var linha = parseInt($(this).attr("id").substring($(this).attr("id").indexOf("___") + 3));

			if ( $('#status___' + linha ).val() != 'A'){
				$(this).hide();
			}
		});
	}
	
	$('.qtd_contada1').hide();
	$('.qtd_contada2').hide();
	$('.qtd_contada3').hide();
	$('.qtd_contada4').hide();
	$('.qtd_contada5').hide();

	var seq_contagem = 0;
	var qtd = 0;
	$("input[name*=cod_item___]").each(function(index, value){	
		qtd += 1;
		var linha = $(this).attr('id').split('___')[1];

		var contagem = 0;
		if( $('#qtd_contada5___' + linha).val() != "" ){
			contagem = 5;
		}else if( $('#qtd_contada4___' + linha).val() != "" ){
			contagem = 4;
		}else if( $('#qtd_contada3___' + linha).val() != "" ){
			contagem = 3;
		}else if( $('#qtd_contada2___' + linha).val() != "" ){
			contagem = 2;
		}else if( $('#qtd_contada1___' + linha).val() != "" ){
			contagem = 1;
		}
		
		if( contagem > seq_contagem  ){
			seq_contagem = contagem; 
		}
		
					
		for (var i = 1; i <= seq_contagem; i++) {
			if ( seq_contagem != i){
				$('#qtd_contada'+ i + '___' + linha).attr('readonly','true');
			}
		}
	});

	if( qtd > 0 ){
		readOnlyAll(true, '.valida');
	}
	
	for (var i = 1; i <= seq_contagem; i++) {
		$('.qtd_contada' + i).show();
	}
	
	var task = $('#task').val();

	if (task == '0' || task == '1') {
		if( $('#data_refer').val() == "" ){
			var dateNow = DataHoje();
			var hourNow = HoraHoje();
			$('#data_refer').val(dateNow);
			$('#hora_refer').val(hourNow);	
		}
		$('.qtd_contada1').hide();
		$('.qtd_contada2').hide();
		$('.qtd_contada3').hide();
		$('.qtd_contada4').hide();
		$('.qtd_contada5').hide();
		$('.qtd_aceita').hide();
		$('.status').hide();
	}

	if (task == '2'){

		$("select[name*=status___]").each(function(index, value){
			var erro = false;
			var linha = $(this).attr('id').split('___')[1];
			if( $('#status___' + linha).val() != 'I' ){
				if( $('#local_est___' + linha).val() == "" ){
					erro = true;
				}
				if( $('#lote___' + linha).val() == "" && $('#ies_ctr_lote___' + linha).val() == "S" ){
					erro = true;
				}
				if( $( '#ies_situa_qtd___'+ linha ).val() == "" ){
					erro = true;
				}
			}
			
			var status = $(this).val();
			if ( status != 'R' && status != '' && !erro ) {				
				$(this).closest('tr').hide();
			}
		});

		$('.qtd_contada1').hide();
		$('.qtd_contada2').hide();
		$('.qtd_contada3').hide();
		$('.qtd_contada4').hide();
		$('.qtd_contada5').hide();
		$('.qtd_contada'+(seq_contagem+1)).show();
		$('.qtd_aceita').hide();
		$('.status').hide();

	}
	
	if (task == '8'){

		$('#btnFilhos').attr('disabled','disabled')
		
		// $('td:nth-child(1),th:nth-child(1)').hide();
		
	}

	/*if (task == '4'){
		$('.follow_up').show();
	}*/
	
	if( task != '0' && task != 1 && task != 4 ){
		readOnlyAll(true, '#inv_cego');
		readOnlyAll(true, '#titulo');
		
	}
	
}

//function fnCustomDelete(oElement) {
function deleteFilhos(oElement) {
	console.log('oElement.....', $(oElement).parent().parent().attr('id').split("___")[1] );
	var seq = $(oElement).parent().parent().attr('id').split("___")[1];
	if( $('#ies_original___' + seq ).val() == "S"  ){
		return false;
	}
	if( confirm("Deseja remover o item?") ){
		fnWdkRemoveChild(oElement);
	}
	trataPF();
}

function validaStatus(task) {
	
	var status = 'N';
	var qtd_reprov = 0;
	var qtd_aprov = 0;
	var qtd_naprov = 0;

	$("select[name*=status___]").each(function(index, value){
	
		var linha = $(this).attr('id').split('___')[1];
	
		if ( $(this).val() == 'R' ){			

			if (task == '4') {
				// alert('entrou');
				var contagem = "1";
				if( $('#qtd_contada5___' + linha).val() != "" ){
					contagem = "5";
				}else if( $('#qtd_contada4___' + linha).val() != "" ){
					contagem = "4";
				}else if( $('#qtd_contada3___' + linha).val() != "" ){
					contagem = "3";
				}else if( $('#qtd_contada2___' + linha).val() != "" ){
					contagem = "2";
				}else if( $('#qtd_contada1___' + linha).val() != "" ){
					contagem = "1";
				}
				//var contagem = parseInt($('#seq_contagem___' + linha ).val());
				$('#seq_contagem___' + linha ).val( contagem );
			}

			qtd_reprov++;
			// status = 'C';

		}

		if ( $(this).val() == 'A'){
			qtd_aprov++;
		}

		if ( $(this).val() == 'O' || $(this).val() == 'I' ){
			qtd_naprov++;
		}

	});

	if ( qtd_reprov > 0 ){
		status = 'C';
	}

	if ( qtd_aprov > 0 && qtd_reprov == 0 ){
		status = 'A';
	}

	if ( qtd_reprov == 0 && qtd_aprov == 0 && qtd_naprov > 0){
		status = 'N';
	}

	$('#valid_status').val(status);
}

function trataStatus(id){
	var linha = id.split('___')[1];
	if( $( '#status___'+linha ).val() == "A" 
	 || $( '#status___'+linha ).val() == "O" ){
		if( $('#qtd_contada5___' + linha).val() != "" ){
			$('#qtd_aceita___' + linha ).val( $('#qtd_contada5___' + linha ).val() );
		}else if( $('#qtd_contada4___' + linha).val() != "" ){
			$('#qtd_aceita___' + linha ).val( $('#qtd_contada4___' + linha ).val() );
		}else if( $('#qtd_contada3___' + linha).val() != "" ){
			$('#qtd_aceita___' + linha ).val( $('#qtd_contada3___' + linha ).val() );
		}else if( $('#qtd_contada2___' + linha).val() != "" ){
			$('#qtd_aceita___' + linha ).val( $('#qtd_contada2___' + linha ).val() );
		}else if( $('#qtd_contada1___' + linha).val() != "" ){
			$('#qtd_aceita___' + linha ).val( $('#qtd_contada1___' + linha ).val() );
		}
	}
	if( $( '#status___'+linha ).val() == "R"
	 || $( '#status___'+linha ).val() == "I"){
		$('#qtd_aceita___' + linha ).val( "" );
	} 
	calculaTotal();
		
}

function trataPF(){
	var qtd = 0;
	$("input[name*=cod_item___]").each(function(index, value){
		qtd += 1;
		var linha = $(this).attr('id').split('___')[1];
		
		if( $('#custo_item___'+ linha).val() == ""
		 || getFloatValue( 'custo_item___'+ linha ) == 0
		 || $('#custo_item___'+ linha).val() == undefined ){
			var SQL = 	"	select "+
						" cod_empresa, eis_f_get_custo_ult_entr(cod_empresa,cod_item) as cus_unit_medio "+
						"	from item_custo"+					
						"	where cod_empresa = '"+ $('#empresa').val() +"'" +
						"		and cod_item = '" + $(this).val() + "'";
	
			console.log(SQL);
			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
			constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixDS' ,null, ConstraintType.MUST));
			
			var dataSet = DatasetFactory.getDataset("select", null, constraints, null);
			
			console.log('item_custo: ', dataSet);
			
			if (dataSet != undefined && dataSet != null){
				if (dataSet.values.length > 0 ){
					$('#custo_item___'+ linha).val(dataSet.values[0]['cus_unit_medio'].replace('.',','));
				}
			}
		}		
		
		if( $('#local_est_original___' + linha).val() == "" ){
			$('#local_est___' + linha).removeAttr('readonly');
		}else{
			$('#local_est___' + linha).attr('readonly');
		}
		
		if( $('#lote_original___' + linha).val() == "" && $('#ies_ctr_lote___' + linha).val() == "S" ){
			$('#lote___' + linha).removeAttr('readonly');
		}else{
			$('#lote___' + linha).attr('readonly');
		}
		
		if( $('#ies_situa_qtd_original___'+ linha).val() == "" ){
			$('#ies_situa_qtd___'+ linha +' option:not(:selected)').prop('disabled', false);
		}else{
			$('#ies_situa_qtd___'+ linha +' option:not(:selected)').prop('disabled', true);
		}
				
	});
	calculaTotal();
	 
	if( qtd > 0 ){
		readOnlyAll(true, '.valida');
	}
	
	var task = $('#task').val();
	if( task == 4 ){
		
		readOnlyAll( true, '.contagem' );
		 
		$("input[name*=cod_item___]").each(function(index, value){
			var linha = $(this).attr('id').split('___')[1];

			$($('#status___' + linha)[0][1]).hide();
			
			if( $('#status___' + linha ).val() != "O" 
			 && $('#status___' + linha ).val() != "A" ){
				
				if( $('#qtd_contada5___' + linha).val() != "" ){
					var cont1 = getFloatValue( 'qtd_contada1___' + linha );
					var cont2 = getFloatValue( 'qtd_contada2___' + linha );
					var cont3 = getFloatValue( 'qtd_contada3___' + linha );
					var cont4 = getFloatValue( 'qtd_contada4___' + linha );
					var cont5 = getFloatValue( 'qtd_contada5___' + linha );
					if( cont4 == cont5 || cont3 == cont5 || cont2 == cont5 || cont1 == cont5){
						$('#status___' + linha ).val( "A" );
						$('#qtd_aceita___' + linha ).val( $('#qtd_contada5___' + linha ).val() );
					}else{
						$('#status___' + linha ).val( "R" );
						$('#qtd_aceita___' + linha ).val( "" );
					}
				}else if( $('#qtd_contada4___' + linha).val() != "" ){
					var cont1 = getFloatValue( 'qtd_contada1___' + linha );
					var cont2 = getFloatValue( 'qtd_contada2___' + linha );
					var cont3 = getFloatValue( 'qtd_contada3___' + linha );
					var cont4 = getFloatValue( 'qtd_contada4___' + linha );
					if( cont3 == cont4 || cont2 == cont4 || cont1 == cont4 ){
						$('#status___' + linha ).val( "A" );
						$('#qtd_aceita___' + linha ).val( $('#qtd_contada4___' + linha ).val() );
					}else{
						$('#status___' + linha ).val( "R" );
						$('#qtd_aceita___' + linha ).val( "" );
					}
				}else if( $('#qtd_contada3___' + linha).val() != "" ){
					var cont1 = getFloatValue( 'qtd_contada1___' + linha );
					var cont2 = getFloatValue( 'qtd_contada2___' + linha );
					var cont3 = getFloatValue( 'qtd_contada3___' + linha );
					if( cont2 == cont3 || cont1 == cont3 ){
						$('#status___' + linha ).val( "A" );
						$('#qtd_aceita___' + linha ).val( $('#qtd_contada3___' + linha ).val() );
					}else{
						$('#status___' + linha ).val( "R" );
						$('#qtd_aceita___' + linha ).val( "" );
					}
				}else if( $('#qtd_contada2___' + linha).val() != "" ){
					var cont1 = getFloatValue( 'qtd_contada1___' + linha );
					var cont2 = getFloatValue( 'qtd_contada2___' + linha );
					if( cont1 == cont2 ){
						$('#status___' + linha ).val( "A" );
						$('#qtd_aceita___' + linha ).val( $('#qtd_contada2___' + linha ).val() );
					}else{
						$('#status___' + linha ).val( "R" );
						$('#qtd_aceita___' + linha ).val( "" );
					}
				}else if( $('#qtd_contada1___' + linha).val() != "" ){
					var estoque = getFloatValue( 'qtd_estoque___' + linha );
					var cont1 = getFloatValue( 'qtd_contada1___' + linha );
					if( estoque == cont1 ){
						$('#status___' + linha ).val( "O" );
						$('#qtd_aceita___' + linha ).val( $('#qtd_contada1___' + linha ).val() );
						$($('#status___' + linha)[0][1]).show();
					}else{
						$('#status___' + linha ).val( "R" );
						$('#qtd_aceita___' + linha ).val( "" );
					}
				}
				
			} 			
			
		});
		validaStatus(task);
	}
}

function novoItem(el) {
	
	var row = addFilho('tbl_filhos');
	var index = $(el).attr('id').split('___')[1];
	
	var arrLinhas = [];
	$("input[name*=cod_item___]").each(function(index, value){	
		var linha = $(this).attr('id').split('___')[1];
		arrLinhas.push( linha );
	});
	
	arrLinhas = arrLinhas.reverse();
	
	for( var i = 0; i < arrLinhas.length; i++ ){
		linhaAtu = arrLinhas[i];
		linhaProx = arrLinhas[i+1];
		
		if( linhaProx == index ){
			$('#cod_den_item___' + linhaAtu).val($('#cod_den_item___' + index).val());
			$('#cod_item___' + linhaAtu).val($('#cod_item___' + index).val());
			$('#den_item___' + linhaAtu).val($('#den_item___' + index).val());
			
			$('#local_est___' + linhaAtu).val("");
			$('#lote___' + linhaAtu).val("");
			$('#local_est_original___' + linhaAtu).val("");
			$('#lote_original___' + linhaAtu).val("");
			$('#ies_original___' + linhaAtu).val("N");
			$('#ies_ctr_lote___' + linhaAtu).val( $('#ies_ctr_lote___' + index).val() );
			
			$('#endereco___' + linhaAtu).val( "" );
			$('#qtd_estoque___' + linhaAtu).val( "0,00" );
			$('#qtd_contada1___' + linhaAtu).val( "" );
			$('#qtd_contada2___' + linhaAtu).val( "" );
			$('#qtd_contada3___' + linhaAtu).val( "" );
			$('#qtd_contada4___' + linhaAtu).val( "" );
			$('#qtd_contada5___' + linhaAtu).val( "" );
			$('#qtd_aceita___' + linhaAtu).val( "" );
			$('#dif_contagem___' + linhaAtu).val( "" );
			$('#status___' + linhaAtu).val( "" );
			$('#ies_situa_qtd_original___'+ linhaAtu).val("");
			$('#ies_situa_qtd___'+ linhaAtu).val("");
			
			break;
		}else{
			$('#cod_den_item___' + linhaAtu).val($('#cod_den_item___' + linhaProx).val());
			$('#cod_item___' + linhaAtu).val($('#cod_item___' + linhaProx).val());
			$('#den_item___' + linhaAtu).val($('#den_item___' + linhaProx).val());
			
			$('#local_est___' + linhaAtu).val( $('#local_est___' + linhaProx).val() );
			$('#lote___' + linhaAtu).val($('#lote___' + linhaProx).val());
			$('#local_est_original___' + linhaAtu).val( $('#local_est_original___' + linhaProx).val() );
			$('#lote_original___' + linhaAtu).val($('#lote_original___' + linhaProx).val());
			$('#ies_original___' + linhaAtu).val($('#ies_original___' + linhaProx).val());
			$('#ies_ctr_lote___' + linhaAtu).val( $('#ies_ctr_lote___' + linhaProx).val() );
			
			$('#endereco___' + linhaAtu).val( $('#endereco___' + linhaProx).val() );
			$('#qtd_estoque___' + linhaAtu).val( $('#qtd_estoque___' + linhaProx).val() );
			$('#qtd_contada1___' + linhaAtu).val( $('#qtd_contada1___' + linhaProx).val() );
			$('#qtd_contada2___' + linhaAtu).val( $('#qtd_contada2___' + linhaProx).val() );
			$('#qtd_contada3___' + linhaAtu).val( $('#qtd_contada3___' + linhaProx).val() );
			$('#qtd_contada4___' + linhaAtu).val( $('#qtd_contada4___' + linhaProx).val() );
			$('#qtd_contada5___' + linhaAtu).val( $('#qtd_contada5___' + linhaProx).val() );
			$('#qtd_aceita___' + linhaAtu).val( $('#qtd_aceita___' + linhaProx).val() );
			$('#dif_contagem___' + linhaAtu).val( $('#dif_contagem___' + linhaProx).val() );
			$('#status___' + linhaAtu).val( $('#status___' + linhaProx).val() );

			$('#ies_situa_qtd_original___'+ linhaAtu).val( $('#ies_situa_qtd_original___'+ linhaProx).val() );
			$('#ies_situa_qtd___'+ linhaAtu).val( $('#ies_situa_qtd___'+ linhaProx).val() );
		}	
	}	
	trataPF();
}

function invCego(){
	if ($('#inv_cego').val() == 'S'){
		$('.estoque').hide();
	} else {
		$('.estoque').show();
	}
}

function fupItem(el){

	// console.log(el);
	// console.log($(el).attr('id').split('___')[1]);

	html =  '<div class="row  row_table"> '+
			'	<input type="hidden" class="form-control" name="data_hist_modal" id="data_hist_modal" readonly > '+
			'	<input type="hidden" class="form-control" name="cod_hist_modal" id="cod_hist_modal" readonly > '+
			'	<input type="hidden" class="form-control" name="user_hist_modal" id="user_hist_modal" readonly > '+			
			'	<div class="col-sm-12 pd_her"> '+
			'		<label for="exampleTag">Item</label> '+
			'		<input type="text" class="form-control" name="item_hist_modal" id="item_hist_modal" readonly > '+
			'		<input type="hidden" class="form-control" name="cod_item_hist_modal" id="cod_item_hist_modal" readonly > '+
			'		<input type="hidden" class="form-control" name="den_item_hist_modal" id="den_item_hist_modal" readonly > '+
			'	</div> '+
			'</div> '+
			'<div class="row  row_table"> '+
			'	<div class="col-sm-12 pd_her"> '+
			'		<label for="exampleTag">Descri&ccedil;&atilde;o de Intera&ccedil;&atilde;o</label> '+
			'		<textarea rows="3" name="desc_hist_modal" id="desc_hist_modal" class="form-control" ></textarea> '+
			'	</div> '+
			'</div> '+
			'<div class="row"> '+
			'	<div class="col-sm-12 pd_her" id="comentarios"> '+
			'		<label for="exampleTag">Históricos</label> '+
			'	</div> '+
			'</div>';


	var fupModal = FLUIGC.modal({
		title: 'Follow Up Item',
		content: html,
		id: 'fup_modal',
		actions: [{
			'label': 'Salvar',
			'bind': 'data-salva-modal',
		},{
			'label': 'Cancelar',
			'autoClose': true
		}]
	}, function(err, data) {
		if(err) {
			// do error handling
		} else {

			var usuario = $('#usuario').val();
			var ct = new Array();
			ct.push( DatasetFactory.createConstraint("colleagueId", usuario, usuario, ConstraintType.MUST ) );
			var ds = DatasetFactory.getDataset("colleague", ['colleagueName'], ct, null);
			console.log(ds);

			var index = $(el).attr('id').split('___')[1];
			var cod_item = $('#cod_item___' + index).val();
			var den_item = $('#den_item___' + index).val();
			var cod_den_item = $('#cod_den_item___' + index).val();

			$('#data_hist_modal').val(DataHoraHoje());
			$('#cod_hist_modal').val(usuario);
			$('#user_hist_modal').val(ds.values[0]['colleagueName']);
			$('#cod_item_hist_modal').val(cod_item);
			$('#den_item_hist_modal').val(den_item);
			$('#item_hist_modal').val(cod_den_item);
			
			var html = '';
			$("input[name*=cod_item_hist___]").each(function(index, value){	
				var linha = $(this).attr('id').split('___')[1];
				console.log(value, $(this).val(), $(this).value);
				if ( $(this).val() == cod_item){
					html += '<textarea rows="3" name="desc_hist_modal" id="desc_hist_modal" class="form-control" readonly>'+ $('#desc_hist___'+linha).val()+'</textarea> ';	
				}
				
			});	

			$('#comentarios').append(html);
			// do something with data
		}

		$('#fup_modal').on('click', '[data-salva-modal]', function(ev) {

			if ($('#desc_hist_modal').val() == ''){
				alert('Necessário informar descrição do follow Up');
				return false;
			}

			var row = addFilho('followup');

			$('#tbl_fup').contents().find("input,select,textarea").each(function () {
				var id = $(this).attr( 'name' );
				console.log(id);
				$('#'+ id + '___' + row).val( $('#'+ id + '_modal').val() );
			});

			alert('Follow Up registrado com sucesso!');

			fupModal.remove();
		});
	});	

}

function calculaTotal(){
	
	var custo_total = 0;
	
	$("input[name*=cod_item___]").each(function(index, value){	
		var linha = $(this).attr('id').split('___')[1];
		
		if( ['A','O'].indexOf( $('#status___'+linha).val() ) != -1  ){
		
			var qtd_aceita = getFloatValue('qtd_aceita___' + linha);
			var qtd_estoque = getFloatValue('qtd_estoque___' + linha);
			var custo_item = getFloatValue('custo_item___' + linha);
			var dif_contagem = qtd_aceita - qtd_estoque;
			var custo_ajuste = dif_contagem * custo_item;
			custo_total += custo_ajuste;
			$('#dif_contagem___' + linha).val( getStringValue(dif_contagem,2) );
			
			$('#custo_ajuste___' + linha).val( getStringValue(custo_ajuste,2) );
		}
	});	
	$('#valor_tot_ajuste').val( getStringValue(custo_total,2) );
}