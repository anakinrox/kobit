
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
				
	var readOnly = $("#cnpj_cpf").attr('readonly');
	if( readOnly == undefined ){
		readOnly = false;
	}
	
	if (componente == 'bt_cnpj_cpf'
		&& (valor == null
			|| (valor != null && !readOnly && validaCpfCnpj2( $('#cnpj_cpf').val()) ) )) {

		var filtroCPL = '';
		var largura = "default";
		if (valor != null && valor != undefined) {
			var exp = /\.|\-|\//g;
			filtroCPL = ',cnpj_cpf,' + valor.toString().replace(exp, "");
			largura = 'none';
		}

		if ($('#tipo_cadastro').val() != "") {
			// filtroCPL += ',tipo_cadastro,' + $('#tipo_cadastro').val();
			filtroCPL += ',___int___id_grupo,' + $('#tipo_cadastro :selected').attr('cod_sis');
		// } else {
			// filtroCPL += ',___in___tipo_cadastro,A|I';
		}

		modalzoom.open("Pessoa",
			"selectTable",
			"cnpj_cpf,CPF/CNPJ,nome_razao,Nome,cidade_uf,Cidade",
			"id,fisico_juridico,nome_razao,cnpj_cpf,cpf_cnpj_flt,email,fone1,tipo_fone1,fone2,tipo_fone2,fone3,tipo_fone3,fone4,tipo_fone4,data_cadastro,ativo,logradouro,numero,bairro,cep,cod_cidade,cidade,uf,cidade_uf,id_banco,nr_agencia,nr_agencia_digito,tp_conta,nr_conta,nr_conta_digito,tp_operacao,ds_titular,nr_documento,tipo_pessoa,pc_comissao,nr_cupom,cau,id_patrocinador,patrocinador,contatos,site,ie_rg,tipo_cadastro,status,id_banco,banco,cod_banco,id_tipo_endereco,cod_uf,cod_pais,id_grupo",
			"dataBase,java:/jdbc/CRMDS,table,fluig_v_pessoa,banco,postgresql,sqlLimit,250,ativo,true" + filtroCPL,
			componente, false, largura, null, null,
			"cnpj_cpf||'-'||nome_razao||'-'||cidade_uf");
	}
		

	if( componente == 'bt_cid' || componente == 'bt_cid_arq' ){
					
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
				
	if( componente == 'bt_pat'  ){
				
		var filtroCPL = '';
		var largura = "default";
		if ( valor != null && valor != undefined ){
			filtroCPL = ',cast(id as char(5)),'+valor;
			largura = 'none';
		}
				
		modalzoom.open("Patrocinador",
					   "selectTable", 
					   "nome_razao,Nome", 
					   "id,nome_razao", 
					   "dataBase,java:/jdbc/CRMDS,table,fluig_v_patrocinador,banco,postgresql,sqlLimit,250"+filtroCPL,
					   componente, false, largura, null, null,
				       "nome_razao" );
	}

	if( componente == 'bt_banco' ){
		
		modalzoom.open("Banco",
					   "selectTable", 
					   "codigo,Codigo,banco,Banco", 
					   "id,codigo,banco", 
					   "dataBase,java:/jdbc/CRMDS,table,online.pon_bancos,banco,postgresql,sqlLimit,250",
					   componente, false, largura, null, null,
				       "codigo||'-'||banco" );
	}

	if( componente == 'bt_user_respon' ){

		// var sql =   "select ps.cnpj_cpf, ps.nome_razao from online.pon_pessoa ps "+
		// 			"join online.pon_pessoa_patrocinador pt on (ps.id = pt.id_pessoa) "+
		// 			"where pt.ativo = 'true' ";

		// var ct = new Array();
		// ct.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
		// ct.push( DatasetFactory.createConstraint('sql', 	 sql, null, ConstraintType.MUST) );
		// var ds = DatasetFactory.getDataset('select', null, ct, null );

		var filtroCPL = '';
		if ( $("#tipo_cadastro").val() == "A" ){
			filtroCPL = ',___in______not___id_grupo,32|45';
		}else if ( $("#tipo_cadastro").val() == "I" ){
			filtroCPL = ',___in______not___id_grupo,32|45';
		}else if ( $("#tipo_cadastro").val() == "S" ){
			filtroCPL = ',___in___id_grupo,32';
		}else if ( $("#tipo_cadastro").val() == "V" ){
			filtroCPL = ',___in___id_grupo,45';
		}else if ( $("#tipo_cadastro").val() == "C" ){
			filtroCPL = ',___in______not___id_grupo,32|45';
		}

		modalzoom.open("Resposável",
				   "selectTable", 
				   "cnpj_cpf,Matricula,nome_razao,Resposavel", 
				   "cnpj_cpf,nome_razao,email", 
				   "dataBase,java:/jdbc/CRMDS,table,fluig_v_patrocinador,banco,postgresql,sqlLimit,250"+filtroCPL,
				   componente, false, "default", null, null,
			       "nome_razao" );
	}
	
	
	if( componente == 'bt_user_visita' ){
		
		var largura = "default";
		var filtroCPL = "";
		if( $('#tipo_cadastro').val() == '' ){
			return false;
		}else if( $('#tipo_cadastro').val() == 'A' ){
			filtroCPL = ",GROUP_ROLE_CODE,especificador";
		}else if( $('#tipo_cadastro').val() == 'I' ){
			filtroCPL = ",GROUP_ROLE_CODE,palestrante";
		}
		
		modalzoom.open("Usuario",
				   "selectTableMySql", 
				   "FULL_NAME,Nome,USER_CODE,Codigo", 
				   "FULL_NAME,USER_CODE", 
				   "dataBase,java:/jdbc/FluigDS,table,fuig_v_user_group_role,sqlLimit,250,___not___USER_CODE,null"+filtroCPL,
				   componente, false, largura, null, null,
			       "FULL_NAME" );	
	}
	
	if( componente == 'bt_add_palestra' ){
		var bloqueio = false;
		if( $('#nome').val() == "" ){
			FLUIGC.toast({
		        title: 'Nome.',
		        message: 'Para Vincular a uma palestra deve ser informado o nome.',
		        type: 'warning'
		    });
			bloqueio = true;
		}
		if( $('#telefone1').val() == "" && $('#email').val() == "" ){
			FLUIGC.toast({
		        title: 'Nome.',
		        message: 'Para Vincular a uma palestra deve ser informado um meio de contato (Telefone ou E-Mail).',
		        type: 'warning'
		    });
			bloqueio = true;
		}		
		if( bloqueio ){
			return false;
		}
		modalzoom.open("Palestra",
				   "selectTableMySql", 
				   "cidade,Cidade,local_palestra,Local,assunto,Assunto,data_palestra,Data", 
				   "num_proces,documentid,den_status_processo,cidade,local_palestra,palestrante,assunto,data_palestra", 
				   "dataBase,java:/jdbc/FluigDS,table,fluig_v_palestra_visita_aberta",
				   componente, false, "default", null, null,
			       "cidade" );			
	}

	if( componente == 'bt_add_viagem' ){
		var bloqueio = false;
		if( $('#nome').val() == "" ){
			FLUIGC.toast({
		        title: 'Nome.',
		        message: 'Para Vincular a uma viagem deve ser informado o nome.',
		        type: 'warning'
		    });
			bloqueio = true;
		}
		if( $('#telefone1').val() == "" && $('#email').val() == "" ){
			FLUIGC.toast({
		        title: 'Nome.',
		        message: 'Para Vincular a uma viagem deve ser informado um meio de contato (Telefone ou E-Mail).',
		        type: 'warning'
		    });
			bloqueio = true;
		}		
		if( bloqueio ){
			return false;
		}
		modalzoom.open("Palestra",
				   "selectTableMySql", 
				   "cidade,Cidade,evento,Evento,data_visita,Data", 
				   "num_proces,documentid,den_status_processo,cidade,evento,assunto,data_visita", 
				   "dataBase,java:/jdbc/FluigDS,table,fluig_v_viagem_aberta",
				   componente, false, "default", null, null,
			       "cidade" );			
	}
	
	if( componente == 'bt_cupon' ){

		if ($('#cupon').val() != '' ){
			FLUIGC.toast({
		        title: 'Atenção.',
		        message: 'Cupom já preenchido!',
		        type: 'warning'
		    });

			return false;
		}
		
		if( $('#task').val() != 20 || $('#cupon').val() != "" ){
			alert('Atividade inválida para informar cupom');
			return false;
		}
		
		var tipo = $('#tipo_cadastro :selected').attr('cod_sis')
		// if ( $('#tipo_cadastro').val() == "A" ){
		// 	tipo = 11;
		// }else if ( $('#tipo_cadastro').val() == "I" ){
		// 	tipo = 26;
		// }else if ( $('#tipo_cadastro').val() == "S" ){
		// 	tipo = 27;
		// }else if ( $('#tipo_cadastro').val() == "V" ){
		// 	tipo = 38;
		// }
		if( tipo == 0 ) return false;
		var sql = "select online.fn_gerar_cupom_parceiro("+ tipo +") as cupon;"
	    var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('sql', sql, null, ConstraintType.MUST) );
		var dataSet = DatasetFactory.getDataset("select", null, constraints, null);
	    if( dataSet != null && dataSet.values.length > 0 ){
	    	$('#cupon').val( dataSet.values[0].cupon ); 
	    }
	}

	if ( componente == 'bt_origem' ){
		modalzoom.open("Origem",
			"selectTable",
			"origem_negocio,Origem",
			"id,origem_negocio",
			"dataBase,java:/jdbc/CRMDS,table,online.pon_origem_negocio,banco,postgresql,sqlLimit,250,ativo,true",
			componente, false, largura, null, null,
			"id||'-'||origem_negocio");
	}

	if ( componente == 'bt_destino' ){
		modalzoom.open("Destino",
			"destino_parceiros",
			"destino,Destino",
			"destino,cod_resp_destino",
			"",
			componente, false, largura, null, null,
			"destino");
	}

	if ( componente == 'bt_org' ){
		modalzoom.open("Organização PipeDrive",
			"pipedriveOrganizations",
			"id,ID,name,Nome",
			"id,name",
			"area,PP,nome,"+$('#nome').val(),
			componente, false, largura, null, null,
			"name");
	}

	if ( componente == 'bt_person' ){
		var filtroCPL = '';

		if ( $('#fisico_juridico').val() == 'J'){
			// filtroCPL = ',phone,'+ $('#telefone_pessoa').val() +',name,'+ $('#pessoa_contato').val() ;
			filtroCPL = ',phone,'+ $('#telefone_pessoa').val() ;
			// + ',org_id,' + $('#id_org').val();
		} else {
			// filtroCPL = ',phone,'+ $('#telefone1').val() +',name,'+ $('#nome').val() ;
			filtroCPL = ',phone,'+ $('#telefone1').val() ;
		}
	
		modalzoom.open("Pessoa PipeDrive",
			"pipedrivePerson",
			"id,ID,name,Nome,phone,Telefone",
			"id,name,phone",
			"area,PP"+filtroCPL,
			componente, false, largura, null, null,
			"name");
	}

	if ( componente == 'bt_call_center' ){
		modalzoom.open("Call Center",
				   "selectTable", 
				   "codigo_colaborador,Código,nome_colaborador,Nome", 
				   "codigo_colaborador,nome_colaborador,email", 
				   "dataBase,java:/jdbc/CRMDS,table,online.vw_pon_colaboradores,banco,postgresql,sqlLimit,250,status,true,grupo_colaborador,CALL CENTER",
				   componente, false, "default", null, null,
			       "nome_colaborador" );
	}
	
}
			
