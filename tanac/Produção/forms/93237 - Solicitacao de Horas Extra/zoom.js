function zoom(componente) {
	
	if( bloqEditaForm ){
		return false;
	}
	
	if (componente == 'bt_solicitante'){
		if( $("input[name*=horas___]").length > 0 ){
			alert("Você somente pode trocar o solicitante se não existir colaborador selecionado.");
			return false;
		}
		modalzoom.open("Usuário",
				   "colleague", 
				   "login,Login,colleagueName,Nome", 
				   "login,colleagueName,colleaguePK.colleagueId", 
				   "active,true",
				   componente, false, 'default', null, null,
				   "colleagueName" );
	}
	
	if (componente == 'bt_empresa'){
		
		/*if( $( "input[name^=horas___]" ).length > 0 ){
			alert("Você somente pode trocar a empresa se não existir colaborador selecionado.");
			return false;
		}*/
		
		modalzoom.open("Empresa",
				   "rm_coligada", 
				   "CODCOLIGADA,Cod.,NOMEFANTASIA,Nome", 
				   "CODCOLIGADA,NOMEFANTASIA", 
				   "",
				   componente, false, 'default', null, null,
				   "NOMEFANTASIA" );
	}
	
	if (componente == 'bt_filial'){
			
		var filtroCPL = "";
		if( $("#CODCOLIGADA").val() != "" ){
			filtroCPL += "CODCOLIGADA,"+$("#CODCOLIGADA").val();
		}
		
		modalzoom.open("Filial",
				   "rm_filial", 
				   "CODCOLIGADAFILIAL,Cod.,NOMEFANTASIA,Nome", 
				   "CODCOLIGADA,CODFILIAL,CODCOLIGADAFILIAL,NOMEFANTASIA", 
				   ""+filtroCPL,
				   componente, false, 'default', null, null,
				   "NOMEFANTASIA" );
	}
	
	if (componente == 'bt_colaborador'){
		
		var filtroCPL = "";
		if( $("#CODCOLIGADA").val() != "" ){
			filtroCPL += ",CODCOLIGADA,"+$("#CODCOLIGADA").val();
		}
		if( $("#CODFILIAL").val() != "" ){
			filtroCPL += ",CODFILIAL,"+$("#CODFILIAL").val();
		}
		
		
		modalzoom.open("Colaborador",
				   "rm_func_nivel_chefia_imediata", 
				   "NOMEFANTASIA,Empresa,CHAPA,Matricula,NOME,Nome", 
				   "CHAPA,NOME,NOMEFANTASIA,NOMEEMPRESA,CODCOLIGADA,CODFILIAL", 
				   "CODCHEFE_N4,"+$("#matricula_gerente").val()+filtroCPL,
				   componente, false, 'default', null, null,
				   "NOME" );
	}
	
	if (componente == 'bt_user'){
		modalzoom.open("Usuário",
				   "colleague", 
				   "login,Login,colleagueName,Nome", 
				   "login,colleagueName,colleaguePK.colleagueId", 
				   "active,true",
				   componente, false, 'default', null, null,
				   "colleagueName" );
	}
	
	if (componente == 'bt_secao'){
		modalzoom.open("Cargo",
				   "selectTableSQLserver", 
				   "codigo,Código,descricao,Descrição", 
				   "codigo,descricao", 
				   "dataBase,java:/jdbc/APP_RM,table,PSECAO,LEN(codigo),16",
				   componente, false, 'default', null, null,
			       "codigo||'-'||descricao" );
	}
	
	if (componente == 'bt_grupo'){
		modalzoom.open("Grupo",
				   "grupo_solicitantes", 
				   "cod_grupo,Cod.,den_grupo,Descrição", 
				   "cod_grupo,den_grupo", 
				   "",
				   componente, false, 'default', null, null,
				   "den_grupo" );
	}

	if (componente == 'bt_coordenador'){
		modalzoom.open("Usuário",
				   "colleague", 
				   "login,Login,colleagueName,Nome", 
				   "login,colleagueName,colleaguePK.colleagueId", 
				   "active,true",
				   componente, false, 'default', null, null,
				   "colleagueName" );
	}
	
	if (componente == 'bt_gerente'){
		modalzoom.open("Usuário",
				   "colleague", 
				   "login,Login,colleagueName,Nome", 
				   "login,colleagueName,colleaguePK.colleagueId", 
				   "active,true",
				   componente, false, 'default', null, null,
				   "colleagueName" );
	}
	
	if (componente == 'bt_diretor'){
		modalzoom.open("Usuário",
				   "colleague", 
				   "login,Login,colleagueName,Nome", 
				   "login,colleagueName,colleaguePK.colleagueId", 
				   "active,true",
				   componente, false, 'default', null, null,
				   "colleagueName" );
	}
}

