function validateForm(form) {

    if ((form.getValue("dt_inicio") == null || form.getValue("dt_inicio") == "") || (form.getValue("dt_fim") == null || form.getValue("dt_fim") == "")) {
        throw "Período não informado!";
    }

    var datInicio = form.getValue('dt_inicio')
    var datFim = form.getValue('dt_fim')

    var ct = new Array();
    ct.push(DatasetFactory.createConstraint("dtInicio", datInicio, datInicio, ConstraintType.MUST));
    ct.push(DatasetFactory.createConstraint("dtFIm", datFim, datFim, ConstraintType.MUST));
    var ds = DatasetFactory.getDataset("dsk_periodos_portal", null, ct, null);

    if (ds != undefined && ds.values != undefined && ds.values != "" && ds.values.length > 0) {
        if (ds.getValue(0, "status") == true) {
            throw "Período já cadastro anteriormente!!."
        }

    }
}


