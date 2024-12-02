
function zoom(componente, idCampoTexto) {
				
	console.log('Componente.....'+componente);
	var valor = null;
	console.log('Quee coisa....',idCampoTexto);
	if ( idCampoTexto != null & idCampoTexto != undefined ){
		valor = $('#'+idCampoTexto).val();
		console.log('VALOR....',valor);
		if (valor == ''){
			return false;
		}
		if (idCampoTexto.split('___')[1] != null && idCampoTexto.split('___')[1] != undefined ){
			componente += '___'+idCampoTexto.split('___')[1];
		}
	}
				
		
	if( componente == 'bt_parceiro' ){
					
		modalzoom.open("Pessoa",
					   "selectTable", 
					   "cnpj_cpf,CPF/CNPJ,nome_razao,Nome,cidade_uf,Cidade,nr_cupom,Cupon", 
					   "id,nome_razao,fone1,nr_cupom,cnpj_cpf,cidade_uf", 
					   "dataBase,java:/jdbc/CRMDS,table,fluig_v_pessoa,banco,postgresql,sqlLimit,250,ativo,true",
					   componente, true, "default", null, null,
				       "cnpj_cpf||'-'||nome_razao||'-'||nr_cupom||'-'||cidade_uf" );
	}
		
	
	if( componente == 'bt_usuario' ){
		console.log('area.....'+$("#area").val());
		
		if( $("#area").val() == "S" ){ 
	
			modalzoom.open("Pessoa",
						   "selectTableMySql", 
						   "user_code,Codigo,full_name,Nome", 
						   "user_code,full_name", 
						   "dataBase,java:/jdbc/FluigDS,table,fluig_v_user_group_role,sqlLimit,250,origem,ROLE,group_role_code,"+$("#showroom").val().split(':')[2],
						   componente, false, "default", null, null,
					       "user_code||'-'||full_name" );
			
		}else{
		
			var tipo_usuario = $('#area').val();
			if( $('#area').val() == 'A' ){
				tipo_usuario = 'VA';
			}else if( $('#area').val() == 'I' ){
				tipo_usuario = 'VI';
			}else if( $('#area').val() == 'J' ){
				tipo_usuario = 'VJ';
			}
			
			modalzoom.open("Usuario",
							"usuario_comercial", 
							"matricula,Matrcula,nome_usuario,Nome", 
							"matricula,nome_usuario,matricula,nome_gestor_venda,gestor_venda,tipo_usuario", 
							"sqlLimit,250,tipo_usuario,"+tipo_usuario,
							componente, false, 'default', null, null,
						    "nome_usuario" );
		}
	}
	
	if( componente == 'bt_fone_pipe_drive' ){
	
		modalzoom.open("Pipedrive Pessoa",
				"pipedrivePerson", 
				"name,Nome,phone,Telefone,email,E-Mail,org_name,Organização", 
				"", 
				"phone,"+$('#telefone1').val()+",name,"+$('#nome').val()+",area,"+$('#area').val(),
				'pipedrivePerson', false, 'full', null, null,
			    "name", true );
		
	}

	if( componente == 'bt_fone_pipe_drive_org' ){
	
		modalzoom.open("Pipedrive Organização",
				"pipedrivePerson", 
				"name,Nome,phone,Telefone,email,E-Mail,org_name,Organização", 
				"", 
				"phone,"+$('#tel_organizacao').val()+",name,"+$('#nome_organizacao').val()+",area,"+$('#area').val(),
				'pipedrivePerson', false, 'full', null, null,
			    "name", true );
		
	}
	
	if( componente == 'bt_cid' ){
		
		var filtroCPL = '';
		var largura = "default";
		if ( valor != null && valor != undefined ){
			filtroCPL = ',cast(id as char(5)),'+valor;
			largura = 'none';
		}
				
		modalzoom.open("Cidades",
					   "selectTable", 
					   "cidade,Cidade,uf,UF,pais,Pais", 
					   "cod_erp,id,cidade,cod_uf,uf,nome,cod_pais,pais", 
					   "dataBase,java:/jdbc/CRMDS,table,fluig_v_cidade,banco,postgresql,sqlLimit,250"+filtroCPL,
					   componente, true, largura, null, null,
				       "uf||'-'||cidade" );
				
	}

}
			
