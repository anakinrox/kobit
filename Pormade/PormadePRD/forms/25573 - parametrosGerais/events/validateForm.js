function validateForm(form){
	
	var activity = getValue('WKNumState');	
	
	if ((activity == 0)||(activity == 4)) {
		if ((form.getValue("ocg_dias_prev_entrega") <= 0 || form.getValue("ocg_dias_prev_entrega") == null || form.getValue("ocg_dias_prev_entrega") == "")) {
			throw "Favor Preencher com Número Positivo!" ;
		}
		if ((form.getValue("orc_desconto_vendedor_porc") < 0|| form.getValue("orc_desconto_vendedor_porc") >100
				|| form.getValue("orc_desconto_vendedor_porc") == null || form.getValue("orc_desconto_vendedor_porc") == "")) {
			throw "Desconto Não é Válido" ;
		}		
		
		if ((form.getValue("ocg_frete_porcentagem") < 0 || form.getValue("ocg_frete_porcentagem") > 100
				|| form.getValue("ocg_frete_porcentagem") == null || form.getValue("ocg_frete_porcentagem") == "")) {
			throw "Desconto Não é Válido" ;
		}	
		
				
	}
	
}