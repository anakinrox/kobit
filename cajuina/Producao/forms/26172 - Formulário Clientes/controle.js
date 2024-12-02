var loadWindow = FLUIGC.loading(window);
var tblHist = null;
var loadFinanc = false;
// var modalTable = null;

var beforeSendValidate = function (numState, nextState) {

    var task = $('#task').val();

    var iesRet = true;

    if ($('#num_cgc_cpf').val().length != 19) {
        FLUIGC.toast({ title: '', message: 'Você deu informação um CPF ou CNPJ válido. ( CNPJ(099.999.999/9999-99) ou CPF(999.999.999/0000-99) ', type: 'warning' });
        iesRet = false;
    }
    if ($('#cod_cliente').val() == "") {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("cod_cliente", $('#num_cgc_cpf').val(), $('#num_cgc_cpf').val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("table", 'clientes', null, ConstraintType.MUST));
        var ds = DatasetFactory.getDataset("selectLogix", null, constraints, null);
        if (ds.values.length > 0) {
            toast('CNPJ/CPF Já cadastrado!', 'warning');
            iesRet = false;
        }
    }

    if (task == 0 || task == 4 || task == 5) {
        if (!valida('.valida')) {
            iesRet = false;
        }

        $("input[name^=email_nfe___]").each(function (index, value) {
            var seq = $(this).attr('id').split('___')[1];
            if ($('#ies_excluido___' + seq).val() != "S") {
                if (!valida('#' + $(this).attr('id'))) {
                    iesRet = false;
                }
            }
        });
    }

    if (!iesRet) {
        toast('Existem campos obrigatórios não preenchidos', 'warning');
    }

    if (!validaIE($('#ins_estadual').val().trim(), $('#cod_uni_feder').val())) {
        FLUIGC.toast({ title: '', message: 'Inscrição Estadual inválida.', type: 'warning' });
        iesRet = false;
    }

    if ($('#num_cgc_cpf').val().indexOf('/0000-') > 0) {
        if (!validaCPF($('#num_cgc_cpf').val().trim().replace('/0000-', '-'))) {
            FLUIGC.toast({ title: '', message: 'CPF inválido.', type: 'warning' });
            iesRet = false;
        }
    } else {
        if (!validaCNPJ($('#num_cgc_cpf').val().trim().replace('/0000-', '-'))) {
            FLUIGC.toast({ title: '', message: 'CNPJ inválido.', type: 'warning' });
            iesRet = false;
        }
    }

    var qtd = 0;
    $("input[name^=email_nfe___]").each(function (index, value) {
        qtd += 1;
        var seq = $(this).attr('id').split('___')[1];
        if ($('#ies_excluido___' + seq).val() != "S") {
            if (!validaEmail(this.value.trim())) {
                FLUIGC.toast({ title: '', message: 'E-Mail inválido (' + this.value + ')', type: 'warning' });
                iesRet = false;
            }
        }
    });

    if (numState == 12) {
        if (!valida('.parecer_financeiro')) {
            iesRet = false;
        }
    }

    if (qtd == 0) {
        FLUIGC.toast({ title: '', message: 'Você deve informar ao menos um e-mail para NFE!', type: 'warning' });
        iesRet = false;
    };

    $("input[name^=nom_contato___]").each(function (index, value) {
        qtd += 1;
        var seq = $(this).attr('id').split('___')[1];
        if ($('#ies_contato_excluido___' + seq).val() != "S") {
            if (this.value.trim() == "") {
                FLUIGC.toast({ title: '', message: 'Você deve informar um nome para o contato.', type: 'warning' });
                iesRet = false;
            }

            if (this.value.trim() != ""
                && $('#telefone_contato___' + seq).val() == ""
                && $('#email_contato___' + seq).val() == "") {
                FLUIGC.toast({ title: '', message: 'Você deve informar e-mail ou telefone para o contato.', type: 'warning' });
                iesRet = false;
            }
        }
    });

    $("input[name^=email_contato___]").each(function (index, value) {
        var seq = $(this).attr('id').split('___')[1];
        if ($('#ies_contato_excluido___' + seq).val() != "S") {
            if (this.value.trim() != "") {
                if (!validaEmail(this.value.trim())) {
                    FLUIGC.toast({ title: '', message: 'E-Mail do contato inválido (' + this.value + ')', type: 'warning' });
                    iesRet = false;
                }
            }
        }
    });

    if (nextState == 9) {
        marcaCampos();
    }

    return iesRet;
}

function loadBody() {

    console.log('loadBody');
    var task = $('#task').val();

    if (task == 0 || task == 1) {
        trataRepres();
    }

    // alert('Task: ' + task);

    // alert('Tipo Cad.: ' + $('#tipo_cadastro').val())

    // if ($('#tipo_cadastro').val() == "E") {
    //     loadDadosCliente($('#cod_cliente').val(), "N");
    //     $('#tipo_cadastro').val("L");
    //     loadTipoDocumentos(true);
    // } else {
    //     loadTipoDocumentos(false);
    // }

    // if ($('#tipo_cadastro').val() == "R"
    //     || $('#tipo_cadastro').val() == "L") {
    //     $('.obsFinaceiro').hide();
    // }


    if ($('#num_iden_lograd').val() == 'SN' && !$('#sem_numero').is(':checked')) {
        $('#sem_numero').attr('checked', true);
    }


    marcaCampos();

    displayFields();

    // if ( $('#num_cgc_cpf').val() == '' && $('#cod_cliente').val() != '' ){
    //     loadDadosCliente($('#cod_cliente').val());
    //}

}

function setEmpresa(isChange) {

    if (isChange) {
        $('.grp_Lista').val('');
        $('.grp_pis').val('');
        $('.grp_cofins').val('');

        loadEmpresa();
    }


}

function loadEmpresa() {
    if ($("#cod_empresa").val() == null || $("#cod_empresa").val() == undefined || $("#cod_empresa").val() == "") { return false; }

    loadWindow.show();
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("cod_empresa_matriz", $("#cod_empresa").val(), $("#cod_empresa").val(), ConstraintType.MUST));
    DatasetFactory.getDataset("empresa_comercial", null, constraints, null, {
        success: function (dataSet) {

            for (var x = 0; x < dataSet.columns.length; x++) {
                // alert('C: ' + dataSet.columns[x]);
                if (dataSet.values.length > 0) {
                    // alert(' V: ' + dataSet.values[0][dataSet.columns[x]]);
                    $("#" + dataSet.columns[x]).val(dataSet.values[0][dataSet.columns[x]]);
                } else {
                    $("#" + dataSet.columns[x]).val("");
                }
            }

            var dias = parseInt($("#dias_validade_credito").val());

            if (!isNaN(dias)) {
                var hoje = new Date();
                $('#validade_credito').val(dataAtualFormatada(new Date(hoje.getTime() + (dias * 24 * 60 * 60 * 1000))));

            }

            $('#nom_portador_emp_pad').val($('#nom_portador_emp').val());
            $('#cod_portador_emp_pad').val($('#cod_portador_emp').val());
            $('#ies_tip_portador_emp_pad').val($('#ies_tip_portador_emp').val());

            loadListaDefault();

            // loadTributos();

            loadWindow.hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            loadWindow.hide();
        }
    });
}

function loadRepDefault() {
    if ($("#cod_repres").val() == null || $("#cod_repres").val() == "") { return false; }

    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('cod_repres', $("#cod_repres").val(), $("#cod_repres").val(), ConstraintType.MUST));
    DatasetFactory.getDataset("representante_compl", null, constraints, null, {
        success: function (dataSet) {

            if (dataSet.hasOwnProperty("values") && dataSet.values.length > 0) {

                for (var i = 0; i < dataSet.values.length; i++) {
                    $("#cod_rota").val(dataSet.values[i]['cod_rota']);
                    $("#den_rota").val(dataSet.values[i]['den_rota']);

                    $("#cod_praca").val(dataSet.values[i]['cod_praca']);
                    $("#den_praca").val(dataSet.values[i]['den_praca']);

                    $("#cod_local").val(dataSet.values[i]['cod_local']);
                    $("#den_local").val(dataSet.values[i]['den_local']);
                };
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            loadWindow.hide();
        }
    });
}


function loadListaDefault() {
    var dsValues = getDsPaiFilho("representante_compl", "lista", "cod_repres,filho___ies_lista_default,filho___cod_empresa_lista", $("#cod_repres").val() + ",on," + $("#cod_empresa").val(), "cod_lista,den_lista");
    if (dsValues.length > 0) {
        $('#num_list_preco').val(dsValues[0]['cod_lista']);
        $('#den_list_preco').val(dsValues[0]['den_lista']);
    }
}

function loadTributos() {
    var dsValues = getDsPaiFilho("empresa_comercial", "cnae_x_tributo", "cod_empresa_matriz", $("#cod_empresa").val(), null);

    $("input[name^=cod_cnae___]").each(function (index, value) {
        console.log(' $(this).val() ................ ', $(value).val());
        for (var x = 0; x < dsValues.length; x++) {
            if ($(value).val().indexOf(dsValues[x]['cod_cnae']) >= 0) {
                $('#des_grp_fisc_cli_pis').val(dsValues[x]['des_grp_fisc_cli_pis']);
                $('#grp_fiscal_cliente_pis').val(dsValues[x]['grp_fiscal_cliente_pis']);
                $('#des_grp_fisc_cli_cofins').val(dsValues[x]['des_grp_fisc_cli_cofins']);
                $('#grp_fiscal_cliente_cofins').val(dsValues[x]['grp_fiscal_cliente_cofins']);
                return true;
            }
        }
    });

}

function setAprovFinanc() {

    if ($("#parecer_financeiro").val() == "A" && $("#solicita_credito").val() == "S") {
        $("#cod_cnd_pgto").val($("#cod_cnd_pgto_prazo").val());
        zoom('bt_pgto', 'cod_cnd_pgto');

        $('#nom_portador_emp').val($('#nom_portador_emp_pad').val());
        $('#cod_portador_emp').val($('#cod_portador_emp_pad').val());
        $('#ies_tip_portador_emp').val($('#ies_tip_portador_emp_pad').val());

    } else if ($("#parecer_financeiro").val() == "R") {
        $("#cod_cnd_pgto").val($("#cod_cnd_pgto_vista").val());
        zoom('bt_pgto', 'cod_cnd_pgto');
        $(".grp_portador_emp").val("");
    }

}


function setSolicitaCredito() {

    if ($("#solicita_credito").val() == "S") {
        $("#cod_cnd_pgto_sug").val($("#cod_cnd_pgto_prazo").val());
        $(".solicCredito").show();
    } else if ($("#solicita_credito").val() == "N") {
        $("#cod_cnd_pgto_sug").val($("#cod_cnd_pgto_vista").val());
        $(".solicCredito").hide();
    }


}

function loadCampos() {
    // var loadEmpresa = false;
    // if ($("#cod_empresa").val() != "") {
    //     loadEmpresa = true;
    // }

    loadDsPfCombo('cod_empresa', 'representante_compl', 'empresa', 'cod_empresa', 'emp_reduz', 'matricula', $("#user_abertura").val(), 'cod_empresa', 'S', 'M', 'ies_empresa_default');
    var task = $('#task').val();
    if (task == "0") {
        setEmpresa(true);
    }

    loadDsCombo('ies_tip_fornec', 'selectLogix', 'legend_value', 'legend_text', 'table,___lower___table_name,___lower___column_name', 'FRM_COLUMN_LEGEND,fornecedor,ies_tip_fornec', 'legend_text', 'N', 'S', 'S');
    loadDsCombo('simples_nacional', 'selectLogix', 'legend_value', 'legend_text', 'table,___lower___table_name,___lower___column_name', 'FRM_VIRTUAL_COLUMN_LEGEND,par_clientes,virtual_optante_simples', 'legend_text', 'N', 'S', 'S');

    // loadDsCombo('cod_cnd_pgto_sug', 'selectLogix', 'cod_cnd_pgto', 'den_cnd_pgto', 'table', 'cond_pgto', 'cod_cnd_pgto', 'N', 'S', 'S');
    // loadDsCombo('cod_cnd_pgto', 'selectLogix', 'cod_cnd_pgto', 'den_cnd_pgto', 'table', 'cond_pgto', 'cod_cnd_pgto', 'N', 'S', 'S');

    loadDsCombo('cod_situa', 'selectLogix', 'cod_situa', 'des_situa', 'table', 'situacao_cre', 'cod_situa', 'N', 'S', 'S');
    loadDsCombo('ies_forma_aprov', 'selectLogix', 'ies_forma_aprov', 'des_forma', 'table', 'forma_aprovacao', 'ies_forma_aprov', 'N', 'S', 'S');

}

