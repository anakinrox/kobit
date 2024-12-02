function zoom(componente, idCampoTexto) {
    var valor = null;

    if (idCampoTexto != null & idCampoTexto != undefined) {
        valor = $('#' + idCampoTexto).val();
        if (valor == '') {
            return false;
        }
        if (idCampoTexto.split('___')[1] != null && idCampoTexto.split('___')[1] != undefined) {
            componente += '___' + idCampoTexto.split('___')[1];
        }
    }

    //trata campos pai filho
    var campo = componente.split('___')[0];

    if (componente == 'bt_lojas') {
        modalzoom.open("Lojas",
            "dsk_flexy",
            "idLoja,ID,nome,Loja,referenceCode,Referencia",
            "idLoja,nome,referenceCode",
            "indacao,LOJAS",
            componente, false, "default", null, null,
            "nome");
    }

    if (componente == 'bt_empresa') {
        modalzoom.open("Empresas",
            "dsk_flexy",
            "codigo,ID,descricao,Empresa,lista,Lista",
            "codigo,descricao,lista",
            "indacao,EMPRESA",
            componente, false, "default", null, null,
            "descricao");
    }

    if (componente == 'bt_refFlex') {
        modalzoom.open("Ref. Flex",
            "dsk_flexy",
            "codigo,Codigo,descricao,Descricao",
            "codigo,descricao",
            "indacao,PRODUTOS",
            componente, false, "default", null, null,
            "descricao");
    }

    if (componente == 'bt_familia') {
        if (($('#cod_empresa_' + $this.instanceId).val() == "")) {
            FLUIGC.toast({
                message: 'O Campo  [ Empresa ] devem ser preenchido.',
                // type: 'danger'
            });
            return false;
        }

        modalzoom.open("Familia",
            "selectLogix",
            "cod_familia,Cod,den_familia,Descri&ccedil;&atilde;o",
            "cod_familia,den_familia",
            "table,familia,cod_empresa," + $('#cod_empresa_' + $this.instanceId).val() + ",order,den_familia",
            componente, false, 'default', null, null,
            "cod_familia||'-'||den_familia");
    }

    if (componente == 'btnAEN') {
        modalzoom.open("AEN",
            "selectLogix",
            "cod_aen,Cod,den_aen_compl,Descri&ccedil;&atilde;o",
            "cod_aen,den_aen_compl,cod_aen_like",
            "table,fluig_v_aen,order,cod_aen",
            componente, false, 'default', null, null,
            "cod_aen||'-'||den_aen_compl");
    }


    if (componente == 'bt_item') {
        var codFamilia = '';

        if ($('#md_cod_familia_' + $this.instanceId).val() == '') {
            FLUIGC.toast({
                message: 'O Campo  [ Família ]  devem ser preenchidos.',
                type: 'danger'
            });
            return false;
        }

        codFamilia = 'cod_familia,' + $('#md_cod_familia_' + $this.instanceId).val() + ',ies_situacao,A,';
        modalzoom.open("Item",
            "selectLogix",
            "cod_item,Cod,den_item,Descri&ccedil;&atilde;o",
            "cod_item,den_item",
            "table,item,cod_empresa," + $('#cod_empresa_' + $this.instanceId).val() + "," + codFamilia.trim() + "order,den_item",
            componente, false, 'default', null, null,
            "cod_item||'-'||den_item");
    }


}


