function validateForm(form) {
    var mensagem = "";

    if ((form.getValue('id_curso') == null) || (form.getValue('id_curso').trim() == "")) {
        mensagem = "O Curso é obrigatório ser selecionado.";
    }


    if (mensagem != "") {
        throw mensagem;
    }
}

