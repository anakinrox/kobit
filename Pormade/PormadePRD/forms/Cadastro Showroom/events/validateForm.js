function validateForm(form) {
    var mensagem = "";

    if ((form.getValue('nome_cidade') == '') || (form.getValue('uf_cidade').trim() == '')) {
        mensagem += "A Cidade é obrigatório ser selecionado.<br>";
    }

    if (form.getValue('endereco') == '') {
        mensagem += "O endereco é obrigatório ser informado.<br>";
    }

    if (form.getValue('bairro') == '') {
        mensagem += " O Bairro é obrigatório ser informado.<br>";
    }

    if (form.getValue('responsavel') == '') {
        mensagem += " O Responsável é obrigatório ser informado.<br>";
    }

    if (form.getValue('email') == '') {
        mensagem += " O E-mail é obrigatório ser informado.<br>";
    }

    if (form.getValue('telefone') == '') {
        mensagem += " O Telefone é obrigatório ser informado.<br>";
    }

    if (form.getValue('atendimento') == '') {
        mensagem += " O Horário de Atendimento é obrigatório ser informado.<br>";
    }

    if (form.getValue('doc_imagem') == '') {
        mensagem += " A Foto é obrigatório ser informado.";
    }

    if (mensagem != "") {
        throw mensagem;
    }
}

