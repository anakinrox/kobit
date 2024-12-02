function afterStateEntry(sequenceId) {
    var user = getValue("WKUser");
    var wNumProcesso = getValue("WKNumProces");
    var wCodRepres = hAPI.getCardValue("cod_repres");

    if (sequenceId == 5) {
        if (wCodRepres.trim() == '' || wCodRepres == undefined) { return false; }

        var wNumTelefone = f_getTelefoneRepres(wCodRepres.trim());
        if (wNumTelefone == null) { return false; }


        var wMensagem = 'Processo ' + wNumProcesso + ' está em Análise Comercial.'
        f_enviaMensagem(wNumTelefone, wMensagem);
    }

    if (sequenceId == 24) {
        if (wCodRepres.trim() == '' || wCodRepres == undefined) { return false; }

        var wNumTelefone = f_getTelefoneRepres(wCodRepres.trim());
        if (wNumTelefone == null) { return false; }

        var wMensagem = 'Processo ' + wNumProcesso + ' do cliente ' + hAPI.getCardValue("nom_cliente") + ' enviado para ser revisão.'
        f_enviaMensagem(wNumTelefone, wMensagem);
    }

    if (sequenceId == 12) {
        if (wCodRepres.trim() == '' || wCodRepres == undefined) { return false; }

        var wNumTelefone = f_getTelefoneRepres(wCodRepres.trim());
        if (wNumTelefone == null) { return false; }

        var wMensagem = 'Processo ' + wNumProcesso + ' do cliente ' + hAPI.getCardValue("nom_cliente") + ' aprovado comercialmente.';
        f_enviaMensagem(wNumTelefone, wMensagem);

        var wMensagem = 'Processo ' + wNumProcesso + ' do cliente ' + hAPI.getCardValue("nom_cliente") + '  em analise financeira.';
        f_enviaMensagem(wNumTelefone, wMensagem);
    }

    if (sequenceId == 16) {
        if (wCodRepres.trim() == '' || wCodRepres == undefined) { return false; }

        var wNumTelefone = f_getTelefoneRepres(wCodRepres.trim());
        if (wNumTelefone == null) { return false; }

        var wMensagem = 'Processo ' + wNumProcesso + ' do cliente ' + hAPI.getCardValue("nom_cliente") + ' concluido no financeiro. ';
        wMensagem += 'A condição de pagamento aprovada foi ' + hAPI.getCardValue("den_cnd_pgto").trim() + ', e valor do limite de crédito liberado foi de R$ ' + hAPI.getCardValue("credito")
        f_enviaMensagem(wNumTelefone, wMensagem);

    }


}

function f_getTelefoneRepres(pCodRepres) {
    var wRetorno = null;

    if (pCodRepres == null || pCodRepres == '') { return wRetorno; }
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('cod_repres', pCodRepres, pCodRepres, ConstraintType.MUST));
    var dataset = DatasetFactory.getDataset("representante_compl", null, constraints, null);

    if (dataset != null && dataset.rowsCount > 0) {
        if (dataset.getValue(0, "num_celular").trim() == '') {
            return wRetorno;
        }

        if (dataset.getValue(0, "num_celular").replace('(', '').replace(')', '').replace(' ', '').substring(0, 2) != '55') {
            wRetorno = '55' + dataset.getValue(0, "num_celular").replace('(', '').replace(')', '').replace(' ', '');
        } else {
            wRetorno = dataset.getValue(0, "num_celular").replace('(', '').replace(')', '').replace(' ', '');
        }
    }

    return wRetorno;
}

function f_enviaMensagem(pNumTelefone, pMensagem) {
    var wRetorno = null;

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('indacao', 'ENVIAR', 'ENVIAR', ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('numtelefone', pNumTelefone, pNumTelefone, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('mensagem', pMensagem, pMensagem, ConstraintType.MUST));
    var dataset = DatasetFactory.getDataset("dsk_whats", null, constraints, null);

    if (dataset != null && dataset.rowsCount > 0) {
        if (data.getValue(0, "status") == true) {
            wRetorno = true;
        } else {
            wRetorno = false;
        }
    }

    return wRetorno
}