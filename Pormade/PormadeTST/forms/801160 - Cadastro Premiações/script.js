var editar;
$(window).on('load', function () {
    var dtInicio = FLUIGC.calendar('#dataInicio', {
        dateFormat: 'dd/mm/yyyy'
    });
    var dtFinal = FLUIGC.calendar('#dataFinal', {
        dateFormat: 'dd/mm/yyyy'
    });
    var dtInicioResgate = FLUIGC.calendar('#dataInicioResgate', {
        dateFormat: 'dd/mm/yyyy'
    });
    var dtFinalResgate = FLUIGC.calendar('#dataFinalResgate', {
        dateFormat: 'dd/mm/yyyy'
    });
    // editar = FLUIGC.richeditor('txtPremio')
    // editar.setData($("#txtPremio").val())

    getListDocument()
});

function convertToBase64(e) {
    var idx = e.id.split("___")
    idx = idx[1]
    $("#btnRemove___" + idx).val(idx)
    console.log(e.id)
    var imageBase64;

    var input = document.getElementById('fotoPremio___' + idx);
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imageBase64 = e.target.result;
            document.getElementById('imgBase64___' + idx).value = imageBase64
            console.log(imageBase64); // Aqui você pode utilizar a string base64 como desejar
        };

        reader.readAsDataURL(input.files[0]);
    }

    window.setTimeout(function () {
        var imgArr = $("#imgBase64___" + idx).val()
        var imgLogo = $("#imagemFoto___" + idx)
        imgLogo = imgLogo.closest("div")
        var buttonElement = `<button type="button" id="${idx}" class="btn btn-danger btns"
        onclick="deletaImagem(this)" class="form-control">
        <i style="color: white;"
            class="fluigicon fluigicon-remove icon-sm"></i></button>`
        var imgElement = `<img src="${imgArr}" alt="Foto Ilustrativa" class="logotipo">`;
        imgLogo.append(buttonElement)
        imgLogo.append(imgElement)

        salvaImagem(e)
        $("#imgBase64___" + idx).val("")
    }, 1000)
}
function verificarImagem(inputElement) {
    const maxSizeInBytes = 47 * 1024;

    if (!verificarTamanhoImagem(inputElement, maxSizeInBytes)) {
        alert("A imagem é muito grande. Por favor, selecione uma imagem menor.");
        inputElement.value = ''; // Limpa o valor do input para permitir selecionar outra imagem
    }
}
function verificarTamanhoImagem(inputElement, maxSizeInBytes) {
    if (!inputElement.files || !inputElement.files[0]) {
        // Nenhum arquivo selecionado
        return true;
    }

    const file = inputElement.files[0];
    const fileSizeInBytes = file.size;

    if (fileSizeInBytes > maxSizeInBytes) {
        // O tamanho do arquivo excede o limite
        return false;
    }

    return true;
}

function salvaImagem(e) {
    var idx = e.id.split("___")
    idx = idx[1]
    //Quando o fotoPremio é colocado ocorre o change
    console.log("salvaImagem" + e.id)
    if ($("#" + e.id).val() != "") {
        console.log('dentro do if' + e.id)
        var arquivo = $("#" + e.id).val();
        if (arquivo != "" && arquivo != null && arquivo != undefined) {
            arquivo = arquivo.split("\\")[2];
            console.log("if2" + arquivo)

            var fotoPremio = document.getElementById(e.id).files[0];
            var url = "" //WCMAPI.getServerURL().replace(':443', '');
            var request_arquivos = {
                url: url + '/api/public/2.0',
                method: 'POST'
            };
            // FLUIGC.loading($("#mensagem").parents("#wcm-content")).show()
            // Salva em pasta temporária
            $.ajax({
                type: 'POST',
                url: request_arquivos.url + '/contentfiles/upload?fileName=' + arquivo,
                data: fotoPremio,
                async: false,
                processData: false,
                contentType: 'application/octet-stream',
                headers: ""
            }).then(response => {
                console.log("resposta" + response)
                var data = new Date()
                var hora = data.getHours()
                if (hora < 10) {
                    hora = "0" + hora;
                }
                var minuto = data.getMinutes()
                if (minuto < 10) {
                    minuto = "0" + minuto;
                }
                var horaAnexo = hora + ":" + minuto
                var dados = {
                    "documentDescription": arquivo,
                    "parentDocumentId": 1279232,
                    "additionalComments": horaAnexo,
                    "inheritSecurity": true,
                    "internalVisualizer": true
                }
                // Salva no GED
                $.ajax({
                    type: 'POST',
                    url: request_arquivos.url + '/documents/createDocument',
                    dataType: 'json',
                    data: JSON.stringify(dados),
                    contentType: 'application/json',
                    async: false,
                    headers: ""
                }).then(response => {
                    console.log(response)

                    $("#idImagem___" + idx).val(response.content.documentId)
                    FLUIGC.toast({
                        timeout: 4000,
                        title: 'Anexo ',
                        message: 'Anexo salvo com sucesso!',
                        type: 'success'
                    });
                    // $("#htmlAnexo").children("ul").remove()
                    // _this.getAnexos();
                    // FLUIGC.loading($("#mensagem").parents("#wcm-content")).hide()
                });
            });
        }


    }
    // $("#fotoPremio").val("");

}

var getListDocument = function (docId) {

    var url = "" //WCMAPI.getServerURL().replace(':443', '');
    var listDocuments = ''
    var request_arquivos = {
        url: url + '/api/public/ecm/document/listDocument/801212',
        method: 'GET'
    };
    $.ajax({
        async: false,
        contentType: "application/json",
        url: request_arquivos.url,
        type: request_arquivos.method,
        headers: ""
    })
        .done(function (data) {
            listDocuments = data.content
        });
    var cpTamanho = $("[id^='idImagem___']").length
    for (var i = 0; i <= cpTamanho; i++) {
        var idImagem = $("#idImagem___" + i).val()
        var imgLogo = $("#imagemFoto___" + i)
        imgLogo = imgLogo.closest("div")

        for (var j = 0; j < listDocuments.length; j++) {
            console.log("id" + listDocuments[j]["id"])
            if (idImagem == listDocuments[j]["id"]) {
                var imgArr = listDocuments[j]["fileURL"]

                var buttonElement = `<button type="button" id="${i}" class="btn btn-danger btns"
                onclick="deletaImagem(this)" class="form-control">
                <i style="color: white;"
                    class="fluigicon fluigicon-remove icon-sm"></i></button>`
                var imgElement = `<img src="${imgArr}" alt="Foto Ilustrativa" class="logotipo">`;
                imgLogo.append(buttonElement)
                imgLogo.append(imgElement)
            }
        }
    }

    return listDocuments;
}

function verificaResgate() {
    var cadastroOk = $('input[name=checkResgate]:checked').val()
    if (cadastroOk == "nao")
        $("#regrasData").addClass('hidden')
    if (cadastroOk == "sim")
        $("#regrasData").removeClass('hidden')
}

function deletaImagem(e) {
    var index = e.id
    var idImg = $("#idImagem___" + index).val()
    console.log(idImg)
    var url = "" //WCMAPI.getServerURL().replace(':443', '');
    var request_arquivos = {
        url: url + `/api/public/2.0/documents/deleteDocument/${idImg}`,
        method: 'POST'
    };
    $.ajax({
        async: false,
        contentType: 'application/json',
        url: request_arquivos.url,
        type: request_arquivos.method,
        headers: ""
    }).done(function (data) {
        fnWdkRemoveChild(e)
    });
}

//oauth.toHeader(oauth.authorize(request_arquivos, token))