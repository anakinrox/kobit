function displayFields(form,customHTML){
	
	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	
	// var manager = 'N';
	// if( getValue('WKManagerMode') ){
	// 	manager = 'S';
	// }
	// form.setValue("isManager", manager );

	// var mobile = 'N';
	// if( form.getMobile() ){
	// 	mobile = 'S';
	// }
	// form.setValue("isMobile", mobile );

	var task = getValue('WKNumState');
	
	form.setValue("task",  task);

	var user = getValue("WKUser");
	
	if ( task == 0 || task == 1) {
		
		if( form.getValue('ies_zona') == "" ){
			form.setValue('iesAGRISK', "N" );
		}
			
		
		log.info('#TASK ::' + task);
		// var ct = new Array();
		// 	ct.push( DatasetFactory.createConstraint('user', user, user, ConstraintType.MUST) );
		// var ds = DatasetFactory.getDataset("dsk_cad_repres", null, ct, null);
		// if( ds.rowsCount > 0 ){
		// 	form.setValue('tipo_cadastro_user', ds.getValue(0, 'tipo_cadastro') );
		// 	// form.setValue('cod_repres', ds.getValue(0, 'lst_repres').split('|')[0] );
		// 	// form.setValue('nom_repres', ds.getValue(0, 'nome_usuario') );
		// 	// form.setValue('responsavel', ds.getValue(0, 'responsavel') );
		// }else{
		// 	form.setValue('tipo_cadastro_user', 'R' );
		// }
		log.info('#USER ::' + user);
		form.setValue('user_abertura', user );
		var ct = new Array();
		ct.push( DatasetFactory.createConstraint('matricula', user, user, ConstraintType.MUST) );
		var ds = DatasetFactory.getDataset("zona_area_solicitante_rm", null, ct, null);
		if( ds.rowsCount > 0 ){
			log.info('#ZONA ::' + ds.getValue(0, 'desc_zona'));
			log.info('#AREA ::' + ds.getValue(0, 'desc_area'));
			if( form.getValue('ies_zona') == "" ) 
				form.setValue('ies_zona', ds.getValue(0, 'desc_zona') );
			if( form.getValue('area_solicitante') == "" )
				form.setValue('area_solicitante', ds.getValue(0, 'desc_area') );
		}

		var dtNow = new java.util.Date();
		var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");

		log.info('#DATA CADASTRO ::' + sdf.format(dtNow) );
		form.setValue( 'dat_cadastro', sdf.format(dtNow) );
		form.setValue( 'dat_atualiz', sdf.format(dtNow) );
		
		
	}

/*	
	log.info("task......... "+task);
	if( task != '0' && task != '4' && task != '10' && task != '22' ){
		log.info("entrei set disable ");
		setEnabled(form, false);
		
		form.setEnabled('aprovar', true);
		form.setEnabled('deAcordo', true);
		form.setEnabled('observacaoSolicitacaoAprovada', true);
		form.setEnabled('ajustar', true);
		form.setEnabled('observacaoAjustarSolicitacao', true);
		form.setEnabled('observacaoSolicitacaoAprovada', true);
		form.setEnabled('observacaoSolicitacaoAprovada', true);
		
	}	
*/
	
	// var ct = new Array();
	// 	ct.push( DatasetFactory.createConstraint('user', user, user, ConstraintType.MUST) );
    // var ds = DatasetFactory.getDataset("dsk_cad_repres", null, ct, null);
    // if( ds.rowsCount > 0 ){
    // 	form.setValue('tipo_cadastro_user', ds.getValue(0, 'tipo_cadastro') );
	// 	// form.setValue('cod_repres', ds.getValue(0, 'lst_repres').split('|')[0] );
	// 	// form.setValue('nom_repres', ds.getValue(0, 'nome_usuario') );
	// 	// form.setValue('responsavel', ds.getValue(0, 'responsavel') );
    // }else{
    // 	form.setValue('tipo_cadastro_user', 'R' );
    // }

}

function setEnabled(form, lEnable) {
	var hpForm = new java.util.HashMap();
	hpForm = form.getCardData();
	var it = hpForm.keySet().iterator();

	while (it.hasNext()) {
		var key = it.next();
		form.setEnabled(key, lEnable);
	}

}