var descFile = "";
var idDocProc = "";
var folder = "";
var modalTipoDocumento = null;
var seqDoc = null;

function openDocuments ( id ){
	idDocumento = id;
	
	seqDoc = id.split('___')[1];
	
	var html = getFiles( seqDoc );

	var modalDocs = FLUIGC.modal({
		title: $('#tipo_documento___' + seqDoc ).val(),
		content: html,
		id: 'modal_documentos',
        size: 'large',
		actions: [{
			'label': 'Fechar',
			'classType': 'btn-danger',
			'autoClose': true
		}]
	}, function(err, data) {
		if(err) {
			// do error handling
		} else {

		}
	});

}

function getFiles( seqDoc ){

	var seq = seqDoc;

	var typeId = $('#cod_tipo_documento___'+seq).val();
	var informa = $('#ies_inform_data___'+seq).val();
	var folder = pastaCliente( $('#num_cgc_cpf').val(), $('#nom_cliente').val() );
	var html = '';

	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint("parentDocumentId", folder, folder, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("documentTypeId", typeId, typeId, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("deleted", false, false, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("activeVersion",true, true, ConstraintType.MUST) );        
	var ds = DatasetFactory.getDataset("document", null, constraints, ['validationStartDate desc']);

	html += '<ul class="list-group fs-no-margin"> ';

	for ( i = 0; i < ds.values.length; i ++){
		// if ( ds.values.length == 0){
		// 	toast('Nenhum documento encontrado.', 'warning');
		// 	return false;
		// }		
		var dt = new Date(  ds.values[i]['validationStartDate'] );
		var dt_exp = new Date(  ds.values[i]['expirationDate'] );
		var data_documento = formataData(dt);
		var data_exp = formataData(dt_exp);

		html +=	'	<li class="list-group-item fs-sm-padding-top fs-sm-padding-bottom"> ';
		
				if ( ['A','F'].indexOf( $('#tipo_cadastro_user').val() ) != -1 ){
		html +=	'		<span class="badge badge-danger fs-cursor-pointer" onclick="delFile( '+ ds.values[i]["documentPK.documentId"] +', \''+ ds.values[i]['documentDescription'] +'\' )"><i class="flaticon flaticon-cancel icon-sm"></i></span> '+
				'		<span class="badge badge-info fs-cursor-pointer" onclick="editFile( \''+ informa +'\', '+ ds.values[i]["documentPK.documentId"] +', \''+ ds.values[i]['documentDescription'] +'\', \''+ data_exp +'\' )"><i class="flaticon flaticon-border-color icon-sm"></i></span> ';
				};
				
		html +=	'		<span class="badge badge-primary fs-cursor-pointer" onclick="openFile( '+ ds.values[i]["documentPK.documentId"] +', '+ ds.values[i]["documentPK.version"] +' )"><i class="flaticon flaticon-documents icon-sm"></i></span> '+
				'		<a class="fs-cursor-pointer" href="javascript:openFile( '+ ds.values[i]["documentPK.documentId"] +', '+ ds.values[i]["documentPK.version"] +' )">' + data_documento + ' - ' + ds.values[i]['documentDescription'] +' - '+ data_exp +'</a>';
				'	</li> ';
	}

	html += '</ul>';

	return html;
}

function editFile (informa, id, desc, data_exp ){

	var modalDescription = FLUIGC.modal({
		title: 'Editar documento: ' + desc,
		content: '<input type="text" id="desc_doc" class="form-control" />'+
				 '<input type="text" id="data_exp" class="form-control" />',
		id: 'modal_editDescription',
        // size: 'small',
		actions: [{
			'label': 'Confirmar',
			'classType': 'btn-success',
			'bind': 'data-confirma-modal',
		},{
			'label': 'Fechar',
			'classType': 'btn-danger',
			'autoClose': true
		}]
	}, function(err, data) {
		if(err) {
			// do error handling
		} else {
			$('#desc_doc').val(desc);
			$('#data_exp').val(data_exp);
			FLUIGC.calendar('#data_exp' );
			if ( informa != 'on' ) $('#data_exp').hide();
			$('#modal_editDescription .modal-title').css('font-size','14px');
		}
	});

	$('#modal_editDescription').on("click", "[data-confirma-modal]", function(ev){
		loadWindow.show();
		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint("id", id , id, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("desc", $('#desc_doc').val() , null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint("expiration", $('#data_exp').val(), null, ConstraintType.MUST));
		DatasetFactory.getDataset("dsk_updateDoc", null, constraints, null, {
			success: function(dataSet){
				// console.log(dataSet.values);
				if( dataSet != null && dataSet != undefined ){
					// $(obj).parent().children()[3].innerHTML = $('#data_exp').val() + ' - ' + $('#desc_doc').val();
					// $(obj).parent().html( $(obj).parent().html().replaceAll(desc, $('#desc_doc').val()) );
					// $(obj).parent().html( $(obj).parent().html().replaceAll(data_exp, $('#data_exp').val()) );

					var html = getFiles( seqDoc );

					$('#modal_documentos .modal-body').html( html );
					loadWindow.hide();
					toast('Descrição do documento '+ id + ' atualizado', 'success');
					modalDescription.remove();
					
				}
			}
		});
		
		// código aqui...

		// activeFile(id).then( res1 => {
		// 	console.log(res1);
		// 	res1.description = $('#desc_doc').val();
		// 	res1.expirationDate = '2022-04-19';
		// 	updateFile( res1 ).then( res => {
		// 		console.log(res);
		// 		$(obj).parent().children()[3].innerHTML = $(obj).parent().children()[3].innerHTML.replace(desc, res.description);
		// 		$(obj).parent().html( $(obj).parent().html().replace(desc, res.description) );
		// 		toast('Descrição do documento '+ res.id + ' atualizado', 'success');
		// 		// obj.
		// 		modalDescription.remove();
		// 	}) ;
		// });


	});

}

function delFile(id, desc){

	FLUIGC.message.confirm({
		title: 'Deletar documento: ' + id,
		message: 'Deseja realmente deletar o documento ' + desc,
		labelYes: 'Sim',
    	labelNo: 'Não'
	}, function(result, el, ev) {
		if ( result ){
			// alert('deletou');
			
	/*		loadWindow.show();
			
			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint("id", id , id, ConstraintType.MUST));
			DatasetFactory.getDataset("dsk_removeDoc", null, constraints, null, {
				success: function(dataSet){
					// console.log(dataSet.values);
					if( dataSet != null && dataSet != undefined ){
						var html = getFiles( seqDoc );
						$('#modal_documentos .modal-body').html( html );
						loadWindow.hide();
						toast('Documento '+ id + ' removido', 'success');
					}
				}
			})*/
			
			loadWindow.show();
			var constraints = new Array();
			constraints.push(DatasetFactory.createConstraint("id", id , id, ConstraintType.MUST));
			DatasetFactory.getDataset("dsk_removeDoc", null, constraints, null, {
				success: function(dataSet){
					if( dataSet != null && dataSet != undefined ){
						var html = getFiles( seqDoc );
						$('#modal_documentos .modal-body').html( html );
						loadWindow.hide();
						toast('Removido documento '+ id + ' atualizado', 'success');
						modalDescription.remove();
						
					}
				}
			});
			
			/*deleteFile(id).then( res => {
				console.log(res);
				var html = getFiles( seqDoc );
				$('#modal_documentos .modal-body').html( html );
				//$(obj).parent().remove();
				toast('Descrição do documento '+ id + ' ' + desc + ' foi removido', 'success');
			});*/
			
		}
	});

}

async function deleteFile(id){

	const response = await fetch('/api/public/ecm/document/remove', {
		method: 'POST',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify({
			id: id, // ID do documento,
		})
	});

	if (response.ok) {
		const json = await response.json();
		return json.content;
	}

	const error = await response.text();
	console.error(error);
}

async function updateFile(jsonFile){
	const { id, version, phisicalFile, description, expirationDate } = jsonFile;

	const response = await fetch('/api/public/ecm/document/updateFile', {
		method: 'POST',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify({
			id: `${id}`,
			version: `${version}`,
			fileName:`${phisicalFile}`,
			expirationDate: `${expirationDate}`
		}),
	});

	if (response.ok) {
		const json = await response.json();
		return json.content;
	}

	const error = await response.text();
	console.error(error);
}

async function activeFile(id){

	const response = await fetch('/api/public/ecm/document/activedocument/' + id, {
		method: 'GET',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
	});

	if (response.ok) {
		const json = await response.json();
		return json.content;
	}

	const error = await response.text();
	console.error(error);
}

async function updateDescription(id, desc){

	const response = await fetch('/api/public/ecm/document/updateDescription', {
		method: 'POST',
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
		body: JSON.stringify({
			id: id, // ID do documento,
			description: desc,
		})
	});

	if (response.ok) {
		const json = await response.json();
		return json.content;
	}

	const error = await response.text();
	console.error(error);
}

function openFile( id, version ){
	
		var parentOBJ;

		// var seq = id.split('___')[1];
		// var docID = id;

		// window.open( parent.WCMAPI.getTenantURL() + '/ecmnavigation?app_ecm_navigation_doc=' + docID );
		if( $('#task').val() == "9" || $('#task').val() == "5" ){
			window.open( parent.WCMAPI.getServerURL() + '/webdesk/streamcontrol/?WDNrDocto=' + id + '&WDNrVersao=' + version);
		}else{
			window.open( parent.WCMAPI.getServerURL() + '/portal/p/1/ecmnavigation?app_ecm_navigation_doc=' + id );
		}
		
		// https://fluig.guabifios.com.br:8443/webdesk/streamcontrol/?WDNrDocto=43966
		// https://fluig.guabifios.com.br:8443/webdesk/streamcontrol/%C3%9Altima+altera%C3%A7%C3%A3o+contratual+-+JISS.pdf?WDCompanyId=1&WDNrDocto=43966&WDNrVersao=1000
		// if ( docID != '' ){
		// 	if (window.opener) {
		// 		parentOBJ = window.opener.parent;
		// 	} else {
		// 		parentOBJ = parent;
		// 	}
	
		// 	var cfg = {
		// 			url : "/ecm_documentview/documentView.ftl",
		// 			maximized : true,
		// 			title : "Anexo",
		// 			callBack : function() {
		// 				parentOBJ.ECM.documentView.getDocument( docID ); //, 1000 );
		// 			},
		// 			customButtons : []
		// 	};
		// 	parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
		// } else {
		// 	toast('Documento não encontrado','info');
		// 	return false;
		// }
	
}


function openFolder( folder ){
	
	var documentUrl = window.parent.WCMAPI.getProtectedContextPath() + "/" + window.parent.WCMAPI.getTenantCode() + "/ecmnavigation?app_ecm_navigation_doc=" + folder;
    window.open(documentUrl)
	
}

function loadFile(){

	if ( $('#num_cgc_cpf').val() == '' || $('#nom_cliente').val() == '' ){
		toast('CGC / CPF ou Nome não indormado', 'warning');
		return false;
	}

	modalTipoDocumento = FLUIGC.modal({
		title: 'Selecione o tipo do documento',
		content: '<select id="tipo_documento_modal" class="form-control"></select>',
		id: 'modal_tipo_documento',
		actions: [{
			'label': 'Confirmar',
			'classType': 'btn-success',
			'bind': 'data-confirma-modal',
		},{
			'label': 'Fechar',
			'classType': 'btn-danger',
			'autoClose': true
		}]
	}, function(err, data) {
		if(err) {
			// do error handling
		} else {
			// do something with data
			loadDsCombo('tipo_documento_modal', 'ds_tipo_documento', 'cod_tipo_documento', 'tipo_documento', '', '', 'cod_tipo_documento', 'N', 'S', 'N');
		}
	});

	$('#modal_tipo_documento').on("click", "[data-confirma-modal]", function(ev){
		// código aqui...
		$('#load_file').click();

	});
	
}
	
function defNomeFile( id ){
	
	console.log('id......'+ id);

	var modalLabel = null;
	
	descFile =  "DAP | Documento de Aposentadoria";
	idDocProc = "doc_dap";
	
	console.log('descFile...', descFile, 'idDocProc', idDocProc);
	// console.log(modalLabel);
	// $('#load_file').click();
	// complemento(modalLabel, function(){
		$('#load_file').click();
	// })

	// <input type="file" name="load_file" id="load_file" title="" style="display: none;" onchange="selectFile(this.files)" />
	
	
}

var myLoading = FLUIGC.loading(window, {
	textMessage:  'Aguarde, realizando upload.'
}); 
    
function selectFile( files ){
	console.log('selectFile', files);
	
	if( files.length == 0 ){
		return false;
	}
	
    var file = files[0];
    myLoading.show();
    var blob = new Blob([file],{type: 'application/octet-stream'});
    //enviar o arquivo selecionado para o diretório de upload do usuário logado    
    $.ajax({
        url: '/api/public/2.0/contentfiles/upload/?fileName=' + encodeURIComponent(file.name),
        type: 'POST',
        //data: formData,
        data: blob,
        cache: false,
        contentType: 'application/octet-stream',
        processData: false,                
        success: function(data) {
            //seta nome do arquivo em um input text para correta visualizacao no dataset do form
            $('#file_name').val(file.name);
            //funcao que controle o checked que indica se o arquivo foi selecionado
            //checkDocumento(file.name, $(input).data("checkbox-name"));
			myLoading.hide(); 

            publicaFile( file );
        },
        error: function(xhr, status, error) {
            //erro
            if (status == "error"){
                $(input).val("");
                checkDocumento("", $(input).data("checkbox-name"));
            }
            myLoading.hide();                                    
            console.log("STATUS: " + status);
            console.log("ERROR: " + error);        
            console.log(xhr);            
            var err = eval("(" + xhr.responseText + ")");                                
            //exibe erro no form
            FLUIGC.toast({
                title: '<strong>Erro ao realizar upload do arquivo selecionado. </strong>',
                message: err.message.message + " " + error,
                type: 'danger'
            });            
        }                          
    });        
}

function publicaFile( file ){
	
	console.log('publicaFile');
	
	myLoading.show();

	var folder = pastaCliente( $('#num_cgc_cpf').val(), $('#nom_cliente').val() );
	var typeId = $('#tipo_documento_modal').val();

	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint("parentId", folder, folder, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("fileName", file.name, file.name, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("tipo_documento", typeId, typeId, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("matricula", parent.WCMAPI.userCode, parent.WCMAPI.userCode, ConstraintType.MUST) );	
	DatasetFactory.getDataset("dsk_create_document", null, constraints, null, {
		success: function(data){
			console.log(data);

			$("input[name^=id_documento___]").each(function (index, value) {
				fnCustomDelete(this);
			});

			loadDocumentos( $('#num_cgc_cpf').val(), $('#nom_cliente').val() );

			$('#load_file').val("");
			
			modalTipoDocumento.remove();

			FLUIGC.toast({
				 title: '',
				 message: "Documento publicado - " + file.name,
				 type: 'info'
			 });
			myLoading.hide();

		},
		error: function(error){
			console.log(error);
		}
	});
}

function pastaCliente(cgc_cpf, descricao){

	// Carrega Pasta Pai
	var folderId = '50'
	// var folderId = '117'
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint("parentDocumentId", folderId, folderId, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("deleted",false, false, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("activeVersion",true, true, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint("documentDescription", cgc_cpf + '%', cgc_cpf + '%', ConstraintType.MUST, true) );
	var dsPasta = DatasetFactory.getDataset("document", null, constraints, null);

	var folder = "";

	if ( dsPasta.values.length == 0 ){
		// var folder = createFolder( descricao , '117', false );
	} else {
		var folder = dsPasta.values[0]['documentPK.documentId'];
	}

	return folder;
}

function createFolder( description, parentId, bloqExt ){
	
	console.log('description', description, 'parentId', parentId, 'bloqExt', bloqExt);

	var idFolder = 0;
	var grupo = '';
	if( bloqExt ){
		grupo = '';
	}
	var cons = new Array();
	cons.push( DatasetFactory.createConstraint( 'FOLDER_NAME', 			description, 	null, ConstraintType.MUST) );
	cons.push( DatasetFactory.createConstraint( 'PARENT_FOLDER_CODE',	parentId, 		null, ConstraintType.MUST) );
	cons.push( DatasetFactory.createConstraint( 'GROUP_HIDDEN', 		grupo, 			null, ConstraintType.MUST) );

	var dataset = DatasetFactory.getDataset( 'ds_create_folder', null, cons, null);
	
	if( dataset.values.length > 0 ){
		idFolder = dataset.values[0]['FOLDER'];
		
		// FLUIGC.toast({
		// 	 title: '',
		// 	 message: "Pasta Criada - " + idFolder+" "+description ,
		// 	 type: 'info'
		//  });
		
	}

	return idFolder;
}

function complemento(modalLabel, callback){

	console.log(modalLabel);

	if (modalLabel == null) {
		console.log('1');
		// $('#load_file').click();
		callback();
	} else {
		var html = 	'<label for="txtNome">'+modalLabel[0]+'</label> '+
					'<input type="text" class="form-control '+ modalLabel[1] +'" name="valor_modal" id="valor_modal"/>';

		var myModal = FLUIGC.modal({
			content: html,
			id: 'fluig-modal',
			actions: [{
				'label': 'Save',
				'classType': 'btn-success save',
				'bind': 'data-save-modal',
			}]
		}, function(err, data) {
			if(err) {
				// do error handling
			} else {
				// do something with data
				setMask();
				$('.save').click( function() {

					if ($('#valor_modal').val() == "") {
						alert('Obrigatório preenchimento do campo');
						return false;
					}
					
					$('#' + modalLabel[2]).val( $('#valor_modal').val() );
					
					myModal.remove();

					console.log('2');
					callback();
					// $('#load_file').click();				

				});
			}
		});
	}
}