function setSelectedZoomItem(selectedItem) {
	
	if (selectedItem.type == "bt_colaborador") {
		var seq = wdkAddChild( 'colaboradores' );
		$('#matricula_colaborador___'+seq).val( selectedItem.CHAPA ) ;
		$('#nome_colaborador___'+seq).val( selectedItem.NOME ) ;
		
		$('#den_empresa___'+seq).val( selectedItem.NOMEFANTASIA ) ;
		$('#cod_empresa___'+seq).val( selectedItem.CODFILIAL ) ;
		$('#cod_coligada___'+seq).val( selectedItem.CODCOLIGADA ) ;
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( 'DFFUNCRACHA', "00000"+selectedItem.CHAPA, "00000"+selectedItem.CHAPA, ConstraintType.MUST) );
		var dataset = DatasetFactory.getDataset( 'SALDO_BANCO_HORAS', null, constraints, null);
		if( dataset.values.length > 0 ){
			$('#saldo___'+seq).val( formatDecimal( dataset.values[0]['SALDO_BANCO'], 2 ) ) ;
		}else{
			$('#saldo___'+seq).val( "0,00" ) ;
		}
		totalizar();
		setMask();
		autoSize();
	}

	if (selectedItem.type == "bt_empresa") {
		$('#NOME').val( selectedItem.NOMEFANTASIA ) ;
		$('#NOMEFANTASIA').val( "" ) ;
		$('#CODCOLIGADA').val( selectedItem.CODCOLIGADA ) ;
		$('#CODFILIAL').val( "" ) ;
		$('#CODCOLIGADAFILIAL').val( "" ) ;
	}
	
	if (selectedItem.type == "bt_filial") {
		$('#NOME').val( selectedItem.NOME ) ;
		$('#NOMEFANTASIA').val( selectedItem.NOMEFANTASIA ) ;
		$('#CODCOLIGADA').val( selectedItem.CODCOLIGADA ) ;
		$('#CODFILIAL').val( selectedItem.CODFILIAL ) ;
		$('#CODCOLIGADAFILIAL').val( selectedItem.CODCOLIGADAFILIAL ) ;
	}
	
	if (selectedItem.type == "bt_solicitante") {
		$('#login_solicitante').val( selectedItem.login ) ;
		$('#user_solicitante').val( selectedItem.colleagueId ) ;
		$('#nome_solicitante').val( selectedItem.colleagueName ) ;

		var ctRM = [];
		ctRM.push( DatasetFactory.createConstraint("user", selectedItem.colleagueId, selectedItem.colleagueId, ConstraintType.MUST) );
		var dsRM = DatasetFactory.getDataset("dsk_rm_usuario_chefia", null, ctRM, null);
		if (dsRM != null && dsRM.values.length > 0 ) {
			
			$('#user_solicitante').val( dsRM.values[0]["user_funcionario"] );
			$('#nome_solicitante').val( dsRM.values[0]["nome_funcionario"] );
			$('#login_solicitante').val( dsRM.values[0]["login_funcionario"] );
			$('#matricula_solicitante').val( dsRM.values[0]["matricula_funcionario"] );
			
			$('#nome_gerente').val( dsRM.values[0]["nome_gerente"] );
			$('#matricula_gerente').val( dsRM.values[0]["matricula_gerente"] );
			$('#login_gerente').val( dsRM.values[0]["login_gerente"] );
			$('#user_gerente').val( dsRM.values[0]["user_gerente"] );
			
			$('#nome_diretor').val( dsRM.values[0]["nome_diretor"] );
			$('#matricula_diretor').val( dsRM.values[0]["matricula_diretor"] );
			$('#login_diretor').val( dsRM.values[0]["login_diretor"] );
			$('#user_diretor').val( dsRM.values[0]["user_diretor"] );
			
			$('#nome_presidente').val( dsRM.values[0]["nome_presidente"] );
			$('#user_presidente').val( dsRM.values[0]["user_presidente"] );
			
		}
	
	}
	
	if (selectedItem.type == "bt_user") {
		   $('#login').val( selectedItem.login ) ;
		   $('#matricula').val( selectedItem.colleagueId ) ;
		   $('#nome_usuario').val( selectedItem.colleagueName ) ;

		   if ( $('#cod_secao').val() == ''){

				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint( 'LEN(codigo)', '16', '16', ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'table',  'PSECAO', 'PSECAO', ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint( 'dataBase', 'java:/jdbc/APP_RM', null, ConstraintType.MUST) );
				var dataset = DatasetFactory.getDataset( 'selectTableSQLserver', null, constraints, null);

				if (dataset != null && dataset != undefined){
					if (dataset.values.length > 0){
						$('#cod_secao').val( dataset.values[0]['codigo'] );
						$('#den_secao').val( dataset.values[0]['descricao'] );
					}
				}


		   }
	}
	if (selectedItem.type == "bt_secao") {
		   $('#cod_secao').val( selectedItem.codigo ) ;
		   $('#den_secao').val( selectedItem.descricao ) ;
	}
	if (selectedItem.type == "bt_grupo") {
		   $('#cod_grupo').val( selectedItem.cod_grupo ) ;
		   $('#den_grupo').val( selectedItem.den_grupo ) ;
	}

	if (selectedItem.type == "bt_coordenador") {
		$('#mat_coordenador').val( selectedItem.colleagueId ) ;
		$('#den_coordenador').val( selectedItem.colleagueName ) ;
	}
	if (selectedItem.type == "bt_gerente") {
			$('#mat_gerente').val( selectedItem.colleagueId ) ;
			$('#den_gerente').val( selectedItem.colleagueName ) ;
	}
	if (selectedItem.type == "bt_diretor") {
			$('#mat_diretor').val( selectedItem.colleagueId ) ;
			$('#den_diretor').val( selectedItem.colleagueName ) ;
	}
}

