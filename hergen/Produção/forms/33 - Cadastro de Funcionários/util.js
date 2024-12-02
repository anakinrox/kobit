function addLineTable(pTable) {

    if (pTable == 'epi') {
        var id = wdkAddChild("epi");
        zoom("cod_item___" + id);
    }

    if (pTable == 'digital') {
        if ($("#matricula").val() == null || $("#matricula").val() == '') {
            FLUIGC.toast({
                message: 'Deve selectionar um funcionário primeiro!',
                type: 'danger'
            });
            $('#idvalidade').val('0');
            return false;
        }

        $.ajax({
            url: 'http://localhost:5000/api/Enroll',
            type: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            success: function (data) {
                //wacky nested anonymous callbacks go here
                var id = wdkAddChild("tblDigital");

                $("#seq_digital___" + id).val(id);
                $("#datahora_digital___" + id).val(dataAtualFormatada);
                $("#hash_digital___" + id).val(data.template);
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });

    }
}

function removeLineTable(obj) {
    fnWdkRemoveChild(obj);
}


function dataAtualFormatada() {
    var data = new Date(),
        dia = data.getDate().toString(),
        diaF = (dia.length == 1) ? '0' + dia : dia,
        mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}