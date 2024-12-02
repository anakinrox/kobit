
var descFile = "";
var idDocProc = "";
var folder = "";

function openFile( obj ){

	var parentOBJ;

	if (window.opener) {
		parentOBJ = window.opener.parent;
	} else {
	    parentOBJ = parent;
	}

	var cfg = {
			url : "/ecm_documentview/documentView.ftl",
	        maximized : true,
	        title : "Anexo",
	        callBack : function() {
	            parentOBJ.ECM.documentView.getDocument( $($(obj).parent().children()[0]).val() ); //, 1000 );
	        },
	        customButtons : []
	};
	parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
	
}


function openFolder( folder ){
	
	var documentUrl = window.parent.WCMAPI.getProtectedContextPath() + "/" + window.parent.WCMAPI.getTenantCode() + "/ecmnavigation?app_ecm_navigation_doc=" + folder;
    window.open(documentUrl)
	
}

function loadFile( id ){
	
	if( $("#projeto").val() == "" ){
		alert('Deve ser definido nome do projeto.');
		return false;
	}
	
	if( $( '#num_pasta_projeto' ).val() == "" ){
		if( !confirm("Será criado uma para armazenar os documentos do projeto!") ){
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
	
	if( id == "bt_sah" ){
		descFile =  $('#processo').val()+" "+$('#projeto').val()+" - SAH ";
		idDocProc = "doc_sah";
		folder = $("#fd_sah").val();
	}
	if( id == "bt_aha" ){
		descFile =  $('#processo').val()+" "+$('#projeto').val()+" - AHA ";
		idDocProc = "doc_aha";
		folder = $("#fd_aha").val();
	}
	if( id == "bt_fig" ){
		descFile =  $('#processo').val()+" "+$('#projeto').val()+" - FIG ";
		idDocProc = "doc_fig";
		folder = $("#fd_fig").val();
	}
	if( id == "bt_cet" ){
		descFile =  $('#processo').val()+" "+$('#projeto').val()+" - CET ";
		idDocProc = "doc_cet";
		folder = $("#fd_cet").val();
	}
	if( id == "bt_pep" ){
		descFile =  $('#processo').val()+" "+$('#projeto').val()+" - PEP ";
		idDocProc = "doc_pep";
		folder = $("#fd_pep").val();
	}
	if( id == "bt_ich" ){
		descFile =  $('#processo').val()+" "+$('#projeto').val()+" - ICH  ";
		idDocProc = "doc_ich";
		folder = $("#fd_ich").val();
	}

/*	var seq = id.split('___')[1];
	var campo = id.split('___')[0];
	if( campo == "bt_custos" ){
		descFile =  $('#processo').val()+" "+$('#den_item').val()+" - "+ $('#cst_empresa___'+seq).val().trim() +" - "+ $('#cst_uf___'+seq).val().trim() +" - Custo";
		idDocProc = 'doc_custos___'+seq;
	} */

	console.log('descFile...',descFile,$('#processo').val(),$('#projeto').val());
	$('#load_file').click();
	
}

var myLoading = FLUIGC.loading(window, {
	textMessage:  'Aguarde, realizando upload.'
}); 
    
function selectFile( files ){
	console.log(files);	
	
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
    myLoading.show();
	$.ajax({
		async : true,
		type : "POST",
		contentType: "application/json",
		url : '/api/public/ecm/document/createDocument',

		data: JSON.stringify({
			"description": descFile+' - '+file.name,
			"parentId": folder,
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
		},
	});	
}

function criaEstrPastas( id ){
	
	var fdp = createFolder( $("#projeto").val(), $("#num_pasta_projetos").val(), false );
	$( '#num_pasta_projeto' ).val( fdp );
	
	var fd = createFolder( "00 - Capa", 				fdp, true );
	var fd = createFolder( "01 - E-Mail", 				fdp, true );
	var fd = createFolder( "02 - Espeficacoes", 		fdp, true );
	var fd = createFolder( "03 - Desenhos", 			fdp, true );
	var fd = createFolder( "04 - SAH", 					fdp, false );
	$('#fd_sah').val( fd );
	var fd = createFolder( "05 - Fotos", 				fdp, true );
	var fd = createFolder( "10 - AHA", 					fdp, false );
	$('#fd_aha').val( fd );
	var fd = createFolder( "15 - CET",					fdp, true );
	$('#fd_cet').val( fd );
	var fd = createFolder( "20 - FIG", 					fdp, true );
	$('#fd_fig').val( fd );
	var fd = createFolder( "25 - PEP", 					fdp, true );
	$('#fd_pep').val( fd );
	var fd = createFolder( "30 - Custos Terceiros", 	fdp, true );
	var fd = createFolder( "35 - Custos HydroWheel", 	fdp, true );
	$('#fd_ich').val( fd );
	var fd = createFolder( "51 - Proposta Tecnica", 	fdp, true );
	var fd = createFolder( "50 - Proposta Comercial", 	fdp, true );
	
	defNomeFile(id);
}

function createFolder( description, parentId, bloqExt ){
	
	var idFolder = 0;
	var grupo = '';
	if( bloqExt ){
		grupo = 'comercial_hydrowheel_externo';
	}
	var cons = new Array();
	cons.push( DatasetFactory.createConstraint( 'FOLDER_NAME', 			description, 	null, ConstraintType.MUST) );
	cons.push( DatasetFactory.createConstraint( 'PARENT_FOLDER_CODE',	parentId, 		null, ConstraintType.MUST) );
	cons.push( DatasetFactory.createConstraint( 'GROUP_HIDDEN', 		grupo, 			null, ConstraintType.MUST) );

	var dataset = DatasetFactory.getDataset( 'create_folder_prop_hw', null, cons, null);
	
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