function setSelectedZoomItem(selectedItem) {
    // Trata campos pai filhos
    var campo = selectedItem.type.split('___')[0];
    var seq = selectedItem.type.split('___')[1];



    if (campo == 'bt_lojas') {
        $('#id_loja_' + $this.instanceId).val(selectedItem.idLoja);
        $('#reference_code_' + $this.instanceId).val(selectedItem.referenceCode);
        $('#nome_loja_' + $this.instanceId).val(selectedItem.nome);
    }

    if (campo == 'bt_empresa') {
        $('#cod_empresa_' + $this.instanceId).val(selectedItem.codigo);
        $('#cod_lista_flexy_' + $this.instanceId).val(selectedItem.lista);
        $('#nome_empresa_' + $this.instanceId).val(selectedItem.descricao);
    }

    if (campo == 'bt_item') {
        $('#md_cod_item_' + $this.instanceId).val(selectedItem.cod_item);
        $('#md_nome_item_' + $this.instanceId).val(selectedItem.den_item);
    }

    if (campo == 'bt_refFlex') {
        $('#datatable-input-refFlexy').val(selectedItem.codigo);
        // $('#ref_nome_itemF_' + $this.instanceId).val(selectedItem.descricao);
    }


    if (selectedItem.type == 'bt_familia') {
        $('#cod_familia_' + $this.instanceId).val(selectedItem.cod_familia);
        $('#den_familia_' + $this.instanceId).val(selectedItem.den_familia);
    }

    if (selectedItem.type == 'btnAEN') {
        $('#cod_aen_' + $this.instanceId).val(selectedItem.cod_aen);
        $('#den_aen_' + $this.instanceId).val(selectedItem.den_aen_compl);
    }



}

//Deleta conteúdo dos campos
function del(componente, componenteFocus) {
    var x = 0;

    var lista = componente.split(",");


    if (document.getElementsByName(lista[x])[0] != null) {
        for (x; x < lista.length; x++) {
            document.getElementsByName(lista[x])[0].value = "";
        }
        if (componenteFocus != "")
            document.getElementsByName(componenteFocus)[0].focus();
    }
    else {
        alert("O campo nao esta habilitado.");
    }
}

//Carrega combo a partir de dataset
//Exemplo chamada loadDsCombo('empresa_' + $this.instanceId, 'empresa_cad_item', 'cod_empresa_matriz', 'den_empresa_matriz', '', '', 'den_empresa_matriz', 'N', 'S', 'S');
function loadDsCombo(combo, dataSet, fieldCodigo, fieldDesc, fieldFilter, fieldFilterValue, fieldOrder, printCod, clear, addblank) {

    if (!$('#' + combo).is('select')) {
        return false;
    }

    var constraintsFilhos = new Array();
    var lstFilter = fieldFilter.split(',');
    var lstFilterValue = fieldFilterValue.split(',');
    for (var j = 0; j < lstFilter.length; j++) {
        console.log('Passo 00X', lstFilter[j], lstFilterValue[j]);
        if (lstFilter[j] != '' && lstFilter[j] != null) {
            constraintsFilhos.push(DatasetFactory.createConstraint(lstFilter[j], lstFilterValue[j], lstFilterValue[j], ConstraintType.MUST));
        }
    }
    var orderFilhos = new Array();
    var lstOrder = fieldOrder.split(',');
    for (var j = 0; j < lstOrder.length; j++) {
        orderFilhos.push(lstOrder[j]);
    }
    var fieldFilhos = new Array(fieldCodigo, fieldDesc);
    var datasetFilhos = DatasetFactory.getDataset(dataSet, fieldFilhos, constraintsFilhos, orderFilhos);

    if (datasetFilhos != null) {

        if (clear == 'S') {
            $("#" + combo + " option").remove();
        }
        var valDefault = "";
        if ($("#" + combo).val() != "" && $("#" + combo).val() != null && $("#" + combo).val() != undefined) {
            valDefault = $("#" + combo).val();
        }
        if (addblank == 'S') {
            $("#" + combo).append("<option value='' ></option>");
        }
        var filhos = datasetFilhos.values;
        for (var i in filhos) {
            var filho = filhos[i];
            var den = '';

            if ($.inArray(filho[fieldCodigo], getOptCombo(combo)) > -1) {
                continue;
            }
            if (fieldDesc == '') {
                den = filho[fieldCodigo];
            } else {
                if (printCod == 'S' || printCod == undefined) {
                    den = filho[fieldCodigo] + ' - ' + filho[fieldDesc];
                } else {
                    den = filho[fieldDesc];
                }
            }
            $("#" + combo).append("<option value='" + filho[fieldCodigo] + "' >" + den + "</option>");
        }
        if (valDefault != '') {
            $("#" + combo).val(valDefault);
        }
    }
}

