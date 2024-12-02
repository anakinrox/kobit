			
			function getFiltroLista( campoBase ){
				
				var filtro = '-';
				$( "input[name*="+campoBase+"___]" ).each(function( index ) {
					if ( filtro == '-' )
						filtro = $(this).val()+'-';
					else
						filtro += $(this).val()+'-';
				}); 
				if ( filtro == '-' ){
					$( "hidden[name*="+campoBase+"___]" ).each(function( index ) {
						if ( filtro == '-' )
							filtro = $(this).val()+'-';
						else
							filtro += $(this).val()+'-';
					}); 	
				}
				return filtro;	
			}

			//busca informações do dataset
			//o type é o nome do componente do html
			function zoom(componente, idCampoTexto) {
				console.log('Componente.....'+componente);
				if( componente == 'bt_aprov_entr_saida' ){
						modalzoom.open("Aprovador",
								   "colleague", 
								   "colleagueId,Matricula,colleagueName,Aprovador", 
								   "colleagueId,colleagueName", 
								   "",
								   componente, false, "default", null, null,
							       "colleagueName" );		
				}

				if( componente == 'bt_resp_garantia' ){
					modalzoom.open("Resposável Garantia",
							   "colleague", 
							   "colleagueId,Matricula,colleagueName,Aprovador", 
							   "colleagueId,colleagueName", 
							   "",
							   componente, false, "default", null, null,
						       "colleagueName" );		
				}
				
				if( componente == 'bt_cc' ){
					
					modalzoom.open("Centro de Custo",
							   	"selectTable", 
							   	"cod_cent_cust,Codigo,nom_cent_cust,Centro de Custo", 
							   	"distinct,cod_cent_cust,nom_cent_cust,cod_uni_funcio,den_uni_funcio", 
							   	"dataBase,java:/jdbc/LogixDS,table,fluig_v_cc_uf,sqlLimit,250,ies_cod_versao,0,cod_empresa,01",
							   	componente, false, "default", null, null,
								"cod_cent_cust||'-'||nom_cent_cust" );
				}				
			}
			
			function setSelectedZoomItem(selectedItem) {

				if ( selectedItem.type == 'bt_aprov_entr_saida' ) {
						var row = wdkAddChild('aprov_entrada_saida'); 
						$('#matricula___'+row).val( selectedItem.colleagueId ) ;
						$('#aprovador___'+row).val( selectedItem.colleagueName ) ;
				}

				if ( selectedItem.type == 'bt_cc' ) { 
					$('#cod_cc').val( selectedItem.cod_cent_cust ) ;
					$('#den_cc').val( selectedItem.nom_cent_cust ) ;
					$('#descricao').val( selectedItem.cod_cent_cust+' - '+selectedItem.nom_cent_cust ) ;
				}

				if ( selectedItem.type == 'bt_resp_garantia' ) { 
					$('#matricula_resp_garantia').val( selectedItem.colleagueId ) ;
					$('#nome_resp_garantia').val( selectedItem.colleagueName ) ;
				}				
				
			}	