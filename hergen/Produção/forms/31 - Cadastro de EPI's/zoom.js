function zoom(componente) {
    modalzoom.open("Item",
        "selectLogix",
        "cod_item,Código,den_item,Item",
        "cod_item,den_item,den_item_reduz,cod_comprador,nom_comprador,cod_unid_med,gru_ctr_desp,den_gru_ctr_desp,cod_tip_despesa,nom_tip_despesa,num_conta,den_conta,tmp_lead_time,cod_familia,gru_ctr_estoq,ies_ctr_estoque,ies_conta,ies_comprador_ativo",
        "table,kbt_v_item,sqlLimit,250,ies_tip_item,C,ies_situacao,A,cod_empresa,02,cod_familia,004,gru_ctr_estoq,3",
        componente, true, "default", null, null,
        "cod_item||'-'||den_item");
}

function setSelectedZoomItem(selectedItem) {
    var componenteSplit = selectedItem.type.split("___")[0];
    var seq = selectedItem.type.split("___")[1];
    if (componenteSplit == "cod_item") {
        $("#codigo_item___" + seq).val(selectedItem.cod_item);
        $("#descricao_item___" + seq).val(selectedItem.den_item);
        $("#referencia___" + seq).val(selectedItem.size);
    }
}