function openColabMassa(){
		
	if( bloqEditaForm ){
		return false;
	}
	
	var constraints = new Array();		
	constraints.push( DatasetFactory.createConstraint("CODCHEFE_N4", 	$("#matricula_gerente").val(), 	$("#matricula_gerente").val(), ConstraintType.MUST) );
	
	if( $("#CODCOLIGADA").val() != "" ){
		constraints.push( DatasetFactory.createConstraint("CODCOLIGADA", 	$("#CODCOLIGADA").val(), 		$("#CODCOLIGADA").val(), ConstraintType.MUST) );
	}
	if( $("#CODFILIAL").val() != "" ){
		constraints.push( DatasetFactory.createConstraint("CODFILIAL", 		$("#CODFILIAL").val(),			$("#CODFILIAL").val(), ConstraintType.MUST) );
	}
	var fields = new Array( 'CHAPA','NOME','NOMEFANTASIA','CODCOLIGADA','CODFILIAL' );
	var order = new Array( 'NOME' );
	var compon = DatasetFactory.getDataset("rm_func_nivel_chefia_imediata", fields, constraints, order);
	console.log('compon......',compon);

	var fields = [ 
	   {'field':'select',
		'titulo':'<input type="checkbox" id="checkAll" name="checkAll" class="form-control checkAll" \>',
		'type':'checkbox',
		'style':'margin-top:0px;padding-top: 0px;padding-bottom: 0px;',
		'class':'form-control checkItem',
		'livre':'',
		'width':'10%'},
	   {'field':'NOMEFANTASIA',
	    'titulo':'<input type="text" id="NOMEFANTASIA" name="NOMEFANTASIA" class="form-control filter" placeholder="Nome" \>',
	    'type':'text',
	    'style':'padding-top: 0px;padding-bottom: 0px;',
	    'class':'form-control',
	    'livre':'readonly="readonly"',
		'width':'20%'},
	   {'field':'CHAPA',
	    'titulo':'<input type="text" id="CHAPA" name="CHAPA" class="form-control filter" placeholder="Matricula" \>',
	    'type':'text',
	    'style':'padding-top: 0px;padding-bottom: 0px;',
	    'class':'form-control',
	    'livre':'readonly="readonly"',
	    //'precision':3,
	    'width':'10%'},
	   {'field':'NOME',
		'titulo':'<input type="text" id="NOME" name="NOME" class="form-control filter" placeholder="Nome" \>',
	    'type':'text',
	    'style':'padding-top: 0px;padding-bottom: 0px;',
	    'class':'form-control',
	    'livre':'readonly="readonly"',
	    //'precision':3,
		'width':'40%'},
	   {'field':'CODCOLIGADA',
		'titulo':'<input type="text" id="CODCOLIGADA" name="CODCOLIGADA" class="form-control filter" placeholder="Nome" \>',
		'type':'text',
		'style':'',
		'class':'',
		'livre':'',
		'width':'0'},
	   {'field':'CODFILIAL',
		'titulo':'<input type="text" id="CODFILIAL" name="CODFILIAL" class="form-control filter" placeholder="Nome" \>',
	    'type':'text',
	    'style':'',
	    'class':'',
	    'livre':'',
		'width':'0'}
	   ];
	
		modalTable( 'openColabMassa', 'Colaboradores', fields, compon.values, 'large', 'openColabMassa', 'N' );
	}