function setSelectedZoomItem(selectedItem) {
	console.log('selectedItem.type',selectedItem.type);
	console.log('selectedItem',selectedItem);
	if ( selectedItem.type == 'bt_cnpj_cpf' ) {
		console.log('selectedItem.id...',selectedItem.id);
		if ( selectedItem.id != undefined && selectedItem.id != null && selectedItem.id != "" ){

			var camposSiS = true;
			// var SQL =   "select pat.nr_cupom "+
			// 			"from online.pon_pessoa_arquiteto pat "+
			// 			"join online.pon_pessoa pe on (pe.id = pat.id_pessoa ) "+
			// 			"where  pe.cnpj_cpf = '"+selectedItem.cnpj_cpf+"' "+
			// 			" and pat.ativo = 'true' ";

			var SQL = 	"select  "+
						"	p.id, pt.nr_cupom,  "+
						"	e.id as idendereco,  "+
						"	t.id as idtelefone,  "+
						"	m.id as idemail, "+
						"	pt.id_patrocinador IS NOT NULL AS sponsor, "+
						"	pt.id_patrocinador             AS usuario_responsavel, "+
						"	pc.id_grupo                AS sponsorGroupId, "+
						"	pc.pc_comissao             AS sponsorBonus, "+
						"	pt.utiliza_rpa, "+
						"	pt.ativo "+
						"FROM online.pon_pessoa p "+
						"JOIN online.pon_pessoa_arquiteto pt ON (pt.id_pessoa = p.id) "+
						"JOIN online.pon_grupo_pessoa gp on (pt.id_grupo = gp.id) "+
						"LEFT JOIN online.pon_pessoa_endereco e ON (e.id_pessoa = p.id) AND (e.principal = true)  "+
						"LEFT JOIN online.pon_pessoa_telefone t ON (t.id_pessoa = p.id) AND (t.principal = true) "+
						"LEFT JOIN online.pon_pessoa_email m ON (m.id_pessoa = p.id) AND (m.principal = true) "+
						// "LEFT JOIN online.pon_pessoa_patrocinador pc ON (pc.id_pessoa = p.id) "+
						"LEFT JOIN online.pon_pessoa_patrocinador pc ON (pc.id = pt.id_patrocinador)  "+
						"WHERE "+
						"	p.cnpj_cpf = '"+selectedItem.cnpj_cpf+"' ";

			console.log(SQL);
			var constraints = new Array();
			constraints.push( DatasetFactory.createConstraint('SQL' , SQL, null, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('DATABASE' , 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
			var datasetSIS = DatasetFactory.getDataset('select', null, constraints, null );

			if ( datasetSIS != null && datasetSIS != undefined ){

				// if (datasetSIS.values[0]["nr_cupom"] != ""){
				// 	alert('Parceiro já cadastrado :' + datasetSIS.values[0]['nr_cupom']);
				// 	$('#cnpj_cpf').val('');
				// 	return false;
				// }

				if (datasetSIS.values.length > 0){

					$('#altera').val('S');
					$('#id_pessoa').val( datasetSIS.values[0]['id'] );
					$('#cupon').val( datasetSIS.values[0]['nr_cupom'] );
					$('#idendereco').val( datasetSIS.values[0]['idendereco'] );
					$('#idtelefone').val( datasetSIS.values[0]['idtelefone'] );
					$('#idemail').val( datasetSIS.values[0]['idemail'] );
					// $('#sponsor').val( datasetSIS.values[0]['sponsor'] );
					$('#sponsor').val( 'false' );
					$('#usuario_responsavel').val( datasetSIS.values[0]['usuario_responsavel'] );
					$('#sponsorGroupId').val( datasetSIS.values[0]['sponsorgroupid'] );
					$('#sponsorBonus').val( datasetSIS.values[0]['sponsorbonus'] );
					$('#utiliza_rpa').val( datasetSIS.values[0]['utiliza_rpa'] );
					$('#ativo').val( datasetSIS.values[0]['ativo'] );

					alert('Parceiro já cadastrado :' + datasetSIS.values[0]['nr_cupom'] + ' os dados serão atualizados!');
					camposSiS = false;
				}
				
			}

			if ( camposSiS ) {
				// $('#cnpj_cpf').unmask();
				$('#cnpj_cpf').val( selectedItem.cnpj_cpf );
				$('#id_pessoa').val( selectedItem.id );
				$('#nome').val( selectedItem.nome_razao );
				$('#contato').val( selectedItem.contatos );
				$('#tipo_cadastro').val( selectedItem.id );
				$('#status_cadastro').val( selectedItem.status );
				$('#fisico_juridico').val( selectedItem.fisico_juridico );
				$('#rg_ie').val( selectedItem.ie_rg );
				$('#email').val( selectedItem.email );
				$('#telefone1').val( selectedItem.fone1 );
				$('#telefone2').val( selectedItem.fone2 );
				$('#telefone3').val( selectedItem.fone3 );
				// $('#nom_patrocinador').val( selectedItem.patrocinador );
				$('#id_patrocinador').val( selectedItem.id_patrocinador );
				
				//$('#data_nascimento').val( selectedItem.id );
				$('#tipo_endereco').val( selectedItem.id_tipo_endereco );
				
				$('#endereco').val( selectedItem.logradouro );
				$('#numero').val( selectedItem.numero );
				$('#cep').val( selectedItem.cep );
				$('#den_cidade_uf').val( selectedItem.cidade_uf );
				$('#den_cidade').val( selectedItem.cidade );
				$('#uf').val( selectedItem.uf ); 
				$('#cod_uf').val( selectedItem.cod_uf );
				$('#cod_pais').val( selectedItem.cod_pais );
				$('#cod_cidade').val( selectedItem.cod_cidade );
				$('#bairro').val( selectedItem.bairro );
				$('#site').val( selectedItem.site );
				$('#cupon').val( selectedItem.nr_cupom );
				$('#comissao').val( selectedItem.pc_comissao );
				$('#cpf_cnpj_titular').val( selectedItem.nr_documento );
				$('#nome_titular').val( selectedItem.ds_titular );
				$('#tipo_pessoa').val( selectedItem.tipo_cadastro );
				$('#tipo_cadastro').val( selectedItem.tipo_cadastro );
				
				$('#id_banco').val( selectedItem.cod_banco );
				$('#banco').val( selectedItem.banco );
				$('#agencia').val( selectedItem.nr_agencia );
				$('#agencia_dig').val( selectedItem.nr_agencia_digito );
				$('#conta').val( selectedItem.nr_conta );
				$('#conta_dig').val( selectedItem.nr_conta_digito );
				$('#operacao').val( selectedItem.tp_operacao );
				$('#tipo_pessoa').val( selectedItem.tipo_pessoa );
				
				// setMarcaraCpfCnpj('cnpj_cpf','fisico_juridico', false);
				// setMarcaraCpfCnpj('cpf_cnpj_titular','tipo_pessoa', false);
				// dinMakCpfCnpj('cnpj_cpf', 'fisico_juridico');
				// $('#cnpj_cpf').unmask();
				if ( $('#fisico_juridico').val() == 'F' ){
					
					var mask = '000.000.000-009';
					$('#fisico_juridico').val('F');
					if( $('#sis_integracao').val() == 2 ) $('#area').val('PP');
					$($('#rg_ie').parent().children()[0]).html('RG');
					$($('#nome').parent().children()[0]).html('Nome&nbsp;<b style="color:red">*</b>');
					$($('#email').parent().children()[0]).html('E-mail&nbsp;<b style="color:red">*</b>');
					$($('#telefone1').parent().children()[0]).html('Telefone&nbsp;<b style="color:red">*</b>');
					// $('#num_cau_crea').removeAttr('readonly');
					// $('#num_cau_crea').attr('valida','true');
					$('.juridico').hide();
				} else {
					var mask = '00.000.000/0000-00';
					if( $('#sis_integracao').val() == 2 ) $('#area').val('PO');
					$($('#rg_ie').parent().children()[0]).html('IE');
					$($('#nome').parent().children()[0]).html('Razão Social&nbsp;<b style="color:red">*</b>');
					$($('#email').parent().children()[0]).html('E-mail da Empresa&nbsp;<b style="color:red">*</b>');
					$($('#telefone1').parent().children()[0]).html('Telefone da Empresa&nbsp;<b style="color:red">*</b>');
					// $('#num_cau_crea').attr('readonly','readonly');
					// $('#num_cau_crea').removeAttr('valida');
					$('.juridico').show();
				}

				var CpfCnpjMaskBehavior = function (val) {

					if ( val.replace(/\D/g, '').length <= 11 ){
						var retorno = '000.000.000-009';
						$('#fisico_juridico').val('F');
						$('#area').val('PP');
						$($('#rg_ie').parent().children()[0]).html('RG');
						$($('#nome').parent().children()[0]).html('Nome&nbsp;<b style="color:red">*</b>');
						$($('#email').parent().children()[0]).html('E-mail&nbsp;<b style="color:red">*</b>');
						$($('#telefone1').parent().children()[0]).html('Telefone&nbsp;<b style="color:red">*</b>');
						// $('#num_cau_crea').removeAttr('readonly');
						// $('#num_cau_crea').attr('valida','true');
						$('.juridico').hide();
					} else { 
						var retorno = '00.000.000/0000-00';
						$('#fisico_juridico').val('J');
						$('#area').val('PO');
						$($('#rg_ie').parent().children()[0]).html('IE');
						$($('#nome').parent().children()[0]).html('Razão Social&nbsp;<b style="color:red">*</b>');
						$($('#email').parent().children()[0]).html('E-mail da Empresa&nbsp;<b style="color:red">*</b>');
						$($('#telefone1').parent().children()[0]).html('Telefone da Empresa&nbsp;<b style="color:red">*</b>');
						// $('#num_cau_crea').attr('readonly','readonly');
						// $('#num_cau_crea').removeAttr('valida');
						$('.juridico').show();
					}
					return retorno;
				},
				
				cpfCnpjpOptions = {
					onKeyPress: function(val, e, field, options) {
					field.mask(CpfCnpjMaskBehavior.apply({}, arguments), options);
					}
				};

				$('#cnpj_cpf').mask(mask, cpfCnpjpOptions);

				
	//						
	//			$('#codigo_arq').val( selectedItem.id );
	//			setMarcaraCpfCnpj('cnpj_arq', 'fisico_juridico_arq', false);
	//			$('#operacao_arq').attr('readonly',true);						
	//			$('#operacao_arq option:not(:selected)').prop('disabled', true);
	//			$('#alt_arq').val('S');
			}
			
		} else {
			valor =  $('#fisico_juridico').val();
            campo = $('#cnpj_cpf').val();
            
			if( valor == 'J' ){

                campo = $('#cnpj_cpf').val().replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

                carrega_cnpj(campo);
            }
		}
	}
											
	if ( selectedItem.type == 'bt_cid' ) {
		$('#den_cidade_uf').val( selectedItem.cidade.trim()+"/"+selectedItem.uf ) ;
		$('#den_cidade').val( selectedItem.cidade ) ;
		$('#id_cidade').val( selectedItem.id ) ;
		$('#uf').val( selectedItem.uf ) ;
		
		$('#cod_uf').val( selectedItem.cod_uf ) ;
		$('#cod_pais').val( selectedItem.cod_pais ) ;
		$('#cod_cidade').val( selectedItem.id ) ;

	}

	/* if ( selectedItem.type == 'bt_pat' ) {
		$('#nom_patrocinador').val( selectedItem.nome_razao ) ;
		$('#id_patrocinador').val( selectedItem.id ) ;					
	} */

	if ( selectedItem.type == 'bt_banco' ) {
		$('#banco').val( selectedItem.banco ) ;
		$('#id_banco').val( selectedItem.codigo ) ;					
	}
	
	if (selectedItem.type == "bt_user_respon") {

		if ( $('#solicitou_orcamento').val() == 'S' ){
			var constraints = new Array();
			constraints.push( DatasetFactory.createConstraint('area', $("#area").val(), null, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('email', selectedItem.email, null, ConstraintType.MUST) );
			var pipedriveUser = DatasetFactory.getDataset("pipedriveUser", null, constraints, null);
			
			if( pipedriveUser == null || pipedriveUser.values.length == 0 ){
				alert("Email não cadastrado no pipeDrive.");
				// return false;
			}else{
				$('#id_user_pipedrive').val( pipedriveUser.values[0]["id"] );
				$('#nome_user_pipedrive').val( pipedriveUser.values[0]["name"] );
			}
		}

		$('#cod_usuario_respon').val( selectedItem.cnpj_cpf.replace(/\D/g, '') );
		$('#usuario_respon').val( selectedItem.nome_razao );

	}	
	 	
	if (selectedItem.type == "bt_user_visita") {
		$('#cod_usuario_visita').val( selectedItem.USER_CODE );
		$('#usuario_visita').val( selectedItem.FULL_NAME );
	}	
	
	if (selectedItem.type == "bt_add_palestra") {
		
	    var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( 'documentId', selectedItem.documentid, selectedItem.documentid, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'nome_pessoa___999999', $('#nome').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cnpj_cpf_pessoa___999999', $('#cnpj_cpf').val().replace('.','').replace('.','').replace('.','').replace('/','').replace('-',''), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'rg_ie_pesssoa___999999', $('#rg_ie').val(), 'field', ConstraintType.MUST) );
		
		constraints.push( DatasetFactory.createConstraint( 'id_pessoa___999999', $('#id_pessoa').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'fone_pessoa___999999', $('#telefone1').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'email_pessoa___999999', $('#email').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'proc_novo___999999', $('#processo').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cidade_pessoa___999999', $('#den_cidade_uf').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cod_cidade_pessoa___999999', $('#cod_cidade').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'den_cidade_pessoa___999999', $('#den_cidade').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'uf_pessoa___999999', $('#uf').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cod_uf_pessoa___999999', $('#cod_uf').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cod_pais_pessoa___999999', $('#cod_pais').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'fisico_juridico___999999', $('#fisico_juridico').val(), 'field', ConstraintType.MUST) );
		
		DatasetFactory.getDataset( 'processo_movimento', null, constraints, null);
		
		consulta();
	}

	if (selectedItem.type == "bt_add_viagem") {
		
	    var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint( 'documentId', selectedItem.documentid, selectedItem.documentid, ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'nome_pessoa___999999', $('#nome').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cnpj_cpf_pessoa___999999', $('#cnpj_cpf').val().replace('.','').replace('.','').replace('.','').replace('/','').replace('-',''), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'rg_ie_pesssoa___999999', $('#rg_ie').val(), 'field', ConstraintType.MUST) );
		
		constraints.push( DatasetFactory.createConstraint( 'id_pessoa___999999', $('#id_pessoa').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'fone_pessoa___999999', $('#telefone1').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'email_pessoa___999999', $('#email').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'proc_novo___999999', $('#processo').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cidade_pessoa___999999', $('#den_cidade_uf').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cod_cidade_pessoa___999999', $('#cod_cidade').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'den_cidade_pessoa___999999', $('#den_cidade').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'uf_pessoa___999999', $('#uf').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cod_uf_pessoa___999999', $('#cod_uf').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'cod_pais_pessoa___999999', $('#cod_pais').val(), 'field', ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint( 'fisico_juridico___999999', $('#fisico_juridico').val(), 'field', ConstraintType.MUST) );
		
		DatasetFactory.getDataset( 'processo_movimento', null, constraints, null);
		
		consulta();
	}

	if ( selectedItem.type == 'bt_origem'){

		$('#origem').val( selectedItem.origem_negocio );
		$('#cod_origem').val( selectedItem.id );

	}

	if ( selectedItem.type == 'bt_destino'){

		$('#destino').val( selectedItem.destino );
		$('#cod_destino').val( selectedItem.cod_resp_destino );

	}

	if ( selectedItem.type == 'bt_org' ){
		$('#id_org').val( selectedItem.id );
	}

	if ( selectedItem.type == 'bt_person' ){
		$('#id_person').val( selectedItem.id );
	}

	if ( selectedItem.type == 'bt_call_center' ){
		$('#cod_call_center').val( selectedItem.codigo_colaborador );
		$('#nome_call_center').val( selectedItem.nome_colaborador );
	}
	
}
			
			
function setProfissao(){
	console.log('Entrei setProfissao');
	$('#especialidade').val('');
	$('#cod_especialidade').val('');
//	loadPaiFilhoCombo( "especialidade", "profissao", "detalhe", "detalhe", "", "cod_profissao", $('#profissao').val() );
}
			
function setDetalhe(){
	console.log('Entrei setDetalhe');
	loadPaiFilhoCombo( "detalhe_prob", "probabilidade", "detalhe", "detalhe", "", "cod_probabilidade", $('#probabilidade').val() );
}
			

function loadPaiFilhoCombo( combo, dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue ){
	
	console.log('loadPaiFilhoCombo', combo, dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue  );

	var constraintsPai = new Array();
	var lstFilter = fildFilter.split(',');
	var lstFilterValue = fildFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
			constraintsPai.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var datasetPai = DatasetFactory.getDataset(dataSet, null, constraintsPai, null );
	console.log('datasetPai.....',datasetPai);
	
	if( datasetPai != undefined && datasetPai != null ){
		var pais = datasetPai.values;
		for ( var y in pais ) {
			var pai = pais[y];
			
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
			
			var orderFilhos = new Array();
			orderFilhos.push( fieldCodigo );						
			var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				var valDefault = $("#"+combo).val();
				$("#"+combo+" option").remove();
				var filhos = datasetFilhos.values;
				console.log('DataSet',datasetFilhos);
				console.log('DataSet',filhos);
				//$("#empresa").append("<option value='' ></option>");
				for ( var i in filhos ) {
					console.log('Linha DataSet.....',i);
					var filho = filhos[i];
					var den = '';					
					if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
						continue;
					} 
					if ( fieldDesc == '' ){
						den = filho[ fieldCodigo ];
					}else{
						if ( tipo_despesas[ filho[ fieldCodigo ] ]['tipo_despesa'] != undefined 
							&& tipo_despesas[ filho[ fieldCodigo ] ]['tipo_despesa'] != null ){
							den = tipo_despesas[ filho[ fieldCodigo ] ]['tipo_despesa'];
						}else{
							den = filho[ fieldDesc ];
						}
					}
					$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
				}
				$("#"+combo).val( valDefault );
			}
		}
	}
}

function getOptCombo( combo ){
	
	var optArray = new Array();
	$("#"+combo+" option").each(function () {
		optArray.push( $(this).val() );
	});
	return optArray;
}


function openEspecialidade(id){
	var constraints = new Array();		
	var fields = new Array( 'cod_servico','den_servico' );
	var order = new Array( 'cod_servico' );
	var compon = getDsPaiFilho( "profissao", "detalhe", "detalhe", "", "cod_profissao", $('#profissao').val() );
	console.log('compon......',compon);
	var fields = [ {'field':'select',
		'titulo':'Sel.',
		'type':'checkbox',
		'style':'margin-top:0px;padding-top: 0px;padding-bottom: 0px;',
		'class':'form-control',
		'livre':'',
		'width':'10%'},
	   {'field':'detalhe',
	    'titulo':'Especialidade',
	    'type':'text',
	    'style':'padding-top: 0px;padding-bottom: 0px;',
	    'class':'form-control',
	    'livre':'readonly="readonly"',
	    //'precision':3,
		'width':'90%'} ];

	if( $('#cod_especialidade' ).val() != "" ){
		var lsEspecialidade = $('#cod_especialidade').val().split(',');
		console.log('lsEspecialidade.......',lsEspecialidade);
		for( var j = 0; j < compon.values.length; j++ ){
			console.log('j.....',j);
			if( $.inArray( compon.values[j].detalhe, lsEspecialidade ) >= 0 ){
				compon.values[j]['select'] = 'S';
			}else{
				compon.values[j]['select'] = 'N';
			}
		}
		console.log('compon.values.......',compon.values);
	}
	console.log('antes_modal....');
	modalTable( 'espec', 'Especialidade', fields, compon.values, 'large', id, 'N' );
}

		 
function returnModalTable( retorno ){
	console.log('retorno.....', retorno.id, retorno);
	if( retorno.id == 'espec' ){
		var itens = [];
		for( var i = 0; i < retorno.dados.length; i++ ){
			if( retorno.dados[i].select == 'S' ){
				itens.push(retorno.dados[i].detalhe);
			}
		}
		$('#cod_especialidade' ).val( itens );
		$('#especialidade' ).val( itens.join(' - ') );
		autoSize();
		return true;
	}
}
//getDsPaiFilho( "profissao", "detalhe", "detalhe", "", "cod_profissao", $('#profissao').val() );
function getDsPaiFilho( dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue ){
	
	console.log( dataSet, table, fieldCodigo, fieldDesc, fildFilter, fildFilterValue  );

	var constraintsPai = new Array();
	var lstFilter = fildFilter.split(',');
	var lstFilterValue = fildFilterValue.split(',');
	for ( var j = 0; j < lstFilter.length; j ++ ){
		console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
		if ( lstFilter[j] != '' && lstFilter[j] != null ){
			constraintsPai.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
		}
	}
	var datasetPai = DatasetFactory.getDataset(dataSet, null, constraintsPai, null );
	
	if( datasetPai != undefined && datasetPai != null ){
		var pais = datasetPai.values;
		for ( var y in pais ) {
			var pai = pais[y];
			
			var constraintsFilhos = new Array();
			constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", pai.documentid, pai.documentid, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", pai.version, pai.version, ConstraintType.MUST) );
			constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );
			
			var orderFilhos = new Array();
			orderFilhos.push( fieldCodigo );						
			var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
			console.log('DataSet',datasetFilhos);
			if ( datasetFilhos != null ){
				return datasetFilhos;
			}
		}
	}
	return null;
}


function validaExistEmail(id){
	console.log('processo',$('#processo').val(),$('#'+id).val() );
	if( $('#'+id).val() == "" ){
		return;
	}
	var cons = new Array();
	cons.push( DatasetFactory.createConstraint("email", $('#'+id).val(), $('#'+id).val(), ConstraintType.MUST) );
	cons.push( DatasetFactory.createConstraint("processo", $('#processo').val(), $('#processo').val(), ConstraintType.MUST_NOT) );
	var ds = DatasetFactory.getDataset('parceiros', null, cons, null );
	console.log('DataSet',ds);
	if ( ds != null && ds.values.length > 0 ){
		alert('E-Mail já cadastrado para parceiro '+ds.values[0].nome );
	}
}

function validaExistFone(id){
	if ( $('#altera').val() ){}
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


function loadDsCombo( combo, 
	dataSet, 
	fieldCodigo, 
	fieldDesc, 
	fieldFilter, 
	fieldFilterValue,
	fieldOrder,
	printCod ){

console.log( 'Passo 001 tipo', $('#'+combo).is('select') );

if( !$('#'+combo).is('select') ){
return false;
}

if( printCod == undefined ){
printCod = 'S';
}

var constraintsFilhos = new Array();
var lstFilter = fieldFilter.split(',');
var lstFilterValue = fieldFilterValue.split(',');
for ( var j = 0; j < lstFilter.length; j ++ ){
console.log( 'Passo 00X',lstFilter[j],lstFilterValue[j] );
if ( lstFilter[j] != '' && lstFilter[j] != null ){
constraintsFilhos.push( DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST) );
}
}
var orderFilhos = new Array();
var lstOrder = fieldOrder.split(',');
for ( var j = 0; j < lstOrder.length; j ++ ){
orderFilhos.push( lstOrder[j] );
}	
var fieldFilhos = new Array(fieldCodigo, fieldDesc);
var datasetFilhos = DatasetFactory.getDataset(dataSet, fieldFilhos, constraintsFilhos, orderFilhos );

if ( datasetFilhos != null ){
var valDefault = "";
if ( $("#"+combo).val() != "" && $("#"+combo).val() != null && $("#"+combo).val() != undefined ){
valDefault = $("#"+combo).val();
}

$("#"+combo+" option").remove();
$("#"+combo).append("<option value='' ></option>");
var filhos = datasetFilhos.values;
for ( var i in filhos ) {
var filho = filhos[i];
var den = '';

if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
  continue;
} 
if ( fieldDesc == '' ){
den = filho[ fieldCodigo ];
}else{
if( printCod == 'S' ){
  den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
}else{
  den = filho[ fieldDesc ];
}
}
$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
}
console.log('valDefault.......',valDefault);
if ( valDefault != '' ){
$("#"+combo).val( valDefault );
}
}		
}