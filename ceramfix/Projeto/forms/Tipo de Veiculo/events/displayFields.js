function displayFields(form, customHTML) {
    //carrega o campo do código

    if (form.getValue('codigo') == '') {

        //recupera o ultimo registro desse form
        var ult_registro = 0;
        var ult_registro_encontrado = 0;
        var constraints = new Array();
        var dataset = DatasetFactory.getDataset("kbt_t_tipo_veiculo", null, constraints, null);

        if (dataset != null && dataset.rowsCount > 0) {
            for (i = 0; i < dataset.rowsCount; i++) {

                ult_registro_encontrado = parseInt(dataset.getValue(i, "codigo"));
                if (parseInt(ult_registro_encontrado) > parseInt(ult_registro)) {
                    form.setValue('codigo', (parseInt(ult_registro_encontrado)) + 1);
                    ult_registro = parseInt(ult_registro_encontrado);
                }
            }
        } else {
            form.setValue('codigo', ult_registro + 1);
        }

//        form.setValue('codigo', 1);
    }
    //fim carga do campo do código

}