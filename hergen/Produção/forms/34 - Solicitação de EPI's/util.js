function addLineTable() {
    var id = wdkAddChild("epi");
    $("#quantidade___" + id).val("1");
    $("#indice___" + id).val(id);
    zoom("codigo_epi___" + id);
}

function removeLineTable(obj) {
    fnWdkRemoveChild(obj);
}

function f_validaDigital() {

    try {

        if ($('#nome_funcionario').val() == '' || $('#cracha').val() == '') {
            FLUIGC.toast({
                message: 'Deve selecionar um funcionário primeiro',
                type: 'danger'
            });
            return false;
        }

        var wArrDigitais = new Array();

        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint('cracha', $('#cracha').val(), $('#cracha').val(), ConstraintType.MUST));
        var datasetPrincipal = DatasetFactory.getDataset("ds_cadastro_funcionario", null, constraints, null);
        if (datasetPrincipal.rowsCount == 0) {
            throw "Cadastro de funcinoário não encontrado";
        } else {
            var regs = new Array();
            for (var i = 0; i < datasetPrincipal.values.length; i++) {

                var documentId = datasetPrincipal.values[i]["metadata#id"];
                var documentVersion = datasetPrincipal.values[i]["metadata#version"];

                var constraintsFilhos = new Array();
                constraintsFilhos.push(DatasetFactory.createConstraint("tablename", "tblDigital", "tblDigital", ConstraintType.MUST));
                constraintsFilhos.push(DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST));
                constraintsFilhos.push(DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST));

                //Busca o dataset
                var datasetFilhos = DatasetFactory.getDataset("ds_cadastro_funcionario", null, constraintsFilhos, null);
                if (datasetFilhos.values.length > 0) {
                    for (var j = 0; j < datasetFilhos.values.length; j++) {
                        wArrDigitais.push(datasetFilhos.values[j]["hash_digital"])
                    }
                } else {
                    FLUIGC.toast({
                        message: 'Funcionário sem digitais cadastradas. validar com o RH',
                        type: 'danger'
                    });
                    return false;
                }
            }

        }

        console.log('Digitais: ' + JSON.stringify(wArrDigitais));

        var payload = {
            "templates": wArrDigitais
        }

        $.ajax({
            url: 'http://localhost:5000/api/Match',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            dataType: 'json',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            success: function (data) {

                // alert(data.template)
                if (data.success == true) {
                    FLUIGC.toast({
                        message: 'Digital verificada!',
                        type: 'success',
                        timeout: 'fast'
                    });

                    $('#idvalidade').val('1');
                    $('#hash_utilizado').val(data.template);
                    $('#hash_cadastrada').val(JSON.stringify(wArrDigitais));
                } else {
                    FLUIGC.toast({
                        message: 'Digital não reconhecida, favor tentar novamente',
                        type: 'danger'
                    });
                    $('#idvalidade').val('0');
                    return false;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                FLUIGC.toast({
                    message: 'Digital não reconhecida, favor tentar novamente',
                    type: 'danger'
                });
                $('#idvalidade').val('0');
                return false;
            }
        });
    } catch (error) {
        // alert('Error: ' + error);
    }



}