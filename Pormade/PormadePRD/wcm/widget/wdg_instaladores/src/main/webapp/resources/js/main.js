var loadWindow = null;
function main() {
    loadWindow = FLUIGC.loading(window);
}

function openItens(id) {

    var load = FLUIGC.loading(window, { textMessage: 'Carregando Itens...' });
    load.show();

    // console.log('Novo Arquivo');

    var compon = new Array();
    compon['columns'] = ['select', 'seq', 'idproposta', 'produto', 'local'];
    compon['values'] = [];
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('indacao', 'ITEMPROPOSTA', 'ITEMPROPOSTA', ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('proposta', $('#md_id_proposta_' + $this.instanceId).val(), $('#md_id_proposta_' + $this.instanceId), ConstraintType.MUST));
    DatasetFactory.getDataset("dsk_instaladores", null, constraints, null, {
        success: (compon) => {
            // console.log('compon......', compon);

            var fields = [
                {
                    'field': 'select',
                    'titulo': '<input type="checkbox" id="checkAll" name="checkAll" class="form-control checkAll" \>',
                    'type': 'checkbox',
                    'style': 'margin-top:0px;padding-top: 0px;padding-bottom: 0px;',
                    'class': 'form-control checkItem',
                    'livre': '',
                    'width': '5%'
                },
                {
                    'field': 'seq',
                    'titulo': '<input type="text" id="seq" name="seq" class="form-control filter" placeholder="Sequencia" \>',
                    'type': 'text',
                    'style': 'padding: 0px;',
                    'class': 'form-control fs-text-right fs-sm-padding-right',
                    'livre': 'readonly="readonly"',
                    //'precision':3,
                    'width': '7%'
                },
                {
                    'field': 'idproposta',
                    'titulo': '<input type="text" id="idproposta" name="idproposta" class="form-control filter" placeholder="Proposta" \>',
                    'type': 'text',
                    'style': 'padding: 0px;',
                    'class': 'form-control fs-text-right fs-sm-padding-right',
                    'livre': 'readonly="readonly"',
                    //'precision':3,
                    'width': '7%'
                },
                {
                    'field': 'produto',
                    'titulo': '<input type="text" id="produto" name="produto" class="form-control filter" placeholder="Descrição" \>',
                    'type': 'text',
                    'style': 'padding: 0px;',
                    'class': 'form-control fs-sm-padding-left',
                    'livre': 'readonly="readonly"',
                    //'precision':3,
                    'width': '30%'
                },
                {
                    'field': 'local',
                    'titulo': '<input type="text" id="local" name="local" class="form-control filter" placeholder="Local" \>',
                    'type': 'text',
                    'style': 'padding: 0px;',
                    'class': 'form-control fs-sm-padding-left',
                    'livre': 'readonly="readonly"',
                    //'precision':3,
                    'width': '15%'
                },
            ];


            var retorno = modalTable('zoom_itens', 'Itens', fields, compon.values, 'large', id, 'N');
            load.hide();
            // console.log(retorno);
        }
    });
}


function returnModalTable(retorno) {
    // console.log('retorno.....', retorno.id, retorno);
    // var lista = retorno.idChave.split('___')[0].split('_')[2];
    if (retorno.id == 'zoom_itens') {
        var wNumLinha = null;
        var wItens = [];

        loadWindow.show();
        for (var i = 0; i < retorno.dados.length; i++) {
            if (retorno.dados[i].select == 'S') {
                var wRetorno = f_validaItemFilho(retorno.dados[i].seq.trim());
                if (wRetorno == false) {
                    var data = {
                        seq: retorno.dados[i].seq.trim(),
                        idproposta: retorno.dados[i].idproposta.trim(),
                        produto: retorno.dados[i].produto.trim(),
                        local: retorno.dados[i].local
                    }
                    wItens.push(data);
                }
            }
        }

        if (wItens.length > 0) {
            var regs = dataTableItemProposta.getData(0);
            for (var i = 0; i < wItens.length; i++) {
                var strIcone = '';
                strIcone += "<i class='fluigicon fluigicon-remove-circle icon-sm title='Remover Serviço' data-remover-row></i>";

                var datatableRow = {
                    proposta: wItens[i]["idproposta"],
                    seq: wItens[i]["seq"],
                    descricao: wItens[i]["produto"],
                    local: wItens[i]["local"],
                    ts: strIcone
                }
                regs.push(datatableRow);
            }
            dataTableItemProposta.reload(regs);
        }

        loadWindow.hide();

    }

    return true;

}


