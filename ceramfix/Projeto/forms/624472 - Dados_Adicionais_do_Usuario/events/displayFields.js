function displayFields(form, customHTML) {
	log.info("-> Início | Dados Adicionais do Usuário | displayFields");

	var companyId = getValue("WKCompany");
	var usuario = getValue("WKUser");
	
	customHTML.append("<script>");
	customHTML.append("Dados.companyId = '" + companyId + "';");
	customHTML.append("Dados.mode = '" + form.getFormMode() + "';");
	customHTML.append("$(function(){");

	if (form.getFormMode() == "ADD") {
		form.setHidePrintLink(true);

		customHTML.append("Dados.init();");
	}
	else if (form.getFormMode() == "MOD") {
		form.setHidePrintLink(true);

		customHTML.append("Dados.edit();");
	} 
	else {
		form.setHidePrintLink(true);
		form.setShowDisabledFields(true);
	}

	if (!isAdmin(usuario)) {
		customHTML.append("Dados.lgpd();");
	}
	
	customHTML.append("});");
	customHTML.append("</script>");

	log.info("-> Fim | Dados Adicionais do Usuário | displayFields");
}

function isAdmin(usuario) {
	var c1 = DatasetFactory.createConstraint("workflowColleagueRolePK.colleagueId", usuario, usuario, ConstraintType.MUST);
	var dsWorkflowColleagueRole = DatasetFactory.getDataset("workflowColleagueRole", null, new Array(c1), null);

	if (dsWorkflowColleagueRole != null && dsWorkflowColleagueRole.rowsCount > 0) {
		for (var j = 0; j < dsWorkflowColleagueRole.rowsCount; j++) {
			var papel = dsWorkflowColleagueRole.getValue(j, "workflowColleagueRolePK.roleId");

			if (papel == "admin") {
				return true;
			}
		}
	}

	return false;
}