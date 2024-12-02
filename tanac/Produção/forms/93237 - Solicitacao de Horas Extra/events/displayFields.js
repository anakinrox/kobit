function displayFields(form,customHTML){ 
	
	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);
	
	var task = getValue('WKNumState');
	var processo = getValue('WKNumProces');
	
	form.setValue('task', task );
	form.setValue('processo', processo );

	var user = getValue("WKUser");
	//user = 'arcoin';
	form.setValue('user_fluig', user );
	var login = user;
	

	if ( task == 0 || task == 1 ){
		
		form.setValue('user_criador', user );
		
		log.info('###### user ##### '+user );
		var ctColleague = [];
		ctColleague.push( DatasetFactory.createConstraint("colleaguePK.companyId", "1", "1", ConstraintType.MUST) );
		ctColleague.push( DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST) );
		var dsColleague = DatasetFactory.getDataset("colleague", null, ctColleague, null);
		if (dsColleague != null && dsColleague.rowsCount > 0 ) {
			
			form.setValue('nome_criador', dsColleague.getValue(0,"colleagueName") );
			
			var ctRM = [];
			ctRM.push( DatasetFactory.createConstraint("user", user, user, ConstraintType.MUST) );
			var dsRM = DatasetFactory.getDataset("dsk_rm_usuario_chefia", null, ctRM, null);
			if (dsRM != null && dsRM.rowsCount > 0 ) {
				
				form.setValue('user_solicitante',  dsRM.getValue(0,"user_funcionario") );
				form.setValue('nome_solicitante', dsRM.getValue(0,"nome_funcionario") );
				form.setValue('login_solicitante', dsRM.getValue(0,"login_funcionario") );
				form.setValue('matricula_solicitante', dsRM.getValue(0,"matricula_funcionario") );
				
				form.setValue('nome_gerente', dsRM.getValue(0,"nome_gerente") );
				form.setValue('matricula_gerente', dsRM.getValue(0,"matricula_gerente") );
				form.setValue('login_gerente', dsRM.getValue(0,"login_gerente") );
				form.setValue('user_gerente', dsRM.getValue(0,"user_gerente") );
				
				form.setValue('nome_diretor', dsRM.getValue(0,"nome_diretor") );
				form.setValue('matricula_diretor', dsRM.getValue(0,"matricula_diretor") );
				form.setValue('login_diretor', dsRM.getValue(0,"login_diretor") );
				form.setValue('user_diretor', dsRM.getValue(0,"user_diretor") );
				
				form.setValue('nome_presidente', dsRM.getValue(0,"nome_presidente") );
				form.setValue('user_presidente', dsRM.getValue(0,"user_presidente") );
				
			}
		}
	}
}