function displayFields() {

    loadCampos();
    // return false;
    //alert(  "isMobile........"+$("#isMobile").val() );
    if ($("#isMobile").val() == "S") {
        $(".not-mobile").hide();
    }

    var task = $('#task').val();
    if (task == "0" || task == "4") {
        if ($("#isAprovador").val() != "S"
            && $("#isFinanceiro").val() != "S") {
            $(".not-inicio").hide();
        }
    }

    if ($("#isAprovador").val() != "S"
        && $("#isFinanceiro").val() != "S") {
        $(".aprov-financeiro").hide();
    }

    if ($("#solicita_credito").val() == "A") {
        $(".solicCredito").show();
    } else if ($("#solicita_credito").val() == "N") {
        $(".solicCredito").hide();
    }

    if ($('#isAprovador').val() == "S" && $('#isFinanceiro').val() == "N") {
        $('.financeiro').hide();
    }



    /*	console.log('displayFields');
        
           
        if( $('#tipo_cadastro_user') == "R" ){
            $("input[name^=tipo_hist___]").each( function (index, value) {
                if( $(this).val() != 'E' ){
                    $(this).parent().hide();
                }
            });
        }
        
        $("input[name^=ies_excluido___]").each(function (index, value) {
            if( $(this).val() == "S" ){
                // $(this).parent().parent().hide()
                // $(this).attr('disabled', 'disabled');
                // $('#bt_del_mail___6').parent().attr('disabled','disabled');
                // $(this).parent().parent().children().attr('readonly', 'true')
                // $(this).parent().parent().children().each(function(){
                //     if(this.nodeName =="INPUT") $(this).attr('readonly', 'true');
                // })
                $(this).parent().parent().children().each(function(){
                     $(this).children().attr('readonly', 'true');
                });
                $(this).parent().parent().addClass('has-error');
            }
    
            if( $(this).val() == "A" ){
                // $(this).parent().parent().hide()
                // $(this).attr('disabled', 'disabled');
                // $('#bt_del_mail___6').parent().attr('disabled','disabled');
                $(this).parent().parent().addClass('has-success');
            }
        });
    
        $("input[name^=ies_contato_excluido___]").each(function (index, value) {
            if( $(this).val() == "S" ){
                // $(this).parent().parent().hide()
                // $(this).attr('disabled', 'disabled');
                // $('#bt_del_mail___6').parent().attr('disabled','disabled');
                $(this).parent().parent().children().each(function(){
                    $(this).children().attr('readonly', 'true');
                });
                $(this).parent().parent().addClass('has-error');
            }
            if( $(this).val() == "A" ){
                // $(this).parent().parent().hide()
                // $(this).attr('disabled', 'disabled');
                // $('#bt_del_mail___6').parent().attr('disabled','disabled');
                $(this).parent().parent().addClass('has-success');
            }
        });
    	
     */
    setIsento('isento_ie', 'ins_estadual', 'cod_uni_feder');
    setSemNumero('sem_numero', 'num_iden_lograd');
    setMask();
    $('input').attr('autocomplete', 'nope');

}

function trataRepres() {
    /*
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("user", parent.WCMAPI.userCode , parent.WCMAPI.userCode, ConstraintType.MUST));
        var dsRepres = DatasetFactory.getDataset("dsk_cad_repres", null, constraints, null)
    
        if (dsRepres && dsRepres != ''){
            if ( dsRepres.values.length > 0 ){
                if ( dsRepres.values[0]['tipo_cadastro'] == 'C' ){
                    disableSeach('.representante');
                }
                
                $('#cod_repres').val( dsRepres.values[0]['lst_repres'].split('|')[0] );
                $('#nom_repres').val( dsRepres.values[0]['nome_usuario'] );
                $('#responsavel').val( dsRepres.values[0]['responsavel'] );
            }
        }
     */
}

function addMail(table) {
    var row = wdkAddChild(table);

    var nId = 0;
    $("input[name^=id_email___]").each(function (index, value) {
        if (nId < parseInt($(this).val())) {
            nId = parseInt($(this).val());
        }
    });
    $('#id_email___' + row).val(nId + 1);
    $('#ies_excluido___' + row).val("A");
    $('#ies_excluido___' + row).parent().parent().addClass("has-success");

    setMask();

    return row;
}

function addContato(table) {

    var row = wdkAddChild(table);

    var nId = 0;
    $("input[name^=num_contato___]").each(function (index, value) {
        if (nId < parseInt($(this).val())) {
            nId = parseInt($(this).val());
        }
    });

    $('#num_contato___' + row).val(nId + 1);
    $('#ies_contato_excluido___' + row).val("A");
    $('#ies_contato_excluido___' + row).parent().parent().addClass("has-success");

    return row;

}

function fnRemovelista(obj) {
    fnWdkRemoveChild(obj);
}

function fnRemoveEmpresaFiscal(obj) {
    fnWdkRemoveChild(obj);
}

function fnRemoveBancos(obj) {
    fnWdkRemoveChild(obj);
}

function fnRemoveReferencia(obj) {
    fnWdkRemoveChild(obj);
}

function fnRemoveContato(obj) {
    var seq = obj.children[0].id.split('___')[1];
    if ($('#ies_contato_excluido___' + seq).val() == "A") {
        fnWdkRemoveChild(obj);
    } else {
        $('#ies_contato_excluido___' + seq).val("S");
        // $(obj).parent().parent().hide();
        $(obj).parent().attr('disabled', 'disabled');
        $(obj).parent().parent().addClass('has-error');
    }
}

function fnRemoveMail(obj) {
    var seq = obj.children[0].id.split('___')[1];
    if ($('#ies_excluido___' + seq).val() == "A") {
        fnWdkRemoveChild(obj);
    } else {
        $('#email_nfe___' + seq).val("");
        $('#ies_excluido___' + seq).val("S");
        // $(obj).parent().parent().hide();
        $(obj).parent().attr('disabled', 'disabled');
        $(obj).parent().parent().addClass('has-error');
    }
}

function marcaCampos() {

    if (!$('#oldData').val()) {
        return false;
    }

    var json = JSON.parse($('#oldData').val());
    var keys = Object.keys(json);
    var camposAlterados = [];
    $("input,textarea").each(function () {

        if (keys.indexOf(this.id) != -1) {
            $(this).parent().removeClass('has-error');
            if ($(this).hasClass('decimal-2')) {
                if (formatStringValue(json[this.id], 2).trim() != $(this).val().trim()) {
                    $(this).parent().addClass('has-error');
                    camposAlterados.push(this.id);
                }
            } else if ($(this).hasClass('data-fluig')) {
                if (json[this.id].split('-').reverse().join('/') != $(this).val().trim()) {
                    $(this).parent().addClass('has-error');
                    camposAlterados.push(this.id);
                }
            } else if ($(this).hasClass('telefone')) {
                if (json[this.id].replace('(', '').replace(')', '').replace('-', '').replace(' ', '').trim() != $(this).val().replace('(', '').replace(')', '').replace('-', '').replace(' ', '').trim()) {
                    $(this).parent().addClass('has-error');
                    camposAlterados.push(this.id);
                }
            } else {
                if (json[this.id].trim() != $(this).val().trim()) {
                    camposAlterados.push(this.id);
                    $(this).parent().addClass('has-error');
                }
            }

        }

    });

    $('#camposAlterados').val(camposAlterados);

}

