 	        //cria um zoom baseado em um dataset
			function zoomDataSet(titulo, dataset, campos, resultFields, type) {
				//if (jQuery.browser.mozilla){  
				//		window.showModalDialog("/webdesk/zoom.jsp?datasetId="+dataset+"&dataFields="+campos+"&resultFields="+resultFields+"&type="+type+"&title="+titulo,"zoom","dialogWidth:600px;dialogHeight:350px");
				//} else {  
						window.open("/webdesk/zoom.jsp?datasetId="+dataset+"&dataFields="+campos+"&resultFields="+resultFields+"&type="+type+"&title="+titulo, "zoom" , "status , scrollbars=no ,width=600, height=350 , top=0 , left=0");                        
				//}  
			}

			function zoomDataSetFiltro(titulo, dataset, campos, resultFields, filtro, type) {
				//if (jQuery.browser.mozilla) {
				//	window.showModalDialog("/webdesk/zoom.jsp?datasetId="+dataset+"&dataFields="+campos+"&resultFields="+resultFields+"&type="+type+"&title="+titulo+"&filterValues="+filtro,"zoom","dialogWidth:600px;dialogHeight:350px");
				//} else {
					window.open("/webdesk/zoom.jsp?datasetId="+dataset+"&dataFields="+campos+"&resultFields="+resultFields+"&type="+type+"&title="+titulo+"&filterValues="+filtro, "zoom" , "status , scrollbars=no ,width=600, height=350 , top=0 , left=0");
				//}
			}
			
			
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
			
			//busca informações do dataset colleague
			//o type é o nome do componente do html
			function zoom(componente) {
							
				/*if ( componente == 'bt_repres' &&  ( $('#cod_repres').val() !=  '' && $('#cod_repres').val() != undefined ) ){
					
					FLUIGC.toast({
						title: 'Representante: ',
						message: 'Não é permitido alterar o representante selecionada!',
						type: 'warning',
						timeout: 'fast'
					});
					return;
				}*/
				
				/*if ( componente != 'bt_repres' && ( $('#cod_repres').val() ==  '' || $('#cod_repres').val() == undefined ) ){
					FLUIGC.toast({
						title: 'Representante: ',
						message: 'È necessário selecionar um representante!',
						type: 'warning',
						timeout: 'fast'	
					});
					return;
				}*/

			
				if (componente == 'bt_empresa'){
					modalzoom.open('Empresa', 
									  'selectLogix', 
									  'cod_empresa,Código,den_reduz,Empresa', 
									  'cod_empresa,den_reduz', 
									  'table,empresa',
									  componente, false, "default", null, null,
								       "cod_empresa||'-'||den_reduz" );
				}
				
				
				
				if (componente == 'bt_moeda'){					
					modalzoom.open('Moeda', 
									  'selectLogix', 
									  'cod_moeda,Código,den_moeda_abrev,Moeda', 
									  'cod_moeda,den_moeda_abrev', 
									  'table,moeda',
									  componente, false, "default", null, null,
								       "cod_moeda||'-'||den_moeda_abrev");
				}

				
				if (componente == 'bt_cnd_pagto'){
					console.log('Acionou1' ,componente );
					modalzoom.open('Cond. Pagamento', 
									  'selectLogix', 
									  'cod_cnd_pgto,Código,den_cnd_pgto,Descrição', 
									  'cod_cnd_pgto,den_cnd_pgto', 
									  'table,cond_pgto',
									  componente, false, "default", null, null,
								       "cod_cnd_pgto||'-'||den_cnd_pgto");
					console.log('Acionou2' ,componente );					
				}							
	
					
				if (componente == 'bt_repres'){
					
					modalzoom.open('Representante', 
										'selectLogix', 
										'cod_repres,Código,raz_social,Nome', 
										'cod_repres,raz_social,nom_repres,nom_guerra', 
										'table,representante',
										componente, false, "default", null, null,
									       "cod_repres||'-'||raz_social" );
				}

				if (componente == 'bt_user'){
					modalzoom.open("Usuario",
							   "colleague", 
							   "login,Login,colleagueName,Nome", 
							   "login,colleagueName,colleaguePK.colleagueId", 
							   "",
							   componente, false, "default", null, null,
						       "colleagueName" );
				}
				
				if (componente == 'bt_coordenador'){
					modalzoom.open("Coordenador",
							   "colleague", 
							   "login,Login,colleagueName,Nome", 
							   "login,colleagueName,colleaguePK.colleagueId", 
							   "",
							   componente, false, "default", null, null,
						       "colleagueName" );
				}
				
				if (componente == 'bt_gerente'){
					modalzoom.open("Gerente",
							   "colleague", 
							   "login,Login,colleagueName,Nome", 
							   "login,colleagueName,colleaguePK.colleagueId", 
							   "",
							   componente, false, "default", null, null,
						       "colleagueName" );
				}

				if (componente == 'bt_aen'){
					modalzoom.open('AEN', 
									'selectLogix', 
									'cod_aen,Código,den_aen_compl,Descrição', 
									'cod_aen,den_aen_compl', 
									'table,fluig_v_aen',
									componente, false, "default", null, null,
								     "cod_aen||'-'||den_aen_compl");

				}
			
			}	
			
			function getCheckbox( checked ){
				if ( checked == "checkbox" ){
					return true;
				}else{
					return false;
				}
			}
			


			function setSelectedZoomItem(selectedItem) {
				
				if (selectedItem.type == "bt_empresa") {
				       var row = wdkAddChild('empresa'); 
					   $('#cod_empresa___'+row).val( selectedItem.cod_empresa ) ;
					   $('#emp_reduz___'+row).val( selectedItem.den_reduz ) ;
				}

				if (selectedItem.type == "bt_moeda") {
				       var row = wdkAddChild('moeda'); 
					   $('#cod_moeda___'+row).val( selectedItem.cod_moeda ) ;
					   $('#den_moeda___'+row).val( selectedItem.den_moeda_abrev ) ;
				}

				if (selectedItem.type == "bt_cnd_pagto") {
				       var row = wdkAddChild('cond_pagto'); 
					   $('#cod_cond_pagto___'+row).val( selectedItem.cod_cnd_pgto ) ;
					   $('#den_cond_pagto___'+row).val( selectedItem.den_cnd_pgto ) ;
				}				
								
				if (selectedItem.type == "bt_repres") {
					   $('#cod_repres').val( selectedItem.cod_repres ) ;
					   $('#raz_social').val( selectedItem.raz_social ) ;
					   $('#nom_repres').val( selectedItem.nom_repres ) ;
					   $('#nom_guerra').val( selectedItem.nom_guerra ) ;
					   $('#ecm-cardPublisher-documentDescription-input').val( selectedItem.raz_social ) ;
					   
					   $('#descricao').val( $('#nome_usuario').val()+' - '+$('#cod_repres').val()+' - '+$('#raz_social').val() );
					   
					   
				}				
				
				if (selectedItem.type == "bt_user") {
					   $('#login').val( selectedItem.login ) ;
					   $('#matricula').val( selectedItem['colleagueId'] ) ;
					   $('#nome_usuario').val( selectedItem.colleagueName ) ;
					   
					   $('#descricao').val( $('#nome_usuario').val()+' - '+$('#cod_repres').val()+' - '+$('#raz_social').val() );
					   
					   
				}
				if (selectedItem.type == "bt_coordenador") {
					   $('#login_coordenador').val( selectedItem.login ) ;
					   $('#matricula_coordenador').val( selectedItem['colleagueId'] ) ;
					   $('#nome_coordenador').val( selectedItem.colleagueName ) ;
				}
				if (selectedItem.type == "bt_gerente") {
					   $('#login_gerente').val( selectedItem.login ) ;
					   $('#matricula_gerente').val( selectedItem['colleagueId'] ) ;
					   $('#nome_gerente').val( selectedItem.colleagueName ) ;
				}
				
				if (selectedItem.type == "bt_aen") {
					   $('#cod_aen').val( selectedItem.cod_aen ) ;
					   $('#den_aen').val( selectedItem.den_aen_compl ) ;
				}
				
			}	
