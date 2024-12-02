
var descFile = "";
var idDocProc = "";
var folder = "";

function openFile( obj ){

	console.log($($(obj).parent().children()[0]).val());

	window.open( 'http://fluig.pormade.com.br:8080/portal/p/1/ecmnavigation?app_ecm_navigation_doc=' +  $($(obj).parent().children()[0]).val() );

	// var parentOBJ;

	// if (window.opener) {
	// 	parentOBJ = window.opener.parent;
	// } else {
	//     parentOBJ = parent;
	// }

	// var cfg = {
	// 		url : "/ecm_documentview/documentView.ftl",
	//         maximized : true,
	//         title : "Anexo",
	//         callBack : function() {
	//             parentOBJ.ECM.documentView.getDocument( $($(obj).parent().children()[0]).val() ); //, 1000 );
	//         },
	//         customButtons : []
	// };
	// parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
	
}


function openFolder( folder ){
	
	var documentUrl = window.parent.WCMAPI.getProtectedContextPath() + "/" + window.parent.WCMAPI.getTenantCode() + "/ecmnavigation?app_ecm_navigation_doc=" + folder;
    window.open(documentUrl)
	
}

function loadFile( id ){

	if( $("#nome_motorista").val() == "" ){
		alert('Deve ser informado um motorista');
		return false;
	}
	
	if( $( '#num_pasta_motorista' ).val() == "" ){
		if( !confirm("Será criado uma para armazenar os documentos do motorista!") ){
			return false;
		}else{
			criaEstrPastas( id );
		}
	}else{
		defNomeFile( id );
	}
	
}
	
function defNomeFile( id ){
	
	console.log('id......'+ id);

	var modalLabel = null;

	if( id == "bt_dap" ){
		descFile =  "DAP | Documento de Aposentadoria";
		idDocProc = "doc_dap";
		modalLabel = ['Data Aposentadoria','data-fluig','dt_aposentadoria'];
		// complemento();
		// folder = $("#fd_dap").val();		
	}

	if( id == "bt_dad" ){
		descFile =  "DAD - Documento de Admissão";
		idDocProc = "doc_dad";
		modalLabel = ['Data Admissão','data-fluig','data_admissao'];
		// complemento();
		// folder = $("#fd_dap").val();
	}

	if( id == "bt_drg" ){
		descFile =  "DRG - Documento Registro Geral";
		idDocProc = "doc_drg";
		// modalLabel = new Array('RG','','rg');
		// folder = $("#fd_dap").val();
	}

	if( id == "bt_dpf" ){
		descFile =  "DPF - Documento Pessoa Física";
		idDocProc = "doc_dpf";
		// modalLabel = new Array('CPF','','cpf');
		// folder = $("#fd_dap").val();
	}

	if( id == "bt_dcm" ){
		descFile =  "DCM - Documento Carteira de Motorista";
		idDocProc = "doc_dcm";
		modalLabel = ['Data Validade CNH','data-fluig','validade_cnh'];
		// folder = $("#fd_dap").val();
	}

	var seq = id.split('___')[1];
	var campo = id.split('___')[0];

	if( campo == "bt_dat" ){
		descFile =  "DAT - Documento Atestado";
		idDocProc = 'doc_dat___'+seq;
	}

	if( campo == "bt_dfe" ){
		descFile =  "DFE - Documento Férias";
		idDocProc = 'doc_dfe___'+seq;
	}

	if( campo == "bt_dfo" ){
		descFile =  "DFO - Documento Folga";
		idDocProc = 'doc_dfo___'+seq;
	}

	
	console.log('descFile...', descFile, 'idDocProc', idDocProc);
	// console.log(modalLabel);
	// $('#load_file').click();
	complemento(modalLabel, function(){
		$('#load_file').click();
	})

	
	
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

					// console.log('2');
					callback();
					// $('#load_file').click();				

				});
			}
		});
	}
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
        url: '/api/public/2.0/contentfiles/upload/?fileName=' + file.name,
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
	$.ajax({
		async : true,
		type : "POST",
		contentType: "application/json",
		url : '/api/public/ecm/document/createDocument',

		data: JSON.stringify({
			"description": descFile+' - '+file.name,
			"parentId": $('#num_pasta_motorista').val(),
			"downloadEnabled": true,
			"attachments": [{
				"fileName": file.name
			}],
		}),
		error: function() {
			FLUIGC.toast({
				 title: '',
				 message: "Falha ao enviar",
				 type: 'danger'
			 });
			myLoading.hide();
		},
		success: function(data) {
			console.log('data.....',data.content.id);
			$( '#'+idDocProc ).val( data.content.id );
			FLUIGC.toast({
				 title: '',
				 message: "Documento publicado - " + file.name,
				 type: 'info'
			 });
			myLoading.hide();

			// complemento();
		},
	});	
}

