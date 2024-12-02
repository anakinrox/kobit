function validateForm(form) {
    var mensagem = "";

    if ((form.getValue('cod_papel') == null) || (form.getValue('cod_papel').trim() == "")) {
        mensagem = "O Papel é obrigatório ser selecionado.";
    }


    if (mensagem != "") {
        throw mensagem;
    }
}

