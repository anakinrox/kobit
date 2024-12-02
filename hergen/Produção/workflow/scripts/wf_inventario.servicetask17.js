function servicetask17(attempt, message) {

	var baseWS        = 'br.com.totvs.webservices';
	var servico       = 'movto_estoque';
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
		
		var constraints = new Array();
		constraints.push( DatasetFactory.createConstraint("cod_empresa", hAPI.getCardValue('empresa'), hAPI.getCardValue('empresa'), ConstraintType.MUST) );
		var empresa = DatasetFactory.getDataset('empresa', null, constraints, null);

		var codOperEnt = 'AJ+'; //empresa.getValue(0, "cod_operacao_entrada");
		var codOperSai = 'AJ-'; //empresa.getValue(0, "cod_operacao_saida"); 
		var codUniFun = hAPI.getCardValue('cod_uni_funcio'); //empresa.getValue(0, "cod_uni_funcio"); 
	
		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("table", "estoque_operac_ct", null, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_empresa", hAPI.getCardValue('empresa'), hAPI.getCardValue('empresa'), ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_operacao", codOperEnt, codOperEnt, ConstraintType.MUST) );
		var oper = DatasetFactory.getDataset('selectLogix', null, ct, null);

		var numContaEnt = oper.getValue(0, "num_conta_credito");
		
		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("table", "estoque_operac_ct", null, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_empresa", hAPI.getCardValue('empresa'), hAPI.getCardValue('empresa'), ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_operacao", codOperSai, codOperSai, ConstraintType.MUST) );
		var oper = DatasetFactory.getDataset('selectLogix', null, ct, null);

		var numContaSai = oper.getValue(0, "num_conta_debito");

		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("table", "estoque_trans", null, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_empresa", hAPI.getCardValue('empresa'), hAPI.getCardValue('empresa'), ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_operacao", codOperEnt, codOperEnt, ConstraintType.MUST) );
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
				
		var ct = new Array();
		ct.push( DatasetFactory.createConstraint("table", "estoque_trans", null, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_empresa", hAPI.getCardValue('empresa'), hAPI.getCardValue('empresa'), ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("cod_operacao", codOperSai, codOperSai, ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("num_docum", getValue("WKNumProces"), getValue("WKNumProces"), ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("dat_movto", hAPI.getCardValue('data_refer').split('/').reverse().join('-')+"", 
															  hAPI.getCardValue('data_refer').split('/').reverse().join('-')+"", ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("nom_usuario", 'admlog', 'admlog', ConstraintType.MUST) );
		ct.push( DatasetFactory.createConstraint("num_prog", 'r00006', 'r00006', ConstraintType.MUST) );
		var cont = DatasetFactory.getDataset('selectLogix', null, ct, null);
		if( cont.rowsCount > 0 ){
			throw "Encontrado movimento de estoque com as mesmas caracteristicas.";
		}		
		
		var la_esttrans = [];
		
		while (contadorItem.hasNext()) {
			log.info('ENTREIII O M ');
			var idItem = contadorItem.next();
			log.info('Campo. ' + idItem);
			var campo = idItem.split('___')[0];
			var linha = idItem.split('___')[1];
			log.info('Seq. ' + linha);
			if (linha != undefined && campo == "cod_item" ) {
				log.info('Sequencia.....' + linha);
	    	    	
				if( hAPI.getCardValue('status___'+linha) == "O"
				  || hAPI.getCardValue('status___'+linha) == "A" ){
				
			    	qtdAceita = parseFloat( hAPI.getCardValue('qtd_aceita___'+linha).replace('.','').replace(',','.') );
			    	qtdEstoque = parseFloat( hAPI.getCardValue('qtd_estoque___'+linha).replace('.','').replace(',','.') );
			    				    	
			    	if( qtdAceita != qtdEstoque ){
			    		
				    	var qtdAjuste = 0;
				    	var operEstoque = "";
				    	var numConta = "";
				    	
				    	var esttrans = {};
				    	
				    	if( qtdEstoque > qtdAceita ){
				    		qtdAjuste = qtdEstoque - qtdAceita;
			    		
				    		esttrans["cod_empresa"] = hAPI.getCardValue('empresa')+"";
				    		esttrans["cod_item"] = hAPI.getCardValue('cod_item___'+linha)+"";
				    		esttrans["dat_movto"] = hAPI.getCardValue('data_refer').split('/').reverse().join('-')+"";
				    		esttrans["cod_operacao"] = codOperSai+"";
				    		esttrans["num_docum"] = getValue("WKNumProces")+"";
				    		esttrans["qtd_movto"] = qtdAjuste+"";
				    		esttrans["cus_unit_movto_p"] = "0";
				    		esttrans["cus_tot_movto_p"] = "0";
				    		esttrans["cus_unit_movto_f"] = "0";
				    		esttrans["cus_tot_movto_f"] = "0";
				    		esttrans["num_conta"] = numContaSai+"";
				    		esttrans["num_secao_requis"] = codUniFun+"";
				    		esttrans["cod_local_est_orig"] = hAPI.getCardValue('local_est___'+linha)+"";
				    		esttrans["num_lote_orig"] = hAPI.getCardValue('lote___'+linha)+"";
				    		esttrans["ies_sit_est_orig"] = hAPI.getCardValue('ies_situa_qtd___'+linha)+"";
				    		esttrans["nom_usuario"] = "ws";
				    		esttrans["tex_observ"] = "Processo Fluig: "+getValue("WKNumProces")+" - "+getValue("WKUser");
				    		
				    		esttrans["cod_area_negocio"] = aen_n1;
				    		esttrans["cod_lin_negocio"] = aen_n2;
				    		esttrans["cod_seg_merc"] = aen_n3;
				    		esttrans["cod_cla_uso"] = aen_n4;
				    		
				    	} else {
				    		qtdAjuste = qtdAceita - qtdEstoque;
				    		
				    		esttrans["cod_empresa"] = hAPI.getCardValue('empresa')+"";
				    		esttrans["cod_item"] = hAPI.getCardValue('cod_item___'+linha)+"";
				    		esttrans["dat_movto"] = hAPI.getCardValue('data_refer').split('/').reverse().join('-')+"";
				    		esttrans["cod_operacao"] = codOperEnt+"";
				    		esttrans["num_docum"] = getValue("WKNumProces")+"";
				    		esttrans["qtd_movto"] = qtdAjuste+"";
				    		esttrans["cus_unit_movto_p"] = "0";
				    		esttrans["cus_tot_movto_p"] = "0";
				    		esttrans["cus_unit_movto_f"] = "0";
				    		esttrans["cus_tot_movto_f"] = "0";
				    		esttrans["num_conta"] = numContaEnt+"";
				    		esttrans["num_secao_requis"] = codUniFun+"";
				    		esttrans["cod_local_est_dest"] = hAPI.getCardValue('local_est___'+linha)+"";
				    		esttrans["num_lote_dest"] = hAPI.getCardValue('lote___'+linha)+"";
				    		esttrans["ies_sit_est_dest"] = hAPI.getCardValue('ies_situa_qtd___'+linha)+"";
				    		esttrans["nom_usuario"] = "ws";
				    		esttrans["tex_observ"] = "Processo Fluig: "+getValue("WKNumProces")+" - "+getValue("WKUser");
				    		
				    		esttrans["cod_area_negocio"] = aen_n1;
				    		esttrans["cod_lin_negocio"] = aen_n2;
				    		esttrans["cod_seg_merc"] = aen_n3;
				    		esttrans["cod_cla_uso"] = aen_n4;
				    	}

				    	la_esttrans.push(esttrans);		
			    	}
				}
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