function loadDadosCliente(cod_cliente, view) {

    loadWindow.show();

    var camposNaoLimpar = ['descritor', 'isManager', 'tipo_cadastro', 'tipo_cadastro_user', 'task', 'oldData'];

    $('.financeiro').show();

    if (view == "S") {
        $('.followup').hide();
    }

    //Carrega dados Cliente
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("cod_cliente", cod_cliente, cod_cliente, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_clientes', null, ConstraintType.MUST));
    DatasetFactory.getDataset("selectLogix", null, constraints, null, {
        success: function (dataSet) {
            // console.log(dataSet.values);
            if (dataSet != null && dataSet != undefined) {
                var data = dataSet.values[0];
                $('#oldData').val(JSON.stringify(data));
                $("input,select,textarea").each(function () {
                    // console.log('looop  ',$(this).attr( 'id' ), $(this).val(), $(this).attr( 'type' ) );

                    if (camposNaoLimpar.indexOf(this.id) == -1 && this.id.indexOf('___') == -1) {
                        if (data[this.id] != undefined && data[this.id] != 'null' && data[this.id] != null) {
                            if ($(this).hasClass('decimal-2')) {
                                this.value = formatStringValue(data[this.id], 2).trim();
                            } else if ($(this).hasClass('data-fluig') && data[this.id] != '') {
                                this.value = data[this.id].split('-').reverse().join('/'); // formataData( new Date( data[this.id] ) ).trim();
                            } else if ($(this).hasClass('telefone') && data[this.id] != '') {
                                var bFone = data[this.id].replace(/[^0-9]/g, '');
                                bFone = '(' + bFone.substring(0, 2) + ') ' + bFone.substring(2, 6) + '-' + bFone.substring(6, 11)
                                this.value = bFone;
                            } else {
                                this.value = data[this.id].trim();
                            }
                        } else {
                            this.value = '';
                        }
                    }

                });

                $('#num_cgc_cpf_matriz').val("");

                if ($('#ins_estadual').val().trim() == "ISENTO") {
                    $("#isento_ie").prop("checked", true);
                    setIsento('isento_ie', 'ins_estadual', 'cod_uni_feder');
                } else {
                    if (!validaIE($('#ins_estadual').val().trim(), $('#cod_uni_feder').val())) {
                        FLUIGC.toast({ title: '', message: 'Inscrição Estadual inválida.', type: 'warning' });
                        $('#ins_estadual').val("");
                    }
                    setMaskIE($('#cod_uni_feder').val().trim(), 'ins_estadual');
                }

                if ($.isNumeric($('#num_iden_lograd').val())) {
                    $('#sem_numero').prop('checked', false);
                    //$('#num_iden_lograd').val( data.numero );
                    setSemNumero('sem_numero', 'num_iden_lograd');
                } else {
                    $('#sem_numero').prop('checked', true);
                    setSemNumero('sem_numero', 'num_iden_lograd');
                }

                if ($('#task').val() != '5') {
                    readOnlyAll('');
                    disableSeach('');
                    $('.bt_tbl').hide();
                }


                carregaResponsavel(data['cod_repres']);

                // Carrega Contatos
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint("cod_cliente", cod_cliente, cod_cliente, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint("table", 'cli_contatos', null, ConstraintType.MUST));
                var ds = DatasetFactory.getDataset("selectLogix", ['num_contato', 'nom_contato', 'email', 'num_telefone'], constraints, ['num_contato'])

                if (ds.values.length > 0) {
                    for (var i = 0; i < ds.values.length; i++) {
                        var seq = wdkAddChild('contatos');
                        if (ds.values[i]['email'].trim() == 'null') ds.values[i]['email'] = '';
                        $('#num_contato___' + seq).val(ds.values[i]['num_contato'].trim());
                        $('#nom_contato___' + seq).val(ds.values[i]['nom_contato'].trim());
                        $('#telefone_contato___' + seq).val(ds.values[i]['num_telefone'].trim());
                        $('#email_contato___' + seq).val(ds.values[i]['email'].trim());
                    }
                }

                // Carrega Emails NFE
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint("cliente", cod_cliente, cod_cliente, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint("table", 'vdp_cli_grp_email', null, ConstraintType.MUST));
                var ds = DatasetFactory.getDataset("selectLogix", ['seq_email', 'email'], constraints, ['seq_email'])

                if (ds.values.length > 0) {
                    for (var i = 0; i < ds.values.length; i++) {
                        var seq = wdkAddChild('emails_nfe');
                        $('#id_email___' + seq).val(ds.values[i]['seq_email'].trim());
                        $('#email_nfe___' + seq).val(ds.values[i]['email'].trim());
                        $('#ies_excluido___' + seq).val("N");
                    }
                }

                loadDocumentos(data['num_cgc_cpf'], data['nom_cliente'], true);

                // loadTipoDocumentos(true);

                // Carrega Grupo Econômico
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint("cod_cliente", cod_cliente, cod_cliente, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_grupo_economico', null, ConstraintType.MUST));
                var ds = DatasetFactory.getDataset("selectLogix", null, constraints, null)

                if (ds.values.length > 0) {
                    $('#num_cgc_cpf_matriz').val(ds.values[0]['num_cgc_cpf']);
                    for (var i = 0; i < ds.values.length; i++) {
                        var seq = wdkAddChild('grp_economico');
                        $('#cgc_cpf_grp_econ___' + seq).val(ds.values[i]['num_cgc_cpf_grp_econ'].trim());
                        $('#cod_cliente_grp_econ___' + seq).val(ds.values[i]['cod_cliente_grp_econ'].trim());
                        $('#nom_cliente_grp_econ___' + seq).val(ds.values[i]['nom_cliente_grp_econ'].trim());
                    }
                }

            };

            $('.decimal-2').maskMoney({ precision: 2, thousands: '.', decimal: ',', defaultZero: true, allowZero: true });

            loadWindow.hide();

        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            loadWindow.hide();
        }
    });

}

function loadFinanceiroAba(cod_cliente, view) {
    //###### REMOVER #######
    return true;
    if (loadFinanc) {
        return true;
    }

    loadWindow.show();

    $('.financeiro').show();

    if (view == "S") {
        $('.followup').hide();
    }

    //Carrega dados Cliente
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("cod_cliente", cod_cliente, cod_cliente, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_clientes', null, ConstraintType.MUST));
    DatasetFactory.getDataset("selectLogix", null, constraints, null, {
        success: function (dataSet) {
            // console.log(dataSet.values);
            if (dataSet != null && dataSet != undefined) {
                var data = dataSet.values[0];

                // Carrega dados financeiro
                var constraints = new Array();
                constraints.push(DatasetFactory.createConstraint('cod_cliente', cod_cliente, cod_cliente, ConstraintType.MUST));
                constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_grupo_financeiro', null, ConstraintType.MUST));
                var ds = DatasetFactory.getDataset("selectLogix", null, constraints, null);

                if (ds.values.length > 0) {
                    for (var i = 0; i < ds.values.length; i++) {
                        for (var j = 0; j < ds.columns.length; j++) {
                            var value = ds.values[i][ds.columns[j]];

                            if ($('#' + ds.columns[j]).hasClass('decimal-2')) {
                                value = formatStringValue(ds.values[i][ds.columns[j]], 2).trim();
                            }

                            if ($('#' + ds.columns[j]).hasClass('data-fluig')
                                || $('#' + ds.columns[j]).hasClass('data-view')) {
                                if (ds.values[i][ds.columns[j]] == 'null')
                                    value = '';
                                else
                                    value = ds.values[i][ds.columns[j]].split('-').reverse().join('/'); //formataData( new Date( ds.values[i][ ds.columns[j] ] ) ).trim();
                            }

                            $('#' + ds.columns[j]).val(value);
                        }
                    }
                }

            };

            $('.decimal-2').maskMoney({ precision: 2, thousands: '.', decimal: ',', defaultZero: true, allowZero: true });

            loadFinanc = true;

            loadWindow.hide();

        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
            loadWindow.hide();
        }
    });

}


function carregaResponsavel(cod_repres) {
    // Carrega Responsável
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("cod_repres", cod_repres, cod_repres, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("ies_responsavel_default", 'on', 'on', ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("table", 'responsavel', null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("dataset", 'representante', null, ConstraintType.MUST));
    var ds = DatasetFactory.getDataset("selectPaiFilho", null, constraints, null)

    if (ds.values.length > 0) {
        $('#responsavel').val(ds.values[0]['responsavel']);
    } else {
        $('#responsavel').val('');
    }
}

function loadDocumentos(num_cgc_cpf, nom_cliente, hide) {

    // // Carrega Tipos Documentos
    // var constraints = new Array();
    // constraints.push( DatasetFactory.createConstraint("table", 'kbt_v_tipo_documento', null, ConstraintType.MUST) );
    // var dsTipoDocumento = DatasetFactory.getDataset("selectTable", null, constraints, null);

    // //Carrega papeis
    // var constraints = new Array();
    // constraints.push(DatasetFactory.createConstraint("colleagueId",  parent.WCMAPI.userCode, parent.WCMAPI.userCode, ConstraintType.MUST));
    // var dsPapeis = DatasetFactory.getDataset("workflowColleagueRole", null, constraints, null);



    // //Verifica se pode incluir novo documento
    // var search3 = dsPapeis.values.filter(function(el) {
    //     return (el['workflowColleagueRolePK.roleId'].indexOf( 'admin' ) != -1  )
    // });

    // if ( search3.length == 0 ){
    //     $('.bt_edit').hide();
    // }

    // if ( folder != '' ){
    //     var constraints = new Array();
    //     constraints.push( DatasetFactory.createConstraint("parentDocumentId", folder, folder, ConstraintType.MUST) );
    //     constraints.push( DatasetFactory.createConstraint("deleted", false, false, ConstraintType.MUST) );
    //     constraints.push( DatasetFactory.createConstraint("activeVersion",true, true, ConstraintType.MUST) );
    //     var ds = DatasetFactory.getDataset("document", null, constraints, null);

    //     if ( ds.values.length > 0 ){
    //         for (var i = 0; i < ds.values.length; i++ ){

    //             var search = dsTipoDocumento.values.filter(function(el) {
    //                 return (el.cod_tipo_documento == ds.values[i]['documentTypeId'] ) 
    //             });

    //             if ( search.length > 0 ){

    //                 // Verifica se pode consultar
    //                 var search2 = dsPapeis.values.filter(function(el) {
    //                     return (el['workflowColleagueRolePK.roleId'].indexOf( search[0]['id_cons_pool'] ) != -1  )
    //                 });

    //                 if ( search2.length > 0 ){

    //                     // var qtd = 0;
    //                     var documentos = '';
    //                     $("input[name^=cod_tipo_documento___]").each(function (index, value) {

    //                         if ( this.value == search[0]['cod_tipo_documento']){
    //                             // qtd++;
    //                             var seq = this.id.split('___')[1];
    //                             // $('#data_documento___'+seq).val( data_documento );
    //                             // $('#id_documento___'+seq).val( ds.values[i]['documentPK.documentId'] );
    //                             if ( $('#documento___'+seq).val( ) != '' ) documentos += $('#documento___'+seq).val() + ',';
    //                             documentos += ds.values[i]['documentPK.documentId'];

    //                             $('#documento___'+seq).val( documentos );
    //                         }

    //                     });

    //                     // if ( qtd == 0 ){
    //                     //     var seq = wdkAddChild('documentos');
    //                     //     var dt = new Date(  ds.values[i]['lastModifiedDate'] );
    //                     //     var data_documento = formataData(dt);
    //                     //     $('#data_documento___'+seq).val( data_documento );
    //                     //     $('#id_documento___'+seq).val( ds.values[i]['documentPK.documentId'] );
    //                     //     $('#documento___'+seq).val( ds.values[i]['documentDescription'] );
    //                     //     $('#cod_tipo_documento___'+seq).val( search[0]['cod_tipo_documento'] );
    //                     //     $('#tipo_documento___'+seq).val( search[0]['tipo_documento'] );
    //                     // }

    //                 }

    //             }
    //         }
    //     }

    //Verifica se tem documentos para visualizar
    var folder = pastaCliente(num_cgc_cpf, nom_cliente);
    $("input[name^=cod_tipo_documento___]").each(function (index, value) {

        var seq = this.id.split('___')[1];
        if (folder != '') {
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint("parentDocumentId", folder, folder, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint("documentTypeId", this.value, this.value, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint("deleted", false, false, ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint("activeVersion", true, true, ConstraintType.MUST));
            //constraints.push( DatasetFactory.createConstraint("sqlLimit",1, 1, ConstraintType.MUST) );
            var ds = DatasetFactory.getDataset("document", null, constraints, null);

            if (ds.values.length == 0) {
                if (hide) {
                    //$('#seq_doc2___'+seq).parent().parent().parent().hide();
                    $('#seq_doc___' + seq).parent().removeClass('btn-success');
                }
            } else {
                if (ds.values[0]["documentPK.documentId"] == "") {
                    if (hide) {
                        //$('#seq_doc2___'+seq).parent().parent().parent().hide();
                        $('#seq_doc___' + seq).parent().removeClass('btn-success');
                    }
                } else {
                    $('#seq_doc___' + seq).parent().addClass('btn-success');
                }
            }

            //if (hide) $('#seq_doc2___'+seq).parent().hide();

        } /*else {
                $('#seq_doc2___'+seq).parent().parent().parent().hide();
            }*/

    });

    // }
}

function setSemNumero(idCampo, idCampoNum, idCampoUF) {
    if ($("#" + idCampo).is(':checked')) {
        $('#' + idCampoNum).attr('readonly', true);
        $('#' + idCampoNum).attr('type', 'text');
        $('#' + idCampoNum).css('background-color', '#DEDEDE');
        $('#' + idCampoNum).val('SN');
    } else {
        $('#' + idCampoNum).attr('readonly', false);
        $('#' + idCampoNum).attr('type', 'number');
        $('#' + idCampoNum).css('background-color', '#FFFFFF');
        $('#' + idCampoNum).val();
    }
}

function setIsento(idCampo, idCampoIE, idCampoUF) {
    console.log('IE_________');
    if ($("#" + idCampo).is(':checked')) {
        $('#' + idCampoIE).unmask();
        $('#' + idCampoIE).attr('readonly', true);
        $('#' + idCampoIE).css('background-color', '#DEDEDE');
        $('#' + idCampoIE).val('ISENTO');
    } else {
        $('#' + idCampoIE).unmask();
        $('#' + idCampoIE).attr('readonly', false);
        $('#' + idCampoIE).css('background-color', '#FFFFFF');
        if ($('#' + idCampoIE).val() == 'ISENTO') {
            console.log('IE_________');
            $('#' + idCampoIE).val('');
            setMaskIE($('#' + idCampoUF).val(), idCampoIE);
        } else if ($('#' + idCampoUF).val() != '') {
            var tmp = $('#' + idCampoIE).val();
            setMaskIE($('#' + idCampoUF).val(), idCampoIE);
            console.log('IE_________' + tmp);
            $('#' + idCampoIE).val(tmp);
        }

    }
    setFinalidade();
}

function setIE() {
    if ($('#ins_estadual').val() != ""
        && !validaIE($('#ins_estadual').val(), $('#cod_uni_feder').val())) {
        FLUIGC.toast({ title: '', message: 'Inscrição Estadual inválida.', type: 'warning' });
    }
    setFinalidade();
}

function setFinalidade() {

    if ($('#ins_estadual').val() != ""
        && $('#ins_estadual').val() != "ISENTO"
        && $('#num_cgc_cpf').val().indexOf("/0000-") == -1) {
        $("#finalidade").val("1");
    } else if ($('#num_cgc_cpf').val().indexOf("/0000-") >= 0) {
        $("#finalidade").val("2");
    } else {
        $("#finalidade").val("3");
    }
}

function dadosCEP() {

    buscaCEP($('#cod_cep').val(), {
        success: function (data) {
            console.log(data);
            $('#cod_cidade_ibge').val(data.ibge);
            $('#bairro').val(data.bairro.toUpperCase());

            var tipo = buscaTipoLogradouro(data.logradouro.toUpperCase());
            if (tipo.status) {
                console.log('tipo...', tipo);
                $("#logradouro").val(tipo.logradouro);
                $("#tipo_logradouro").val(tipo.tip_logradouro);
                $("#desc_logradouro").val(tipo.des_logradouro);
            } else {
                $("#logradouro").val(data.logradouro.toUpperCase());
            }
            zoom('bt_cidade', 'cod_cidade_ibge');

            // setMaskIE( $('#cod_uni_feder').val(), 'ins_estadual' );
        },

        error: function (error) {
            console.log(error);
        }
    });
}

function removerMask() {
    $(".cnpj_cpf").unmask();
}

function colocaMask(indacao) {
    if ($(".cnpj_cpf").val().length == 14) {
        $(".cnpj_cpf").mask("00.000.000/0000-00");
    } else {
        $(".cnpj_cpf").mask("000.000.000-00");
    }
}

function dadosReceita(pIndValidacao) {
    if ($(".cnpj_cpf").val() == '') { return false; }

    if ($('#num_cgc_cpf').attr("oldvalue") == $('#num_cgc_cpf').val() && (pIndValidacao == undefined || pIndValidacao == '')) { colocaMask(); return false; }
    var isCNPJ = false;
    $('#num_cgc_cpf').attr("oldvalue", $('#num_cgc_cpf').val());
    // alert($('#tipo_cadastro').val());

    // $('.cnpj_cpf').mask("000.000.000/0000-00");

    // if ($('#tipo_cadastro').val() != "E") {
    //     if ($('#num_cgc_cpf').val() != "" && $('#num_cgc_cpf').val().length != 19) {
    //         FLUIGC.toast({ title: '', message: 'Informação um CPF ou CNPJ no formato válido.', type: 'warning' });
    //         setTimeout("$('#num_cgc_cpf').focus();", 2);
    //         return false;
    //     }


    // }

    // if ($('#num_cgc_cpf').val().indexOf('/0000-') > 0) {
    //     if (!validaCPF($('#num_cgc_cpf').val().replace('/0000-', '-'))) {
    //         FLUIGC.toast({ title: '', message: 'CPF inválido.', type: 'warning' });
    //     }
    // } else {

    if (pIndValidacao != undefined && pIndValidacao != '') { removerMask() };
    if ($(".cnpj_cpf").val().length == 14) {
        isCNPJ = true;
        colocaMask();
    } else {
        colocaMask();

        var wDatNascimento = prompt("Data Nascimento", $("#dat_nascimento").val());
        if (wDatNascimento != null) {
            $("#dat_nascimento").val(wDatNascimento)
        }
    }

    if ($('#cod_cliente').val() == "") {
        var constraints = new Array();
        constraints.push(DatasetFactory.createConstraint("num_cgc_cpf", "0" + $('#num_cgc_cpf').val(), "0" + $('#num_cgc_cpf').val(), ConstraintType.MUST));
        constraints.push(DatasetFactory.createConstraint("table", 'clientes', null, ConstraintType.MUST));
        var ds = DatasetFactory.getDataset("selectLogix", null, constraints, null);
        if (ds.values.length > 0) {

            $("#cod_cliente").val(ds.values[0]['cod_cliente'])
            // toast('CNPJ/CPF Já cadastrado!', 'warning');
            // setTimeout("$('#num_cgc_cpf').focus();", 2);
            // return false;
        }
    }


    cnpj_receita($('#num_cgc_cpf').val(), $('#dat_nascimento').val(), {
        success: function (data) {
            var dataHoje = new Date();
            // console.log();
            $('#dataHoraSinegra').val('');
            $('#situacaoSintegra').val('');
            $('#dataHoraReceita').val('');
            $('#situacaiReceita').val('');

            if (isCNPJ) {

                $('#dat_fundacao').val(data.estabelecimento.data_inicio_atividade.split('-').reverse().join('/'));
                $('#cod_cep').val(data.estabelecimento.cep.replace('.', ''));
                $('#correio_eletronico').val(data.estabelecimento.email);

                clearTables("emails_nfe");
                $("input[name*=email_nfe___]").each(function (index) {
                    fnWdkRemoveChild(this);
                });

                if ($("input[name^=email_nfe___]").length == 0) {
                    var row = wdkAddChild('emails_nfe');
                    $("#email_nfe___" + row).val(data.estabelecimento.email);
                }

                $('#nom_reduzido').val(data.estabelecimento.nome_fantasia);
                $('#den_cidade').val(data.estabelecimento.cidade.nome);
                $('#nom_cliente').val(data.razao_social);

                $('#cod_cidade_ibge').val(data.estabelecimento.cidade.ibge_id);
                $('#bairro').val(data.estabelecimento.bairro.toUpperCase());
                $('#cod_uni_feder').val(data.estabelecimento.estado.sigla);
                zoom('bt_cidade', 'cod_cidade_ibge');

                // return false;

                if ($.isNumeric(data.estabelecimento.numero)) {
                    $('#sem_numero').prop('checked', false);
                    $('#num_iden_lograd').val(data.estabelecimento.numero);
                    setSemNumero('sem_numero', 'num_iden_lograd');
                } else {
                    $('#sem_numero').prop('checked', true);
                    setSemNumero('sem_numero', 'num_iden_lograd');
                }

                $('#telefone_1').val("(" + data.estabelecimento.ddd1 + ") " + data.estabelecimento.telefone1);
                var tipo = buscaTipoLogradouro(data.estabelecimento.tipo_logradouro.toUpperCase());
                if (tipo.status) {
                    // console.log('tipo...', tipo);
                    $("#logradouro").val(data.estabelecimento.logradouro.toUpperCase());
                    $("#tip_logradouro").val(tipo.tip_logradouro);
                    $("#desc_logradouro").val(tipo.des_logradouro);
                } else {
                    $("#logradouro").val(data.estabelecimento.logradouro.toUpperCase());

                }
                $("#compl_endereco").val(data.estabelecimento.complemento);

                if (data.simples != null && data.simples.simples == 'Sim') {
                    $("#simples_nacional").val('S');
                } else {
                    $("#simples_nacional").val('N');
                }


                // $('#ies_situacao').val(data.situacao[0]);
                clearTables("cnae");

                $("input[name*=cod_cnae___]").each(function (index) {
                    fnWdkRemoveChild(this);
                });

                row = wdkAddChild("cnae");
                $("#cod_cnae___" + row).val(data.estabelecimento.atividade_principal.classe);
                $("#tip_cnae___" + row).val("P");
                $("#den_cnae___" + row).val(data.estabelecimento.atividade_principal.descricao);

                if (data.estabelecimento.atividades_secundarias != undefined) {
                    for (var x = 0; x < data.estabelecimento.atividades_secundarias.length; x++) {
                        row = wdkAddChild('cnae');
                        $("#cod_cnae___" + row).val(data.estabelecimento.atividades_secundarias[x].classe);
                        $("#tip_cnae___" + row).val("S");
                        $("#den_cnae___" + row).val(data.estabelecimento.atividades_secundarias[x].descricao);
                    }
                }

                $('#dataHoraReceita').val(dataHoje.toLocaleString());
                $('#situacaiReceita').val(data.estabelecimento.situacao_cadastral);

                loadTributos();

                if (data.sintegra != null) {
                    if (data.sintegra.code == '0') {
                        $('#ins_estadual').val(data.sintegra.inscricao_estadual);
                        setIE();

                        $("#isento_ie").prop("checked", false);
                        setIsento('isento_ie', 'ins_estadual', 'cod_uni_feder');
                        // onchange = "setIE()"

                        $('#dataHoraSinegra').val(dataHoje.toLocaleString());
                        $('#situacaoSintegra').val(data.sintegra.situacao_ie);

                    }
                    if (data.sintegra.code == '1') {
                        $('#ins_estadual').val('');
                        $("#isento_ie").prop("checked", true);
                        setIsento('isento_ie', 'ins_estadual', 'cod_uni_feder');
                    }
                    if (parseInt(data.sintegra.code) > 1) {
                        FLUIGC.toast({
                            message: "Erro ao consultar os dados do sintegra, será valido outra hora.",
                            type: 'danger'
                        });
                    }

                }
            }

            if (!isCNPJ) {

                $('#dat_fundacao').val('');
                $('#cod_cep').val('');
                $('#correio_eletronico').val('');

                clearTables("emails_nfe");
                $("input[name*=email_nfe___]").each(function (index) {
                    fnWdkRemoveChild(this);
                });

                $('#nom_reduzido').val(data.nome);
                $('#den_cidade').val('');
                $('#nom_cliente').val(data.nome);

                $('#cod_cidade_ibge').val('');
                $('#bairro').val('');
                $('#cod_uni_feder').val('');
                // zoom('bt_cidade', 'cod_cidade_ibge');

                // return false;


                $('#sem_numero').prop('checked', true);
                setSemNumero('sem_numero', 'num_iden_lograd');


                $('#telefone_1').val('');
                $("#logradouro").val('');
                $("#compl_endereco").val('');
                $("#simples_nacional").val('N');


                // $('#ies_situacao').val(data.situacao[0]);
                clearTables("cnae");

                $("input[name*=cod_cnae___]").each(function (index) {
                    fnWdkRemoveChild(this);
                });

                $('#dataHoraReceita').val(dataHoje.toLocaleString());
                $('#situacaiReceita').val(data.situacao_cadastral);

                // loadTributos();

                $('#ins_estadual').val('');
                $("#isento_ie").prop("checked", true);
                setIsento('isento_ie', 'ins_estadual', 'cod_uni_feder');



            }
        },
        error: function (error) {
            console.log(error);
        }
    });

    // }
}

async function f_revalidaAPI(pIndValidacao) {


    if (pIndValidacao == 'S') {
        if ($('#num_cgc_cpf').val().trim() == '') {
            return false;
        }

        var wcnpj = $('#num_cgc_cpf').val().replace(/\D/g, '');
        if (wcnpj.length == 14) {
            wcnpj = wcnpj.substr(0, 14);
        } else {
            FLUIGC.toast({
                message: "Cliente pessoal física não é possivel consultar Sintegra. ",
                type: 'danger'
            });
            return false;
        }

        if ($("#isMobile").val() == "N") {
            var myLoading1 = f_loading('Consultando Sintegra...');
        } else {
            var myLoading1 = loadWindow;
        }
        myLoading1.show();
        var wObjSintegra = await f_getSintegra(wcnpj);
        if (wObjSintegra != null) {
            if (wObjSintegra.status == true) {

                var dataHoje = new Date();
                var data = JSON.parse(wObjSintegra.retorno);

                if (data.code == '0' && data.situacao_ie != 'Ativo') {
                    FLUIGC.toast({
                        message: "Situação do CNPJ está Inativo no Sintegra! Favor verificar. ",
                        type: 'danger'
                    });

                    myLoading1.hide();
                    return false;
                }

                if (data != null) {
                    if (data.code == '0') {
                        $("#isento_ie").prop("checked", false);
                        // setIsento('isento_ie', 'ins_estadual', 'cod_uni_feder');
                        $('#ins_estadual').val(data.inscricao_estadual);

                        $('#dataHoraSinegra').val(dataHoje.toLocaleString());
                        $('#situacaoSintegra').val(data.situacao_ie);

                    }
                    if (data.code == '1') {
                        $('#ins_estadual').val('');
                        $("#isento_ie").prop("checked", true);
                        setIsento('isento_ie', 'ins_estadual', 'cod_uni_feder');
                    }

                    if (parseInt(data.code) > 1) {
                        FLUIGC.toast({
                            message: "Erro ao consultar os dados do sintegra, será valido outra hora.",
                            type: 'danger'
                        });
                    }

                }
            }
        }
        myLoading1.hide();
    }

}

function buscaTipoLogradouro(logradouro, indAPI) {
    // console.log('logradouro...', logradouro);
    if (indAPI == undefined) {
        var tipo = logradouro.split(' ')[0];
    } else {
        tipo = logradouro
    }


    var constraints = new Array();
    var fields = new Array();
    constraints.push(DatasetFactory.createConstraint("trim(tip_logradouro)", tipo, tipo, ConstraintType.SHOULD));

    constraints.push(DatasetFactory.createConstraint("table", 'vdp_tip_logradouro', null, ConstraintType.MUST));
    fields.push('tip_logradouro', 'des_logradouro')
    var ds = DatasetFactory.getDataset("selectLogix", fields, constraints, null);
    // console.log('ds', ds);

    var retorno = {};
    retorno['status'] = false;

    if (ds.values.length > 0) {
        retorno['tip_logradouro'] = ds.values[0]["tip_logradouro"];
        retorno['des_logradouro'] = ds.values[0]["des_logradouro"];
        retorno['logradouro'] = logradouro.split(' ').slice(1).join(' ');
        retorno['status'] = true;
    } else {
        var constraints = new Array();
        var fields = new Array();
        constraints.push(DatasetFactory.createConstraint("trim(des_logradouro)", tipo, tipo, ConstraintType.SHOULD));
        constraints.push(DatasetFactory.createConstraint("table", 'vdp_tip_logradouro', null, ConstraintType.MUST));
        fields.push('tip_logradouro', 'des_logradouro')
        var ds = DatasetFactory.getDataset("selectLogix", fields, constraints, null);
        if (ds.values.length > 0) {
            retorno['tip_logradouro'] = ds.values[0]["tip_logradouro"];
            retorno['des_logradouro'] = ds.values[0]["des_logradouro"];
            retorno['logradouro'] = logradouro.split(' ').slice(1).join(' ');
            retorno['status'] = true;
        }


    }
    return retorno;
}


function showCamera(id) {
    console.log("Disparou >>> showCamera()");

    var campo = id.split('___')[0];
    var index = id.split('___')[1];

    console.log(campo, index);

    var seq = getSeq(index);

    var nome_documento = $('#cod_tipo_documento___' + index).val() + ' | ' + $('#tipo_documento___' + index).val() + '___' + seq;

    // removeAnexo(index);
    // console.log( obj );
    var teste = JSInterface.showCamera(nome_documento);

    // console.log(teste);
    $(window.top.document).find('#attachmentsStatusTab').trigger('click');
    // $("#documento___" + index).val( nome_documento );

    // setTimeout(function(){
    //   Anexo();
    // }, 1000);

}

function getSeq(seq) {

    var index = 0;

    if ($('#seq_doc___' + seq).val() != '') index = parseInt($('#seq_doc___' + seq).val());

    index++;

    $('#seq_doc___' + seq).val(index);

    return index;

}

function removeAnexo(nome_documento) {

    $.each(parent.ECM.attachmentTable.getData(), function (i, attachment) {
        console.log(i, attachment);
        if (nome_documento == attachment.description) {
            parent.WKFViewAttachment.removeAttach([i]);
        }
    });

}

function loadTipoDocumentos(bol) {
    /*
        if ( parent.WKFViewAttachment ){
            console.log(parent.WKFViewAttachment.attachmentsDocs);
            var lstDocs = parent.WKFViewAttachment.attachmentsDocs; 
            var html = '<ul class="list-group fs-no-margin"> ';;
            for ( doc in lstDocs ) {
                const { documentId, description, physicalFileName, attachedDate, version } = lstDocs[doc];
                html += `	<li class="list-group-item fs-sm-padding-top fs-sm-padding-bottom">
                                <span class="badge badge-primary fs-cursor-pointer" onclick="openFile( '${documentId}', '${version}' )"><i class="flaticon flaticon-documents icon-sm"></i></span>
                                <a class="fs-cursor-pointer" href="javascript:openFile( '${documentId}', '${version}' )">${attachedDate} - ${description} | ${physicalFileName}</a>'
                            </li> `;
    
            }
            html += '</ul>';
            $('#novos_documentos').append( html );
        }
    
        var qtd = 0;
        // $("input[name^=cod_tipo_documento___]").each(function (index, value) {
        //     qtd++;
        // });
        $('#documentos > tbody > tr:not(:first)').remove();
        if ( qtd == 0 ){
            // Carrega Tipos Documentos
            var constraints = new Array();
            constraints.push( DatasetFactory.createConstraint("table", 'kbt_v_tipo_documento', null, ConstraintType.MUST) );
            var dsTipoDocumento = DatasetFactory.getDataset("selectTable", null, constraints, null);
    
            //Carrega papeis
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint("colleagueId",  parent.WCMAPI.userCode, parent.WCMAPI.userCode, ConstraintType.MUST));
            var dsPapeis = DatasetFactory.getDataset("workflowColleagueRole", null, constraints, null);
    
            if ( dsTipoDocumento.values.length > 0 ){
                //Retorna tipos de documentos
                var tipos_documentos = null; //Array.from(new Set(dsTipoDocumento.values.filter(doc => dsPapeis.values.filter(papel => doc.id_edit_pool === papel['workflowColleagueRolePK.roleId']).length).map((o) => o.cod_tipo_documento)));
                if( bol ){
                    tipos_documentos = Array.from(new Set(dsTipoDocumento.values.filter(doc => dsPapeis.values.filter(papel => doc.id_edit_pool === papel['workflowColleagueRolePK.roleId']).length).map((o) => o.cod_tipo_documento)));            	
                }else{
                    tipos_documentos = Array.from(new Set(dsTipoDocumento.values.filter(doc => dsPapeis.values.filter(papel => doc.id_cons_pool === papel['workflowColleagueRolePK.roleId']).length).map((o) => o.cod_tipo_documento)));
                }	
                
                
                if ( tipos_documentos.length > 0 ){
                    var arrObj = new Array();
                    for (var i = 0; i < tipos_documentos.length; i++ ){
                        arrObj.push( dsTipoDocumento.values.filter(doc => doc.cod_tipo_documento === tipos_documentos[i]  )[0] );
                    }
    
                    for (var i = 0; i < arrObj.length; i++ ){
    
                        // if ( arrObj[i]['ies_obrigatorio'] == 'on' ){
                            var seq = wdkAddChild('documentos');
                            $('#cod_tipo_documento___'+seq).val( arrObj[i]['cod_tipo_documento'] );
                            $('#ies_inform_data___'+seq).val( arrObj[i]['ies_inform_data'] );
                            $('#tipo_documento___'+seq).val( arrObj[i]['tipo_documento'] );
                        // }
                        
                    }
                    
                }
    
                if( $('#num_cgc_cpf').val() != '' && $('#nom_cliente').val() != '' ) 
                    loadDocumentos($('#num_cgc_cpf').val(), $('#nom_cliente').val(), bol );
    
            }
        }
    */
}

function loadFinanceiro(id) {

    var seq = id.split('___')[1];

    var html = '<div class="row"> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="val_pedidos" class="control-label">Pedidos</label> ' +
        '        <div class="input-group"> ' +
        '           <span class="input-group-addon btn-primary fluigicon fluigicon-search fluigicon-sm" onclick="loadHist(\'md_pedidos\',\'md_cod_cliente\')"></span> ' +
        '           <input type="hidden" id="md_cod_cliente"/> ' +
        '           <input type="text" id="md_val_pedidos" class="form-control fs-text-right decimal-2" readonly/> ' +
        '        </div> ' +
        '    </div>					 ' +
        '    <div class="col-md-3"> ' +
        '        <label for="val_cheques" class="control-label">Cheques</label> ' +
        '        <div class="input-group"> ' +
        '           <span class="input-group-addon btn-primary fluigicon fluigicon-search fluigicon-sm" onclick="loadHist(\'md_cheques\',\'md_cod_cliente\')"></span> ' +
        '           <input type="text" id="md_val_cheques" class="form-control fs-text-right decimal-2" readonly/> ' +
        '        </div> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="saldo" class="control-label">Saldo</label> ' +
        '        <input type="text" id="md_saldo" class="form-control fs-text-right decimal-2" readonly/> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="val_debito_vencido" class="control-label">Total Títulos Vencidos</label> ' +
        '        <div class="input-group"> ' +
        '           <span class="input-group-addon btn-primary fluigicon fluigicon-search fluigicon-sm" onclick="loadHist(\'md_tit_venc\',\'md_cod_cliente\')"></span> ' +
        '           <input type="text" id="md_val_debito_vencido" class="form-control fs-text-right decimal-2" readonly/> ' +
        '        </div> ' +
        '   </div> ' +
        '</div> ' +
        '<div class="row"> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="val_debito_a_venc" class="control-label">Total Títulos a Vencer</label> ' +
        '        <div class="input-group"> ' +
        '           <span class="input-group-addon btn-primary fluigicon fluigicon-search fluigicon-sm" onclick="loadHist(\'md_tit_a_venc\',\'md_cod_cliente\')"></span> ' +
        '           <input type="text" id="md_val_debito_a_venc" class="form-control fs-text-right decimal-2" readonly/> ' +
        '       </div> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="saldo_adiantamento" class="control-label">Saldo Adiantamento</label> ' +
        '        <input type="text" id="md_saldo_adiantamento" class="form-control fs-text-right decimal-2" readonly/> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="val_maior_acumulo" class="control-label">Valor do maior acumulo</label> ' +
        '        <input type="text" id="md_val_maior_acumulo" class="form-control fs-text-right decimal-2" readonly/> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="dat_ult_analise" class="control-label">Data ultima analise</label> ' +
        '        <input type="text" id="md_dat_ult_analise" class="form-control data-fluig" readonly/> ' +
        '    </div> ' +
        '</div> ' +
        '<div class="row"> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="dat_maior_acumulo" class="control-label">Data do maior acumulo</label> ' +
        '        <input type="text" id="md_dat_maior_acumulo" class="form-control data-fluig" readonly/> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="val_ult_fat" class="control-label">Valor da ultima fatura</label> ' +
        '        <input type="text" id="md_val_ult_fat" class="form-control fs-text-right decimal-2" readonly/> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="dat_ult_fat" class="control-label">Data da ultima fatura</label> ' +
        '        <input type="text" id="md_dat_ult_fat" class="form-control data-fluig" readonly/> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="val_ult_pedido" class="control-label">Valor ultimo Pedido</label> ' +
        '        <input type="text" id="md_val_ult_pedido" class="form-control fs-text-right decimal-2" readonly/> ' +
        '    </div> ' +
        '</div> ' +
        '<div class="row"> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="dat_ult_pedido" class="control-label">Data ultimo Pedido</label> ' +
        '        <input type="text" id="md_dat_ult_pedido" class="form-control data-fluig" readonly/> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="val_maior_fat" class="control-label">Valor da maior fatura</label> ' +
        '        <input type="text" id="md_val_maior_fat" class="form-control fs-text-right decimal-2" readonly/> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="dat_maior_fat" class="control-label">Data da maior fatura</label> ' +
        '        <input type="text" id="md_dat_maior_fat" class="form-control data-fluig" readonly/> ' +
        '    </div> ' +
        '    <div class="col-md-3"> ' +
        '        <label for="" class="control-label" >&nbsp;</label> ' +
        '        <button class="form-control btn btn-primary" type="button" onclick="loadHist(\'md_tit_pago\',\'md_cod_cliente\')">Títulos Pagos</button> ' +
        '    </div> ' +
        '</div> ';

    var modalFin = FLUIGC.modal({
        title: 'Dados financeiros | ' + $('#nom_cliente_grp_econ___' + seq).val(),
        content: html,
        id: 'modal_financeiro',
        size: 'large',
        actions: [{
            'label': 'Imprimir',
            'bind': 'data-imprime-credito',
            'classType': 'btn-info',
        }, {
            'label': 'Fechar',
            'classType': 'btn-danger',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {
            // do something with data
            loadWindow.show();
            var constraints = new Array();
            constraints.push(DatasetFactory.createConstraint('cod_cliente', $('#cod_cliente_grp_econ___' + seq).val(), $('#cod_cliente_grp_econ___' + seq).val(), ConstraintType.MUST));
            constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_cliente_financeiro', null, ConstraintType.MUST));
            DatasetFactory.getDataset("selectLogix", null, constraints, null, {
                success: function (data) {

                    for (var i = 0; i < data.values.length; i++) {
                        for (var j = 0; j < data.columns.length; j++) {
                            var value = data.values[i][data.columns[j]];

                            if ($('#md_' + data.columns[j]).hasClass('decimal-2')) {
                                value = formatStringValue(data.values[i][data.columns[j]], 2);
                            }

                            if ($('#md_' + data.columns[j]).hasClass('data-fluig')) {
                                //value = formataData( new Date( data.values[i][ data.columns[j] ] ) );
                                value = data.values[i][data.columns[j]].split('-').reverse().join('/');
                            }

                            $('#md_' + data.columns[j]).val(value);
                        }
                    }

                    $('#md_cod_cliente').val($('#cod_cliente_grp_econ___' + seq).val());

                    loadWindow.hide();
                },

                error: function (error) {

                }
            })
        }
    });

    $('#modal_financeiro').on('click', '[data-imprime-credito]', function (ev) {

        var data = {};
        data['cod_cliente'] = $('#md_cod_cliente').val();
        data['val_ult_fat'] = $('#md_val_ult_fat').val();
        data['dat_ult_fat'] = $('#md_dat_ult_fat').val();
        data['val_maior_acumulo'] = $('#md_val_maior_acumulo').val();
        data['dat_maior_acumulo'] = $('#md_dat_maior_acumulo').val();
        data['val_maior_fat'] = $('#md_val_maior_fat').val();
        data['dat_maior_fat'] = $('#md_dat_maior_fat').val();
        data['val_debito_vencido'] = $('#md_val_debito_vencido').val();
        data['val_debito_a_venc'] = $('#md_val_debito_a_venc').val();
        data['grupo'] = 'N';
        data['tipo'] = 'credito';

        getPrint(data);

    });

}

function printGrupo() {

    var data = {};
    data['cod_cliente'] = $('#cod_cliente').val();
    data['val_ult_fat'] = $('#val_ult_fat').val();
    data['dat_ult_fat'] = $('#dat_ult_fat').val();
    data['val_maior_acumulo'] = $('#val_maior_acumulo').val();
    data['dat_maior_acumulo'] = $('#dat_maior_acumulo').val();
    data['val_maior_fat'] = $('#val_maior_fat').val();
    data['dat_maior_fat'] = $('#dat_maior_fat').val();
    data['val_debito_vencido'] = $('#val_debito_vencido').val();
    data['val_debito_a_venc'] = $('#val_debito_a_venc').val();
    data['grupo'] = 'S';
    data['tipo'] = 'credito';

    getPrint(data);
}

function loadHist(tipo, cliente) {

    var constraints = new Array();
    var orderby = new Array();

    if (tipo == 'md_pedidos') {
        var title = 'PEDIDOS';
        var content = '';
        var table = 'kbt_v_pedidos';
        var wHeader = [{ "display": false },
        { "display": false },
        { "display": false },
        { "display": false },
        { "display": false },
        { "display": false },
        { "title": "Cliente", "size": 'text-left colspan-pint-12', "dataorder": "nom_cliente" },
        { "display": false },
        { "display": false },
        { "title": "Portador", "size": 'text-right number colspan-pint-3', "dataorder": "cod_portador" },
        { "title": "Num Pedido", "size": 'text-right number colspan-pint-3', 'dataorder': 'num_pedido' },
        { "title": "Data Pedido", "size": 'date colspan-pint-3', "dataorder": "dat_pedido" },
        { "title": "Valor Pedido", "size": 'text-right colspan-pint-3', 'dataorder': 'valor_pedido' }];
    }

    if (tipo == 'md_cheques') {
        var title = 'CHEQUES';
        var content = '';
        var table = 'kbt_v_cheques';
        var wHeader = [
            { "display": false }, //origem,
            { "display": false }, //cod_empresa,
            { "display": false }, //den_empresa,
            { "display": false }, //den_reduz,
            { "display": false }, //uf_emp,
            { "display": false }, //cod_cliente,
            { "title": "Cliente", "size": 'text-left colspan-pint-8', "dataorder": "nom_cliente" }, //nom_cliente,
            { "display": false }, //nom_reduzido,
            { "display": false }, //cod_uni_feder,
            { "title": "Portador", "size": 'text-right number colspan-pint-2', 'dataorder': 'cod_portador' }, //cod_portador,
            { "display": false }, //nom_portador,
            { "display": false }, //nom_abr_portador,
            { "title": "Cod Tip Desp", 'size': 'colspan-pint-1', 'dataorder': 'cod_tip_despesa' }, //cod_tip_despesa,
            { "title": "Den Tip Desp", 'size': 'colspan-pint-3', 'dataorder': 'nom_tip_despesa' }, //nom_tip_despesa,
            { "display": false }, //num_ap,
            { "title": "NF", 'size': 'number colspan-pint-2', 'dataorder': 'num_nf' }, //num_nf,
            { "title": "Data Venc", 'size': 'date colspan-pint-3', 'dataorder': 'dat_vencto' }, //dat_vencto,
            { "title": "Valor", "size": 'text-right number colspan-pint-3', 'dataorder': 'valor_che' }, //valor_che,
            { "display": false } //valor_che_vencido
        ];
    }

    if (tipo == 'md_tit_venc') {

        /*var ct = new Array();
        ct.push(DatasetFactory.createConstraint("table", "kbt_v_pct_juros", null, ConstraintType.MUST));
        var dsJuros = DatasetFactory.getDataset("selectLogix", null, ct, null)

        var juro = '0,00';
        if ( dsJuros ){
            if ( dsJuros.values.length > 0 ){
                juro = getStringValue( parseFloat(dsJuros.values[0]['pct_juro_mora']),2 );
            }
        }
*/

        var title = 'TÍTULOS VENCIDOS';

        var content = '<div class="row">' +
            '<div class="col-md-3 col-md-offset-9 "> ' +
            '    <label for="" class="control-label">Valor Total</label> ' +
            '    <input type="text" id="md_tot_tit_venc" class="form-control" style="text-align: right;" readonly/>' +
            '</div>' +
            /*                    '<div class="col-md-2"> '+
                                '    <label for="" class="control-label">% Juros</label> '+
                                '    <input type="text" id="md_pct_juro" class="form-control" style="text-align: right;" value="'+juro+'" onblur="recalculaJuros()"/>'+
                                '</div>'+
                                '<div class="col-md-3"> '+
                                '    <label for="" class="control-label">Valor Juros</label> '+
                                '    <input type="text" id="md_val_juro" class="form-control" style="text-align: right;" readonly/>'+
                                '</div>'+
                                '<div class="col-md-3"> '+
                                '    <label for="" class="control-label">Valor com Juros</label> '+
                                '    <input type="text" id="md_val_c_juro" class="form-control" style="text-align: right;" readonly/>'+
                                '</div>'+
                                '<div class="col-md-1"> '+
                                '    <label for="" class="control-label">&nbsp;</label> '+
                                '    <button class="form-control btn btn-primary fluigicon fluigicon-cog" type="button" onclick="recalculaJuros()"></button>'+
                                '</div>'+*/
            '</div>';

        var table = 'kbt_v_titulos';
        var wHeader = [
            { "display": false }, //origem,
            { "display": false }, //cod_empresa,
            { "display": false }, //den_empresa,
            { "display": false }, //den_reduz,
            { "display": false }, //uf_emp,
            { "display": false }, //cod_cliente,
            { "title": "Cliente", "size": 'text-left colspan-pint-10', "dataorder": "nom_cliente" }, //nom_cliente,
            { "display": false }, //nom_reduzido,
            { "display": false }, //cod_uni_feder,
            { "display": false }, //cod_portador,
            { "display": false }, //nom_portador,
            { "display": false }, //nom_abr_portador,
            { "display": false }, //cod_tip_despesa,
            { "display": false }, //nom_tip_despesa,
            { "title": "Duplicata", 'size colspan-pint-2': 'number', 'dataorder': 'num_ap' }, //num_ap,
            { "display": false }, //num_nf,
            { "title": "Emissao", 'size': 'date colspan-pint-3', 'dataorder': 'dat_emissao' }, //dat_emissao,
            { "title": "Vencimento", 'size': 'date colspan-pint-3', 'dataorder': 'dat_vencimento' }, //dat_vencimento,
            { "title": "Dias Vencto", 'size': 'date colspan-pint-3', 'dataorder': 'dat_emissao' }, //dias_vencimento,
            { "display": false }, //valor_cre,
            { "title": "Valor", "size": 'text-right number colspan-pint-3', 'dataorder': 'valor_cre_vencido' }, //valor_cre_vencido,
            { "display": false }, //valor_cre_a_vencer
            { "display": false }, //valor_juro
            { "display": false }, //valor_c_juro
        ];

        constraints.push(DatasetFactory.createConstraint("valor_cre_vencido", "0", "0", ConstraintType.MUST_NOT));
    }

    if (tipo == 'md_tit_a_venc') {

        var title = 'TÍTULOS A VENCER';
        var content = '<div class="row">' +
            '<div class="col-md-3 col-md-offset-9 "> ' +
            '    <label for="" class="control-label">Valor Total</label> ' +
            '    <input type="text" id="md_tot_tit_a_venc" class="form-control" style="text-align: right;" readonly/>' +
            '</div>' +
            '</div>'
        var table = 'kbt_v_titulos';
        var wHeader = [
            { "display": false }, //origem,
            { "display": false }, //cod_empresa,
            { "display": false }, //den_empresa,
            { "display": false }, //den_reduz,
            { "display": false }, //uf_emp,
            { "display": false }, //cod_cliente,
            { "title": "Cliente", "size": 'text-left colspan-pint-12', "dataorder": "nom_cliente" }, //nom_cliente,
            { "display": false }, //nom_reduzido,
            { "display": false }, //cod_uni_feder,
            { "display": false }, //cod_portador,
            { "display": false }, //nom_portador,
            { "display": false }, //nom_abr_portador,
            { "display": false }, //cod_tip_despesa,
            { "display": false }, //nom_tip_despesa,
            { "title": "Duplicata", 'size': 'number colspan-pint-3', 'dataorder': 'num_ap' }, //num_ap,
            { "display": false }, //num_nf,
            { "title": "Emissao", 'size': 'date colspan-pint-3', 'dataorder': 'dat_emissao' }, //dat_emissao,
            { "title": "Vencimento", 'size': 'date colspan-pint-3', 'dataorder': 'dat_vencimento' }, //dat_vencimento,
            { "display": false }, //dias_vencimento
            { "display": false }, //valor_cre,
            { "display": false }, //valor_cre_vencido,
            { "title": "Valor", "size": 'text-right number colspan-pint-3', 'dataorder': 'valor_cre_a_vencer' } //valor_cre_a_vencer
        ];
        constraints.push(DatasetFactory.createConstraint("valor_cre_a_vencer", "0", "0", ConstraintType.MUST_NOT));
    }

    if (tipo == 'md_tit_saldo') {

        var title = 'TÍTULOS SALDO';
        var content = '<div class="row">' +
            '<div class="col-md-3 col-md-offset-9 "> ' +
            '    <label for="" class="control-label">Valor Total</label> ' +
            '    <input type="text" id="md_tot_saldo" class="form-control" style="text-align: right;" readonly/>' +
            '</div>' +
            '</div>'
        var table = 'kbt_v_titulos';
        var wHeader = [
            { "display": false }, //origem,
            { "display": false }, //cod_empresa,
            { "display": false }, //den_empresa,
            { "display": false }, //den_reduz,
            { "display": false }, //uf_emp,
            { "display": false }, //cod_cliente,
            { "title": "Cliente", "size": 'text-left colspan-pint-12', "dataorder": "nom_cliente" }, //nom_cliente,
            { "display": false }, //nom_reduzido,
            { "display": false }, //cod_uni_feder,
            { "display": false }, //cod_portador,
            { "display": false }, //nom_portador,
            { "display": false }, //nom_abr_portador,
            { "display": false }, //cod_tip_despesa,
            { "display": false }, //nom_tip_despesa,
            { "title": "Duplicata", 'size': 'number colspan-pint-3', 'dataorder': 'num_ap' }, //num_ap,
            { "display": false }, //num_nf,
            { "title": "Emissao", 'size': 'date colspan-pint-3', 'dataorder': 'dat_emissao' }, //dat_emissao,
            { "title": "Vencimento", 'size': 'date colspan-pint-3', 'dataorder': 'dat_vencimento' }, //dat_vencimento,
            { "display": false }, //dias_vencimento
            { "title": "Valor", "size": 'text-right number colspan-pint-3', 'dataorder': 'valor_cre' }, //valor_cre,
            { "display": false }, //valor_cre_vencido,
            { "display": false } //valor_cre_a_vencer,
        ];
        constraints.push(DatasetFactory.createConstraint("valor_cre", "0", "0", ConstraintType.MUST_NOT));
    }

    if (tipo == 'md_tit_pago') {

        var ct = new Array();
        ct.push(DatasetFactory.createConstraint("table", "kbt_v_pct_juros", null, ConstraintType.MUST));
        var dsJuros = DatasetFactory.getDataset("selectLogix", null, ct, null)

        var juro = '0,00';
        if (dsJuros) {
            if (dsJuros.values.length > 0) {
                juro = getStringValue(parseFloat(dsJuros.values[0]['pct_juro_mora']), 2);
            }
        }

        if ($('#md_documento').val() != '' && $('#md_documento').val()) {

            constraints.push(DatasetFactory.createConstraint('___like___num_docum', $('#md_documento').val(), $('#md_documento').val(), ConstraintType.MUST));

        } else {

            if ($('#md_portador').val()) {
                var portadores = $('#md_portador').val().replace(',', '|')
                constraints.push(DatasetFactory.createConstraint('___in___cod_portador', portadores, portadores, ConstraintType.MUST));
            }

            if ($('#md_n_portador').val()) {
                var portadores = $('#md_n_portador').val().replace(',', '|')
                constraints.push(DatasetFactory.createConstraint('___in___cod_portador', portadores, portadores, ConstraintType.MUST_NOT));
            }

            if ($('#md_tipo_documento').val()) {
                var tipo_documento = $('#md_tipo_documento').val().replace(',', '|')
                constraints.push(DatasetFactory.createConstraint('___in___ies_tip_docum', tipo_documento, tipo_documento, ConstraintType.MUST));
            }

            if ($('#md_n_tipo_documento').val()) {
                var tipo_documento = $('#md_n_tipo_documento').val().replace(',', '|')
                constraints.push(DatasetFactory.createConstraint('___in___ies_tip_docum', tipo_documento, tipo_documento, ConstraintType.MUST_NOT));
            }

            if ($('#md_dat_ini').val() && $('#md_dat_fim').val()) {
                constraints.push(DatasetFactory.createConstraint('___date___dat_credito', $('#md_dat_ini').val().split('/').reverse().join('/'), $('#md_dat_fim').val().split('/').reverse().join('/'), ConstraintType.MUST));
                var dt_ini = $('#md_dat_ini').val();
                var dt_fim = $('#md_dat_fim').val();
            } else {
                var date = new Date();
                var dt_fim = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDate())).slice(-2);
                date.setDate(date.getDate() - 30);
                var dt_ini = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + "01";
                // var dt_fim = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + retUltimoDia( date.getFullYear(), (date.getMonth() + 1) );

                constraints.push(DatasetFactory.createConstraint('___date___dat_credito', dt_ini, dt_fim, ConstraintType.MUST));

                var dt_ini = dt_ini.split('-').reverse().join('/');
                var dt_fim = dt_fim.split('-').reverse().join('/');
            }

        }

        orderby = ['num_docum, dat_credito']

        var title = 'TÍTULOS PAGOS';
        var content = '<div class="row">' +
            '<div class="col-md-3"> ' +
            '    <label for="" class="control-label">Documento</label> ' +
            '    <input type="text" id="md_documento" class="form-control" style="text-align: right;" onblur="clearTable()" />' +
            '</div>' +
            '<div class="col-md-4"> ' +
            '   <div class="col-md-6 fs-no-padding"> ' +
            '       <label for="" class="control-label">Data Ini</label> ' +
            '       <input type="text" id="md_dat_ini" class="form-control md_data" value="' + dt_ini + '" onblur="clearTable()" />' +
            '   </div>' +
            '   <div class="col-md-6 fs-no-padding"> ' +
            '       <label for="" class="control-label">Data Fim</label> ' +
            '       <input type="text" id="md_dat_fim" class="form-control md_data" value="' + dt_fim + '" onblur="clearTable()" />' +
            '   </div>' +
            '</div>' +
            '<div class="col-md-2"> ' +
            '    <label for="" class="control-label">% Juros</label> ' +
            '    <input type="text" id="md_pct_juro" class="form-control" style="text-align: right;" value="' + juro + '" onblur="clearTable()"/>' + //recalculaJuros()
            '</div>' +
            '<div class="col-md-2"> ' +
            '    <label for="" class="control-label">Tot Desc/Juro</label> ' +
            '    <input type="text" id="md_tot_desc_juro" class="form-control" style="text-align: right;" readonly />' +
            '</div>' +
            '<div class="col-md-1"> ' +
            '    <label for="" class="control-label">&nbsp;</label> ' +
            '    <button class="form-control btn btn-primary fluigicon fluigicon-cog" type="button" onclick="loadHist(\'md_tit_pago\', \'cod_cliente\')"></button>' +
            '</div>' +
            '<div class="col-md-4"> ' +
            '   <div class="col-md-6 fs-no-padding"> ' +
            '      <label for="" class="control-label">Portador Incluir</label> ' +
            '      <input type="text" id="md_portador" class="form-control portador" onblur="clearTable()" />' +
            '   </div>' +
            '   <div class="col-md-6 fs-no-padding"> ' +
            '      <label for="" class="control-label">Tip Doc Incluir</label> ' +
            '      <input type="text" id="md_tipo_documento" class="form-control tipo_documento" onblur="clearTable()" />' +
            '   </div>' +
            '</div>' +
            '<div class="col-md-4"> ' +
            '   <div class="col-md-6 fs-no-padding"> ' +
            '      <label for="" class="control-label">Portador Excluir</label> ' +
            '      <input type="text" id="md_n_portador" class="form-control portador" onblur="clearTable()" />' +
            '   </div>' +
            '   <div class="col-md-6 fs-no-padding"> ' +
            '      <label for="" class="control-label">Tip Doc Excluir</label> ' +
            '      <input type="text" id="md_n_tipo_documento" class="form-control tipo_documento" onblur="clearTable()" />' +
            '   </div>' +
            '</div>' +
            '<div class="col-md-1"> ' +
            '    <label for="" class="control-label">Grupo Econ?</label> ' +
            '    <select id="md_grupo" class="form-control" onchange="clearTable()"> ' +
            '        <option value="S">Sim</option> ' +
            '        <option value="N">Não</option> ' +
            '     </select> ' +
            '</div>' +
            '</div>';
        var table = 'kbt_v_titulos_pagos';
        var wHeader = [
            { "title": "Empresa", "size": 'text-right number colspan-pint-1', 'dataorder': 'cod_empresa' }, //cod_empresa,
            { "display": false }, //num_docum,
            { "title": "Documento", "size": 'text-right number colspan-pint-3', 'dataorder': 'num_docum' }, //num_docum,
            { "display": false }, //ies_tip_docum,
            { "title": "Portador", "size": 'text-right number colspan-pint-1', 'dataorder': 'cod_portador' }, //cod_portador,
            // {"title": "Tipo Port.", "size": 'text-right number', 'dataorder': 'ies_tip_portador'}, //ies_tip_portador,
            { "title": "Cliente", "size": 'text-left colspan-pint-6', 'dataorder': 'nom_cliente' }, //ies_tip_portador,
            { "title": "Data Venc.", "size": 'date colspan-pint-3', 'dataorder': 'dat_venc' }, //dat_venc,
            { "title": "Data Cred.", "size": 'date colspan-pint-3', 'dataorder': 'dat_credito' }, //dat_credito,
            { "title": "Dias Atraso Antec", "size": 'text-right number colspan-pint-1', 'dataorder': 'dias_ant_atraso' }, //dias_ant_atraso,
            { "title": "Valor Pago", "size": 'text-right number colspan-pint-3', 'dataorder': 'val_pago' }, //val_pago
            { "title": "Valor Desc Juro", "size": 'text-right number colspan-pint-3', 'dataorder': 'val_juro' }, //val_juro
        ];

    }

    var modalTable = FLUIGC.modal({
        title: title,
        content: content + '<div id="table_' + tipo + '"></div>',
        id: tipo,
        size: 'full',
        actions: [{
            'label': 'Imprimir',
            'classType': 'btn-info imprime',
            'bind': 'data-imprime-hist'
        }, {
            'label': 'Fechar',
            'classType': 'btn-danger',
            'autoClose': true
        }]
    }, function (err, data) {
        if (err) {
            // do error handling
        } else {

            /* Portadores */
            var ct = new Array();
            ct.push(DatasetFactory.createConstraint("table", "portador", null, ConstraintType.MUST));
            var dsPortador = DatasetFactory.getDataset("selectLogix", null, ct, ['cod_portador']);

            var portadores = dsPortador.values.map(o => o.cod_portador);

            /* Instantiated new autocomplete */
            var autoPortadorExcluir = FLUIGC.autocomplete('#md_n_portador', {
                source: substringMatcher(portadores),
                // name: 'cities',
                displayKey: 'description',
                tagClass: 'tag-gray',
                type: 'tagAutocomplete'
            });

            /* Instantiated new autocomplete */
            var autoPortador = FLUIGC.autocomplete('#md_portador', {
                source: substringMatcher(portadores),
                // name: 'cities',
                displayKey: 'description',
                tagClass: 'tag-gray',
                type: 'tagAutocomplete'
            });

            /* Tipo Documento */
            var ct = new Array();
            ct.push(DatasetFactory.createConstraint("table", "par_tipo_docum", null, ConstraintType.MUST));
            var dsTipo_documento = DatasetFactory.getDataset("selectLogix", ['distinct', 'ies_tip_docum'], ct, ['ies_tip_docum']);

            var tipo_documento = dsTipo_documento.values.map(o => o.ies_tip_docum);

            var autoTipoPortador = FLUIGC.autocomplete('.tipo_documento', {
                source: substringMatcher(tipo_documento),
                // name: 'cities',
                displayKey: 'description',
                tagClass: 'tag-gray',
                type: 'tagAutocomplete'
            });

            // $('#modal_hist').find('[data-imprime-hist]').unbind();

            var foo = $._data($("#" + tipo)[0], "events").click;

            if (foo.filter(fo => fo.selector == "[data-imprime-hist]").length == 0) {

                autoPortadorExcluir.add({
                    description: '904'
                });

                $('#' + tipo).on('click', '[data-imprime-hist]', function (el, ev) {
                    console.log(el, ev);
                    var data = {};
                    data['cod_cliente'] = $('#cod_cliente').val();
                    data['grupo'] = $('#md_grupo').val() ? $('#md_grupo').val() : 'S';
                    data['tipo'] = 'dtl';
                    data['title'] = title;
                    data['table'] = tipo;
                    // data['header'] = wHeader.filter(obj => obj.display != false).map( obj => obj.title );

                    if (tipo == 'md_tit_venc') {
                        var objArr = {};
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr['Total'] = $('#md_tot_tit_venc').val();
                        /*objArr['% Juro'] = $('#md_pct_juro').val();
                        objArr['Juros'] = $('#md_val_juro').val();
                        objArr['Tot. c/Jur'] = $('#md_val_c_juro').val();*/
                        data['footer'] = objArr;
                    }

                    if (tipo == 'md_tit_a_venc') {
                        var objArr = {};
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr['Total'] = $('#md_tot_tit_a_venc').val();
                        data['footer'] = objArr;
                    }

                    if (tipo == 'md_tit_saldo') {
                        var objArr = {};
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr['Total'] = $('#md_tot_saldo').val();
                        data['footer'] = objArr;
                    }


                    if (tipo == 'md_tit_pago') {
                        data['title'] = title + ' ' + $('#md_dat_ini').val() + ' ATÉ ' + $('#md_dat_fim').val() + '  | % Juro: ' + $('#md_pct_juro').val();
                        var objArr = {};
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr[''] = '';
                        objArr['% Juro'] = $('#md_pct_juro').val();
                        objArr['Tot. Desc/Juro'] = $('#md_tot_desc_juro').val();
                        data['footer'] = objArr;
                    }

                    getPrint(data);

                });
            }

        }
    });

    montaTableHist(cliente, tipo, constraints, orderby, table, wHeader);

}

function montaTableHist(cliente, tipo, constraints, orderby, table, wHeader) {
    loadWindow.show();

    if (cliente.split('_')[0] == 'md') {
        constraints.push(DatasetFactory.createConstraint('cod_cliente', $('#' + cliente).val(), $('#' + cliente).val(), ConstraintType.MUST));
    } else {
        var codClientes = [];
        $("input[name^=cod_cliente_grp_econ___]").each(function (index, value) {
            codClientes.push(this.value);
        });
        constraints.push(DatasetFactory.createConstraint('___in___cod_cliente', codClientes.join('|'), codClientes.join('|'), ConstraintType.MUST));
    }
    //constraints.push(DatasetFactory.createConstraint('cod_cliente', $('#'+cliente).val(), $('#'+cliente).val(), ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('sqlLimit', '9999', '9999', ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("table", table, null, ConstraintType.MUST));
    DatasetFactory.getDataset("selectLogix", null, constraints, orderby, {
        success: function (data) {
            var tot_valor_cre = 0;
            var tot_cre_a_vencer = 0;
            var tot_cre_vencido = 0;
            var tot_cre_vencido_juro = 0;
            var tot_cre_vencido_c_juro = 0;
            var tot_desc_juro = 0;

            for (var i = 0; i < data.values.length; i++) {
                for (var j = 0; j < data.columns.length; j++) {
                    if (data.columns[j].indexOf('val') >= 0) {
                        data.values[i][data.columns[j]] = formatStringValue(data.values[i][data.columns[j]], 2);
                    } else if (data.columns[j].indexOf('dat_') >= 0) {
                        data.values[i][data.columns[j]] = data.values[i][data.columns[j]].split('-').reverse().join('/');//formataData( new Date( data.values[i][ data.columns[j] ].replace('-','/') ) );
                    }
                }

                if (tipo == 'md_tit_venc') {
                    //if ( i == 0){
                    //    data.columns.push('valor_juro');
                    //    data.columns.push('valor_c_juro');
                    //}
                    var valor = parseFloat(data.values[i]['valor_cre_vencido'].replaceAll('.', '').replace(',', '.'));
                    //var pct = parseFloat( $('#md_pct_juro').val().replace(',','.') ) / 100 ;
                    //data.values[i][ 'valor_juro' ] = formatStringValue( valor * pct, 2 ) ;
                    //data.values[i][ 'valor_c_juro' ] = formatStringValue( valor + ( valor * pct ), 2 ) ;

                    tot_cre_vencido += valor;
                    //tot_cre_vencido_juro += valor * pct;
                    //tot_cre_vencido_c_juro += valor + ( valor * pct );

                }

                if (tipo == 'md_tit_a_venc') {
                    var valor = parseFloat(data.values[i]['valor_cre_a_vencer'].replaceAll('.', '').replace(',', '.'));
                    tot_cre_a_vencer += valor;
                }

                if (tipo == 'md_tit_saldo') {
                    var valor = parseFloat(data.values[i]['valor_cre'].replaceAll('.', '').replace(',', '.'));
                    tot_valor_cre += valor;
                }

                if (tipo == 'md_tit_pago') {
                    if (i == 0) {
                        data.columns.push('val_juro');
                    }

                    var valor = parseFloat(data.values[i]['val_pago'].replaceAll('.', '').replace(',', '.'));
                    var dias = parseFloat(data.values[i]['dias_ant_atraso']);
                    var pct = parseFloat($('#md_pct_juro').val().replace(',', '.')) / 100;
                    var taxa = (pct / 30) * dias;

                    data.values[i]['val_juro'] = formatStringValue((valor * taxa), 2);

                    tot_desc_juro += valor * taxa;

                    $('#md_pct_juro').maskMoney({ precision: 2, thousands: '', decimal: ',', defaultZero: true, allowZero: true });

                    FLUIGC.calendar('.md_data');
                }

            }

            if (tipo == 'md_tit_a_venc') {
                $('#md_tot_tit_a_venc').val(formatStringValue(tot_cre_a_vencer, 2));
            }

            if (tipo == 'md_tit_venc') {
                //$('#md_pct_juro').maskMoney({precision : 2,thousands : '',decimal : ',', defaultZero : true,allowZero : true});
                $('#md_tot_tit_venc').val(formatStringValue(tot_cre_vencido, 2));
                //$('#md_val_juro').val( formatStringValue( tot_cre_vencido_juro, 2) );
                //$('#md_val_c_juro').val( formatStringValue( tot_cre_vencido_c_juro, 2) );

                //FLUIGC.calendar('.md_data' );
            }

            if (tipo == 'md_tit_saldo') {
                $('#md_tot_saldo').val(formatStringValue(tot_valor_cre, 2));
            }

            if (tipo == 'md_tit_pago') {
                $('#md_pct_juro').maskMoney({ precision: 2, thousands: '', decimal: ',', defaultZero: true, allowZero: true });
                $('#md_tot_desc_juro').val(formatStringValue(tot_desc_juro, 2));
                FLUIGC.calendar('.md_data');
            }

            tblHist = FLUIGC.datatable('#table_' + tipo, {
                dataRequest: data.values,
                renderContent: data.columns,
                header: wHeader,
                search: { enabled: false, },
                navButtons: {
                    enabled: false,
                },

            }, function (err, data) {
                // DO SOMETHING (error or success)                        
            });

            $('#table_' + tipo).on('click', '[data-order-by]', function (event) {
                var order = this.getAttribute('data-order-by');
                var types = this.classList;

                dados = tblHist.getData();

                var classList = this.children[1].classList;

                if (classList.contains("dropup")) {
                    //this.orderAscDesc = "ASC";
                    dados.sort(function (a, b) {
                        if (types.contains('date')) {
                            var a1 = new Date(a[order].split('/').reverse().join('/')), b1 = new Date(b[order].split('/').reverse().join('/'));
                        } else if (types.contains('number')) {
                            var a1 = getFloatValue(a[order].replaceAll('.', '')), b1 = getFloatValue(b[order].replaceAll('.', ''));
                        } else {
                            var a1 = a[order].toLowerCase(), b1 = b[order].toLowerCase();
                        }
                        if (a1 == b1) return 0;
                        return a1 > b1 ? 1 : -1;
                    });
                } else {
                    //this.orderAscDesc = "DESC";
                    dados.sort(function (a, b) {
                        if (types.contains('date')) {
                            var a1 = new Date(a[order].split('/').reverse().join('/')), b1 = new Date(b[order].split('/').reverse().join('/'));
                        } else if (types.contains('number')) {
                            var a1 = getFloatValue(a[order].replaceAll('.', '')), b1 = getFloatValue(b[order].replaceAll('.', ''));
                        } else {
                            var a1 = a[order].toLowerCase(), b1 = b[order].toLowerCase();
                        }
                        if (a1 == b1) return 0;
                        return a1 < b1 ? 1 : -1;
                    });
                }

                tblHist.reload(dados);
                formataTable('table_' + tipo);
            });

            formataTable('table_' + tipo);

            loadWindow.hide();
        },

        error: function (error) {

        }
    });
}

function recalculaJuros() {
    console.log('teste', tblHist.getData());
    data = tblHist.getData();

    var tot_cre_a_vencer = 0;
    var tot_cre_vencido = 0;
    var tot_cre_vencido_juro = 0;
    var tot_cre_vencido_c_juro = 0;

    for (var i = 0; i < data.length; i++) {
        var valor = parseFloat(data[i]['valor_cre_vencido'].replaceAll('.', '').replace(',', '.'));
        var valorVencer = parseFloat(data[i]['valor_cre_a_vencer'].replaceAll('.', '').replace(',', '.'));
        var pct = parseFloat($('#md_pct_juro').val().replace(',', '.')) / 100;
        data[i]['valor_juro'] = formatStringValue(valor * pct, 2);
        data[i]['valor_c_juro'] = formatStringValue(valor + (valor * pct), 2);

        tot_cre_a_vencer += valorVencer;
        tot_cre_vencido += valor;
        tot_cre_vencido_juro += valor * pct;
        tot_cre_vencido_c_juro += valor + (valor * pct);
    }

    $('#md_tot_tit_a_venc').val(formatStringValue(tot_cre_a_vencer, 2));
    $('#md_tot_tit_venc').val(formatStringValue(tot_cre_vencido, 2));
    $('#md_val_juro').val(formatStringValue(tot_cre_vencido_juro, 2));
    $('#md_val_c_juro').val(formatStringValue(tot_cre_vencido_c_juro, 2));

    tblHist.reload(data);

    formataTable('table_tit_venc');

}

function formataTable(table) {

    $("#" + table).find("tr").each(function (el, ev) {
        $($(this).children()).each(function (el, ev) {
            if ($(this).css('display') != 'none') {
                var index = this.cellIndex;
                if ($($(this).closest('table').find('thead > tr')[0].cells[index]).hasClass('text-right')) {
                    $(this).addClass('text-right');
                }
            };
        });
    });
}

function substringMatcher(strs) {
    return function findMatches(q, cb) {
        var matches, substrRegex;

        matches = [];

        substrRegex = new RegExp(q, 'i');

        $.each(strs, function (i, str) {
            if (substrRegex.test(str)) {
                matches.push({
                    description: str
                });
            }
        });
        cb(matches);
    };
}

function clearTable() {


    tblHist.destroy();

}
