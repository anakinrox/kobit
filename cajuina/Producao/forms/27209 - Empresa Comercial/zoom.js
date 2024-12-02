function eraser(componente){
	var campo = componente.split('___')[0];
	var seq = componente.split('___')[1];
	
	if( campo.indexOf( "grp_fiscal_cliente" ) >= 0 ){
		
		if( campo == "grp_fiscal_cliente_icms" 	){
			$('#des_grp_fisc_cli_icms___'+ seq).val( "" ) ;
			$('#grp_fiscal_cliente_icms___' + seq).val( "" ) ;
		}
		if( campo == "grp_fiscal_cliente_st" 		){
			$('#des_grp_fisc_cli_st___'+ seq).val( "" ) ;
			$('#grp_fiscal_cliente_st___' + seq).val( "" ) ;			
		}
		if( campo == "grp_fiscal_cliente_ipi" 		){
			$('#des_grp_fisc_cli_ipi___'+ seq).val( "" ) ;
			$('#grp_fiscal_cliente_ipi___' + seq).val( "" ) ;			
		}			
		if( campo == "grp_fiscal_cliente_pis" 		){
			$('#des_grp_fisc_cli_pis___'+ seq).val( "" ) ;
			$('#grp_fiscal_cliente_pis___' + seq).val( "" ) ;			
		}
		if( campo == "grp_fiscal_cliente_cofins" 	){
			$('#des_grp_fisc_cli_cofins___'+ seq).val( "" ) ;
			$('#grp_fiscal_cliente_cofins___' + seq).val( "" ) ;
		}
			
	}
	
}

