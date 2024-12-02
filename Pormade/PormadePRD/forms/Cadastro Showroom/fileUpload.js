
var descFile = "";
var idDocProc = "";
var folder = "";

function openFile(obj) {

	window.open('http://fluig.pormade.com.br:8080/portal/p/1/ecmnavigation?app_ecm_navigation_doc=' + $($(obj).parent().children()[0]).val());

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


function openFolder(folder) {

	var documentUrl = window.parent.WCMAPI.getProtectedContextPath() + "/" + window.parent.WCMAPI.getTenantCode() + "/ecmnavigation?app_ecm_navigation_doc=" + folder;
	window.open(documentUrl)

}

function loadFile(id) {
	if ($("#nome_cidade").val() == '') {
		FLUIGC.toast({
			title: 'Erro cidade',
			message: '<strong>Cidade deve ser selecionada. </strong>',
			type: 'danger'
		});
		return;
	}
	criaEstrPastas(id);
	// defNomeFile(id);


}

function defNomeFile(id) {

	var modalLabel = null;
	descFile = "Imagem Showroom";
	idDocProc = "doc_imagem";
	modalLabel = ['Imagem Showroom', 'data-fluig', 'dt_showroom'];
	$('#load_file').click();

}

function complemento(modalLabel, callback) {

	if (modalLabel == null) {
		console.log('1');
		// $('#load_file').click();
		callback();
	} else {
		var html = '<label for="txtNome">' + modalLabel[0] + '</label> ' +
			'<input type="text" class="form-control ' + modalLabel[1] + '" name="valor_modal" id="valor_modal"/>';

		var myModal = FLUIGC.modal({
			content: html,
			id: 'fluig-modal',
			actions: [{
				'label': 'Save',
				'classType': 'btn-success save',
				'bind': 'data-save-modal',
			}]
		}, function (err, data) {
			if (err) {
				// do error handling
			} else {
				// do something with data
				setMask();
				$('.save').click(function () {

					if ($('#valor_modal').val() == "") {
						alert('Obrigatório preenchimento do campo');
						return false;
					}

					$('#' + modalLabel[2]).val($('#valor_modal').val());

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
	textMessage: 'Aguarde, realizando upload.'
});

function selectFile(files) {
	// console.log('selectFile', files);

	if (files.length == 0) {
		return false;
	}

	var file = files[0];
	myLoading.show();
	var blob = new Blob([file], { type: 'application/octet-stream' });
	//enviar o arquivo selecionado para o diretório de upload do usuário logado    
	$.ajax({
		url: '/api/public/2.0/contentfiles/upload/?fileName=' + file.name,
		type: 'POST',
		//data: formData,
		data: blob,
		cache: false,
		contentType: 'application/octet-stream',
		processData: false,
		success: function (data) {
			$('#file_name').val(file.name);
			myLoading.hide();

			publicaFile(file);
		},
		error: function (xhr, status, error) {
			//erro
			if (status == "error") {
				$(input).val("");
				checkDocumento("", $(input).data("checkbox-name"));
			}
			myLoading.hide();
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

function publicaFile(file) {
	myLoading.show();
	$.ajax({
		async: true,
		type: "POST",
		contentType: "application/json",
		url: '/api/public/ecm/document/createDocument',

		data: JSON.stringify({
			"description": descFile + ' - ' + file.name,
			"parentId": $('#id_pasta').val(),
			"downloadEnabled": true,
			"attachments": [{
				"fileName": file.name
			}],
		}),
		error: function (xhr, status, error) {
			var err = eval("(" + xhr.responseText + ")");
			//exibe erro no form
			FLUIGC.toast({
				title: '<strong>Erro ao realizar upload do arquivo selecionado. </strong>',
				message: err.message.message + " " + error,
				type: 'danger'
			});
			myLoading.hide();
		},
		success: function (data) {
			$('#' + idDocProc).val(data.content.id);
			// FLUIGC.toast({
			// 	title: '',
			// 	message: "Documento publicado - " + file.name,
			// 	type: 'info'
			// });
			myLoading.hide();
		},
	});
}

function criaEstrPastas(id) {
	var fdm = createFolder($("#nome_cidade").val(), '800447', false);
	$('#id_pasta').val(fdm);

	defNomeFile(id);
}

function createFolder(description, parentId, bloqExt) {

	var idFolder = 0;
	var grupo = '';
	if (bloqExt) {
		grupo = '';
	}

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("parentDocumentId", parentId, parentId, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("deleted", false, false, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("activeVersion", true, true, ConstraintType.MUST));
	constraints.push(DatasetFactory.createConstraint("documentDescription", description, description, ConstraintType.MUST));
	// var like = DatasetFactory.createConstraint("documentDescription", description + '%', description + '%', ConstraintType.MUST);
	// like.setLikeSearch(true);
	// constraints.push(like);
	var dsPasta = DatasetFactory.getDataset("document", null, constraints, null);
	if (dsPasta.rowsCount > 0) {
		idFolder = dsPasta.getValue(0, "documentPK.documentId");
	} else {
		var cons = new Array();
		cons.push(DatasetFactory.createConstraint('FOLDER_NAME', description, null, ConstraintType.MUST));
		cons.push(DatasetFactory.createConstraint('PARENT_FOLDER_CODE', parentId, null, ConstraintType.MUST));
		cons.push(DatasetFactory.createConstraint('GROUP_HIDDEN', grupo, null, ConstraintType.MUST));

		var dataset = DatasetFactory.getDataset('ds_create_folder', null, cons, null);

		if (dataset.values.length > 0) {
			idFolder = dataset.values[0]['FOLDER'];
		}
	}

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