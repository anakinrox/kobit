$(window).on('load', function () {
    var activity = getState();

    if (activity == 4 || activity == 0) {
        addChild()
        getIdCcusto()
    }
    if (activity == 5) {
        $("#btnAddChild").addClass("hidden")
        $("button, #btnRemove").addClass("hidden")
    } else {
        $("#btnAddChild").removeClass("hidden")
        $("#btnRemove").removeClass("hidden")
    }
    // if (getMobile() == "true") {
    //     getIdCcusto()
    // }
})

function addChild() {
    var index = wdkAddChild('tbApontamento');

    $("#horaEntrada1___" + index).mask('00:00')
    $("#horaSaida1___" + index).mask('00:00')
    $("#horaEntrada2___" + index).mask('00:00')
    $("#horaSaida2___" + index).mask('00:00')
    $("#horaEntrada3___" + index).mask('00:00')
    $("#horaSaida3___" + index).mask('00:00')
    $("#horaEntrada4___" + index).mask('00:00')
    $("#horaSaida4___" + index).mask('00:00')
}

function addCalendar(e) {
    var index = e.id
    FLUIGC.calendar("#" + index, {
        dateFormat: 'dd/mm/yyyy',
        maxDate: new Date()
    });
}

function validaHora(e) {
    var cpHora = e.id
    var horaVal = e.value
    var validaTamanho = horaVal.split("")
    horaVal = horaVal.split(':')
    if (horaVal[0] > 23 || horaVal[1] > 59 || validaTamanho.length < 5) {
        $("#" + cpHora).val("")
        $("#" + cpHora).focus()
        FLUIGC.toast({
            title: "Hora inválida!",
            message: "Favor inserir horário até as 23:59",
            type: "danger"
        });
    }
}

function calculaHoras(e) {
    var idCpHora = e.id
    var idHoras = idCpHora.split("___")

    var posCp = idHoras[0]
    posCp = posCp.split("")
    var iCp = posCp.length - 1
    posCp = posCp[iCp]

    var horaInicial = $("#horaEntrada" + posCp + "___" + idHoras[1]).val()
    var horaFinal = e.value

    if (validarHoras(horaInicial, horaFinal)) {
    } else {
        FLUIGC.toast({
            title: "Hora da Saída menor que a hora da Entrada!",
            message: "",
            type: "danger"
        });
        $("#" + idCpHora).val("")
        $("#" + idCpHora).focus()
    }
}

function validarHoras(horaInicial, horaFinal) {
    const horaInicialObj = new Date(`01/01/2000 ${horaInicial}`);
    const horaFinalObj = new Date(`01/01/2000 ${horaFinal}`);

    if (horaFinalObj < horaInicialObj) {
        return false;
    }
    return true;
}

function getIdCcusto() {
    var idUser = $("#registroColab").val()
    var dsCentroCusto = DatasetFactory.getDataset("centro_de_custo", null, null, null)

    for (var i = 0; i < dsCentroCusto.values.length; i++) {
        var codigoCc = dsCentroCusto.values[i]["cod_cc"]

        var documentId = dsCentroCusto.values[i]["metadata#id"];
        var documentVersion = dsCentroCusto.values[i]["metadata#version"];

        //Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
        var c1 = DatasetFactory.createConstraint("tablename", "aprov_entrada_saida", "aprov_entrada_saida", ConstraintType.MUST);
        var c2 = DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST);
        var c3 = DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST);
        var constraintsFilhos = new Array(c1, c2, c3);

        var dsAprov = DatasetFactory.getDataset("centro_de_custo", null, constraintsFilhos, null);
        console.log(dsAprov.values)
        for (var j = 0; j < dsAprov.values.length; j++) {
            console.log(dsAprov.values[j]["matricula"])
            console.log(dsCentroCusto.values[i]["matricula_resp_garantia"])
            if (idUser == dsAprov.values[j]["matricula"]) {
                console.log(dsCentroCusto.values[i]["matricula_resp_garantia"])
                $("#codAprov").val(dsCentroCusto.values[i]["matricula_resp_garantia"])
                $("#respAprov").val(dsCentroCusto.values[i]["nome_resp_garantia"])

            }
        }
    }


    console.log("idUSer > " + idUser)

    //var c1 = DatasetFactory.createConstraint("codigo", idUser, idUser, ConstraintType.MUST);
    // var dsGetCentroCusto = DatasetFactory.getDataset("dsk_teste", null, null, null);

    // for (var i = 0; i < dsGetCentroCusto.values.length; i++) {
    //     if (dsGetCentroCusto.values[i]["codigo"] == idUser) {
    //         $("#codCcusto").val(dsGetCentroCusto.values[i]["codCcusto"])
    //     }
    // }

    // var codCc = $("#codCcusto").val()
    // reloadZoomFilterValues("respAprov", "COD_RESP," + codCc);
}


/*
var beforeSendValidate = function (numState, nextState) {
    var result = "";
    var breakLine = "\n";

    if (numState == 0 || numState == 4) {
        if ($("#codAprov").val() == null || $("#codAprov").val() == "") {
            result += "- Selecione o Responsável pela Aprovação! " + breakLine;
        }
    }
}
*/