function zoom(componente, idCampoTexto) {
	console.log('Componente.....'+componente);
	if( componente == 'bt_empresa' ){
		
		modalzoom.open("Empresa",
				   	   "selectTable", 
				       "cod_empresa,Cod,den_reduz,Empresa", 
				       "cod_empresa,den_reduz", 
				       "dataBase,java:/jdbc/LogixDS,table,empresa",
				       componente, false, "default", null, null,
						"cod_empresa||'-'||den_reduz" );
						  
	}
	
	var campo = componente.split('___')[0];
	
	if( campo.indexOf( "grp_fiscal_cliente" ) >= 0 ){
		
		var tributo = "";
		if( campo == "grp_fiscal_cliente_icms" 	)  tributo = "ICMS";
		if( campo == "grp_fiscal_cliente_st" 		)  tributo = "ICMS_ST";
		if( campo == "grp_fiscal_cliente_ipi" 		)  tributo = "IPI";
		if( campo == "grp_fiscal_cliente_pis" 		)  tributo = "PIS_REC";
		if( campo == "grp_fiscal_cliente_cofins" 	)  tributo = "COFINS_REC";
		
		
		
		modalzoom.open("Grupo Fiscal "+tributo,
			   	   	   "selectLogix", 
			   	   	   "grp_fiscal_cliente,Código,des_grp_fisc_cli,Grupo Fiscal", 
			   	   	   "grp_fiscal_cliente,des_grp_fisc_cli", 
			   	   	   "table,kbt_grupo_fiscal_cliente,empresa,"+$('#cod_empresa_matriz').val()+",tributo_benef,"+tributo,
			   	   	   componente, false, "default", null, null,
			       	  "grp_fiscal_cliente||'-'||des_grp_fisc_cli" );
		
	}

	if( componente == 'bt_item_produzido' ||
		componente == 'bt_item_beneficiado' ||
		componente == 'bt_item_comprado' ||
		componente == 'bt_item_final' ||
		componente == 'bt_item_fantasma' ||
		componente == 'bt_grupo_cc' || 
		componente == 'bt_grupo_seg' ||
		componente == 'bt_grupo_locais' ){

		var empresa = '';

		$("input[name*=cod_empresa___").each(function(index){
			// console.log('cod_empresa....' , $(this).val(), index )
			if( index ==  0 ){
				empresa += 	$(this).val();
			} else {
				empresa += 	'|' + $(this).val();
			}
		});

		if (empresa == ''){
			FLUIGC.toast({
				message: 'Nehuma empresa informada',
				type: 'danger'
			});
			return false;
		}
		
		modalzoom.open("Grupo Estoque",
				   	   "selectTable", 
				       "cod_empresa,Emp,gru_ctr_estoq,Cod,den_gru_ctr_estoq,Grupo Estoque", 
				       "cod_empresa,gru_ctr_estoq,den_gru_ctr_estoq", 
				       "dataBase,java:/jdbc/LogixDS,table,grupo_ctr_estoq,___in___cod_empresa," + empresa,
				       componente, false, "default", null, null,
			       	   "gru_ctr_estoq||'-'||den_gru_ctr_estoq" );
	}

	if( componente == 'bt_familia_item' ){

		if ($('#cod_empresa_matriz').val() == ''){
			FLUIGC.toast({
				message: 'Nehuma empresa informada',
				type: 'danger'
			});
			return false;
		}

		modalzoom.open("Familias",
				   	   "selectTable", 
				       "cod_familia,Código,den_familia,Família", 
				       "cod_familia,den_familia", 
				       "dataBase,java:/jdbc/LogixDS,table,familia,cod_empresa,"+$('#cod_empresa_matriz').val(),
				       componente, false, "default", null, null,
				       "cod_familia||'-'||den_familia" );
	}
	
	if( componente == 'bt_atividade' ){

		// var processId = 'cadastro_item';

		// var constraints = new Array();
		// constraints.push(DatasetFactory.createConstraint("processId", processId , processId, ConstraintType.MUST));
		// constraints.push(DatasetFactory.createConstraint("active", 'true' ,'true', ConstraintType.MUST));

		// var dataSet = DatasetFactory.getDataset("workflowProcess", null, constraints, ["workflowProcessPK.processInstanceId"]);
		// console.log('dataSet...',dataSet.values);

		// if( dataSet != null && dataSet != undefined ){			
		// 	var versao = dataSet.values[dataSet.values.length -1]["version"];
		// 	// console.log('versao...', versao);
		// }

		modalzoom.open("Atividade",
			"dsk_processTask", 
			"cod_atividade,Atividade,den_atividade,Des Atividade", 
			"cod_atividade,den_atividade", 
			"cod_processo,cadastro_item",
			componente, false, "default", null, null,
			"cod_atividade||'-'||den_atividade" );
	}

	var campo = componente.split('___')[0];
	var seq = componente.split('___')[1];

	if( campo == 'den_conta_contabil' ){

		modalzoom.open("Conta Estoque",
				   	   "selectTable", 
				       "num_conta,Num. Conta,num_conta_reduz,Conta Reduz,den_conta,Conta", 
				       "num_conta,num_conta_reduz,den_conta", 
				       "dataBase,java:/jdbc/LogixDS,table,plano_contas",
				       componente, false, "default", null, null,
				       "num_conta_reduz||'-'||den_conta" );
	}

	if( campo == 'den_local' ){

		modalzoom.open("Conta Estoque",
				   	   "selectTable", 
				       "num_conta,Num. Conta,num_conta_reduz,Conta Reduz,den_conta,Conta", 
				       "num_conta,num_conta_reduz,den_conta", 
				       "dataBase,java:/jdbc/LogixDS,table,plano_contas",
				       componente, false, "default", null, null,
				       "num_conta_reduz||'-'||den_conta" );
	}

	if( campo == 'cod_local_estoque' || 
		campo == 'cod_local_insp'|| 
		campo == 'cod_local_receb'|| 
		campo == 'cod_local_prod'  ){
		
		var empresa = '';

		$("input[name*=cod_empresa___").each(function(index){
			// console.log('cod_empresa....' , $(this).val(), index )
			if( index ==  0 ){
				empresa += 	$(this).val();
			} else {
				empresa += 	'|' + $(this).val();
			}
		});

		if (empresa == ''){
			FLUIGC.toast({
				message: 'Nehuma empresa informada',
				type: 'danger'
			});
			return false;
		}
		
		modalzoom.open("Local",
				   	   "selectTable", 
				       "cod_local,Cod,den_local,Local", 
				       "cod_local,den_local", 
				       "dataBase,java:/jdbc/LogixDS,table,fluig_v_local,___in___cod_empresa,"+empresa,
				       componente, false, "default", null, null,
			       	   "cod_local||'-'||den_local" );
	}

	if( campo == 'cod_resp' ){

		// modalzoom.open("Responsável",
		// 		   	   "selectTableSQLserver", 
		// 		       "codigo,Cod,descricao,Responsável", 
		// 		       "codigo,descricao", 
		// 		       "dataBase,java:/jdbc/FluigDS,table,kbt_v_workflow_atribuicao",
		// 		       componente, false, "default", null, null,
		// 	       	   "codigo||'-'||descricao" );

		modalzoom.open("Responsavel",
			"colleague",
			"colleagueName,Nome",
			"colleaguePK.colleagueId,colleagueName",
			"active,true",
			componente, false, 'default', null, null,
			"colleagueName");
	}

	if ( campo == 'cod_papel' ){
		modalzoom.open("Papel",
			"workflowRole",
			"roleDescription,Nome",
			"workflowRolePK.roleId,roleDescription",
			"",
			componente, false, 'default', null, null,
			"roleDescription");
	}
	
	
	if (campo == 'bt_tip_cli' ){
		modalzoom.open("Tipo Cliente",
				"selectLogix",
				"cod_tip_cli,Cod.,den_tip_cli,Tipo",
				"cod_tip_cli,den_tip_cli",
				"table,tipo_cliente,order,den_tip_cli",
				componente, false, 'default', null, null,
				"cod_tip_cli||'-'||den_tip_cli");
	} 
	
	if ( campo == 'zoom_portador' || campo == 'zoom_portador_emp' ){

		var filtroCPL = '';
		var largura = "default";
	

		modalzoom.open("Portador",
			"selectLogix",
			"cod_portador,Cod,ies_tip_portador,Tipo,nom_portador,Portador",
			"cod_portador,ies_tip_portador,nom_portador",
			"table,portador"+filtroCPL,
			componente, false, largura, null, null,
			"cod_portador");
	}

	if (componente == 'btnRota') {
		modalzoom.open("Rota",
				"selectLogix", 
				"cod_rota,Codigo,den_rota,Rota", 
				"cod_rota,den_rota", 
				"sqlLimit,50,table,rotas,order,cod_rota",
				componente, false, "default", null, null,
				"cod_rota||'-'||den_rota" ); 
	}
	
	if (componente == 'btnPraca') {
		modalzoom.open("Praça",
				"selectLogix", 
				"cod_praca,Codigo,den_praca,Rota", 
				"cod_praca,den_praca", 
				"sqlLimit,50,table,pracas,order,cod_praca",
				componente, false, "default", null, null,
				"cod_praca||'-'||den_praca" ); 
	}
	
	if (componente == 'btnLocal') {
		modalzoom.open("Localidade",
				"selectLogix", 
				"cod_local,Codigo,den_local,Localidade", 
				"cod_local,den_local", 
				"sqlLimit,50,table,rota_praca,order,cod_local,cod_rota,"+$("#cod_rota").val()+",cod_praca,"+$("#cod_praca").val(),
				componente, false, "default", null, null,
				"cod_local||'-'||den_local" ); 
	}

	
}
			
