function validateForm(form) {
    var mensagem = "";

    console.log("Empresa: ...." + form.getValue("cod_empresa"))

    if (form.getValue("cod_empresa") == "") {
        mensagem += '- Campo Empresa deve ser informado.<br>';
    }


    if (form.getValue("cod_cliente_fat") == "") {
        mensagem += '- Campo Cliente de faturamento deve ser informado.<br>';
    }

    if ((form.getValue("cod_natureza_fat") == "") || (form.getValue("cod_finalidade_fat") == "") ||
        (form.getValue("cod_cond_pgto_fat") == "") ||(form.getValue("cod_carteira_fat") == "")){
        mensagem += '- As informações de Natureza, Finalidade, Cond. Pgto e Carteira devem ser informadas para o Faturamento.<br>';
    }


    if (form.getValue("tipo_venda") == "dropshipping") {
        if ((form.getValue("cod_natureza_rem") == "") || (form.getValue("cod_finalidade_rem") == "") ||
            (form.getValue("cod_cond_pgto_rem") == "")|| (form.getValue("cod_carteira_rem") == "")) {
            mensagem += 'As informações de Natureza, Finalidade, Cond. Pgto e Carteira são obrigatória para tipo de venda "dropshipping".<br>';
        }
    }

        


    if (mensagem != "") {
        throw mensagem;
    }
}