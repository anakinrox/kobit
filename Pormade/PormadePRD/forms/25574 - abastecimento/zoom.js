			
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
				
				if( componente == 'bt_motorista'){
					
					modalzoom.open("Colaborador",
							   "selectTable", 
							   "nom_motorista,Nome", 
							   "empresa,motorista,nom_motorista", 
							   "dataBase,java:/jdbc/LogixDS,table,pmd_motorista,banco,informix,sqlLimit,250",
							   componente, false, "default", null, null,
						       "nom_motorista" );
				}
				
				if( componente == 'bt_placa' ){
					modalzoom.open("Placa",
							   "selectTable", 
							   "placa,Placa", 
							   "placa", 
							   "dataBase,java:/jdbc/LogixDS,table,fluig_v_veiculo,banco,informix,sqlLimit,250",
							   componente, false, "default", null, null,
						       "placa" );		
				}
				
					
			}
			
			function setSelectedZoomItem(selectedItem) {
				
				console.log('selectedItem.type',selectedItem.type);
				console.log('selectedItem',selectedItem);
				
				if ( selectedItem.type == 'bt_motorista' ) {
					$('#motorista').val( selectedItem.nom_motorista ) ;
					$('#id_motorista').val( selectedItem.motorista ) ;
					$('#emp_motorista').val( selectedItem.empresa ) ;
				}	
				
				if ( selectedItem.type == 'bt_placa' ) {
					$('#placa').val( selectedItem.placa ) ;
				}
			}
			
			