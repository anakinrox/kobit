function loadBody(){
	loadCombos();
    setMask();
}

function setEmpresa(){
	$("#den_empresa_matriz").val( $("#cod_empresa_matriz option:selected").text() );
	loadCombos();	
}

function loadCombos(){
	loadDsCombo('cod_empresa_matriz', 'selectTable', 'cod_empresa',  'den_reduz',    'dataBase,table', 'java:/jdbc/LogixDS,empresa', 'cod_empresa' );
	
    loadDsCombo('ies_tip_fornec', 'selectLogix', 'legend_value', 'legend_text', 'table,___lower___table_name,___lower___column_name', 'FRM_COLUMN_LEGEND,fornecedor,ies_tip_fornec', 'legend_text', 'N', 'S', 'S');
    loadDsCombo('simples_nacional', 'selectLogix', 'legend_value', 'legend_text', 'table,___lower___table_name,___lower___column_name', 'FRM_VIRTUAL_COLUMN_LEGEND,par_clientes,virtual_optante_simples', 'legend_text', 'N', 'S', 'S');

    loadDsCombo('cod_cnd_pgto_sug',	  'selectLogix', 'cod_cnd_pgto', 'den_cnd_pgto', 'table', 		   'cond_pgto', 				 'cod_cnd_pgto', 'N', 'S', 'S' );
	loadDsCombo('cod_cnd_pgto_vista',  'selectLogix', 'cod_cnd_pgto', 'den_cnd_pgto', 'table', 		   'cond_pgto', 				 'cod_cnd_pgto', 'N', 'S', 'S' );
	loadDsCombo('cod_cnd_pgto_prazo', 'selectLogix', 'cod_cnd_pgto', 'den_cnd_pgto', 'table', 		   'cond_pgto', 				 'cod_cnd_pgto', 'N', 'S', 'S' );
	
	loadDsCombo('cod_situa', 	  	  'selectLogix', 'cod_situa', 'des_situa', 'table', 		   		'situacao_cre', 			 'cod_situa', 'N', 'S', 'S' );
	loadDsCombo('ies_forma_aprov', 	  'selectLogix', 'ies_forma_aprov', 'des_forma', 'table', 		   		'forma_aprovacao', 			 'ies_forma_aprov', 'N', 'S', 'S' );
	
}

function fnCustomDelete(oElement){
	fnWdkRemoveChild(oElement);
}

function addCnae(){
	var row = wdkAddChild('cnae_x_tributo');
}