function returnModalTable( retorno ){
	console.log('retorno.....', retorno.id, retorno);
	var lista = retorno.idChave.split('___')[0].split('_')[2];

	if( retorno.id == 'openColabMassa' ){
		
		
		var html = ' <div class="row"> '+
					'	<div class="col-sm-4"> '+
					'	 	<label for="titulo">Data De</label> '+
					'		<input type="text" class="form-control data-fluig" name="data_de_modal" id="data_de_modal" /> '+
					'	</div> '+
					'	<div class="col-sm-4"> '+
					'	 	<label for="titulo">Data Ate</label> '+
					'		<input type="text" class="form-control data-fluig" name="data_ate_modal" id="data_ate_modal" /> '+
					'	</div> '+
					'	<div class="col-sm-4"> '+
					'	 	<label for="titulo">Horas</label> '+
					'		<input type="text" class="form-control decimal-2" name="horas_modal" id="horas_modal" /> '+
					'	</div> '+
					'</div>';
		
		var valoresPadroes = FLUIGC.modal({
		    title: 'Valores Padrões',
		    content: html,
		    id: 'fluig-modal',
		    actions: [{
		        'label': 'Salvar',
		        'bind': 'data-confirma-modal',
		    },{
		        'label': 'Cancelar',
		        'autoClose': true
		    }]
		}, function(err, data) {
		    if(err) {
		        // do error handling
		    } else {
		        // do something with data
		    	setMask();
		    	$('#fluig-modal').on('click', '[data-confirma-modal]', function(ev) {
		
		    		for( var i = 0; i < retorno.dados.length; i++ ){
		    			if( retorno.dados[i].select == 'S' ){
		    				var seq = wdkAddChild( 'colaboradores' );
		    				$('#matricula_colaborador___'+seq).val( retorno.dados[i].CHAPA ) ;
		    				$('#nome_colaborador___'+seq).val( retorno.dados[i].NOME ) ;
		    				
		    				$('#den_empresa___'+seq).val( retorno.dados[i].NOMEFANTASIA ) ;
		    				$('#cod_empresa___'+seq).val( retorno.dados[i].CODFILIAL ) ;
		    				$('#cod_coligada___'+seq).val( retorno.dados[i].CODCOLIGADA ) ;
		    				
		    				$('#data_de___'+seq).val( $('#data_de_modal').val() ) ;
		    				$('#data_ate___'+seq).val( $('#data_ate_modal').val() ) ;
		    				$('#horas___'+seq).val( $('#horas_modal').val() ) ;
		    				var constraints = new Array();
		    				constraints.push( DatasetFactory.createConstraint( 'DFFUNCRACHA', "00000"+retorno.dados[i].CHAPA, "00000"+retorno.dados[i].CHAPA, ConstraintType.MUST) );
		    				var dataset = DatasetFactory.getDataset( 'SALDO_BANCO_HORAS', null, constraints, null);
		    				if( dataset.values.length > 0 ){
		    					$('#saldo___'+seq).val( formatDecimal( dataset.values[0]['SALDO_BANCO'], 2 ) ) ;
		    				}else{
		    					$('#saldo___'+seq).val( "0,00" ) ;
		    				}
		    			}
		    		}		

		    		totalizar();
		    		setMask();
		    		autoSize();
		    		valoresPadroes.remove();
		    		
		    	});
		    }
		});
						
		return true;
	}
}
