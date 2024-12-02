function validateForm(form){
	log.info("-> Início | Dados Adicionais do Usuario | validateForm");

	var arrError = [];
	var arrIndexes = [];

	if (form.getValue("nomeCompleto") == "") {
		arrError.push(i18n.translate("dadosadc.javascript.nomecompleto"));
	}	
	
	if (arrError.length > 0) {
		var error = loadErrors(arrError);

		log.info("-> Fim | Dados Adicionais do Usuario | validateForm");
		throw error;
	}
}

function loadErrors(arrError) {
	var error =" " + i18n.translate("dadosadc.javascript.verifiquecampos") + "<br><br>";

	for (var i = 0; i < arrError.length; i++) {
		var count = i + 1;

		if (parseInt(i) > 0) {
			arrError[i] = "<br><strong>" + count + "</strong> - " + arrError[i];
		}
		else {
			arrError[i] = "<strong>" + count + "</strong> - " + arrError[i];
		}

		error += arrError[i];
	}

	return error;
}