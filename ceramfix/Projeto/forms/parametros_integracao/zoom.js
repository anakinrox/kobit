var seq = 0;

function openZoom({ field, filters }, id) {

    if ((id != null) || (id != undefined)) {
        var sLast = id.split('_').length;
        seq = id.split('_')[(sLast - 1)];
    }

    let filtersString = '';

    if (filters) {
        const filtersArr = Object.entries(filters);
        filtersString = filtersArr.map(([key, value]) => `${key},${value}`).join(',');
        console.log(filtersString);
    }

    if (field == 'item') {
        if ($('#cod_empresa').val() == '') {
            FLUIGC.toast({
                message: 'O Campo  [ Empresa ] devem ser preenchido.',
                type: 'danger'
            });
            return false;
        }
    }

    if (field != 'empresa') {
        if ($('#cod_empresa').val() == '') {
            FLUIGC.toast({
                message: 'O Campo  [ Empresa ] devem ser preenchido.',
                type: 'danger'
            });
            return false;
        }
    }

    var empresa = $('#cod_empresa').val();

    const configs = {
        empresa: ['Empresa', 'selectLogix', 'cod_empresa,Código,den_empresa,Descrição', 'cod_empresa,den_empresa', 'table,empresa', field, false, 'default', null, null, "cod_empresa||'-'||den_empresa"],
        cliente_fat: ['Clientes Faturamento', 'selectLogix', 'cod_cliente,Código,nom_cliente,Descrição', 'cod_cliente,nom_cliente', 'table,clientes,ies_situacao,A', field, false, 'default', null, null, "cod_cliente||'-'||nom_cliente"],
        cliente_rem: ['Clientes Remessa', 'selectLogix', 'cod_cliente,Código,nom_cliente,Descrição', 'cod_cliente,nom_cliente', 'table,clientes,ies_situacao,A', field, false, 'default', null, null, "cod_cliente||'-'||nom_cliente"],
        natureza_fat : ['Natureza','natureza_operacao','cod_nat_oper,Código,den_nat_oper,Descrição','cod_nat_oper,den_nat_oper','sqlLimit,250', field, false, 'default', null, null, "cod_nat_oper||'-'||den_nat_oper"],
        natureza_rem: ['Natureza','natureza_operacao','cod_nat_oper,Código,den_nat_oper,Descrição','cod_nat_oper,den_nat_oper','sqlLimit,250', field, false, 'default', null, null, "cod_nat_oper||'-'||den_nat_oper"],
        cond_pgto_fat: ['Cond. Pagamento','condicao_pagamento_vdp','cod_cnd_pgto,Código,den_cnd_pgto,Descrição','cod_cnd_pgto,den_cnd_pgto','sqlLimit,250', field, false, 'default', null, null, "cod_cnd_pgto||'-'||den_cnd_pgto"],
        cond_pgto_rem: ['Cond. Pagamento','condicao_pagamento_vdp','cod_cnd_pgto,Código,den_cnd_pgto,Descrição','cod_cnd_pgto,den_cnd_pgto','sqlLimit,250', field, false, 'default', null, null, "cod_cnd_pgto||'-'||den_cnd_pgto"],
        carteira_fat: ['Cod. Carteira','carteira','cod_tip_carteira,Código,den_tip_carteira,Descrição','cod_tip_carteira,den_tip_carteira','sqlLimit,250', field, false, 'default', null, null, "cod_tip_carteira||'-'||den_tip_carteira"],
        carteira_rem: ['Cod. Carteira','carteira','cod_tip_carteira,Código,den_tip_carteira,Descrição','cod_tip_carteira,den_tip_carteira','sqlLimit,250', field, false, 'default', null, null, "cod_tip_carteira||'-'||den_tip_carteira"],
        moeda_fat: ['Moeda', 'selectLogix','cod_moeda,Código,den_moeda,Descrição','cod_moeda,den_moeda','table,moeda', field, false, 'default', null, null, "cod_moeda||'-'||den_moeda"],
        moeda_rem: ['Moeda', 'selectLogix','cod_moeda,Código,den_moeda,Descrição','cod_moeda,den_moeda','table,moeda', field, false, 'default', null, null, "cod_moeda||'-'||den_moeda"],
        list_preco_fat: ['Lista de Preço', 'selectLogix','num_list_preco,Código,den_list_preco,Descrição','num_list_preco,den_list_preco','table,desc_preco_mest,where,cod_empresa='+empresa+'' ,field, false, 'default', null, null, "num_list_preco||'-'||den_list_preco"],
        list_preco_rem: ['Lista de Preço', 'selectLogix','num_list_preco,Código,den_list_preco,Descrição','num_list_preco,den_list_preco','table,desc_preco_mest,where,cod_empresa='+empresa+'' ,field, false, 'default', null, null, "num_list_preco||'-'||den_list_preco"],
    };

    const config = configs[field];
    if (config) {
        modalzoom.open(...config);
    }
}

function setSelectedZoomItem({ type, cod_empresa, den_empresa, cod_cliente, nom_cliente, cod_nat_oper, den_nat_oper, cod_cnd_pgto, den_cnd_pgto, cod_tip_carteira, den_tip_carteira, cod_moeda, den_moeda, num_list_preco, den_list_preco,  ...item }) {

    if (type === 'empresa') {
        $('#cod_empresa').val(cod_empresa);
        $('#nome_empresa').val(den_empresa);
        return;
    }

    if (type === 'cliente_fat') {
        $('#cod_cliente_fat').val(cod_cliente);
        $('#nome_cliente_fat').val(nom_cliente);
        return;
    }

    if (type === 'cliente_rem') {
        $('#cod_cliente_rem').val(cod_cliente);
        $('#nome_cliente_rem').val(nom_cliente);
        return;
    }

    if (type === 'natureza_fat') {
        $('#cod_natureza_fat').val(cod_nat_oper);
        $('#natureza_fat').val(den_nat_oper);
        return;
    }

    if (type === 'natureza_rem') {
        $('#cod_natureza_rem').val(cod_nat_oper);
        $('#natureza_rem').val(den_nat_oper);
        return;
    }

    if (type === 'cond_pgto_fat') {
        $('#cod_cond_pgto_fat').val(cod_cnd_pgto);
        $('#cond_pgto_fat').val(den_cnd_pgto);
        return;
    }

    if (type === 'cond_pgto_rem') {
        $('#cod_cond_pgto_rem').val(cod_cnd_pgto);
        $('#cond_pgto_rem').val(den_cnd_pgto);
        return;
    }

    if (type === 'carteira_fat') {
        $('#cod_carteira_fat').val(cod_tip_carteira);
        $('#carteira_fat').val(den_tip_carteira);
        return;
    }

    if (type === 'carteira_rem') {
        $('#cod_carteira_rem').val(cod_tip_carteira);
        $('#carteira_rem').val(den_tip_carteira);
        return;
    }

    if (type === 'moeda_fat') {
        $('#cod_moeda_fat').val(cod_moeda);
        $('#moeda_fat').val(den_moeda);
        return;
    }

    if (type === 'moeda_rem') {
        $('#cod_moeda_rem').val(cod_moeda);
        $('#moeda_rem').val(den_moeda);
        return;
    }

    if (type === 'list_preco_fat') {
        $('#cod_list_preco_fat').val(num_list_preco);
        $('#list_preco_fat').val(den_list_preco);
        return;
    }

    if (type === 'list_preco_rem') {
        $('#cod_list_preco_rem').val(num_list_preco);
        $('#list_preco_rem').val(den_list_preco);
        return;
    }




}

function clearSelectedZoomItem() {

}