function criaEstrPastas( id ){
	console.log('criaEstrPastas', id);
	var fdm = createFolder( $("#nome_motorista").val(), $("#num_pasta_motoristas").val(), false );
	$( '#num_pasta_motorista' ).val( fdm );
	
	defNomeFile(id);
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
		
		FLUIGC.toast({
			 title: '',
			 message: "Pasta Criada - " + idFolder+" "+description ,
			 type: 'info'
		 });
		
	}
	
	/*
    myLoading.show();
    var idFolder = 0;
	$.ajax({
		async : false,
		type : "POST",
		contentType: "application/json",
		url : '/api/public/ecm/document/createFolder',

		data: JSON.stringify({
			"description" : description,//document's description  
			"parentId": parentId,   
			"downloadEnabled": true,
		}),
		error: function() {
			FLUIGC.toast({
				 title: '',
				 message: "Falha ao criar pasta",
				 type: 'danger'
			 });
			myLoading.hide();
		},
		success: function(data) {
			console.log('data.....',data.content.id);
			idFolder = data.content.id;
			FLUIGC.toast({
				 title: '',
				 message: "Pasta Criada - " + data.content.id+" "+description ,
				 type: 'info'
			 });
			
			if( bloqExt ){
					
			 	var cons = new Array();
				cons.push( DatasetFactory.createConstraint( 'COD_EMPRESA', 			 '1', 		null, ConstraintType.MUST) );
				cons.push( DatasetFactory.createConstraint( 'NR_DOCUMENTO', 		 idFolder, 	null, ConstraintType.MUST) );
				cons.push( DatasetFactory.createConstraint( 'NR_VERSAO', 			 '1000', 	null, ConstraintType.MUST) );
				cons.push( DatasetFactory.createConstraint( 'IDI_TIP_ATRIBUIC',		 '2', 		null, ConstraintType.MUST) );
				cons.push( DatasetFactory.createConstraint( 'DES_VAL_ATRIBUIC', 	 'comercial_hydrowheel_externo', null, ConstraintType.MUST) );
				cons.push( DatasetFactory.createConstraint( 'LOG_PERMITE_DOWNLOAD',  '1', 		null, ConstraintType.MUST) );
				cons.push( DatasetFactory.createConstraint( 'LOG_PERMIS', 			 '0', 		null, ConstraintType.MUST) );
				cons.push( DatasetFactory.createConstraint( 'IDI_NIV_PERMIS_SEGUR',  '0', 		null, ConstraintType.MUST) );
				cons.push( DatasetFactory.createConstraint( 'LOG_EXCLUSIV_VERS_ANT', '0', 		null, ConstraintType.MUST) );
				cons.push( DatasetFactory.createConstraint( 'LOG_LISTA_CONTDO', 	 '1', 		null, ConstraintType.MUST) );
				
				var dataset = DatasetFactory.getDataset( 'doc_set_permissao', null, cons, null);
			}
			
			myLoading.hide();
		},
	});	*/

	return idFolder;
}

//loadFolder
/*
$.ajax({ async : true, 
	type : "GET", 
	contentType: "application/json", 
	url : '/api/public/ecm/document/listDocument/108383', // 157 é o id da pasta que contém os arquivos 
	success: function(retorno) { //limpar listagem 
		//$(".arquivos").remove();
		
		$.each( retorno.content,  function(k,v){ 
				console.log(v.description); //interagir com o HTML 
				$(".arquivosEncontrados").append(''+v.description+''); 
		}) 
	} 
});
*/