function zoom(componente) {
    var id = componente.split('___')[0];
    var seq = componente.split('___')[1];

    if (id == "codigo_epi") {
        modalzoom.open('Tipo de EPI',
            "ds_epis_em_estoque",
            "codigo_item,Código,descricao_item,Descrição,referencia,Referência,estoque,Estoque",
            "codigo_item,descricao_item,referencia,ca_epi,estoque",
            "",
            componente, false, "default", null, null,
            "codigo_item||'-'||descricao_item");
    }
    if (id == "matricula") {
        modalzoom.open("Funcionario",
            "ds_cadastro_funcionario",
            "matricula,Matricula,nome_funcionario,Funcionario",
            "matricula,cracha,nome_funcionario,ccusto,desc_ccusto,funcao,desc_funcao,cod_fornecedor,raz_social,terceiro",
            "sqlLimit,600",
            componente, false, "default", null, null,
            "nome_funcionario");
    }
    if (id == "ccusto") {
        modalzoom.open("Centro de Custo",
            "selectLogix",
            "cod_cent_cust,Codigo,nom_cent_cust,Centro de Custo",
            "distinct,cod_cent_cust,nom_cent_cust",
            "table,kbt_v_cc_uf,sqlLimit,250",
            componente, false, "default", null, null,
            "cast(cod_cent_cust as char(10))||'-'||nom_cent_cust");
    }
    if (id == "fornecedor") {
        modalzoom.open("Fornecedor",
            "selectLogix",
            "cod_fornecedor,Codigo,raz_social,Fornecedor",
            "distinct,cod_fornecedor,raz_social",
            "table,fornecedor,sqlLimit,250",
            componente, false, "default", null, null,
            "cod_fornecedor||'-'||raz_social");
    }
    if (id == "funcao") {
        return false;
        modalzoom.open("Função",
            "selectTableSQLserver",
            "codcar,Código,titred,Nome do Cargo",
            "codcar,titred",
            "dataBase,java:/jdbc/SeniorDS,table,fluig_v_funcionario,sqlLimit,250",
            componente, false, "default", null, null, null);
    }
}

function setSelectedZoomItem(selectedItem) {
    var id = selectedItem.type.split('___')[0];
    var seq = selectedItem.type.split('___')[1];

    if (id == "matricula") {
        $("#matricula").val(selectedItem.matricula);
        $("#cracha").val(selectedItem.cracha);
        $("#nome_funcionario").val(selectedItem.nome_funcionario);
        $("#ccusto").val(selectedItem.ccusto);
        $("#desc_ccusto").val(selectedItem.desc_ccusto);
        $("#funcao").val(selectedItem.funcao);
        $("#desc_funcao").val(selectedItem.desc_funcao);

        if (selectedItem.terceiro == "S") {
            $("#cod_fornecedor").val(selectedItem.cod_fornecedor);
            $("#raz_social").val(selectedItem.raz_social);
            $("#terceiro").val("S");
        } else {

            var ct = new Array();
            ct.push(DatasetFactory.createConstraint("matricula", '819', null, ConstraintType.MUST));
            var dataset = DatasetFactory.getDataset('senior', null, ct, null);

            if (dataset.rowsCount == 0) {
            } else {
                for (i = 0; i < dataset.values.length; i++) {
                    $("#ccusto").val(dataset.values[i]["codCCusto"]);
                    $("#desc_ccusto").val(dataset.values[i]["CCusto"]);
                    $("#funcao").val(dataset.values[i]["codCargo"]);
                    $("#desc_funcao").val(dataset.values[i]["nomCargo"]);
                }
            }

            $("#cod_fornecedor").val("");
            $("#raz_social").val("");
            $("#terceiro").val("N");
        }
        handleTerceiro();
    }

    if (id == "ccusto") {
        $("#ccusto").val(selectedItem.cod_cent_cust);
        $("#desc_ccusto").val(selectedItem.nom_cent_cust);
    }

    if (id == "codigo_epi") {
        $("#codigo_item___" + seq).val(selectedItem.codigo_item);
        $("#codigo_epi___" + seq).val(selectedItem.codigo_epi);
        $("#descricao_item___" + seq).val(selectedItem.descricao_item);
        $("#referencia___" + seq).val(selectedItem.referencia);
        $("#ca___" + seq).val(selectedItem.ca_epi);

        $("#padrao_troca___" + seq).val(selectedItem.padrao_troca);
        if (selectedItem.padrao_troca != "") {
            var data = new Date();
            var padrao_troca = parseInt(selectedItem.padrao_troca) * 24 * 60 * 60 * 1000; // quantidade de dias em milisegundos
            var prox_troca = new Date(data.getTime() + padrao_troca);

            $("#prox_troca___" + seq).val(prox_troca.toLocaleDateString());
        } else {
            $("#prox_troca___" + seq).val("");
        }
    }

    if (id == "funcao") {
        $("#funcao").val(selectedItem.codcar);
        $("#desc_funcao").val(selectedItem.titred);
    }
    if (id == "fornecedor") {
        $("#cod_fornecedor").val(selectedItem.cod_fornecedor);
        $("#raz_social").val(selectedItem.raz_social);
    }
}