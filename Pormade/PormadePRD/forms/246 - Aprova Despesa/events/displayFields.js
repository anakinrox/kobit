function displayFields(form,customHTML){ }function displayFields(form,customHTML){ 
	
	var activity = getValue('WKNumState');
	
	form.setHidePrintLink(true);
	form.setShowDisabledFields(true);

	var user = getValue("WKUser");	
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
	var constraints = new Array(c1);
	var colleagueMap = DatasetFactory.getDataset("colleague", null, constraints, null);
	form.setValue('user_fup', colleagueMap.getValue(0,"colleagueName"));
	form.setValue('cod_user_fup', user);
	
	var dtNow = new java.util.Date();
	var sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");
	form.setValue('data_fup', sdf.format(dtNow) );
	
	if( getValue("WKMobile") ){
		form.setValue("isMobile", 'S' );
	}else{
		form.setValue("isMobile", 'N' );
	}
	
	form.setValue("task", getValue('WKNumState') );
	form.setValue("processo", getValue('WKNumProces') );
	form.setValue("cod_processo", getValue('WKDef') );
	
	///PEGAR EMAIL de usuario Logado - INICIO
	if (activity == 0 || activity == 1 ) {
		
		form.setValue( "datadespesa", sdf.format(dtNow) );
		
		form.setValue("solicitante", colleagueMap.getValue(0, "colleagueName")  );		
		form.setValue("codsolicitante", getValue("WKUser")  );

		var c1 = DatasetFactory.createConstraint('matricula', getValue("WKUser") , getValue("WKUser"), ConstraintType.MUST);
		var userCom = DatasetFactory.getDataset('usuario_comercial', null , new Array(c1), null);
		//form.setValue("emaillogado",  datasetColleague.getValue(0, "mail") );
		log.info('userCom '+userCom.rowsCount );
		if( userCom.rowsCount > 0  ){
			form.setValue("gestor", userCom.getValue(0, "nome_gestor_venda")  );		
			form.setValue("codgestor", userCom.getValue(0, "gestor_venda") );
			form.setValue("tipo_usuario", userCom.getValue(0, "tipo_usuario") );
			form.setValue("tem_adiantamento", userCom.getValue(0, "adiantamento") );
		}
	
		if( form.getValue("valKM") == "" || form.getValue("valKM") == undefined ){
			form.setValue("valKM", userCom.getValue(0, "valor_km") );
		}
		
		if( form.getValue("valKM") == "" || form.getValue("valKM") == undefined ){
			var g1 = DatasetFactory.createConstraint('matricula', userCom.getValue(0, "gestor_venda") , userCom.getValue(0, "gestor_venda"), ConstraintType.MUST);
			var gestCom = DatasetFactory.getDataset('usuario_comercial', null , new Array(g1), null);
			//form.setValue("emaillogado",  datasetColleague.getValue(0, "mail") );
			log.info('gestCom '+gestCom.rowsCount );
			if( gestCom.rowsCount > 0  ){
				form.setValue("valKM", gestCom.getValue(0, "valor_km") );
			}
		}
	}
	
	/*var activity = getValue('WKNumState');
	if( activity != 0 && activity != 4 && activity != 33 && activity != 43 && activity != 47 ){
		setEnabled(form, false);
		form.setEnabled("valordespesa",true);
		form.setEnabled("valormes",true);
		form.setEnabled("descricao",true);
	}*/	
}

//Habilita ou Desabilita todos os campos do formulario
function setEnabled(form, lEnable) {
	var hpForm = new java.util.HashMap();
	hpForm = form.getCardData();
	var it = hpForm.keySet().iterator();
	while (it.hasNext()) {	
		var key = it.next();
		form.setEnabled(key, lEnable);
	}
}