function setSelectedZoomItem(selectedItem) {
	
	console.log('selectedItem',selectedItem);
	
	if ( selectedItem.type == 'bt_parceiro' ) {
		$('#id_pessoa').val( selectedItem.id );
		$('#nome').val( selectedItem.nome_razao );
		$('#telefone1').val( selectedItem.fone1 );
		$('#cupom').val( selectedItem.nr_cupom );
	}
	
	if ( selectedItem.type == 'bt_usuario' ) {
		
		if( $("#area").val() == "S" ){ 
			$('#nome_usuario').val( selectedItem.full_name );
			$('#matricula').val( selectedItem.user_code );
			$('#tipo_usuario').val( "X" );
		}else{
			$('#nome_usuario').val( selectedItem.nome_usuario );
			$('#matricula').val( selectedItem.matricula );
			$('#tipo_usuario').val( selectedItem.tipo_usuario );			
		}
	}
		
	if( selectedItem.type == "pipedrivePerson" ){
		
		if( selectedItem["new"] ){
			$('#id_person').val( '-1' );
		}else{
			$('#id_person').val( selectedItem["id"] );
		}
		$('#telefone1_valid').val( $('#telefone1').val() );
		
	}
	
	if ( selectedItem.type == 'bt_cid' ) {
		$('#den_cidade_uf').val( selectedItem.cidade.trim()+"/"+selectedItem.uf ) ;
		$('#cidade').val( selectedItem.cidade ) ;
		$('#id_cidade').val( selectedItem.id ) ;
		$('#uf').val( selectedItem.uf ) ;
		
		$('#cod_uf').val( selectedItem.cod_uf ) ;
		$('#cod_pais').val( selectedItem.cod_pais ) ;
		$('#cod_cidade').val( selectedItem.id ) ;

	}


}

function loadUserShowroom(){
	
	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/FluigDS', null, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint('table', 'fluig_v_user_group_role', null, ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint('origem', 'ROLE', 'ROLE', ConstraintType.MUST) );
	constraints.push( DatasetFactory.createConstraint('group_role_code', $("#showroom").val().split(':')[2], $("#showroom").val().split(':')[2], ConstraintType.MUST) );
	var dsUser = DatasetFactory.getDataset("selectTableMySql", ['user_code','full_name'], constraints, null);
	console.log('compon......',dsUser);
	
	if( dsUser != null && dsUser.values.length > 0 ){
		
		var row = Math.floor(Math.random() * dsUser.values.length ); 
		
		$('#nome_usuario').val( dsUser.values[ row ]['full_name'] ) ;
		$('#matricula').val( dsUser.values[ row ]['user_code'] ) ;
		$('#tipo_usuario').val( 'X' );
		
	}
	

	
}
	
function openPerson(){
	
	var fone = $('#telefone1').val();
/*	var constraints = new Array();
	constraints.push( DatasetFactory.createConstraint('phone', fone, fone, ConstraintType.MUST) );
	var compon = DatasetFactory.getDataset("pipedrivePerson", null, constraints, null);
	console.log('compon......',compon);
*/	
	var par = parent.$('#send-modal').parent();
	parent.$('#send-modal').hide();
	modalzoom.open("Pipedrive Pessoa",
					"pipedrivePerson", 
					"name,Nome,phone,Telefone,email,E-Mail,org_name,Organização", 
					"", 
					"phone,"+fone+",area,"+$('#area').val(),
					'pipedrivePerson', false, 'full', null, null,
				    "name", true );
	//console.log(par);
	//$('#modal-zoom-pipedrivePerson').parent( par );
	$('#modal-zoom-pipedrivePerson').appendTo( par );
	/*
	var fields = [ {'field':'select',
		'titulo':'Sel.',
		'type':'checkbox',
		'style':'margin-top:0px;padding-top: 0px;padding-bottom: 0px;',
		'class':'form-control',
		'livre':'',
		'width':'10%'},
	   {'field':'name',
	    'titulo':'Nome',
	    'type':'text',
	    'style':'padding-top: 0px;padding-bottom: 0px;',
	    'class':'form-control',
	    'livre':'readonly="readonly"',
	    //'precision':3,
	    'width':'40%'},
	   {'field':'phone',
	    'titulo':'Fone',
	    'type':'text',
	    'style':'padding-top: 0px;padding-bottom: 0px;',
	    'class':'form-control',
	    'livre':'readonly="readonly"',
	    //'precision':3,
		'width':'20%'},
	   {'field':'email',
		'titulo':'E-Mail',
		'type':'text',
		'style':'padding-top: 0px;padding-bottom: 0px;',
		'class':'form-control',
		'livre':'readonly="readonly"',
		//'precision':3,
		'width':'40%'},
	   {'field':'org_name',
		'titulo':'Organização',
		'type':'text',
		'style':'padding-top: 0px;padding-bottom: 0px;',
		'class':'form-control',
		'livre':'readonly="readonly"',
		//'precision':3,
		'width':'20%'},
	   {'field':'id',
		'titulo':'ID',
		'type':'text',
		'style':'display:none;padding-top: 0px;padding-bottom: 0px;',
		'class':'form-control',
		'livre':'readonly="readonly"',
		//'precision':3,
		'width':'0%'},
	   {'field':'org_id',
		'titulo':'ID Org',
		'type':'text',
		'style':'display:none;padding-top: 0px;padding-bottom: 0px;',
		'class':'form-control',
		'livre':'readonly="readonly"',
		//'precision':3,
		'width':'0%'}
		
	    ];
	
	console.log('fields......',fields);
	modalTable( 'pipedrivePerson', 'Pipedrive Pessoa', fields, compon.values, 'full', 'pipedrivePerson', 'N' );
	*/
}

