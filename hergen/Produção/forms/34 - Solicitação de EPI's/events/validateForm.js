function validateForm(form) {
	var mensagem = "";

	if ((form.getValue('nome_funcionario') == null) || (form.getValue('nome_funcionario').trim() == "")) {
		mensagem = "o Funcioário deve ser selecionada.";
	}

	if ((form.getValue('funcao') == null) || (form.getValue('funcao').trim() == "")) {
		mensagem += "<br>A função deve ser selecionada.";
	}

	if ((form.getValue('idvalidade') == null) || (form.getValue('idvalidade').trim() == "") || (form.getValue('idvalidade').trim() == "0")) {
		mensagem += "<br>Digital não verificada ou não reconhecida.";
	}


	if (mensagem != "") {
		throw mensagem;
	}
}