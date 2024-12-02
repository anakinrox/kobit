function validateForm(form) {
	var mensagem = "";

	if ((form.getValue('matricula') == null) || (form.getValue('matricula').trim() == "")) {
		mensagem = "A matricula deve ser selecionada.";
	}

	if (form.getValue('terceiro') == "S") {

		if ((form.getValue('cracha') == null) || (form.getValue('cracha').trim() == "")) {
			mensagem += "<br>Numero do cracha deve ser informado quando o funcionário for Terceiro";
		}

		if ((form.getValue('nome_funcionario') == null) || (form.getValue('nome_funcionario').trim() == "")) {
			mensagem += "<br>O nome do funcionário deve ser informado quando o funcionário for Terceiro";
		}

		if ((form.getValue('cod_fornecedor') == null) || (form.getValue('cod_fornecedor').trim() == "")) {
			mensagem += "<br>Um Fornecedorve ser selecionada quando o funcionário for Terceiro";
		}

		if ((form.getValue('funcao') == null) || (form.getValue('funcao').trim() == "")) {
			mensagem += "<br>Uma função ser selecionada quando o funcionário for Terceiro";
		}

		if ((form.getValue('ccusto') == null) || (form.getValue('ccusto').trim() == "")) {
			mensagem += "<br>Um Centro e Custo ser selecionada quando o funcionário for Terceiro";
		}
	}


	if (mensagem != "") {
		throw mensagem;
	}
}