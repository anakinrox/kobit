function enableFields(form) {
    var atividade = getValue('WKNumState');

    if (atividade == 5) {
        form.setEnabled('respAprov', false);
        form.setEnabled('tipoApontamento', false);
        form.setEnabled('obsApontamento', false);
        form.setEnabled('btnRemove', false);
        var indexes = form.getChildrenIndexes("tbApontamento");
        for (var i = 0; i < indexes.length; i++) {
            form.setEnabled('dataApontada___' + indexes[i], false);
            form.setEnabled('horaEntrada1___' + indexes[i], false);
            form.setEnabled('horaEntrada2___' + indexes[i], false);
            form.setEnabled('horaEntrada3___' + indexes[i], false);
            form.setEnabled('horaEntrada4___' + indexes[i], false);
            form.setEnabled('horaSaida1___' + indexes[i], false);
            form.setEnabled('horaSaida2___' + indexes[i], false);
            form.setEnabled('horaSaida3___' + indexes[i], false);
            form.setEnabled('horaSaida4___' + indexes[i], false);
            form.setEnabled('btnRemove___' + indexes[i], false);
        }
    }
}