function zoom(componente) {
    var id = componente.split('___')[0];
    var seq = componente.split('___')[1];

    if (id == "cod_item") {
        modalzoom.open('Tipo de EPI',
            "selectDataSet",
            "codigo,Código,descricao,Descrição,referencia,Referência",
            "p.codigo,p.descricao,pf.referencia",
            "dataset,ds_cadastro_epi,tableFilho,itens,sqlLimit,250",
            componente, false, "default", null, null,
            "codigo_item||'-'||descricao_item");

        /* modalzoom.open('Tipo de EPI',
                 "selectDataSet",
                 "codigo,Código,descricao,Descrição,ca_epi,CA",
                 "codigo,descricao,ca_epi",
                 "dataset,ds_cadastro_epi",
                 componente, false, "default", null, null,
                 "codigo||'-'||descricao");*/

    }

    if (id == "matricula") {
        modalzoom.open("Funcionario",
            "selectTableSQLserver",
            "numcad,Matricula,nomfun,Funcionario",
            "numcad,nomfun,codccu,nomccu,numcra,codcar,titred",
            "dataBase,java:/jdbc/SeniorDS,table,fluig_v_funcionario,sqlLimit,250",
            componente, false, "default", null, null,
            "CONCAT( numcad, CAST( nomfun as varchar(20) ) )");
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
        modalzoom.open("Função",
            "selectTableSQLserver",
            "codcar,Código,titred,Nome do Cargo",
            "codcar,titred",
            "dataBase,java:/jdbc/SeniorDS,table,fluig_v_funcionario,sqlLimit,250",
            componente, false, "default", null, null, null);
    }
}

function setSelectedZoomItem(selectedItem) {
    var id = selectedItem.type.split('___')[0]
    var seq = selectedItem.type.split('___')[1];
    if (id == "matricula") {
        $("#matricula").val(selectedItem.numcad);
        $("#cracha").val(selectedItem.numcra);
        $("#nome_funcionario").val(selectedItem.nomfun);
        $("#ccusto").val(selectedItem.codccu);
        $("#desc_ccusto").val(selectedItem.nomccu);

        $("#funcao").val(selectedItem.codcar);
        $("#desc_funcao").val(selectedItem.titred);
    }
    if (id == "ccusto") {
        $("#ccusto").val(selectedItem.cod_cent_cust);
        $("#desc_ccusto").val(selectedItem.nom_cent_cust);
    }
    if (id == "cod_item") {
        $("#codigo_item___" + seq).val(selectedItem.codigo);
        $("#descricao_item___" + seq).val(selectedItem.descricao);
        $("#referencia___" + seq).val(selectedItem.referencia);
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