function setSelectedZoomItem(selectedItem) {
	
	if (selectedItem.type == "bt_empresa") {
		var qtd = 0;
		$("input[name*=cod_empresa___").each(function(index){
			console.log('cod_empresa....' , $(this).val(), selectedItem.cod_empresa )
			if( $(this).val() ==  selectedItem.cod_empresa ){
				qtd += 1;
			}
			console.log('cod_empresa qtd ....' , qtd );
		});
		console.log('Depois qtd ....' , qtd );
		if( qtd == 0 ){
			var row = wdkAddChild('empresas');
			console.log('Add row ....' , row )
			$('#cod_empresa___'+row).val( selectedItem.cod_empresa ) ;
			$('#den_empresa___'+row).val( selectedItem.den_reduz ) ;
			console.log('Add row ....' , row );
			orderPaiFilho('', 'linha_base', 'cod_empresa' );
			console.log('depois order by ....'  );
		}
	}

	if (selectedItem.type == "bt_familia_item") {
		var row = wdkAddChild('familia_x_item');
		$('#cod_familia_item___'+row).val( selectedItem.cod_familia ) ;
		$('#den_familia_item___'+row).val( selectedItem.den_familia ) ;
	}

	if (selectedItem.type == "bt_grupo_cc") {
		var row = wdkAddChild('grupo_x_conta');
		$('#cod_grp_estoq_cc___'+row).val( selectedItem.gru_ctr_estoq ) ;
		$('#den_grp_estoq_cc___'+row).val( selectedItem.den_gru_ctr_estoq ) ;
	}

	if (selectedItem.type == "bt_grupo_seg") {
		var row = wdkAddChild('grupo_x_seg');
		$('#cod_grp_estoq_seg___'+row).val( selectedItem.gru_ctr_estoq ) ;
		$('#den_grp_estoq_seg___'+row).val( selectedItem.den_gru_ctr_estoq ) ;
	}

	if (selectedItem.type == "bt_grupo_locais") {
		var row = wdkAddChild('grupo_x_locais');
		$('#cod_grp_estoq_locais___'+row).val( selectedItem.gru_ctr_estoq ) ;
		$('#den_grp_estoq_locais___'+row).val( selectedItem.den_gru_ctr_estoq ) ;
	}

	if (selectedItem.type == "bt_item_produzido") {
		var row = wdkAddChild('produzido');
		$('#cod_grp_estoq_prod___'+row).val( selectedItem.gru_ctr_estoq ) ;
		$('#den_grp_estoq_prod___'+row).val( selectedItem.den_gru_ctr_estoq ) ;
	}

	if (selectedItem.type == "bt_item_beneficiado") {
		var row = wdkAddChild('beneficiado');
		$('#cod_grp_estoq_benef___'+row).val( selectedItem.gru_ctr_estoq ) ;
		$('#den_grp_estoq_benef___'+row).val( selectedItem.den_gru_ctr_estoq ) ;
	}

	if (selectedItem.type == "bt_item_comprado") {
		var row = wdkAddChild('comprado');
		$('#cod_grp_estoq_comp___'+row).val( selectedItem.gru_ctr_estoq ) ;
		$('#den_grp_estoq_comp___'+row).val( selectedItem.den_gru_ctr_estoq ) ;
	}

	if (selectedItem.type == "bt_item_final") {
		var row = wdkAddChild('final');
		$('#cod_grp_estoq_final___'+row).val( selectedItem.gru_ctr_estoq ) ;
		$('#den_grp_estoq_final___'+row).val( selectedItem.den_gru_ctr_estoq ) ;
	}

	if (selectedItem.type == "bt_item_fantasma") {
		var row = wdkAddChild('fantasma');
		$('#cod_grp_estoq_fantasma___'+row).val( selectedItem.gru_ctr_estoq ) ;
		$('#den_grp_estoq_fantasma___'+row).val( selectedItem.den_gru_ctr_estoq ) ;
	}

	if (selectedItem.type == 'bt_atividade') {
		var row = wdkAddChild('resp_x_atividade');
		$('#cod_atividade___' + row).val(selectedItem.cod_atividade);
		$('#den_atividade___' + row).val(selectedItem.den_atividade);
	}

	var campo = selectedItem.type.split('___')[0];
	var seq = selectedItem.type.split('___')[1];
	
	if( campo.indexOf( "grp_fiscal_cliente" ) >= 0 ){
		
		if( campo == "grp_fiscal_cliente_icms" 	){
			$('#des_grp_fisc_cli_icms___'+ seq).val( selectedItem.des_grp_fisc_cli ) ;
			$('#grp_fiscal_cliente_icms___' + seq).val( selectedItem.grp_fiscal_cliente ) ;
		}
		if( campo == "grp_fiscal_cliente_st" 		){
			$('#des_grp_fisc_cli_st___'+ seq).val( selectedItem.des_grp_fisc_cli ) ;
			$('#grp_fiscal_cliente_st___' + seq).val( selectedItem.grp_fiscal_cliente ) ;			
		}
		if( campo == "grp_fiscal_cliente_ipi" 		){
			$('#des_grp_fisc_cli_ipi___'+ seq).val( selectedItem.des_grp_fisc_cli ) ;
			$('#grp_fiscal_cliente_ipi___' + seq).val( selectedItem.grp_fiscal_cliente ) ;			
		}			
		if( campo == "grp_fiscal_cliente_pis" 		){
			$('#des_grp_fisc_cli_pis___'+ seq).val( selectedItem.des_grp_fisc_cli ) ;
			$('#grp_fiscal_cliente_pis___' + seq).val( selectedItem.grp_fiscal_cliente ) ;			
		}
		if( campo == "grp_fiscal_cliente_cofins" 	){
			$('#des_grp_fisc_cli_cofins___'+ seq).val( selectedItem.des_grp_fisc_cli ) ;
			$('#grp_fiscal_cliente_cofins___' + seq).val( selectedItem.grp_fiscal_cliente ) ;
		}
			
	}
	

	if ( campo == "den_conta_contabil") {
		$('#cod_conta_contabil___'+ seq).val( selectedItem.num_conta_reduz ) ;
		$('#den_conta_contabil___' + seq).val( selectedItem.den_conta ) ;
	}

	if ( campo == "cod_local_estoque") {
		$('#cod_local_estoque___'+ seq).val( selectedItem.cod_local ) ;
		$('#den_local_estoque___' + seq).val( selectedItem.den_local ) ;
	}

	if ( campo == "cod_local_receb") {
		$('#cod_local_receb___'+ seq).val( selectedItem.cod_local ) ;
		$('#den_local_receb___' + seq).val( selectedItem.den_local ) ;
	}

	if ( campo == "cod_local_insp") {
		$('#cod_local_insp___'+ seq).val( selectedItem.cod_local ) ;
		$('#den_local_insp___' + seq).val( selectedItem.den_local ) ;
	}

	if ( campo == "cod_local_prod") {
		$('#cod_local_prod___'+ seq).val( selectedItem.cod_local ) ;
		$('#den_local_prod___' + seq).val( selectedItem.den_local ) ;
	}

	if ( campo == "cod_resp") {
		$('#cod_resp___'+ seq).val( selectedItem.colleagueId) ;
		$('#den_resp___' + seq).val( selectedItem.colleagueName) ;
	}

	if ( campo == "cod_papel") {
		$('#cod_papel___'+ seq).val( 'Pool:Role:' + selectedItem.roleId ) ;
		$('#den_papel___' + seq).val( selectedItem.roleDescription ) ;
	}
	
	if ( campo == "zoom_portador" ){
		$('#cod_portador').val( selectedItem.cod_portador );
		$('#ies_tip_portador').val( selectedItem.ies_tip_portador );
		$('#nom_portador').val( selectedItem.nom_portador );
	}
	
	if ( campo == "zoom_portador_emp" ){
		$('#cod_portador_emp').val( selectedItem.cod_portador );
		$('#ies_tip_portador_emp').val( selectedItem.ies_tip_portador );
		$('#nom_portador_emp').val( selectedItem.nom_portador );
	}

	if (selectedItem.type == "bt_tip_cli") {		
		$('#cod_tip_cli').val(selectedItem.cod_tip_cli);
		$('#den_tip_cli').val(selectedItem.den_tip_cli);
	}

	
	if (selectedItem.type == "btnRota") {		
		$('#cod_rota').val(selectedItem.cod_rota);
		$('#den_rota').val(selectedItem.den_rota);
		$('#cod_local').val("");
		$('#den_local').val("");
	}
	
	if (selectedItem.type == "btnPraca") {		
		$('#cod_praca').val(selectedItem.cod_praca);
		$('#den_praca').val(selectedItem.den_praca);
		$('#cod_local').val("");
		$('#den_local').val("");
	}
	
	if (selectedItem.type == "btnLocal") {		
		$('#cod_local').val(selectedItem.cod_local);
		$('#den_local').val(selectedItem.den_local);
	}
	
	
}	