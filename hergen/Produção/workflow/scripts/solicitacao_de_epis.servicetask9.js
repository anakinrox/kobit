function servicetask9() {

	var dataBaseLogix = 'java:/jdbc/LogixDS';

	var retorno = "";
	// Conecta o servico e busca pelo nome cadastrado do webservice do Protheus
	
	try { 
		
		var clientService = fluigAPI.getAuthorizeClientService();
		
		var data = {
				companyId : getValue("WKCompany") + "",
				serviceCode : "LogixRest",
				endpoint : "/logixrest/kbtr00006/multesttrans",
				timeoutService : "240",
				method : "post"
			};
		
		var headers = {};
		headers["Content-Type"] = "application/json;charset=UTF-8";
		headers["Accept"] = "*/*";
		data["headers"] = headers;
		
		log.info("## DADOS OPTION ##");
		var options = {};
		options["encoding"] = "UTF-8";
		options["mediaType"] = "application/json";
		data["options"] = options;
		
		log.info("## DADOS PARAMS ##");
		var params = {};
		
		var camposItem = hAPI.getCardData(getValue("WKNumProces"));
		var contadorItem = camposItem.keySet().iterator();
		var empresa = "02";
		var codOper = 'RQM' ;
		var codCC = hAPI.getCardValue('ccusto');
		
		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("table", "kbt_v_unidade_funcional", null, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_empresa", 	empresa, empresa, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_centro_custo", codCC, codCC, ConstraintType.MUST) );
		var unidFunc = DatasetFactory.getDataset('selectLogix', ['cod_uni_funcio'], ct, null);			
		var codUniFun = unidFunc.getValue(0, "cod_uni_funcio"); 
	

		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("table", "estoque_trans", null, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_empresa", empresa, empresa, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_operacao", codOper, codOper, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("num_docum", getValue("WKNumProces"), getValue("WKNumProces"), ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("dat_movto", hAPI.getCardValue('data_refer').split('/').reverse().join('-')+"", 
															  hAPI.getCardValue('data_refer').split('/').reverse().join('-')+"", ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("nom_usuario", 'admlog', 'admlog', ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("num_prog", 'r00006', 'r00006', ConstraintType.MUST) );
		var cont = DatasetFactory.getDataset('selectLogix', null, ct, null);
		if( cont.rowsCount > 0 ){
			throw "Encontrado movimento de estoque com as mesmas caracteristicas.";
		}

		
		var aen_n1 = "0";
		var aen_n2 = "0";
		var aen_n3 = "0";
		var aen_n4 = "0";
		
		
		var la_esttrans = [];
		
		while (contadorItem.hasNext()) {
			log.info('ENTREIII O M ');
			var idItem = contadorItem.next();
			log.info('Campo. ' + idItem);
			var campo = idItem.split('___')[0];
			var linha = idItem.split('___')[1];
			log.info('Seq. ' + linha);
			if (linha != undefined && campo == "codigo_item" ) {
				log.info('Sequencia.....' + linha);
	    	    	
				
				var ct = new Array();
				ct.push( DatasetFactory.createConstraint("table", "item_sup", null, ConstraintType.MUST) );
				ct.push( DatasetFactory.createConstraint("cod_empresa", 	empresa, empresa, ConstraintType.MUST) );
				ct.push( DatasetFactory.createConstraint("cod_item", hAPI.getCardValue('codigo_item___'+linha), hAPI.getCardValue('codigo_item___'+linha), ConstraintType.MUST) );
				var unidFunc = DatasetFactory.getDataset('selectLogix', ['cod_tip_despesa'], ct, null);			
				var codTipoDesp = unidFunc.getValue(0, "cod_tip_despesa"); 
				
				var numConta =  "0000".substring(codCC.length()) + codCC + "0000".substring(codTipoDesp.length()) + codTipoDesp;
				
				qtdbaixa = parseFloat( hAPI.getCardValue('quantidade___'+linha).replace('.','').replace(',','.') );
			    
				var esttrans = {};
			    esttrans["cod_empresa"] = empresa+"";
				esttrans["cod_item"] = hAPI.getCardValue('codigo_item___'+linha)+"";
				esttrans["dat_movto"] = hAPI.getCardValue('data_refer').split('/').reverse().join('-')+"";
				esttrans["cod_operacao"] = codOper+"";
				esttrans["num_docum"] = getValue("WKNumProces")+"";
				esttrans["qtd_movto"] = qtdbaixa+"";
				esttrans["cus_unit_movto_p"] = "0";
				esttrans["cus_tot_movto_p"] = "0";
				esttrans["cus_unit_movto_f"] = "0";
				esttrans["cus_tot_movto_f"] = "0";
				esttrans["num_conta"] = numConta+"";
				esttrans["num_secao_requis"] = codUniFun+"";
				esttrans["cod_local_est_orig"] = "ALMOX";
				esttrans["num_lote_orig"] = "";
				esttrans["ies_sit_est_orig"] = "L";
				esttrans["nom_usuario"] = "ws";
				esttrans["tex_observ"] = "Processo Fluig: "+getValue("WKNumProces")+" - "+getValue("WKUser");
				    		
				esttrans["cod_area_negocio"] = aen_n1;
				esttrans["cod_lin_negocio"] = aen_n2;
				esttrans["cod_seg_merc"] = aen_n3;
				esttrans["cod_cla_uso"] = aen_n4;
				    		
				la_esttrans.push(esttrans);		
			   
			}
	    }
		if( la_esttrans.length > 0 ){
				
			data["params"] = {"la_esttrans": la_esttrans};
			
			log.info("## antes do stringify ProcInvetário ## " + data.toString());
			var jj = JSON.stringify(data);
	
			log.info("## RESULT POST ProcInvetário ## " + jj);
			
			var vo = clientService.invoke(jj);
			if (vo.getResult() == "" || vo.getResult().isEmpty()) {
				throw "Retorno esta vazio";
			} else {
				log.info("## RESULT POST REST ProcInvetário ## " + vo.getResult());
				var jr = JSON.parse(vo.getResult());
				if (jr.data['retorno'] == undefined) {
					throw "ProcInvetário ERRO: Nao foi recebido retorno do servidor Logix!";
				}else if (jr.data['retorno'] == "FALSE"){
					var aMsg = [];
					for( var x = 0; x < jr.data["length"]; x++ ){ 			
						aMsg.push( jr.data["messages"][0]["detail"] );
					}
					throw "ProcInvetário ERRO: "+aMsg.join("; ");
				}
		    }

		}
		
	} catch(erro) { 
		log.error(erro.toString());
		throw erro;
	}
	
	return true;
}