//Parte da função loadDsCombo
function getOptCombo(combo) {
    var optArray = new Array();
    $("#" + combo + " option").each(function () {
        optArray.push($(this).val());
    });
    return optArray;
}

//Carrega dados do modal para seleção
var modalzoom = (function () {
    var zoommodal = null;
    var loading = FLUIGC.loading(window);
    return {
        open: function (title, dataset, fields, resultfields, filters, type, iniVazio, size, likefield, likevalue, searchby) {

            parent.$('#workflowView-cardViewer').css('zIndex', 1);
            loading.show();

            var showfields = [];
            var globaldataset = [];
            var current = 0;
            var sqlLimit = 300;
            var tipo = type;

            if (size == '' || size == undefined || size == 'default')
                size = "large";

            var id = 'modal-zoom-' + type;

            if (zoommodal != null) {
                zoommodal.remove();
                zoommodal = null;

                $(".table-zoom > thead").html("");
                $(".table-zoom > tbody").html("");
            }

            var html = "<body class='fluig-style-guide' >" +
                "<div class='input-group'>" +
                "<span class='input-group-addon'><span class='fluigicon fluigicon-search'></span></span>" +
                "<input type='text' class='form-control' id='search' placeholder='Digite o texto e utilize o <Enter> para buscar'>" +
                "</div>" +
                "<div class='table-responsive' style='overflow: auto; height: 220px;'>" +
                "<table class='table table-hover table-zoom'>" +
                "<thead>" +
                "</thead>" +
                "<tbody>" +
                "</tbody>" +
                "</table>" +
                "</div>" +
                "</body>";

            var dosearch = function () {
                var url = urlrequest();
                $(".table-zoom > tbody").html("");

                loading.show();

                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: url,
                    data: "",
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log("dataset error", XMLHttpRequest, textStatus, errorThrown)
                    },
                    success: function (data, status, xhr) {
                        var dataset = data["invdata"];
                        readydataset(dataset);
                    }
                });
            }

            var urlrequest = function () {
                var request = "/ecm/api/rest/ecm/dataset/",
                    json = {};

                if (dataset != null) {
                    request += "getDatasetZoom";
                    json.datasetId = dataset;
                } else if (cardDatasetId != null) {
                    request += "getCardDatasetValues";
                    json.cardDatasetId = cardDatasetId;
                }

                if (resultfields != null && resultfields.length > 0) {
                    json.resultFields = trimarray(resultfields.split(","));
                }

                if (filters != null && filters.length > 0) {
                    json.filterFields = trimarray(filters.split(","));
                    for (var x = 0; x < json.filterFields.length; x++) {
                        if (json.filterFields[x] == "sqlLimit") {
                            sqlLimit = json.filterFields[x + 1];
                        }
                    }
                }

                if (likefield != null && likefield.length > 0 && likevalue != null && likevalue.length > 0) {
                    json.likeField = likefield;
                    json.likeValue = likevalue;
                }

                var searchValue = $("#search").val();
                if (searchValue && searchValue.length > 0) {
                    json.searchValue = searchValue;

                    if (searchby && searchby != "") {
                        json.searchField = searchby;
                    } else {
                        json.searchField = fields.split(",")[0];
                    }
                }

                return request += "?json=" + encodeURI(JSON.stringify(json));
            };

            var trimarray = function (fields) {
                for (var i = 0; i < fields.length; i++) {
                    fields[i] = fields[i].trim();
                }
                return fields;
            }

            var readydataset = function (dataset) {

                globaldataset = dataset;

                if (dataset.length == 1 && size == 'none') {
                    var row = dataset[0];
                    row["type"] = type;
                    row["size"] = size;
                    setSelectedZoomItem(row);
                    loading.hide();
                    return true;
                }

                var linhas = 0;
                for (var i = 0; i < dataset.length; i++) {
                    var row = dataset[i];
                    linhas += 1;
                    var html = "<tr data-dataset=" + i + ">";
                    for (var x = 0; x < showfields.length; x++) {
                        html += "<td>" + row[showfields[x]] + "</td>";
                    }
                    html += "</tr>";
                    $(".table-zoom > tbody").append(html);
                }
                $(".table-zoom > tbody > tr").click(function () {
                    $(".table-zoom > tbody > tr").removeClass("active");
                    $(this).addClass("active");
                    current = $(this).data("dataset");
                });
                $(".table-zoom > tbody > tr").dblclick(function () {
                    var row = globaldataset[$(this).data("dataset")];
                    row["type"] = type;
                    row["size"] = size;
                    setSelectedZoomItem(row);
                    zoommodal.remove();
                });
                $('#msg').remove();
                if (linhas == sqlLimit) {
                    $('#' + id + " .modal-footer").prepend('<span id="msg"  name="msg" style="text-align: left;color: red;float: left;"><b> *Foram listados ' + sqlLimit + ' registros, refine sua busca!</b></span>');
                }
                loading.hide();
            }

            if (size == 'none') {
                dosearch();
                return true;
            }

            var zoommodal = FLUIGC.modal({
                title: title,
                content: html,
                formModal: false,
                size: size,
                id: id,
                actions: [{
                    'label': 'Selecionar',
                    'classType': 'btn-success zoom-selected',
                    'autoClose': true,
                }, {
                    'label': 'Fechar',
                    'classType': 'zoom-fechar',
                    'autoClose': true
                }]
            },
                function (err, data) {
                    if (err) {
                        FLUIGC.toast({ title: 'Erro:', message: err, type: 'danger' });
                    } else {
                        var searchtable = function (text) {
                            var table = $('.table-zoom > tbody');
                            table.find('tr').each(function (index, row) {
                                var allCells = $(row).find('td');
                                if (allCells.length > 0) {
                                    var found = false;
                                    allCells.each(function (index, td) {
                                        var regExp = new RegExp(text, 'i');
                                        if (regExp.test($(td).text())) {
                                            found = true;
                                            return false;
                                        }
                                    });
                                    if (found == true) $(row).show(); else $(row).hide();
                                }
                            });
                        }

                        var setup = function (lista) {
                            var l = lista.split(",");
                            var html = "<tr>";
                            for (var i = 0; i < l.length; i++) {
                                showfields.push(l[i]);
                                html += "<th>" + l[i + 1] + "</th>"
                                i++;
                            }
                            html += "</tr>";
                            $(".table-zoom > thead").append(html);
                        }

                        var timeout;
                        $('#search').keyup(function () {
                            clearTimeout(timeout);
                            var keycode;
                            if (window.event) {
                                keycode = window.event.keyCode;
                            } else if (event) {
                                keycode = event.which;
                            } else {
                                return true;
                            }
                            if (keycode == 13 && $("#search").val().length >= 3) {
                                dosearch();
                            } else {
                                timeout = setTimeout(searchtable($(this).val()), 500);
                            }
                        });

                        $('.zoom-selected').click(function () {
                            var row = globaldataset[current];
                            row["type"] = type;
                            row["size"] = size;
                            setSelectedZoomItem(row);
                        });

                        $('.zoom-fechar').click(function () {
                            clearSelectedZoomItem(type);
                        });

                        setup(fields);
                        if (!iniVazio)
                            dosearch();
                        else
                            loading.hide();
                    }
                });

        }
    }
})();