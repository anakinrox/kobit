			
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
				
				if( componente == 'bt_matricula' ){

					var filtroCPL = '';
					var largura = "default";
					if ( valor != null && valor != undefined ){
						filtroCPL = ',numcad,'+valor;
						largura = 'none';
					}
					console.log('Antes user');
					if ($('#user_abert').val() != undefined && $('#user_abert').val() != "" ){
						var constraints = new Array();
						constraints.push( DatasetFactory.createConstraint( 'dataSet', 'centro_de_custo', null, ConstraintType.MUST) );
						constraints.push( DatasetFactory.createConstraint( 'table', 'aprov_entrada_saida', null, ConstraintType.MUST) );
						constraints.push( DatasetFactory.createConstraint( 'filho_matricula', $('#user_abert').val(), $('#user_abert').val(), ConstraintType.MUST) );
						var dataset = DatasetFactory.getDataset( 'selectPaiFilho', null, constraints, null);		
						console.log('Result....',dataset);
						if ( dataset == null || dataset.values.length == 0 ){
							filtroCPL = ',numcad,'+$('#user_abert').val();
						}else{
							var cc = '';
							for (var x = 0; x < dataset.values.length; x++) {
								var reg = dataset.values[x];
								if( cc == ''){
									cc = reg['cod_cc'];  
								}else{
									cc += '|'+reg['cod_cc'];
								}
							}
							filtroCPL += ',___in___codccu,'+cc;
						}
						console.log('FiltroCPL....',filtroCPL);
					}
										
					modalzoom.open("Funcionario",
							   "selectTableSQLserver", 
							   "numcad,Matricula,nomfun,Funcionario", 
							   "numcad,nomfun,codccu,nomccu", 
							   "dataBase,java:/jdbc/SeniorDS,table,fluig_v_funcionario,sqlLimit,250"+filtroCPL,
							   componente, false, largura, null, null,
						       "CONCAT( numcad, CAST( nomfun as varchar(20) ) )" );
				}
				
				
				if( componente == 'bt_cpf' && ( idCampoTexto == undefined || idCampoTexto == null || validaCPF( idCampoTexto ) ) ){
					
					var filtroCPL = '';
					var largura = "default";
					if ( valor != null && valor != undefined ){
						filtroCPL = ',cpf,'+valor;
						largura = 'none';
					}
					
					modalzoom.open("Pessoa",
							   "pessoa", 
							   "cpf,CPF,nome,Nome,empresa_reduz,Empresa", 
							   "cpf,nome,cnpj,codigo,empresa,empresa_reduz,rg,emissor,telefone,celular,tipo", 
							   "sqlLimit,250"+filtroCPL,
							   componente, true, largura, null, null,
						       "cpf||'-'||nome" );
					
				}

				
				if( componente == 'bt_aprov' ){
					
					var filtroCPL = '';
					var largura = "default";
					console.log('valor......',valor);
					if ( valor != null && valor != undefined ){
						filtroCPL = ',pai_cod_cc,'+valor;
						largura = 'more';
					}
					console.log('filtroCPL......',filtroCPL);
					
					modalzoom.open("Aprovador",
							   "paiFilho", 
							   "matricula,Matricula,aprovador,Aprovador", 
							   "matricula,aprovador", 
							   "dataSet,centro_de_custo,table,aprov_entrada_saida,sqlLimit,250"+filtroCPL,
							   componente, false, largura, null, null,
						       "aprovador" );
				}
				
				if( componente == 'bt_cnpj' && ( idCampoTexto == undefined || idCampoTexto == null || validaCNPJ( idCampoTexto ) ) ){
					
					
					if ( $('#tipo').val == 'C' ){
	
						var filtroCPL = '';
						var largura = "default";
						if ( valor != null && valor != undefined ){
							filtroCPL = ',num_cgc_cpf,'+valor;
							largura = 'none';
						}
						
						modalzoom.open("Cliente",
								   "selectTable", 
								   "num_cgc_cpf,CNPJ,nom_cliente,Cliente", 
								   "num_cgc_cpf,nom_cliente,cod_cliente,nom_reduzido", 
								   "dataBase,java:/jdbc/LogixDS,table,clientes,sqlLimit,250,ies_situacao,A"+filtroCPL,
								   componente, true, largura, null, null,
							       "num_cgc_cpf||'-'||cod_cliente||'-'||nom_cliente" );
						
					}
						
						
					if ( $('#tipo').val != 'C' ){
						
						var filtroCPL = '';
						var largura = "default";
						if ( valor != null && valor != undefined ){
							filtroCPL = ',num_cgc_cpf,'+valor;
							largura = 'none';
						}
						
						modalzoom.open("Fornecedor",
								   "selectTable", 
								   "num_cgc_cpf,CNPJ,raz_social,Fornecedor", 
								   "num_cgc_cpf,raz_social,cod_fornecedor,raz_social_reduz", 
								   "dataBase,java:/jdbc/LogixDS,table,fornecedor,sqlLimit,250,ies_fornec_ativo,A"+filtroCPL,
								   componente, true, largura, null, null,
							       "num_cgc_cpf||'-'||cod_fornecedor||'-'||raz_social" );
						
					}
				}	
			}
			
			function setSelectedZoomItem(selectedItem) {

				if ( selectedItem.type == 'bt_cnpj' && $('#tipo').val == 'C' ) {
						$('#cnpj').val( selectedItem.num_cgc_cpf ) ;
						$('#codigo').val( selectedItem.cod_cliente ) ;
						$('#empresa').val( selectedItem.nom_cliente ) ;
						$('#empresa_reduz').val( selectedItem.nom_reduzido ) ;
				}				
				
				if ( selectedItem.type == 'bt_cnpj' && $('#tipo').val != 'C' ) {
						$('#cnpj').val( selectedItem.num_cgc_cpf ) ;
						$('#codigo').val( selectedItem.cod_fornecedor ) ;
						$('#empresa').val( selectedItem.raz_social ) ;
						$('#empresa_reduz').val( selectedItem.raz_social_reduz ) ;
				}

				if ( selectedItem.type == 'bt_cpf' ) {
						$('#cpf').val( selectedItem.cpf ) ;
						$('#nome').val( selectedItem.nome ) ;
						$('#cnpj').val( selectedItem.cnpj ) ;
						$('#codigo').val( selectedItem.codigo ) ;
						$('#empresa').val( selectedItem.empresa ) ;
						$('#empresa_reduz').val( selectedItem.empresa_reduz ) ;
						$('#rg').val( selectedItem.rg ) ;
						$('#emissor').val( selectedItem.emissor ) ;
						$('#telefone').val( selectedItem.telefone ) ;
						$('#celular').val( selectedItem.celular ) ;
						$('#tipo').val( selectedItem.tipo ) ;
				}
				
				
				if ( selectedItem.type == 'bt_matricula' ) {
						$('#matricula').val( selectedItem.numcad ) ;
						$('#nome_funcionario').val( selectedItem.nomfun ) ;
						$('#cod_cc').val( selectedItem.codccu ) ;
						$('#den_cc').val( selectedItem.nomccu ) ;

						$('#matricula_super').val( '' ) ;
						$('#nome_super').val( '' ) ;
					    zoom( 'bt_aprov', 'cod_cc' );

				}
				
				if ( selectedItem.type == 'bt_aprov' ) {
					$('#matricula_super').val( selectedItem.matricula ) ;
					$('#nome_super').val( selectedItem.aprovador ) ;
				
					if ($('#matricula_super').val() == undefined 
							|| $('#matricula_super').val() == null 
							|| $('#matricula_super').val() == "" ){
						$('#tipo_aprov').val( 'N' );
						$('#aprovado').val( 'N' );
					}else if ( $('#matricula_super').val() == $('#matricula').val()
							|| $('#matricula_super').val() == $('#user_abert').val() ){
						$('#tipo_aprov').val( 'P' );
						$('#aprovado').val( 'S' );
						
					}else{
						$('#tipo_aprov').val( 'A' );
						$('#aprovado').val( 'N' );
					}
				}
				
			}
			
			