function validateForm(form){
	
	var activity = getValue('WKNumState');	
	
	if ((activity == 0)||(activity == 4)) {
			
		if ((form.getValue("descricao_tipoPorta") == null || form.getValue("descricao_tipoPorta") == "")) {
			throw "Favor Preencher a Descrição Tipo de Porta" ;
		}
		
		if ((form.getValue("porta_dupla") == null || form.getValue("porta_dupla") == "")) {
			throw "Favor Selecionar se é Porta Dupla" ;
		}		
		
		if ((form.getValue("material_tipoPorta") == null || form.getValue("material_tipoPorta") == "")) {
			throw "Favor Selecionar o Material" ;
		}
		
		if ((form.getValue("preco_tipoPorta") == null || form.getValue("preco_tipoPorta") == "")) {
			throw "Favor Informar o Preço" ;
		}
		
		if ((form.getValue("status_tipoPorta") == null || form.getValue("status_tipoPorta") == "")) {
			throw "Favor Selecionar o Status" ;
		}
		
	}
	
	
}