function fnCustomDelete(oElement) {

    // if ($('#task').val() != 1 && $('#task').val() != 0 && $('#task').val() != 6) {
    //     return false;
    // }

    fnWdkRemoveChild(oElement);
}


function onlynumber(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
    //var regex = /^[0-9.,]+$/;
    var regex = /^[0-9.]+$/;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}

function f_validaDisable(objClick, disable) {
    if ((disable == "") || (disable == null)) {

        if (objClick.id == "bt_itemClear") {
            $('.grp_user').val('');
            return false;
        }


        if (objClick.id == "bt_familiaClear") {
            $('.grp_familia').val('');
            return false;
        }

        if (objClick.id == "btnAENListaClear") {
            $('.aen_lista').val('');
            return false;
        }


        zoom(objClick.id)

    }

}

function f_incluirItemN() {

    var widStatusAtual = f_getStats($('#md_idstatus_atual_' + $this.instanceId).val());
    if (widStatusAtual.ordem >= 9) {
        return false
    }
    openItens('zoom_itens');
}


function formatDecimal(val, pres) {
    var fVal = parseFloat(val);

    if (isNaN(fVal)) {
        fval = 0;
    }

    var neg = "";
    if (fVal < 0) {
        fVal = fVal * -1;
        var neg = "-";
    }

    var numDec = String((fVal).toFixed(pres));
    var n = numDec.split('.')[0];
    var r = '';
    var x = 0;
    var tratado;

    for (var i = n.length; i > 0; i--) {
        r += n.substr(i - 1, 1) + (x == 2 && i != 1 ? '-' : '');
        x = x == 2 ? 0 : x + 1;
    }

    tratado = r.split('').reverse().join('');
    tratado = tratado.replace('-,', ',');
    var busca = '-';
    var strbusca = eval('/' + busca + '/g');
    tratado = tratado.replace(strbusca, '.');
    if (pres > 0) {
        tratado = tratado + "," + numDec.split('.')[1];
    }
    return neg + tratado;
};


function f_validaItemFilho(pCodItem) {
    var wRetorno = false;
    try {
        $('input[name^="cod_item___"]').each(function (index, value) {
            var seq = $(this).attr("id").split('___')[1];
            if ($(this).val != '') {
                if ($('#cod_item___' + seq).val().trim() == pCodItem.trim() && wRetorno == false) {
                    wRetorno = true;
                }
            }

        });
    } catch (error) { }

    return wRetorno;
}

