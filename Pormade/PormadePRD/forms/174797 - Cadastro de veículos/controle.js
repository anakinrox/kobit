var editForm = true;

function loadBody(){

	console.log('loadBody');
	
	loadDsCombo( 'empresa', 'selectTable', 'mtc_id', 'mtc_nome', 'dataBase,table,banco,mtc_proprietario_motorista', 'java:/jdbc/LogixDS,ptv_motorista_cadastro_mtc,informix,P', 'mtc_nome', 'S','N')
	
	setMask();
				
}

var beforeSendValidate = function(numState,nextState){
	
	var task = $('#task').val();

	// if (task == 4 || task == 0){
	// 	if ( $('#motorista').val() == '' ){
	// 		alert('Motorista não informados');
	// 		return false;
	// 	}
	// }

	return true;
	
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