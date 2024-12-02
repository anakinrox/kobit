			
			//busca informações do dataset
			//o type é o nome do componente do html
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
				
				if( $('#task').val() == 0 
					|| $('#task').val() == 1 
					|| $('#task').val() == 30 
					|| $('#task').val() == 11
					|| ( ['104','87'].indexOf( $('#task').val() ) >= 0 && componente == 'bt_user_orcamento' ) 
					|| ( ['7','114'].indexOf( $('#task').val() ) >= 0 && componente == 'bt_user_eng_apli' )
					|| ( $('#task').val() == 7 && componente == 'bt_user_orcamento' && $('#ies_setor').val() == 'A' ) 
					|| ( $('#task').val() == 104 && componente == 'bt_user_eng_apli' && $('#ies_setor').val() == 'O' )
					|| ( ['29','30'].indexOf( $('#task').val() ) >= 0 && componente == 'elabora_proposta' )
					|| ( ['29','33','127'].indexOf( $('#task').val() ) >= 0 && componente == 'bt_user_env_proposta' ) ){
					
					if( componente == 'bt_user_orcamento'
					 ||	componente == 'bt_user_eng_ext'  
					 ||	componente == 'bt_user_eng_apli'  
					 || componente == 'bt_user_proposta'
					 || componente == 'bt_user_env_proposta'  ){
						
						var largura = "default";
						var filtroCPL = "";
						
						if( componente == 'bt_user_orcamento' )
							filtroCPL += ',GROUP_ROLE_CODE,orcamento_hw';
						if( componente == 'bt_user_eng_apli' )
							filtroCPL += ',GROUP_ROLE_CODE,engenharia_aplicacao_hw';
						if( componente == 'bt_user_eng_ext' )
							filtroCPL += ',GROUP_ROLE_CODE,engenharia_externa_hw';			
						if( componente == 'bt_user_proposta' )
							filtroCPL += ',GROUP_ROLE_CODE,elabora_proposta_hw';
						if( componente == 'bt_user_env_proposta' )
							filtroCPL += ',GROUP_ROLE_CODE,envia_proposta_hw';					
						
						modalzoom.open("Usuario",
								   "selectTableMySql", 
								   "FULL_NAME,Nome,USER_CODE,Codigo", 
								   "USER_CODE,FULL_NAME", 
								   "dataBase,java:/jdbc/FluigDS,table,fuig_v_user_group_role,sqlLimit,250"+filtroCPL,
								   componente, false, largura, null, null,
							       "FULL_NAME" );										
					}
					
					if( componente == 'bt_cnpj'  ){
						
						var filtroCPL = '';
						var largura = "default";
						if ( valor != null && valor != undefined ){
							filtroCPL = ',num_cgc_cpf,'+valor;
							largura = 'none';
						}
						
					
					//	parent.$('#workflowview-header').hide();
						
						modalzoom.open("Cliente",
								   "selectTable", 
								   "num_cgc_cpf,CNPJ,nom_cliente,Cliente,den_cidade_uf,Cidade", 
								   "num_cgc_cpf,nom_cliente,cod_cliente,nom_reduzido,den_cidade_uf", 
								   "dataBase,java:/jdbc/LogixDS,table,fluig_v_cliente_compl,sqlLimit,250,ies_situacao,A"+filtroCPL,
								   componente, true, largura, null, null,
							       "num_cgc_cpf||'-'||cod_cliente||'-'||nom_cliente" );
						
					}
				}

				
	   			if ( componente.split('___')[0] == 'bt_item'){
					
					var loadClear = true;
					ctr_est = 'ies_ctr_estoque,S';
								
					var filtroCPL = '';
					var largura = "default";
					if ( valor != null && valor != undefined ){
						filtroCPL += ',cod_item,'+valor;
						largura = 'none';
						console.log( 'filtroCPL....',filtroCPL );
					}
														
					modalzoom.open("Item",
								   "selectTable", 
								   "cod_item,C&oacutedigo,den_item,Item", 
								   "cod_item,den_item,den_item_reduz,cod_unid_med,gru_ctr_desp,den_gru_ctr_desp,cod_tip_despesa,nom_tip_despesa,num_conta,den_conta", 
								   //"dataBase,java:/jdbc/LogixDS,table,fluig_v_item,sqlLimit,250,___not___ies_tip_item,P,___not___ies_tip_item,F,___not___ies_tip_item,T,cod_empresa,"+ $('#empresa').val()+","+ctr_est,
								   "dataBase,java:/jdbc/LogixDS,table,fluig_v_item_com,sqlLimit,250,cod_empresa,02,"+ctr_est+filtroCPL,
								   componente, loadClear, largura, null, null,
								    "cod_item||'-'||den_item" ); 
				}
				
					
					
			}
			
			function setSelectedZoomItem(selectedItem) {
				
				if( selectedItem.type == 'bt_user_orcamento' ){
					$('#user_orcamento').val( selectedItem.USER_CODE ) ;
					$('#nome_user_orcamento').val( selectedItem.FULL_NAME ) ;
				}
				
				if( selectedItem.type == 'bt_user_eng_apli' ){
					$('#user_eng_apli').val( selectedItem.USER_CODE ) ;
					$('#nome_user_eng_apli').val( selectedItem.FULL_NAME ) ;
				}
				
				if( selectedItem.type == 'bt_user_eng_ext' ){
					$('#user_eng_ext').val( selectedItem.USER_CODE ) ;
					$('#nome_user_eng_ext').val( selectedItem.FULL_NAME ) ;
				}
				
				if( selectedItem.type == 'bt_user_proposta' ){
					$('#user_proposta').val( selectedItem.USER_CODE ) ;
					$('#nome_user_proposta').val( selectedItem.FULL_NAME ) ;
				}
				
				if( selectedItem.type == 'bt_user_env_proposta' ){
					$('#user_env_proposta').val( selectedItem.USER_CODE ) ;
					$('#nome_user_env_proposta').val( selectedItem.FULL_NAME ) ;
					
					$('#user_env_proposta_fup').val( selectedItem.USER_CODE ) ;
					$('#nome_user_env_proposta_fup').val( selectedItem.FULL_NAME ) ;
				}					
				
				if ( selectedItem.type == 'bt_cnpj' ) {
						$('#cnpj').val( selectedItem.num_cgc_cpf ) ;
						$('#codigo').val( selectedItem.cod_cliente ) ;
						$('#empresa').val( selectedItem.nom_cliente ) ;
						$('#empresa_reduz').val( selectedItem.nom_reduzido ) ;
						$('#cidade').val( selectedItem.den_cidade_uf ) ;
						
						setDescricao();
						
				}

				var seq = selectedItem.type.split('___')[1];
				
				if ( selectedItem.type.split('___')[0] == 'bt_item' ) {
					
					$('#cod_item_busca___'+seq).val( selectedItem.cod_item ) ;
					$('#den_item_reduz___'+seq).val( selectedItem.den_item_reduz ) ;
					
					$('#den_item___'+seq).val( selectedItem.den_item ) ;
					$('#cod_grp_desp___'+seq).val( selectedItem.gru_ctr_desp ) ;
					$('#den_grp_desp___'+seq).val( selectedItem.den_gru_ctr_desp ) ;
					$('#cod_unid_med___'+seq).val( selectedItem.cod_unid_med ) ;
					$('#cod_tipo_desp___'+seq).val( selectedItem.cod_tip_despesa ) ;
					$('#den_tipo_desp___'+seq).val( selectedItem.nom_tip_despesa ) ;
					$('#num_conta_item___'+seq).val( selectedItem.num_conta ) ;
					
					if ( selectedItem.size != 'none' ){
						$('#cod_item___'+seq).val( selectedItem.cod_item ) ;							
					}else if( selectedItem.cod_item == "" ){
						FLUIGC.toast({
								title: 'Busca: ',
								message: 'Item n&atilde;o localizado!',
								type: 'warning',
								timeout: 'fast'
						});
						$('#cod_item___'+seq).focus();
					}
				}

				
				
			}
			
			