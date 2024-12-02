var editForm = true;

var openImagen = function( idDocumento, versionDocumento, titulo ){
			
	if( idDocumento == "" || versionDocumento == "" ){
		return false;
	}
	
	var myModal = FLUIGC.modal({
			title: titulo,
			content:' <div class="imgModal" > '+
					' 	 <p><a target="&quot;_blank;&quot;"><img alt="" data-units="px" src="/api/public/ecm/document/documentfile/'+idDocumento+'/'+versionDocumento+'" style="width:100%" /></a></p> '+
					' </div> ', 
			id: 'fluig-modal',
			size: 'largesmall',
			actions: [{
					'label': 'Fechar',
					'autoClose': true
			}]
	}, function(err, data) {
			if(err) {
					// do error handling
			} else {
					// do something with data
			}
	});
}

function loadBody(){

	console.log('loadBody');
	
	if ( $('#task').val() != 18 ){
		setMask();
	}	
	
	habilitaParcelas();

	valCalculado();

	displayFields();
	
	controleZoom();
				
}

function displayFields() {
	var task = $('#task').val();

	console.log('displayField...', task);

	// if ( task == 0 || task == 1 ){
	// 	$('#data_vencimento').attr('readonly','true');
	// 	$('#data_pagamento').attr('readonly','true');
	// } else {
	// 	$('#data_vencimento').removeAttr('readonly');
	// 	$('#data_pagamento').removeAttr('readonly');
	// }

	if ( task == 18 ){
		$('#aba_1 input, #aba_1 textarea, #aba_1 select, #aba_1 span').each(function () {
			if ( this.localName == 'select' ){
				if ( this.id != 'ind_condutor' ){
					$('#' + this.id + ' option:not(:selected)').prop('disabled', true);
					$(this).css('background-color','#eee');
				}				
			} if ( this.localName == 'span' ) {
				if ( $(this).hasClass('btn') ){
					$(this).attr('disabled','disabled');
				}
			} else {
				$(this).attr('readonly','');
				if ( $(this).parent().hasClass('input-group') ){
					$(this).parent().children().each(function(index, value){
						if ( $(this).hasClass('input-group-addon') ){
							$(this).hide();
						}
					 });
					 $(this).parent().removeClass('input-group');
				}
			}
			
		});
	}

}

var beforeSendValidate = function(numState,nextState){
	
	// var task = $('#task').val();

	if (numState == 0 || numState == 1){

		if ( !validaAutoInfracao() ){
			return false;
		}

	}

	$('#descritor').val( $('#cod_infracao').val() + ' - ' + $('#motorista').val() + ' - ' + $('#data_infracao').val() );

	return true;
	
}

// function showCamera(parameter) {
// 	JSInterface.showCamera(parameter);
// 	trataCampo();
// }

// function getNomeFile(parameter) {			
	
// 	fileName = "";
	
// 	fileName = getNextSeqChave();
	
// 	tipo = parameter.split('___')[0];
// 	row = parameter.split('___')[1];
	
// 	if( tipo == "receita" || tipo == "bt_foto_receita" ){
// 		$('#seqImagem_receita___'+row).val( fileName );
// 	}
// 	if( tipo == "despesas" || tipo == "bt_foto_despesa" ){
// 		$('#seqImagem_despesa___'+row).val( fileName );
// 	}
// 	if( tipo == "descarga" || tipo == "bt_foto_descarga" ){
// 		$('#seqImagem_descarga___'+row).val( fileName );
// 	}
// 	if( tipo == "abastecimento" || tipo == "bt_foto_abastecimento" ){
// 		$('#seqImagem_abastecimento___'+row).val( fileName );
// 	}
	
// }

// function openFile(parameter) {
	
// 	var seq = parameter.split('___')[1];
// 	var campo = parameter.split('___')[0];
	
// 	console.log('parameter....',parameter);
	
