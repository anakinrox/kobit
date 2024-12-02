function servicetask38(attempt, message) {
	
	if( hAPI.getCardValue("altera") == "S" ){

		var idPessoa = hAPI.getCardValue("id_pessoa")
		var nome = retira_acentos(hAPI.getCardValue("nome").toUpperCase()+"")+"";
		var cnpj_cpf = String(hAPI.getCardValue("cnpj_cpf")).replace(/\D/g, '');;
		var fisico_juridico = hAPI.getCardValue("fisico_juridico");
		var rg_ie = retira_acentos(hAPI.getCardValue("rg_ie")+"")+"";
		var genero = hAPI.getCardValue("sexo");
		var data_nacimento = hAPI.getCardValue("data_nascimento");
		var naturalidade = hAPI.getCardValue("cod_naturalidade");
		var nacionalidade = hAPI.getCardValue("cod_nacionalidade");
		var estadoCivil = hAPI.getCardValue("estado_civil");
		var pis = hAPI.getCardValue("pis");
		var instrucao = hAPI.getCardValue("escolaridade");
		var raca = hAPI.getCardValue("raca");
		var tiposanguino = 'N';
		var contato = hAPI.getCardValue("email");
		var origem = hAPI.getCardValue("cod_origem");
		var site = '';
		var idEndereco = hAPI.getCardValue("idendereco");
		var cep = hAPI.getCardValue("cep");
		var endereco = hAPI.getCardValue("endereco");
		var numero = hAPI.getCardValue("numero");
		var complemento = hAPI.getCardValue("site");
		var bairro = hAPI.getCardValue("bairro");
		var den_cidade = hAPI.getCardValue("den_cidade");
		var uf = hAPI.getCardValue("uf");
		var pais = "BRASIL";
		var idTelefone = hAPI.getCardValue("idtelefone");
		var telefone1 = hAPI.getCardValue("telefone1");
		var idEmail = hAPI.getCardValue("idemail");
		var email = hAPI.getCardValue("email");
		var cupon = hAPI.getCardValue("cupon");
		var comissao = hAPI.getCardValue("comissao");
		var id_banco = hAPI.getCardValue('id_banco');
//		if ( hAPI.getCardValue('banco') != "" ){
//			var id_banco = hAPI.getCardValue('banco').split(' - ')[0];
//		}
//		if( hAPI.getCardValue("id_banco") != "" ){
//			var sql = " select ps.codigo "+
//					  "	from online.pon_bancos ps "+
//					  "	where ps.id = '"+ hAPI.getCardValue("id_banco") +"' ";
//			var ct = new Array();
//			ct.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
//			ct.push( DatasetFactory.createConstraint('sql', 	 sql, null, ConstraintType.MUST) );
//			var ds = DatasetFactory.getDataset('select', null, ct, null );
//			if( ds.rowsCount == 0 ){
//				throw 'Não localizado banco '+ hAPI.getCardValue("id_banco").trim() +' no SIS.';
//			}
//			var id_banco = ds.getValue(0, 'codigo')+"";
//		}
		var agencia = hAPI.getCardValue("agencia");
		var conta = hAPI.getCardValue("conta");
		var operacao = 1; 
		if ( hAPI.getCardValue("operacao") == "CONTA POUPANCA" ){
			operacao = 2
		}
		var pix = hAPI.getCardValue("pix");
		var num_cau_crea = hAPI.getCardValue("num_cau_crea");
		var tipo_cadastro = hAPI.getCardValue("tipo_cadastro");
		var profissao = hAPI.getCardValue("profissao");
		var cod_usuario_respon = hAPI.getCardValue("usuario_responsavel");
		var sponsor = hAPI.getCardValue("sponsor");
		var sponsorBonus = hAPI.getCardValue("sponsorBonus");
		var sponsorGroupId = hAPI.getCardValue("sponsorGroupId");
		var flagrpa = hAPI.getCardValue("utiliza_rpa");		
		
		var ct = [
			DatasetFactory.createConstraint('indacao', 'UPDATEPESSOA', 'UPDATEPESSOA', ConstraintType.MUST),
			DatasetFactory.createConstraint('idPessoa', idPessoa, idPessoa, ConstraintType.MUST),
			DatasetFactory.createConstraint('nome', nome, nome, ConstraintType.MUST),
			DatasetFactory.createConstraint('cnpj_cpf', cnpj_cpf, cnpj_cpf, ConstraintType.MUST),
			DatasetFactory.createConstraint('fisico_juridico', fisico_juridico, fisico_juridico, ConstraintType.MUST),
			DatasetFactory.createConstraint('rg_ie', rg_ie, rg_ie, ConstraintType.MUST),
			DatasetFactory.createConstraint('genero', genero, genero, ConstraintType.MUST),
			DatasetFactory.createConstraint('data_nacimento', data_nacimento, data_nacimento, ConstraintType.MUST),
			DatasetFactory.createConstraint('naturalidade', naturalidade, naturalidade, ConstraintType.MUST),
			DatasetFactory.createConstraint('nacionalidade', nacionalidade, nacionalidade, ConstraintType.MUST),
			DatasetFactory.createConstraint('estadoCivil', estadoCivil, estadoCivil, ConstraintType.MUST),
			DatasetFactory.createConstraint('pis', pis, pis, ConstraintType.MUST),
			DatasetFactory.createConstraint('instrucao', instrucao, instrucao, ConstraintType.MUST),
			DatasetFactory.createConstraint('raca', raca, raca, ConstraintType.MUST),
			DatasetFactory.createConstraint('tiposanguino', tiposanguino, tiposanguino, ConstraintType.MUST),
			DatasetFactory.createConstraint('contato', contato, contato, ConstraintType.MUST),
			DatasetFactory.createConstraint('origem', origem, origem, ConstraintType.MUST),
			DatasetFactory.createConstraint('site', site, site, ConstraintType.MUST),
			DatasetFactory.createConstraint('idEndereco', idEndereco, idEndereco, ConstraintType.MUST),
			DatasetFactory.createConstraint('cep', cep, cep, ConstraintType.MUST),
			DatasetFactory.createConstraint('endereco', endereco, endereco, ConstraintType.MUST),
			DatasetFactory.createConstraint('numero', numero, numero, ConstraintType.MUST),
			DatasetFactory.createConstraint('complemento', complemento, complemento, ConstraintType.MUST),
			DatasetFactory.createConstraint('bairro', bairro, bairro, ConstraintType.MUST),
			DatasetFactory.createConstraint('den_cidade', den_cidade, den_cidade, ConstraintType.MUST),
			DatasetFactory.createConstraint('uf', uf, uf, ConstraintType.MUST),
			DatasetFactory.createConstraint('pais', pais, pais, ConstraintType.MUST),
			DatasetFactory.createConstraint('idTelefone', idTelefone, idTelefone, ConstraintType.MUST),
			DatasetFactory.createConstraint('telefone1', telefone1, telefone1, ConstraintType.MUST),
			DatasetFactory.createConstraint('idEmail', idEmail, idEmail, ConstraintType.MUST),
			DatasetFactory.createConstraint('email', email, email, ConstraintType.MUST),
			DatasetFactory.createConstraint('cupon', cupon, cupon, ConstraintType.MUST),
			DatasetFactory.createConstraint('comissao', comissao, comissao, ConstraintType.MUST),
			DatasetFactory.createConstraint('id_banco', id_banco, id_banco, ConstraintType.MUST),
			DatasetFactory.createConstraint('agencia', agencia, agencia, ConstraintType.MUST),
			DatasetFactory.createConstraint('conta', conta, conta, ConstraintType.MUST),
			DatasetFactory.createConstraint('operacao', operacao, operacao, ConstraintType.MUST),
			DatasetFactory.createConstraint('pix', pix, pix, ConstraintType.MUST),
			DatasetFactory.createConstraint('num_cau_crea', num_cau_crea, num_cau_crea, ConstraintType.MUST),
			DatasetFactory.createConstraint('tipo_cadastro', tipo_cadastro, tipo_cadastro, ConstraintType.MUST),
			DatasetFactory.createConstraint('profissao', profissao, profissao, ConstraintType.MUST),
			DatasetFactory.createConstraint('cod_usuario_respon', cod_usuario_respon, cod_usuario_respon, ConstraintType.MUST),
			DatasetFactory.createConstraint('sponsor', sponsor, sponsor, ConstraintType.MUST),
			DatasetFactory.createConstraint('sponsorBonus', sponsorBonus, sponsorBonus, ConstraintType.MUST),
			DatasetFactory.createConstraint('sponsorGroupId', sponsorGroupId, sponsorGroupId, ConstraintType.MUST),
			DatasetFactory.createConstraint('flagrpa', flagrpa, flagrpa, ConstraintType.MUST),
		]
		
		if ( hAPI.getCardValue("doc_assinatura") != "" ){
			
			var sql = "select cod_contrato, data_assinatura from kbt_t_contrato_parceria " +
					  "where num_proces = '"+ hAPI.getCardValue("doc_assinatura") +"' ";
			var ct2 = new Array();
			ct2.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
			ct2.push( DatasetFactory.createConstraint('sql', 	 sql, null, ConstraintType.MUST) );
			var ds = DatasetFactory.getDataset('select', null, ct2, null );
			
			if ( ds.rowsCount > 0 ){
				
				ct.push( DatasetFactory.createConstraint('numContrato', ds.getValue(0, 'cod_contrato'), ds.getValue(0, 'cod_contrato'), ConstraintType.MUST) );
				ct.push( DatasetFactory.createConstraint('dataContrato', ds.getValue(0, 'data_assinatura'), ds.getValue(0, 'data_assinatura'), ConstraintType.MUST) );
				
			}
		}
		
		log.info("## CONSTRAINTS ## 38");
		log.dir(ct);
		var ds = DatasetFactory.getDataset('dsk_sis', null, ct, null );
		if( ds.rowsCount > 0 ){
			
			if ( ds.getValue(0, 'status') != 'true' ){
				throw 'Erro ao atualizar SIS: ' + ds.getValue(0, 'pessoa');
			}

		} else {
			throw "Erro ao atualizar parceiro no sis";
		}
		
	} else {
		
		var idPessoa = hAPI.getCardValue("id_pessoa")
		var nome = retira_acentos(hAPI.getCardValue("nome").toUpperCase()+"")+"";
		var cnpj_cpf = String(hAPI.getCardValue("cnpj_cpf")).replace(/\D/g, '');;
		var fisico_juridico = hAPI.getCardValue("fisico_juridico");
		var rg_ie = retira_acentos(hAPI.getCardValue("rg_ie")+"")+"";
		var genero = hAPI.getCardValue("sexo");
		var data_nacimento = hAPI.getCardValue("data_nascimento");
		var naturalidade = hAPI.getCardValue("cod_naturalidade");
		var nacionalidade = hAPI.getCardValue("cod_nacionalidade");
		var estadoCivil = hAPI.getCardValue("estado_civil");
		var pis = hAPI.getCardValue("pis");
		var instrucao = hAPI.getCardValue("escolaridade");
		var raca = hAPI.getCardValue("raca");
		var tiposanguino = 'N';
		var contato = hAPI.getCardValue("email");
		var origem = hAPI.getCardValue("cod_origem");
		var site = '';
		var idEndereco = hAPI.getCardValue("idendereco");
		var cep = hAPI.getCardValue("cep");
		var endereco = hAPI.getCardValue("endereco");
		var numero = hAPI.getCardValue("numero");
		var complemento = hAPI.getCardValue("site");
		var bairro = hAPI.getCardValue("bairro");
		var den_cidade = hAPI.getCardValue("den_cidade");
		var uf = hAPI.getCardValue("uf");
		var pais = "BRASIL";
		var idTelefone = hAPI.getCardValue("idtelefone");
		var telefone1 = hAPI.getCardValue("telefone1");
		var idEmail = hAPI.getCardValue("idemail");
		var email = hAPI.getCardValue("email");
		var cupon = hAPI.getCardValue("cupon");
		var comissao = hAPI.getCardValue("comissao");
		var id_banco = hAPI.getCardValue('id_banco');
//		if ( hAPI.getCardValue('banco') != "" ){
//			var id_banco = hAPI.getCardValue('banco').split(' - ')[0];
//		}
//		if( hAPI.getCardValue("id_banco") != "" ){
//			var sql = " select ps.codigo "+
//					  "	from online.pon_bancos ps "+
//					  "	where ps.id = '"+ hAPI.getCardValue("id_banco") +"' ";
//			var ct = new Array();
//			ct.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
//			ct.push( DatasetFactory.createConstraint('sql', 	 sql, null, ConstraintType.MUST) );
//			var ds = DatasetFactory.getDataset('select', null, ct, null );
//			if( ds.rowsCount == 0 ){
//				throw 'Não localizado banco '+ hAPI.getCardValue("id_banco").trim() +' no SIS.';
//			}
//			var id_banco = ds.getValue(0, 'codigo')+"";
//		}
		var agencia = hAPI.getCardValue("agencia");
		var conta = hAPI.getCardValue("conta");
		var operacao = 1; 
		if ( hAPI.getCardValue("operacao") == "CONTA POUPANCA" ){
			operacao = 2
		}
		var pix = hAPI.getCardValue("pix");
		var num_cau_crea = hAPI.getCardValue("num_cau_crea");
		var tipo_cadastro = hAPI.getCardValue("tipo_cadastro");
		var profissao = hAPI.getCardValue("profissao");
		var cod_usuario_respon = hAPI.getCardValue("usuario_responsavel");
		var sponsor = hAPI.getCardValue("sponsor");
		var sponsorBonus = hAPI.getCardValue("sponsorBonus");
		var sponsorGroupId = hAPI.getCardValue("sponsorGroupId");
		var flagrpa = hAPI.getCardValue("utiliza_rpa");		
		
		var ct = [
			DatasetFactory.createConstraint('indacao', 'ADDPESSOA', 'ADDPESSOA', ConstraintType.MUST),
			DatasetFactory.createConstraint('nome', nome, nome, ConstraintType.MUST),
			DatasetFactory.createConstraint('cnpj_cpf', cnpj_cpf, cnpj_cpf, ConstraintType.MUST),
			DatasetFactory.createConstraint('fisico_juridico', fisico_juridico, fisico_juridico, ConstraintType.MUST),
			DatasetFactory.createConstraint('rg_ie', rg_ie, rg_ie, ConstraintType.MUST),
			DatasetFactory.createConstraint('genero', genero, genero, ConstraintType.MUST),
			DatasetFactory.createConstraint('data_nacimento', data_nacimento, data_nacimento, ConstraintType.MUST),
			DatasetFactory.createConstraint('naturalidade', naturalidade, naturalidade, ConstraintType.MUST),
			DatasetFactory.createConstraint('nacionalidade', nacionalidade, nacionalidade, ConstraintType.MUST),
			DatasetFactory.createConstraint('estadoCivil', estadoCivil, estadoCivil, ConstraintType.MUST),
			DatasetFactory.createConstraint('pis', pis, pis, ConstraintType.MUST),
			DatasetFactory.createConstraint('instrucao', instrucao, instrucao, ConstraintType.MUST),
			DatasetFactory.createConstraint('raca', raca, raca, ConstraintType.MUST),
			DatasetFactory.createConstraint('tiposanguino', tiposanguino, tiposanguino, ConstraintType.MUST),
			DatasetFactory.createConstraint('contato', contato, contato, ConstraintType.MUST),
			DatasetFactory.createConstraint('origem', origem, origem, ConstraintType.MUST),
			DatasetFactory.createConstraint('site', site, site, ConstraintType.MUST),
			DatasetFactory.createConstraint('idEndereco', idEndereco, idEndereco, ConstraintType.MUST),
			DatasetFactory.createConstraint('cep', cep, cep, ConstraintType.MUST),
			DatasetFactory.createConstraint('endereco', endereco, endereco, ConstraintType.MUST),
			DatasetFactory.createConstraint('numero', numero, numero, ConstraintType.MUST),
			DatasetFactory.createConstraint('complemento', complemento, complemento, ConstraintType.MUST),
			DatasetFactory.createConstraint('bairro', bairro, bairro, ConstraintType.MUST),
			DatasetFactory.createConstraint('den_cidade', den_cidade, den_cidade, ConstraintType.MUST),
			DatasetFactory.createConstraint('uf', uf, uf, ConstraintType.MUST),
			DatasetFactory.createConstraint('pais', pais, pais, ConstraintType.MUST),
			DatasetFactory.createConstraint('idTelefone', idTelefone, idTelefone, ConstraintType.MUST),
			DatasetFactory.createConstraint('telefone1', telefone1, telefone1, ConstraintType.MUST),
			DatasetFactory.createConstraint('idEmail', idEmail, idEmail, ConstraintType.MUST),
			DatasetFactory.createConstraint('email', email, email, ConstraintType.MUST),
			DatasetFactory.createConstraint('cupon', cupon, cupon, ConstraintType.MUST),
			DatasetFactory.createConstraint('comissao', comissao, comissao, ConstraintType.MUST),
			DatasetFactory.createConstraint('id_banco', id_banco, id_banco, ConstraintType.MUST),
			DatasetFactory.createConstraint('agencia', agencia, agencia, ConstraintType.MUST),
			DatasetFactory.createConstraint('conta', conta, conta, ConstraintType.MUST),
			DatasetFactory.createConstraint('operacao', operacao, operacao, ConstraintType.MUST),
			DatasetFactory.createConstraint('pix', pix, pix, ConstraintType.MUST),
			DatasetFactory.createConstraint('num_cau_crea', num_cau_crea, num_cau_crea, ConstraintType.MUST),
			DatasetFactory.createConstraint('tipo_cadastro', tipo_cadastro, tipo_cadastro, ConstraintType.MUST),
			DatasetFactory.createConstraint('profissao', profissao, profissao, ConstraintType.MUST),
			DatasetFactory.createConstraint('cod_usuario_respon', cod_usuario_respon, cod_usuario_respon, ConstraintType.MUST),
			DatasetFactory.createConstraint('sponsor', sponsor, sponsor, ConstraintType.MUST),
			DatasetFactory.createConstraint('sponsorBonus', sponsorBonus, sponsorBonus, ConstraintType.MUST),
			DatasetFactory.createConstraint('sponsorGroupId', sponsorGroupId, sponsorGroupId, ConstraintType.MUST),
			DatasetFactory.createConstraint('flagrpa', flagrpa, flagrpa, ConstraintType.MUST),
		]
		
		if ( hAPI.getCardValue("doc_assinatura") != "" ){
			
			var sql = "select cod_contrato, data_assinatura from kbt_t_contrato_parceria " +
					  "where num_proces = '"+ hAPI.getCardValue("doc_assinatura") +"' ";
			var ct2 = new Array();
			ct2.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
			ct2.push( DatasetFactory.createConstraint('sql', 	 sql, null, ConstraintType.MUST) );
			var ds = DatasetFactory.getDataset('select', null, ct2, null );
			
			if ( ds.rowsCount > 0 ){
				
				ct.push( DatasetFactory.createConstraint('numContrato', ds.getValue(0, 'cod_contrato'), ds.getValue(0, 'cod_contrato'), ConstraintType.MUST) );
				ct.push( DatasetFactory.createConstraint('dataContrato', ds.getValue(0, 'data_assinatura'), ds.getValue(0, 'data_assinatura'), ConstraintType.MUST) );
				
			}
		}
		
		log.info("## CONSTRAINTS ## 38");
		log.dir(ct);
		var ds = DatasetFactory.getDataset('dsk_sis', null, ct, null );
		if( ds.rowsCount > 0 ){
			
			if ( ds.getValue(0, 'status') != 'true' ){
				throw 'Erro ao incluir SIS: ' + ds.getValue(0, 'pessoa');
			}

		} else {
			throw "Erro ao incluir parceiro no sis";
		}
	
//		try{
//			var clientService = fluigAPI.getAuthorizeClientService();
//			
//			var endpoint = "/api.rule?sys=PON"; 
//			
//			var data = {
//				companyId : getValue("WKCompany") + "",
//				serviceCode : "SYS",
//				timeoutService : "240",
//				endpoint : endpoint,
//				method : "POST"
//			};
//				
//			var headers = {};
//			headers["Content-Type"] = "application/json";
//			headers["Token"] = "c72c53905d28d2eaaee0d1d2cd11a287";
//			data["headers"] = headers;
//			
//			var params = {};
//			var pessoa = {};
//			
//			pessoa["name"] = retira_acentos(hAPI.getCardValue("nome").toUpperCase()+"")+"";
//			pessoa["identity"] = hAPI.getCardValue("cnpj_cpf").replace('.','').replace('.','').replace('/','').replace('-','')+"";
//			var tipo = 'CPF';
//			if( hAPI.getCardValue("fisico_juridico") == "J" ){
//				tipo = 'CNPJ'
//			}
//			pessoa["identityType"] = tipo+"";
//			pessoa["document"] = retira_acentos(hAPI.getCardValue("rg_ie")+"")+"";
//			pessoa["birthDate"] = String(hAPI.getCardValue("data_nascimento")).split(' ')[0];
//			pessoa["obs"] = retira_acentos(hAPI.getCardValue("contato").replace('-','')+"")+""
//			pessoa["complement"] = retira_acentos(hAPI.getCardValue("site").replace('-','')+"")+""
//			pessoa["zipCode"] = hAPI.getCardValue("cep").replace('-','')+"";
//			pessoa["street"] = retira_acentos(hAPI.getCardValue("endereco").toUpperCase()+"")+"";
//			
//			var number = "0";
//			if( hAPI.getCardValue("numero").toUpperCase() != "" ){
//				number = hAPI.getCardValue("numero").toUpperCase()+"";
//			}
//			pessoa["number"] = number+"";
//			pessoa["neighbourhood"] = retira_acentos(hAPI.getCardValue("bairro").toUpperCase()+"")+"";
//			pessoa["city"] = retira_acentos(hAPI.getCardValue("den_cidade").toUpperCase()+"")+"";
//			pessoa["state"] = retira_acentos(hAPI.getCardValue("uf").toUpperCase()+"")+"";
//			pessoa["country"] = "BRASIL";
//			pessoa["mobileNumber"] = hAPI.getCardValue("telefone1").toUpperCase().replace('(','').replace(')','').replace('-','')+"";
//			pessoa["email"] = retira_acentos(hAPI.getCardValue("email").toUpperCase()+"")+"";
//			pessoa["partnerCoupon"] = hAPI.getCardValue("cupon").toUpperCase()+"";
//			pessoa["partnerBonus"] = parseFloat( hAPI.getCardValue("comissao") );
//			
//			if( hAPI.getCardValue("cod_call_center") != undefined 
//			 && hAPI.getCardValue("cod_call_center") != ""
//			 && !isNaN( parseInt( hAPI.getCardValue("cod_call_center") ) ) ){
//				pessoa["partnerCallCenterOperatorId"] = parseInt( hAPI.getCardValue("cod_call_center") );
//			}
//			
//			pessoa["partner"] = "true";
//			pessoa["provider"] = "false";
//			
//			pessoa["bankId"] = hAPI.getCardValue("id_banco")+"";
//			pessoa["bankBranch"] = hAPI.getCardValue("agencia")+"";
//			pessoa["bankAccount"] = hAPI.getCardValue("conta")+"";
//			var tipo = 1; 
//			if ( hAPI.getCardValue("operacao") == "CONTA POUPANCA" ){
//				tipo = 2
//			}
//			pessoa["bankAccountType"] = parseInt( tipo );
//			pessoa["bankAccountOperation"] = "";
//			
//			pessoa["pix"] = hAPI.getCardValue("pix")+"";
//			if( hAPI.getCardValue("num_cau_crea") != "" && hAPI.getCardValue("num_cau_crea") != undefined ){
//				pessoa["partnerCau"] = hAPI.getCardValue("num_cau_crea")+"";
//			}
//			
//			var tipo = 0; 
//			var grupo;
//			
//			var ct = new Array();
//			ct.push( DatasetFactory.createConstraint('cod_tipo_parceria', hAPI.getCardValue("tipo_cadastro"), hAPI.getCardValue("tipo_cadastro"), ConstraintType.MUST) );
//			var ds = DatasetFactory.getDataset('ds_tipo_parceria', null, ct, null );
//			if( ds.rowsCount > 0 ){
//				if( ds.getValue(0, 'cod_sis') != "" ){
//					tipo = parseInt( ds.getValue(0, 'cod_sis') );
//				}
//			}
//			
//			if ( hAPI.getCardValue("tipo_cadastro") == "A" ){
//				tipo = 11;
//			}else if ( hAPI.getCardValue("tipo_cadastro") == "I" ){
//				tipo = 26;
//			}else if ( hAPI.getCardValue("tipo_cadastro") == "S" ){
//				tipo = 27;
//				grupo = 32;
//			}else if ( hAPI.getCardValue("tipo_cadastro") == "V" ){
//				tipo = 38;
//				grupo = 45;
//			}else if ( hAPI.getCardValue("tipo_cadastro") == "C" ){
//				tipo = 57;
//			}
//			
//			pessoa["partnerGroupId"] = parseInt( tipo );
//			
//			var ct = new Array();
//			ct.push( DatasetFactory.createConstraint('cod_profissao', hAPI.getCardValue("profissao"), hAPI.getCardValue("profissao"), ConstraintType.MUST) );
//			var ds = DatasetFactory.getDataset('profissao', null, ct, null );
//			if( ds.rowsCount > 0 ){
//				if( ds.getValue(0, 'id_sis') != "" ){
//					pessoa["partnerOccupationId"] = parseInt( ds.getValue(0, 'id_sis') );
//				}else{
//					pessoa["partnerOccupationId"] = 0;
//				}
//			}else{
//				pessoa["partnerOccupationId"] = 0;
//			}
//			
//			var sql = 	" select pt.id "+
//				  		"	from online.pon_pessoa ps "+
//						"	join online.pon_pessoa_patrocinador pt on (ps.id = pt.id_pessoa) "+
//						"	where ps.cnpj_cpf = '"+ String( hAPI.getCardValue("cod_usuario_respon") ).replace(/\D+/g, "").trim() +"' ";
//			if ( grupo ) sql += " and pt.id_grupo = '"+ grupo +"' ";
//			var ct = new Array();
//			ct.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
//			ct.push( DatasetFactory.createConstraint('sql', 	 sql, null, ConstraintType.MUST) );
//			var ds = DatasetFactory.getDataset('select', null, ct, null );
//			if( ds.rowsCount == 0 ){
//				throw 'Não localizado patrocinador com CPF '+ String( hAPI.getCardValue("cod_usuario_respon") ).replace(/\D+/g, "").trim() +' no SIS.';
//			}
//			pessoa["sponsorId"] = parseInt( ds.getValue(0, 'id') );
//			
//			params["incluirPessoa"] = pessoa;
//			log.info( "## pessoa ## " + pessoa.name );
//			
//			data["params"] = params;
//			
//			var jj = JSON.stringify(data);
//			log.info( "## JJ ## " + jj );
//			var vo = clientService.invoke(jj);
//			
//			var jr = JSON.parse(vo.getResult());
//			log.info( "## success ## " + jr.success);
//			
//			if( jr.success == false ){
//				throw 'Erro na integração com SYS: '+ jr.message;
//			} else {
//				
//			}
//		} catch(erro) { 
//			log.error( "ERROOOOOO" + erro.toString() );
//			throw 'Erro na integração com SYS: '+erro.toString();
//		}
		
	}
	return true;
}

function retira_acentos(str) 
{
//	log.info('retira_acentos str........'+str);
    com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝ?Þßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ?";
    sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRBaaaaaaaceeeeiiiionoooooouuuuybyr";
    novastr="";
    for(i=0; i<str.length; i++) {
        troca=false;
        for (a=0; a<com_acento.length; a++) {
            if (str.substr(i,1)==com_acento.substr(a,1)) {
                novastr+=sem_acento.substr(a,1);
                troca=true;
                break;
            }
        }
        if (troca==false) {
            novastr+=str.substr(i,1);
        }
    }
//    log.info('retira_acentos novastr........'+novastr);
    return novastr;
}