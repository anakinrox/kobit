function sincTableERP(status_proces){
	
	var task = getValue("WKNumState");
	var solicitante = getValue("WKUser");

	var indexes = hAPI.getChildrenIndexes("tbl_filhos");
	
	var cod_empresa = hAPI.getCardValue("empresa");
	var titulo = hAPI.getCardValue("titulo");
	var num_processo = getValue("WKNumProces");
	var dat_refer = hAPI.getCardValue("data_refer").split('/').reverse().join('-');
	var hor_refer = hAPI.getCardValue("hora_refer");
	var inv_cego = hAPI.getCardValue("inv_cego");
	var cod_user_respon = hAPI.getCardValue("cod_responsavel");
	var cod_user_aceite = hAPI.getCardValue("cod_user_aceite"); /*criar form*/
	var cod_user_aprov = hAPI.getCardValue("cod_user_aprov"); /*criar form*/
	var cod_operacao = hAPI.getCardValue("cod_operacao"); /*criar form*/
	
	for (var i = 0; i < indexes.length; i++) {						
		var index = indexes[i];			
//		for (var k = 0; k < dsDeFilhos.rowsCount; k++) {
//			// log.info('entrou rows filho')
//			var seq = k + 1;
//			for (var l = 0; l < dsDeFilhos.getColumnsCount(); l++) {					
//				log.info('linha...' + dsDeFilhos.getColumnName(l) + '___' + seq + ' | ' + dsDeFilhos.getValue(k, dsDeFilhos.getColumnName(l)));			
//			}
//			
//		}
		
		var cod_item = hAPI.getCardValue("cod_item___" + index);
		var qtd_estoque = getFloat(hAPI.getCardValue("qtd_estoque___" + index));
		var qtd_contagem_1 = getFloat(hAPI.getCardValue("qtd_contada1___" + index));
		var qtd_contagem_2 = getFloat(hAPI.getCardValue("qtd_contada2___" + index));
		var qtd_contagem_3 = getFloat(hAPI.getCardValue("qtd_contada3___" + index));
		var qtd_contagem_4 = getFloat(hAPI.getCardValue("qtd_contada4___" + index));
		var qtd_contagem_5 = getFloat(hAPI.getCardValue("qtd_contada5___" + index));
		var qtd_aceita = getFloat(hAPI.getCardValue("qtd_aceita___" + index));
		var status = hAPI.getCardValue("status___" + index);
		var qtd_ajuste = getFloat(hAPI.getCardValue("dif_contagem___" + index));
		var vrl_refer_ajuste = hAPI.getCardValue("vlr_refer_ajuste___" + index); /*criar form*/
		var cod_local = hAPI.getCardValue("local_est___" + index);
		var num_lote = hAPI.getCardValue("lote___" + index);
		var endereco = hAPI.getCardValue("endereco___" + index);
		var ies_situa_qtd = hAPI.getCardValue("ies_situa_qtd___" + index);
		
		var SQL = "select count(*) as qtd "+
				  "	from kbt_t_inv_estoque "+
				  " where cod_empresa = '"+ cod_empresa +"' "+
				  "	  and num_processo = '"+num_processo+"' "+
				  "	  and cod_item = '"+cod_item+"' "+
				  "	  and cod_local = '"+cod_local+"' "+
				  "	  and num_lote = '"+num_lote+"' "+
				  "	  and ies_situa_qtd = '"+ies_situa_qtd+"' "+
				  "	  and endereco = '"+endereco+"' ";

		var constraintsFilhos = new Array();
		constraintsFilhos.push(DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST));
		constraintsFilhos.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/LogixDS', null, ConstraintType.MUST));
		var dsDeFilhos = DatasetFactory.getDataset("select", null, constraintsFilhos, null);
	
		log.info('qtd Registros... ' + dsDeFilhos.getValue(0, 'qtd'));
		
		var action = 'U';
		
		if (dsDeFilhos.getValue(0, 'qtd') == 0 ){
			var action = 'I';
		}
	
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint('DATABASE',	'java:/jdbc/LogixDS',	null, 				ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('TABLE', 		'kbt_t_inv_estoque',	null, 				ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('ACTION', 	action, 				null, 				ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'cod_atividade', 		task,		 		ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'status_proces', 		status_proces, 		ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'solicitante', 			solicitante, 		ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'titulo', 				titulo, 			ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'dat_refer', 			dat_refer, 			ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'hor_refer', 			hor_refer, 			ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'inv_cego', 			inv_cego, 			ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'cod_user_repon', 		cod_user_respon, 	ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'cod_user_aceite',		cod_user_aceite, 	ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'cod_user_aprov', 		cod_user_aprov, 	ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'qtd_estoque', 			qtd_estoque, 		ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'qtd_contagem_1', 		qtd_contagem_1, 	ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'qtd_contagem_2', 		qtd_contagem_2, 	ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'qtd_contagem_3', 		qtd_contagem_3, 	ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'qtd_contagem_4', 		qtd_contagem_4, 	ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'qtd_contagem_5', 		qtd_contagem_5, 	ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'qtd_aceita', 			qtd_aceita, 		ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'status', 				status, 			ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'qtd_ajuste', 			qtd_ajuste, 		ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'vrl_refer_ajuste', 	vrl_refer_ajuste, 	ConstraintType.MUST) );
		constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'cod_operacao', 		cod_operacao, 		ConstraintType.MUST) );

		if( action == "I" ){
			constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'cod_empresa', 			cod_empresa, 		ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('FIELD_D', 	'num_processo', 		num_processo, 		ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'cod_item', 			cod_item, 			ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'cod_local', 			cod_local, 			ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'num_lote', 			num_lote,		 	ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'endereco', 			endereco,		 	ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('FIELD_C', 	'ies_situa_qtd', 		ies_situa_qtd,		 ConstraintType.MUST) );
		}else{
			constraints.push( DatasetFactory.createConstraint('WHERE_C', 	'cod_empresa', 			cod_empresa, 		ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('WHERE_D', 	'num_processo', 		num_processo, 		ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('WHERE_C', 	'cod_item', 			cod_item, 			ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('WHERE_C', 	'cod_local', 			cod_local, 			ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('WHERE_C', 	'num_lote', 			num_lote,		 	ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('WHERE_C', 	'endereco', 			endereco,		 	ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('WHERE_C', 	'ies_situa_qtd', 		ies_situa_qtd,		 ConstraintType.MUST) );
		}
		
		var dataset = DatasetFactory.getDataset("dsk_table_dml", null, constraints, null);
	}		

}



function getFloat(value){
	log.info('getFloat..' + value)
	if (value == '' || value == undefined || value == null || value == 'null' ){
		return 0
	} else {
		var fValue = parseFloat(value.replace(',','.')); 
		if( isNaN( fValue ) ){
			return 0;
		}else{
			return fValue;
		}
	}
}