// 	if( campo == "bt_open_receita" ){
// 		var titulo = $('#data_receita___'+seq).val()||' '||$('#tipo_receita___'+seq).val()||' '||$('#valor_receita___'+seq).val();
// 		openImagen( $('#docum_receita___'+seq).val(), $('#versao_receita___'+seq).val(), titulo );
// 	}
// 	if( campo == "bt_open_despesa" ){
// 		var titulo = $('#data_despesa___'+seq).val()||' '||$('#tipo_despesa___'+seq).val()||' '||$('#valor_despesa___'+seq).val();
// 		openImagen( $('#docum_despesa___'+seq).val(), $('#versao_despesa___'+seq).val(), titulo );
// 	}
// 	if( campo == "bt_open_descarga" ){
// 		var titulo = $('#data_descarga___'+seq).val()||' '||$('#tipo_descarga___'+seq).val()||' '||$('#valor_descarga___'+seq).val();
// 		openImagen( $('#docum_descarga___'+seq).val(), $('#versao_descarga___'+seq).val(), titulo );
// 	}
// 	if( campo == "bt_open_abastecimento" ){
// 		var titulo = $('#data_abastecimento___'+seq).val()||' '||$('#tipo_abastecimento___'+seq).val()||' '||$('#valor_abastecimento___'+seq).val();
// 		openImagen( $('#docum_abastecimento___'+seq).val(), $('#versao_abastecimento___'+seq).val(), titulo );
// 	}

// }		

		
	function getNextSeqChave(){ 
	console.log('seqChaveImagem', $('#seqChaveImagem').val() );
	var seqChaveImagem = isNaN(parseInt( $('#seqChaveImagem').val() ) ) ? 0 : parseInt( $('#seqChaveImagem').val() );
	seqChaveImagem += 1;
	$('#seqChaveImagem').val(seqChaveImagem);
	return pad( seqChaveImagem, 4 );
}

function calculaParcelas() {
	var parcelas = isNull(getFloatId('parcelas'),0);
	var valor = isNull(getFloatId('valor'),0);
	var valor_parcela = valor / parcelas;
	console.log(parcelas,valor,valor_parcela);
	$('#valor_parcela').val(String((valor_parcela).toFixed(2)).replace('.', ','))

}

function expandeParcelas(id) {
	var linhas = $('#'+id).val();
	console.log(linhas);
	$('table[tablename=tbl_parcelas] tbody tr').not(':first').remove();

	var parcelas = isNull(getFloatId('parcelas'),0);
	var valor = isNull(getFloatId('valor'),0);
	var valor_parcela = valor / parcelas;
	var ultima_parcela  = valor - valor_parcela.toFixed(2) * (linhas - 1)
	
	for (var i = 0; i < linhas; i++) {
		var newId = addFilho('tbl_parcelas');
		$('#n_parcela___' + newId).val( i + 1 );

		if ( i + 1 != linhas ){
			$('#valor_parcela___' + newId).val( String((valor_parcela).toFixed(2)).replace('.', ',') );
		} else {
			$('#valor_parcela___' + newId).val( String((ultima_parcela).toFixed(2)).replace('.', ',') );
		}
		
	}

	setMask();

}


function multiParcelas() {
	// var multiplo = isNull(getFloatId('multiplo'),0);
	// var valor = isNull(getFloatId('valor'),0);
	// var valor_calculado = multiplo * valor;

	// $('#valor_calculado').val( getStringValue(valor_calculado,2) );
}

function habilitaParcelas() {
	if ($('#pago').val() == 'S') {
		$('.dv_parcelas').show();
	} else {
		$('.dv_parcelas').hide();
	}
}

function valCalculado() {
	if ($('#ind_condutor').val() == 'S'){
		// var valor_caculado = getFloatId('valor') * 2;
		// $('#valor_calculado').val( String((valor_caculado).toFixed(2)).replace('.', ',') );
		$('.dv_multiplo').show();
	} else {
		// var valor_caculado = getFloatId('valor');
		// $('#valor_calculado').val( String((valor_caculado).toFixed(2)).replace('.', ',') );
		$('.dv_multiplo').hide();
	}
}

