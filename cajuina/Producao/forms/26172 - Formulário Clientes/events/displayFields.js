function displayFields(form, customHTML) {

	form.setShowDisabledFields(true);
	form.setHidePrintLink(true);

	var manager = 'N';
	if (getValue('WKManagerMode')) {
		manager = 'S';
	}
	form.setValue("isManager", manager);

	var mobile = 'N';
	if (form.getMobile() == true) {
		mobile = 'S';
		log.info(" Entrei no if mobile................. " + mobile);
	}

	form.setValue("isMobile", mobile);


	form.setValue("task", getValue('WKNumState'));
	var user = getValue("WKUser");

	if (getValue('WKNumState') == "0" || getValue('WKNumState') == "4") {

		form.setValue('user_abertura', user);
		var ct = new Array();
		ct.push(DatasetFactory.createConstraint('matricula', user, user, ConstraintType.MUST));
		var ds = DatasetFactory.getDataset("dsk_cad_repres", null, ct, null);
		if (ds.rowsCount > 0) {
			form.setValue('tipo_cadastro_user', ds.getValue(0, 'tipo_cadastro'));
			form.setValue('cod_repres', ds.getValue(0, 'cod_repres'));
			form.setValue('nom_repres', ds.getValue(0, 'nome_usuario'));
			form.setValue('lst_repres', ds.getValue(0, 'lst_repres'));
		}
		else {
			form.setValue('tipo_cadastro_user', 'X');
		}
	}

	var ct = new Array();
	ct.push(DatasetFactory.createConstraint("workflowColleagueRolePK.colleagueId", user, user, ConstraintType.MUST));
	ct.push(DatasetFactory.createConstraint("workflowColleagueRolePK.roleId", "cad_cliente_financeiro", "cad_cliente_financeiro", ConstraintType.MUST));
	var role = DatasetFactory.getDataset("workflowColleagueRole", null, ct, null);
	if (role.rowsCount > 0) {
		form.setValue('isFinanceiro', "S");
	} else {
		form.setValue('isFinanceiro', "N");
	}

	var ct = new Array();
	ct.push(DatasetFactory.createConstraint("workflowColleagueRolePK.colleagueId", user, user, ConstraintType.MUST));
	ct.push(DatasetFactory.createConstraint("workflowColleagueRolePK.roleId", "cad_cliente_aprovador", "cad_cliente_aprovador", ConstraintType.MUST));
	var role = DatasetFactory.getDataset("workflowColleagueRole", null, ct, null);
	if (role.rowsCount > 0) {
		form.setValue('isAprovador', "S");
	} else {
		form.setValue('isAprovador', "N");
	}


}