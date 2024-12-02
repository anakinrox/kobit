	var markers = [];
	var map;
	var info_Window;
	
	function loadBody(){
		
		if( $('#loadPergunta').val() != 'S' ){
			loadPerguntas();
		}else{
			loadOptionPergunta();
		}
		
		trataLoja();
		
		FLUIGC.calendar('.data-fluig');
			
		loadDsCombo('showroom', 'selectTableMySql', 'role_code_atrib', 'description', 'dataBase,table', 'java:/jdbc/FluigDS,fluig_v_role_showroom_franquia', 'description', 'N' );
			
		setDetalhe();
		
	};
	
	function setDetalhe(){
		console.log('Entrei setGrupo');
		loadPaiFilhoCombo( "detalhe_prob", "probabilidade", "detalhe", "detalhe", "", "cod_probabilidade", $('#probabilidade').val() );
	}
	
	var beforeSendValidate = function(numState,nextState){
		
		if( !valida('.principal') ){
			alert("Existem campos obrigat&oacute;rios n&atilde;o informados.");
			return false;
		}
		
		if( $('#area').val() == ""  ){
			alert("Você deve informar a &aacute;rea destinada.");
			return false;
		}
		if( $('#area').val() == "S"
		  && ( $('#showroom').val() == "" )
		  && nextState != 5 ){
			alert("Você deve destinar a um Showroom.");
			return false;
		}
		
		if( nextState == 15 
			&& ( $('#oportunidade').val() == "N" 
			|| $('#motivo_perca').val() != "" ) ){
			
			alert("Para enviar para pool não pode ter motivo de perca ou não ter oportunidade gerada.");
			return false;
			
		}
		
		if( $('#area').val() == "V" && 	$('#matricula').val() == "" ){
			alert("Deve ser selecionado um vendedor.");
			return false;
		}
		
		
		if( nextState == 103 || nextState == 42 || nextState == 125 ){
			
			if( $('#oportunidade').val() == "" ){
				alert("Para finalizar o processo deve selecionar se gerou ou não oportunidade.");
				return false;
			}
			if( $('#oportunidade').val() == "N" && $('#motivo_perca').val() == "" ){
				alert("Para oportunidade não fechada, favor informar um motivo.");
				return false;
			}
			if( $('#oportunidade').val() == "S"  
				//&& ( $('#area').val() == "A" || $('#area').val() == "I" )
				&& ( $('#nome').val() == "" 
				  || $('#telefone1').val() == "" ) ){
					alert("Para oportunidade fechada, favor informar Nome e Telefone do Parceiro.");
					return false;
				}
			
		} 
		
		if( nextState != 15 ){
			if( ( numState == 59 || numState == 73 ) && $('#area').val() != 'V' ){
				alert("Para essa ação não pode ser trocado a área responsável.");
				return false;
			}else if( ( numState == 61 || numState == 71 ) && $('#area').val() != 'A' ){
				alert("Para essa ação não pode ser trocado a área responsável.");
				return false;
			}else if( ( numState == 63 || numState == 69 ) && $('#area').val() != 'I' ){
				alert("Para essa ação não pode ser trocado a área responsável.");
				return false;
			}else if( ( numState == 65 || numState == 67 ) && $('#area').val() != 'S' ){
				alert("Para essa ação não pode ser trocado a área responsável.");
				return false;
			}
		}
		
		if( ( nextState == 73 || nextState == 78 
		   || nextState == 71 || nextState == 75 
		   || nextState == 69 || nextState == 81 
		   || nextState == 67 || nextState == 84 )
		  && $('#data_prev_fup').val() == "" ){
			alert("Você deve informar uma data agenda.");
			return false;
		}
		
		if( ( nextState == 73 || nextState == 78 
		   || nextState == 71 || nextState == 75 
		   || nextState == 69 || nextState == 81 
		   || nextState == 67 || nextState == 84 
		   || nextState == 15 )
			  && $('#descricao').val() == "" ){
			alert("Você deve informar um historico.");
			return false;
		}
		console.log('antes id_person',$('#id_person').val());
		if( ( $('#id_person').val() == undefined || $('#id_person').val() == "" || $('#telefone1_valid').val() != $('#telefone1').val() ) && $('#telefone1').val() != "" ){
			console.log('antes constranntis');
			var constraints = new Array();
			constraints.push( DatasetFactory.createConstraint('area', $('#area').val(), null, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('phone', $('#telefone1').val(), null, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('name', $('#nome').val(), null, ConstraintType.MUST) );
			var person = DatasetFactory.getDataset("pipedrivePerson", null, constraints, null);
			console.log('person...',person);
			if( person.values.length > 0 ){
				alert( "Nome ou Telefone já cadastrato no PipeDrive e não relacionado a oportunidade" );
				return false;
			}else{
				$('#id_person').val("");
			}
		}
		console.log('cheguei no fim...');
		return true;
		
	}
	
	function limpa_respon(){
		
		$('#nome_usuario').val( "" );
		$('#matricula').val( "" );
		$('#tipo_usuario').val( "" );
		
		$('#showroom').val( "" );
		
	}
	
	function trataLoja(){
		console.log( "area.....", $('#area').val() );
		if( $('#area').val() == "S" ){
			$('.engenharia').hide();
			$('.parceiro').hide();		
			$('.showroom').show();
			$('.organizacao').hide();
		}else if( $('#area').val() == "E" ) {
			$('.showroom').hide();
			$('.parceiro').hide();
			$('.engenharia').show();
			$('.organizacao').hide();
		}else if( $('#area').val() == "A" || $('#area').val() == "I" || $('#area').val() == "V" || $('#area').val() == "J") {
			$('.showroom').hide();
			$('.engenharia').hide();
			$('.parceiro').show();
			if ( $('#area').val() != "V" ) {
				$('.organizacao').show();
			}
		}else{
			$('.showroom').hide();
			$('.engenharia').hide();
			$('.parceiro').hide();
			$('.organizacao').hide();
		}
	}
		
	function validaExistFone(id){
		if( $('#'+id).val() == "" ){
			return;
		}
		var cons = new Array();
		cons.push( DatasetFactory.createConstraint("telefone1", $('#'+id).val(), $('#'+id).val(), ConstraintType.MUST) );
		cons.push( DatasetFactory.createConstraint("processo", $('#processo').val(), $('#processo').val(), ConstraintType.MUST_NOT) );
		var ds = DatasetFactory.getDataset('parceiros', null, cons, null );
		console.log('DataSet',ds);
		if ( ds != null && ds.values.length > 0 ){
			alert('Telefone já cadastrado para parceiro '+ds.values[0].nome );
			return;
		}
		var cons = new Array();
		cons.push( DatasetFactory.createConstraint("telefone2", $('#'+id).val(), $('#'+id).val(), ConstraintType.MUST) );
		cons.push( DatasetFactory.createConstraint("processo", $('#processo').val(), $('#processo').val(), ConstraintType.MUST_NOT) );
		var ds = DatasetFactory.getDataset('parceiros', null, cons, null );
		console.log('DataSet',ds);
		if ( ds != null && ds.values.length > 0 ){
			alert('Telefone já cadastrado para parceiro '+ds.values[0].nome );
			return;
		}
		var cons = new Array();
		cons.push( DatasetFactory.createConstraint("telefone3", $('#'+id).val(), $('#'+id).val(), ConstraintType.MUST) );
		cons.push( DatasetFactory.createConstraint("processo", $('#processo').val(), $('#processo').val(), ConstraintType.MUST_NOT) );
		var ds = DatasetFactory.getDataset('parceiros', null, cons, null );
		console.log('DataSet',ds);
		if ( ds != null && ds.values.length > 0 ){
			alert('Telefone já cadastrado para parceiro '+ds.values[0].nome );
			return;
		}
	}
			
	function loadPerguntas() {
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("tipo_processo", 'I', 'I', ConstraintType.MUST ) );				
		var perguntas = DatasetFactory.getDataset("pergunta_qualificacao", null, constraints, null);
		if (perguntas != null) {
			for (var x = 0; x < perguntas.values.length; x++) {
				var row = perguntas.values[x];
				console.log(row);
				var seq = wdkAddChild('perguntas');
				$('#pergunta___' + seq).val( row.descricao_pergunta );
				$('#pergunta_documentid___' + seq).val(row.documentid);
				$('#pergunta_version___' + seq).val(row.version);											
				
				loadDsCombo( 'questao___'+seq, 
							 'pergunta_qualificacao', 
							 'sequencia', 
							 'opcao', 
							 'tablename,metadata#id,metadata#version', 
							 'opcoes,'+row.documentid+','+row.version,
						     'sequencia');
				$('#loadPergunta').val('S');
			}
		}
		console.log('SAIU AS PERGUNTAS');
		//loadOptionPergunta();
	}			
	
	function loadOptionPergunta(){
		$("input[name^='pergunta___']").each( function() {
			console.log('Item...', $(this).attr('name'));
			var seq = $(this).attr('name').split('___')[1];
			
			
			loadDsCombo( 'questao___'+seq, 
						 'pergunta_qualificacao', 
						 'sequencia', 
						 'opcao', 
						 'tablename,metadata#id,metadata#version,metadata#active', 
						 'opcoes,'+$('#pergunta_documentid___' + seq).val()+','+$('#pergunta_version___' + seq).val()+',true',
					     'sequencia');
		});
	}