function showCamera(id){
	console.log("Disparou >>> showCamera()");
  
	if ( id == 'doc_aif') {
		var nome_documento = $('#auto_infracao').val() + '___1';
	}

	if (id == 'doc_cpg') {
		var nome_documento = $('#comp_pagamento').val() + '___2';
	}
  
	// console.log(campo,index);
    
	var teste = JSInterface.showCamera(nome_documento);
  
	console.log(teste);
	$(window.top.document).find('#attachmentsStatusTab').trigger('click');
	
	setTimeout(function(){
	  Anexo();
	}, 10000);
  
  }
  
  function Anexo() {
	  console.log("Disparou >>> Anexo()");
	  
	  $.each(parent.ECM.attachmentTable.getData(), function(i,attachment) {
		  console.log(i,attachment);
		  var index =  attachment.description.split('___')[1];
		  var attachmentName =  attachment.name;
		  if (index == 1){			  
			  $("#doc_infracao").val(attachmentName);
		  }

		  if (index == 2){
			  $("#doc_pagamento").val(attachmentName);
		  }
  
	  });
  }

  function limpaCampos(grupo){

	if ( $('#ind_acerto').val() == 'S'){
		$('.grp_placa').val('');
		$('.grp_motorista').val('');
	} else {
		$('.grp_'+grupo).val('');
	}
	
  }

  function controleZoom(){
	  if ($('#ind_acerto').val() == 'S'){
		$('.div_motorista').removeClass('input-group');
		$('.div_motorista').children().each(function(index, value){
			if ( $(this).hasClass('input-group-addon') ){
				$(this).hide();
			}
		 });
	  }
	  if ($('#ind_acerto').val() == 'N'){
		$('.div_motorista').addClass('input-group');
		$('.div_motorista').children().each(function(index, value){
			if ( $(this).hasClass('input-group-addon') ){
				$(this).show();
			}
		 });
	  }
  }

  function novoCadastro(){

	//Utiliza dataset document interno e processo_movimento customizado
	//Para mensagem em tela usa função toast do utils
	
	var datasetName = 'cadastro_infracao_transito';

	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint( 'datasetName', datasetName, datasetName, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint( 'activeVersion', true, true, ConstraintType.MUST) );
	var dataset = DatasetFactory.getDataset( 'document', null, constraints, null);
	console.log(dataset);

	if ( dataset != null && dataset != undefined){
		if (dataset.values.length > 0 ){
			retorno = dataset.values[0];

			// var formLink = WCMAPI.getServerURL() + '/webdesk/streamcontrol/'+ retorno['parentDocumentId'] +'/'+ selected.documentid +'/' +retorno['version']+ '/'; editar
			WCMAPI = parent.WCMAPI;

			var formLink = WCMAPI.getServerURL() + '/webdesk/streamcontrol/'+ retorno['documentPK.documentId'] +'/0/0/';
			var html = '<iframe style="border: 0px; " src="' + formLink + '" id="iFrameDoc" class="iFrameDoc"></iframe> ';
			
			console.log('HTML......',html);	

			var modalDocumentEdit = FLUIGC.modal({
				title: 'Novo Registro',
				content: html,
				id: 'documentEdit',
				size : 'full',
				actions: [{
					'label' : 'Confirmar',
					'bind' : 'data-open-modal',
					'classType' : 'btn-success confirmar'
				},{
					'label': 'Fechar',
					'autoClose': true
				}]
			}, function(err, data) {
				if(err) {
					
				} else {
					
				}
			});

			$('#iFrameDoc').on('load', function() {

				// Enquadramento de tela
				var modalWidth = $('#documentEdit .modal-body').width();
				$('#iFrameDoc').css("width", modalWidth + "px");
				modalWidth = $('#iFrameDoc').contents().find('html').width() - 8;
				$('#iFrameDoc').contents().find('html').css('width', modalWidth + "px");
				var screenHeight = $('#iFrameDoc').contents().find('form').height();
				if (screenHeight < 300){
					screenHeight = 300;
				}
				$('#iFrameDoc').css("height", screenHeight + "px");
				$('#iFrameDoc').contents().find('#printBt').hide();	

				$('.confirmar').click(function() {
					console.log('confirmar');

					var constraintsEntrada = new Array();
									
					$('#iFrameDoc').contents().find("input,select,textarea").each(function () {
						// if ( $(this).val() != '' ){
							// console.log('looop  ',$(this).attr( 'name' ), $(this).val(), $(this).attr( 'type' ) );
							if ( $(this).attr( 'type' ) == 'radio' && $(this).is(':checked')){
								constraintsEntrada.push( DatasetFactory.createConstraint( $(this).attr( 'name' ), $(this).val(), 'field', ConstraintType.MUST ) );
							}							
							if ( $(this).attr( 'type' ) != 'radio'){
								constraintsEntrada.push( DatasetFactory.createConstraint( $(this).attr( 'name' ), $(this).val(), 'field', ConstraintType.MUST ) );
							}
						// }
					});
						
					// Editar Documento
					// constraintsEntrada.push( DatasetFactory.createConstraint( 'documentId', selected.documentid, null, ConstraintType.MUST) );

					// Se for Iniciar Processo
					// constraintsEntrada.push( DatasetFactory.createConstraint( 'processo', 'Chamado', null, ConstraintType.MUST) );
					// constraintsEntrada.push( DatasetFactory.createConstraint( 'atividade', '9', null, ConstraintType.MUST) );
					// constraintsEntrada.push( DatasetFactory.createConstraint( 'iniciarProcesso', 'S', null, ConstraintType.MUST) );

					// Se for criar um documento
					constraintsEntrada.push( DatasetFactory.createConstraint( 'parentDocumentId', retorno['documentPK.documentId'], null, ConstraintType.MUST) );
					
					var dataset = DatasetFactory.getDataset( 'processo_movimento', null, constraintsEntrada, null);
					
					console.log(dataset);
					
					if (dataset != undefined && dataset != null) {
						if (dataset.values.length > 0 ){
							if (dataset.values[0]["status"] == 'ok') {
								toast('Formulário :' + dataset.values[0]['documentId'] +' criado com sucesso!', 'success');
								
								$('#cod_infracao').val( $('#iFrameDoc').contents().find("#cod_infracao") );
								$('#infracao').val( $('#iFrameDoc').contents().find("#infracao") );
								$('#pontos').val( $('#iFrameDoc').contents().find("#pontos") );
								$('#valor').val( $('#iFrameDoc').contents().find("#valor").replace('.',','));
								$('#infrator').val( $('#iFrameDoc').contents().find("#infrator") );

								if ($('#iFrameDoc').contents().find("#ind_condutor") == 'S'){
									// var valor_caculado = selectedItem.valor * 2;
								// 	$('#valor_calculado').val( String((valor_caculado).toFixed(2)).replace('.', ',') );
									multiParcelas()
								} else {
									$('#valor_calculado').val( $('#iFrameDoc').contents().find("#valor").replace('.',','));
								}

								modalDocumentEdit.remove();
							} else {
								toast('Erro ao salvar formulário: ' + dataset.values[0]["status"], 'danger');
							}
												
						}
					}

				});

			});
		}
		
	}
		
  }

  function validaAutoInfracao(){
	

	var tSolicao = getTable( 'multas_sba', '' );

	var SQL = 	"	select sc.* " +
				"	from "+ tSolicao +" sc "+
				"	join documento dc on (dc.cod_empresa = sc.companyid "+
					"			           and dc.nr_documento = sc.documentid "+
					" 			           and dc.nr_versao = sc.version) "+
				"	join anexo_proces an on (an.COD_EMPRESA = sc.companyid "+ 
				"					   and an.NR_DOCUMENTO = sc.documentid) "+
				" join proces_workflow u on ( u.COD_EMPRESA = an.COD_EMPRESA   "+
              	"                       and u.NUM_PROCES = an.NUM_PROCES )  "+
				"	where dc.versao_ativa = 1 "+
				"	  and u.status <> 1 "+
				"	  and num_infracao = '"+ $('#num_infracao').val() +"' ";


	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS' ,null, ConstraintType.MUST));
	
	var dataSet = DatasetFactory.getDataset("select", null, constraints, null);

	if ( dataSet.values.length > 0 ){
		toast( 'Numero de auto de infração já cadastrada!', 'danger');
		return false;
	}

	return true;

  }