function f_enviaMensagem(pIdInstalacao, pIdSequencia) {

    var htmlM = '<div class="row"> ' +
        '   <div class="col-sm-2"> ' +
        '       <label class="control-label" for="txtNome">Proposta</label> ' +
        '       <input type="hidden" class="grp_user" name="md_id_registro_' + $this.instanceId + '" id="md_id_registro_' + $this.instanceId + '" value="' + pIdInstalacao + '" /> ' +
        '       <input type="hidden" class="grp_user" name="md_id_proposta_' + $this.instanceId + '" id="md_id_proposta_' + $this.instanceId + '" /> ' +
        '       <h3><label class="control-label" for=""><strong id="md_num_proposta_' + $this.instanceId + '">&nbsp;</strong></label> </h3>' +
        '   </div> ' +
        '   <div class="col-md-5"> ' +
        '       <label class="control-label" for="txtNome">Cliente</label> ' +
        '       <div class="input-group">' +
        '           <h3><label class="control-label" for=""><strong id="md_nom_cliente_' + $this.instanceId + '">&nbsp;</strong></label> </h3>' +
        '       </div> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-6"> ' +
        '       <label class="control-label" for="txtNome">Instalador</label>' +
        '       <div class="input-group">' +
        '           <input type="hidden" class="grp_instalador" name="cod_instalador_' + $this.instanceId + '" id="cod_instalador_' + $this.instanceId + '" />' +
        '           <input type="text" class="form-control grp_instalador valida" name="nome_instalador_' + $this.instanceId + '" id="nome_instalador_' + $this.instanceId + '" valida="field" value="" readonly/>' +
        '           <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$(\'.grp_instalador\').val(\'\')" disable></span>' +
        '           <span id="bt_instalador" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)" disable></span>' +
        '       </div> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-6"> ' +
        '       <label class="control-label" for="txtNome">Responsável</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_nom_responsavel_' + $this.instanceId + '" id="md_nom_responsavel_' + $this.instanceId + '" maxlength="25" valida="field"/> ' +
        '   </div> ' +
        '   <div class="col-md-4"> ' +
        '       <label class="control-label" for="txtNome">WhatsAPP</label> ' +
        '       <input type="text" class="form-control grp_user valida" name="md_num_whats_' + $this.instanceId + '" id="md_num_whats_' + $this.instanceId + '"  maxlength="25" placeholder="(00) 00000-0000" data-contato valida="field"/> ' +
        '   </div> ' +
        '</div>' +

        '<div class="row"> ' +
        '   <div class="col-md-13" align="center"> ' +
        '   &nbsp; ' +
        '   </div> ' +
        '</div> ' +

        '<div class="row"> ' +
        '   <div class="col-md-12" style="display:flex; justify-content: flex-end"> ' +
        '       <div class="col-sd-2">' +
        '           <button type="button" class="btn btn-danger btn-lg btn-block" title=Cancelar proposta" onclick="md_mensagemReSend.remove();"><i class="flaticon flaticon-close icon-xs" aria-hidden="true"></i> Cancelar</button>' +
        '       </div>' +
        '       <div class="col-sd-2">' +
        '           <button type="button" class="btn btn-success btn-lg btn-block" title="Confirma propostar" onclick="f_updateMensagem();"><i class="fluigicon fluigicon-add-test icon-xs" aria-hidden="true"></i> Confirmar</button>' +
        '       </div>' +
        '   </div> ' +
        '</div>';


    md_mensagemReSend = FLUIGC.modal({
        title: 'Reenviar mensagem de Aprovação',
        content: htmlM,
        id: 'fluig-md_mensagemReSend',
        size: 'large',
        actions: []
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

        }
    });

    $('#fluig-md_mensagemReSend').ready(function () {
        // Contato

        if (pIdInstalacao != undefined && pIdInstalacao != '') {
            loadWindow.show();
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('indacao', 'INSTALACAO', 'INSTALACAO', ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('idregistro', pIdInstalacao, pIdInstalacao, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint('sequencia', pIdSequencia, pIdSequencia, ConstraintType.MUST));


            DatasetFactory.getDataset("dsk_instaladores", null, constraints, null, {
                success: (data) => {
                    if (data.hasOwnProperty("values") && data.values.length > 0) {

                        for (var i = 0; i < data.values.length; i++) {
                            $('#md_num_proposta_' + $this.instanceId).text(data.values[i]["proposta"]);
                            $('#md_nom_cliente_' + $this.instanceId).text(data.values[i]["cliente"]);

                            $('#md_id_proposta_' + $this.instanceId).val(data.values[i]["idproposta"]);
                            $('#cod_instalador_' + $this.instanceId).val(data.values[i]["idinstalador"]);
                            $('#nome_instalador_' + $this.instanceId).val(data.values[i]["instalador"]);

                            $('#md_nom_responsavel_' + $this.instanceId).val(data.values[i]["responsavel"]);
                            $('#md_num_whats_' + $this.instanceId).val(data.values[i]["telefone"]);
                        }

                    }
                    loadWindow.hide();
                },
                error: (err) => {
                    loadWindow.hide();
                },
            });
        }
    });
}