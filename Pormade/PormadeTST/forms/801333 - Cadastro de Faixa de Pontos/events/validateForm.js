function validateForm(form) {

    var cpPontos = form.getValue('pontos')
    var cpPontsHide = form.getValue('pontosHide')

    var c1 = DatasetFactory.createConstraint("pontosHide", cpPontsHide, cpPontsHide, ConstraintType.MUST)
    var ds = DatasetFactory.getDataset("ds_cadastro_faixa_pontos", null, [c1], null);

    if (ds != undefined && ds.values != undefined && ds.values != "" && ds.values.length > 0) {
        throw "Faixa de pontos já cadastrada para " + cpPontos + " pontos"
    }
}