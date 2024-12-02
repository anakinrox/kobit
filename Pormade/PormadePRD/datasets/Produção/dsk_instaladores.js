var gToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMDkwNzIwMjQiLCJub21lIjoiZmx1aWcifQ.Gh8g5STXlLkOfwUDmutQwmMzqjxvaUO0VafCCHJVQrs';
function defineStructure() { }
function onSync(lastSyncDate) { }

function createDataset(fields, constraints, sortFields) {
	printLog("info", "## Moodle START ##");
	var newDataset = DatasetBuilder.newDataset();

	var listaConstraits = {};
	listaConstraits['indacao'] = '';

	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			listaConstraits[constraints[i].fieldName.trim()] = constraints[i].initialValue;
		}
	}


	// return false;

	if (listaConstraits['indacao'] == '') {
		listaConstraits['indacao'] = 'INSTALACAO';
		listaConstraits['uf'] = '';
		listaConstraits['cidade'] = '';
		listaConstraits['equipe'] = '';
		listaConstraits['interacao'] = 'M';
		listaConstraits['status'] = '';
		listaConstraits['codwidget'] = 'wdg_instaladores';




		listaConstraits['idproposta'] = "379279";
		listaConstraits['idinstalador'] = "25745";
		listaConstraits['datinicio'] = "";
		listaConstraits['datfim'] = "";
		listaConstraits['responsavel'] = "Adrian ";
		listaConstraits['whats'] = "(42) 9111-3692";
		listaConstraits['indtermo'] = "S";
		listaConstraits['idStatusNovo'] = "13";
		listaConstraits['idStatusAtual'] = "7";
		listaConstraits['observacao'] = "";

		listaConstraits['idregistro'] = "11137";
		listaConstraits['sequencia'] = "1";
		listaConstraits['seqitem'] = "2173422";
		listaConstraits['produto'] = "57";
		listaConstraits['usuario'] = "admlog";


		listaConstraits['indfoto'] = "S";


		listaConstraits['json'] = '[{"idproposta":"379279","seq":"2312811","produto":"2345","descricao":"PORTA FRIZATTA 004 80X210 SOLIDO BRANCO","local":"null"},{"idproposta":"379279","seq":"2312810","produto":"2345","descricao":"PORTA FRIZATTA 004 80X210 SOLIDO BRANCO","local":"null"}]';
	}

	try {

		if (listaConstraits['indacao'] == 'PROPOSTA') {
			newDataset.addColumn('equipe');
			newDataset.addColumn('id');
			newDataset.addColumn('data');
			newDataset.addColumn('proposta');
			newDataset.addColumn('idPessoa');
			newDataset.addColumn('cliente');
			newDataset.addColumn('idInstalador');
			newDataset.addColumn('Instalador');
			newDataset.addColumn('uf');
			newDataset.addColumn('cidade');
			newDataset.addColumn('bairro');
			newDataset.addColumn('consultor');
			newDataset.addColumn('notafiscal');

			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');

			try {
				connectionWD = dataSourceWD.getConnection();

				var SQL = "select distinct pr.id, TO_CHAR( pr.dh_emissao::date, 'yyyy-MM-dd') AS dh_emissao, pc.id_pessoa, p.nome_razao, pr.nr_proposta, ";
				SQL += " pr.nr_versao, pr.id_instalador_instal, pInstador.nome_razao as instalador, pr.instalacao_inclusa, city.uf, city.cidade as cidade, pv.equipe, ";
				SQL += " pEnd.bairro, pConsult.nome_razao as consultor, ";
				SQL += "  case when pHist.id_usuario is not null then TO_CHAR( pHist.dh_evento::date, 'yyyy-MM-dd') else null end as notafiscal ";
				SQL += "from pon_proposta pr ";
				SQL += "    inner join pon_pessoa_cliente pc on(pc.id = pr.id_cliente)  ";
				SQL += "    inner join pon_pessoa p on(p.id = pc.id_pessoa)  ";
				SQL += "    inner join pon_pessoa_endereco pEnd on(pEnd.id = pr.id_endereco_entrega) ";
				SQL += " inner join pon_pessoa_vendedor pv on (pv.id = pr.id_vendedor) ";
				SQL += " inner join pon_pessoa pConsult on(pConsult.id = pv.id_pessoa) ";
				SQL += "   inner join fluig_v_cidade city on (pEnd.cod_uf = city.cod_uf) ";
				SQL += "            and (pEnd.cod_cidade = city.cod_cidade_ibge) ";

				if (listaConstraits['uf'] != '') {
					SQL += "  and(city.uf = '" + listaConstraits['uf'] + "') "
				}

				if (listaConstraits['cidade'] != '') {
					SQL += "  and(city.cidade = '" + listaConstraits['cidade'] + "')  ";
				}

				if (listaConstraits['equipe'] != '' && listaConstraits['equipe'] != undefined) {
					SQL += "            and (pv.equipe = '" + listaConstraits['equipe'] + "') ";
				}


				SQL += "    left join pon_pessoa_arquiteto pIns on(pIns.id = pr.id_instalador_instal) ";
				SQL += "    left join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa)  ";
				SQL += "    left join pon_proposta_historico pHist on (pHist.id_proposta = pr.id)  ";
				SQL += "                                          and (pHist.descricao like 'Nota Fiscal Gerada%')  ";
				SQL += "WHERE instalacao_inclusa = true ";
				SQL += "and pr.id_status not in ('1', '2', '3', '4', '14', '21', '22', '25', '26') ";
				SQL += "and not exists(select 1 from kbt_t_instalacoes where idproposta = pr.id and (indsituacao <> 'D' or id_status <> 11)) ";


				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();

				while (rsWD.next()) {
					newDataset.addRow(new Array(
						rsWD.getString('equipe') + "",
						rsWD.getString('id') + "",
						rsWD.getString('dh_emissao') + "",
						rsWD.getString('nr_proposta') + "-" + rsWD.getString('nr_versao'),
						rsWD.getString('id_pessoa') + "",
						rsWD.getString('nome_razao') + "",
						rsWD.getString('id_instalador_instal') + "",
						rsWD.getString('instalador') + "",
						rsWD.getString('uf') + "",
						rsWD.getString('cidade') + "",
						rsWD.getString('bairro') + "",
						rsWD.getString('consultor') + "",
						rsWD.getString('notafiscal') + ""
					));
				}

			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

		}

		if (listaConstraits['indacao'] == 'ITEMMODAL') {
			newDataset.addColumn('idproposta');
			newDataset.addColumn('seq');
			newDataset.addColumn('produto');
			newDataset.addColumn('local');


			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				var SQL = "select  pi.id as seq, pp.descricao, pi.local  ";
				SQL += "from pon_proposta_itens pI  ";
				SQL += "    inner join pon_proposta_componentes d on(pI.id = d.id_proposta_item) ";
				SQL += "    inner join pon_produtos pp on(pp.id = d.id_produto) ";
				SQL += "            and(pp.id_produto_tipo not in (1,7,12,24,25,26,4,22)) ";
				SQL += "where pi.id_proposta = " + listaConstraits['proposta'];


				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();

				while (rsWD.next()) {
					newDataset.addRow(new Array(
						listaConstraits['proposta'] + "",
						rsWD.getString('seq') + "",
						rsWD.getString('descricao') + "",
						rsWD.getString('local') + ""
					));
				}

			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

		}

		if (listaConstraits['indacao'] == 'ITEMPROPOSTA') {
			newDataset.addColumn('idproposta');
			newDataset.addColumn('seq');
			newDataset.addColumn('produto');
			newDataset.addColumn('local');


			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				var SQL = "select  pi.id as seq, pp.descricao, pi.local  ";
				SQL += "from pon_proposta_itens pI  ";
				SQL += "    inner join pon_proposta_componentes d on(pI.id = d.id_proposta_item) ";
				SQL += "    inner join pon_produtos pp on(pp.id = d.id_produto) ";
				SQL += "            and(pp.id_produto_tipo not in (1,7,12,24,25,26,4,22)) ";
				SQL += "where pi.id_proposta = " + listaConstraits['proposta'];
				SQL += "  and not exists (select * from kbt_t_instalacoes_itens where idproposta = pi.id_proposta  and idseq = pi.id )";

				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();

				while (rsWD.next()) {
					newDataset.addRow(new Array(
						listaConstraits['proposta'] + "",
						rsWD.getString('seq') + "",
						rsWD.getString('descricao') + "",
						rsWD.getString('local') + ""
					));
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

		}

		if (listaConstraits['indacao'] == 'INSTALACAO') {
			newDataset.addColumn('id');
			newDataset.addColumn('seq');
			newDataset.addColumn('datainicio');
			newDataset.addColumn('datafim');
			newDataset.addColumn('proposta');
			newDataset.addColumn('cliente');
			newDataset.addColumn('equipe');
			newDataset.addColumn('idinstalador');
			newDataset.addColumn('instalador');
			newDataset.addColumn('responsavel');
			newDataset.addColumn('telefone');
			newDataset.addColumn('idproposta');
			newDataset.addColumn('token');
			newDataset.addColumn('termo');
			newDataset.addColumn('uf');
			newDataset.addColumn('cidade');
			newDataset.addColumn('bairro');
			newDataset.addColumn('consultor');
			newDataset.addColumn('notafiscal');
			newDataset.addColumn('itens');
			newDataset.addColumn('idsituacao');
			newDataset.addColumn('situacao');
			newDataset.addColumn('cor');
			newDataset.addColumn('texto');
			newDataset.addColumn('sincronizado');
			newDataset.addColumn('ordem');
			newDataset.addColumn('observacao');
			newDataset.addColumn('dat_prev_producao');
			newDataset.addColumn('ind_pagamento');
			newDataset.addColumn('tipo_proposta');
			newDataset.addColumn('documento');
			newDataset.addColumn('dat_aceite');
			newDataset.addColumn('aceite');
			newDataset.addColumn('obs_apta');

			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();
				var gson = new com.google.gson.Gson();

				var SQL = "select distinct kbt.id, kbt.seq_proposta, kbt.idproposta, kbt.datagendaini, kbt.datagendafim, p.nome_razao, pr.nr_proposta, pr.nr_versao, kbt.ind_termo, ";
				SQL += " COALESCE(kbt.idinstalador,  pr.id_instalador_instal) as id_instalador, COALESCE(pInstador.nome_razao, pInstadorP.nome_razao) as instalador, ";
				SQL += " kbt.token, kbt.nom_responsavel, kbt.num_telefone, kbt.uf, kbt.cidade, kbt.equipe, ";
				SQL += " pEnd.bairro, pConsult.nome_razao as consultor, ";
				SQL += "  kbt.dat_emissao_nf as notafiscal, ";
				SQL += " kbtS.id as idSituacao, kbtS.descricao as desc_situacao, kbtS.indsinc, kbtS.ordem, kbtS.corfundo as cor_situacao, kbtS.cortexto as cor_texto, kbt.observacao, ";
				SQL += " TO_CHAR(pr.dt_previsao_finalizacao::date, 'yyyy-MM-dd') as dt_previsao_finalizacao, ";
				SQL += " kbt.ind_pagamento, ";
				SQL += "  case when pr.tp_proposta = 'P' then 'Proposta' when pr.tp_proposta = 'R' then 'Reposição' else 'Complementar' end as tp_proposta, ";
				SQL += " kbt.num_documento, ";
				SQL += " TO_CHAR(kbt.dat_aceite::DATE, 'yyyy-MM-dd') AS dat_aceite, ";
				SQL += " kbt.aceite, ";
				SQL += " kbt.obs_apta ";
				SQL += " from kbt_t_instalacoes kbt ";
				SQL += "    inner join kbt_t_instalacoes_status kbtS on (kbtS.id = kbt.id_status)  ";
				SQL += "    inner join pon_proposta pr on(pr.id = kbt.idproposta)  ";
				SQL += "    inner join pon_pessoa_cliente pc on(pc.id = pr.id_cliente)  ";
				SQL += "    inner join pon_pessoa p on(p.id = pc.id_pessoa)   ";
				SQL += "    left join pon_pessoa_arquiteto pIns on(pIns.id = kbt.idinstalador) ";
				SQL += "    left join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa) ";

				SQL += "    left join pon_pessoa_arquiteto pInsP on(pInsP.id = pr.id_instalador_instal) ";
				SQL += "    left join pon_pessoa pInstadorP on(pInstadorP.id = pInsP.id_pessoa) ";

				SQL += "    inner join pon_pessoa_endereco pEnd on(pEnd.id = pr.id_endereco_entrega) ";
				SQL += "    inner join pon_pessoa_vendedor pv on (pv.id = pr.id_vendedor) ";
				SQL += "    inner join pon_pessoa pConsult on(pConsult.id = pv.id_pessoa) ";

				SQL += " where 1 = 1 ";

				if (listaConstraits['idregistro'] != '' && listaConstraits['idregistro'] != undefined) {
					SQL += " and kbt.id = " + listaConstraits['idregistro'];
					SQL += " and kbt.seq_proposta = " + listaConstraits['sequencia'];
				}

				if ((listaConstraits['uf'] != '') && (listaConstraits['uf'] != undefined)) {
					SQL += "  and kbt.uf = '" + listaConstraits['uf'] + "' "
				}

				if ((listaConstraits['cidade'] != '') && (listaConstraits['cidade'] != undefined)) {
					SQL += "  and kbt.cidade = '" + listaConstraits['cidade'] + "' ";
				}

				if (listaConstraits['equipe'] != '' && listaConstraits['equipe'] != undefined) {
					SQL += "  and kbt.equipe = '" + listaConstraits['equipe'] + "' ";
				}

				if ((listaConstraits['status'] != '') && (listaConstraits['status'] != undefined)) {
					SQL += "  and kbtS.id = " + listaConstraits['status'];
				}

				printLog("erro", "SQL Inst: " + SQL);
				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();

				while (rsWD.next()) {
					var arrItens = [];
					if (listaConstraits['idregistro'] != '' && listaConstraits['idregistro'] != undefined) {
						var SQL = "select "
						SQL += "     kbti.idseq as seq, kbti.idproduto as idproduto, COALESCE(pp.descricao,kbti.descricao) as descricao, kbti.local, kbt.idproposta, kbtI.ind_situacao    ";
						SQL += "from kbt_t_instalacoes kbt";
						SQL += "    inner join kbt_t_instalacoes_itens kbtI on (kbtI.idproposta = kbt.idproposta)";
						SQL += "                                           and (kbtI.seqinstall = " + listaConstraits['sequencia'] + ")";
						SQL += "    left join pon_proposta_itens pI on(pI.id = kbt.idproposta) ";
						SQL += "                                    and (pI.id = kbti.idseq) ";
						SQL += "    left join pon_proposta_componentes d on(pI.id = d.id_proposta_item) ";
						SQL += "    left join pon_produtos pp on(pp.id = d.id_produto)";
						SQL += "                and(pp.id_produto_tipo in (1, 7, 12, 24, 25, 26, 4, 22)) ";
						SQL += "where kbt.id = " + listaConstraits['idregistro']
						statementWD = connectionWD.prepareStatement(SQL);
						var rsWD2 = statementWD.executeQuery();
						while (rsWD2.next()) {
							var data = {
								proposta: rsWD2.getString('idproposta') + "",
								seq: rsWD2.getString('seq') + "",
								produto: rsWD2.getString('idproduto') + "",
								descricao: rsWD2.getString('descricao') + "",
								local: rsWD2.getString('local') + "",
								situacao: rsWD2.getString('ind_situacao') + ""
							}
							arrItens.push(data)
						}
						if (rsWD2 != null) rsWD2.close();

						if (arrItens.length == 0) {
							arrItens = f_loadItensProposta(newDataset, connectionWD, rsWD.getString('idproposta'))
						}

					}

					newDataset.addRow(new Array(
						rsWD.getString('id') + "",
						rsWD.getString('seq_proposta') + "",
						rsWD.getString('datagendaini') + "",
						rsWD.getString('datagendafim') + "",
						rsWD.getString('nr_proposta') + "-" + rsWD.getString('nr_versao'),
						rsWD.getString('nome_razao') + "",
						rsWD.getString('equipe') + "",
						rsWD.getString('id_instalador') + "",
						rsWD.getString('instalador') + "",
						rsWD.getString('nom_responsavel') + "",
						rsWD.getString('num_telefone') + "",
						rsWD.getString('idproposta') + "",
						rsWD.getString('token') + "",
						rsWD.getString('ind_termo') + "",
						rsWD.getString('uf') + "",
						rsWD.getString('cidade') + "",
						rsWD.getString('bairro') + "",
						rsWD.getString('consultor') + "",
						rsWD.getString('notafiscal') + "",
						gson.toJson(arrItens) + "",
						rsWD.getString('idSituacao') + "",
						rsWD.getString('desc_situacao') + "",
						rsWD.getString('cor_situacao') + "",
						rsWD.getString('cor_texto') + "",
						rsWD.getString('indsinc') + "",
						rsWD.getString('ordem') + "",
						rsWD.getString('observacao') + "",
						rsWD.getString('dt_previsao_finalizacao') + "",
						rsWD.getString('ind_pagamento') + "",
						rsWD.getString('tp_proposta') + "",
						rsWD.getString('num_documento') + "",
						rsWD.getString('dat_aceite') + "",
						rsWD.getString('aceite') + "",
						rsWD.getString('obs_apta') + ""

					));
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

		}

		if (listaConstraits['indacao'] == 'INSTALADOR') {
			newDataset.addColumn('id');
			newDataset.addColumn('nome');

			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				var SQL = "select pIns.id, pInstador.nome_razao ";
				SQL += "from pon_pessoa_arquiteto pIns ";
				SQL += "    inner join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa)  ";
				SQL += "                                    and (pInstador.ativo = true)  ";
				SQL += "                                    and (pInstador.tp_pessoa = 'J')  ";
				SQL += "    inner join pon_pessoa_email pEmail on(pEmail.id_pessoa = pIns.id_pessoa) ";
				SQL += "                            and(pEmail.principal = true)  ";
				SQL += "where pIns.id_classificacao = 8  ";
				SQL += " and  pIns.ativo = true  ";
				SQL += " union ";
				SQL += "select pIns.id, pInstador.nome_razao  ";
				SQL += "from pon_pessoa_arquiteto pIns  ";
				SQL += "    inner join pon_pessoa pInstador on(pInstador.id = pIns.id_pessoa) ";
				SQL += "            and(pInstador.ativo = true)   ";
				SQL += " ";
				SQL += "    inner join pon_pessoa_email pEmail on(pEmail.id_pessoa = pIns.id_pessoa) ";
				SQL += "            and(pEmail.principal = true)   ";
				SQL += "where pIns.id_classificacao = 8   ";
				SQL += "and  pIns.ativo = true ";
				SQL += "and pInstador.cnpj_cpf = '59538279204' ";

				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();

				while (rsWD.next()) {
					newDataset.addRow(new Array(
						rsWD.getString('id') + "",
						rsWD.getString('nome_razao') + ""
					));
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

		}

		if (listaConstraits['indacao'] == 'EQUIPE') {
			newDataset.addColumn('nome');

			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				var SQL = "select distinct equipe from pon_pessoa_vendedor where equipe is not null  and ativo = true order by equipe";

				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();

				while (rsWD.next()) {
					newDataset.addRow(new Array(
						rsWD.getString('equipe') + ""
					));
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}
		}

		if (listaConstraits['indacao'] == 'STATUS') {
			newDataset.addColumn('ordem');
			newDataset.addColumn('codigo');
			newDataset.addColumn('descricao');
			newDataset.addColumn('sync');


			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				var SQL = "select id, descricao, indsinc, ordem from kbt_t_instalacoes_status where ativo = true ";
				if (listaConstraits['interacao'] != '' && listaConstraits['interacao'] != undefined) {
					SQL += " and interacao = '" + listaConstraits['interacao'] + "' ";
				}
				if (listaConstraits['status'] != '' && listaConstraits['status'] != undefined) {
					SQL += " and id = " + listaConstraits['status']
				}
				SQL += " order by ordem";

				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();

				while (rsWD.next()) {
					newDataset.addRow(new Array(
						rsWD.getString('ordem') + "",
						rsWD.getString('id') + "",
						rsWD.getString('descricao') + "",
						rsWD.getString('indsinc') + ""
					));
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

		}

		if (listaConstraits['indacao'] == 'INC') {
			newDataset.addColumn('STATUS');
			newDataset.addColumn('MENSAGEM');

			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				var wOrdemAtual = f_getOrdemStatus(listaConstraits['idStatusAtual']);
				var wOrdemNovo = f_getOrdemStatus(listaConstraits['idStatusNovo']);
				var wIdInstalador = listaConstraits['idinstalador'] != '' ? listaConstraits['idinstalador'] : null;

				try {
					// newDataset.addRow(new Array('Criando Log'));
					f_gravaLog(newDataset, connectionWD, listaConstraits['usuario'], listaConstraits['idregistro'], listaConstraits['sequencia'], constraints);
				} catch (error) {
					newDataset.addRow(new Array('Error Log: ' + error));
				}

				var SQLUPD = "update kbt_t_instalacoes set idInstalador = " + wIdInstalador + ", datRegistro = CURRENT_DATE, ";
				SQLUPD += "datAgendaIni = " + (listaConstraits['datinicio'] != '' ? "'" + listaConstraits['datinicio'] + "'" : null) + ", datAgendaFim = " + (listaConstraits['datfim'] != '' ? "'" + listaConstraits['datfim'] + "'" : null) + ", nom_responsavel = '" + listaConstraits['responsavel'] + "', ";
				SQLUPD += "num_telefone = '" + listaConstraits['whats'] + "', ind_termo = '" + listaConstraits['indtermo'] + "', id_status = '" + listaConstraits['idStatusNovo'] + "', ";
				SQLUPD += "observacao = '" + listaConstraits['observacao'] + "', ";
				SQLUPD += "ind_sync = " + (wOrdemNovo.sync == 'S' ? "'S'" : null);
				SQLUPD += " where id = " + listaConstraits['idregistro'] + " and seq_proposta = " + listaConstraits['sequencia'];



				var SQLDEL = "delete from kbt_t_instalacoes_itens where idinstalacao = " + listaConstraits['idregistro'] + ' and seqinstall = ' + listaConstraits['sequencia'];

				try {
					statementWD = connectionWD.prepareStatement(SQLUPD); // Faz o Update na instalacao
					statementWD.executeUpdate();

					if (wOrdemNovo.ordem >= 5 || wOrdemNovo.codigo == 13) {
						statementWD = connectionWD.prepareStatement(SQLDEL); // Renove os itens da Instalacao
						statementWD.executeUpdate();

						var jsonObj = JSON.parse(listaConstraits['json']);
						var length = Object.keys(jsonObj).length;
						for (var i = 0; i < length; i++) {
							var SQLINS = "insert into kbt_t_instalacoes_itens (idinstalacao, seqinstall, idseq, idproduto, inditem, idproposta, descricao, local) values ";
							SQLINS += "(" + listaConstraits['idregistro'] + "," + listaConstraits['sequencia'] + "," + jsonObj[i]['seq'] + "," + jsonObj[i]['produto'] + ", 'P', " + jsonObj[i]['idproposta'] + ",'" + jsonObj[i]['descricao'] + "','" + jsonObj[i]['local'] + "') ";
							statementWD = connectionWD.prepareStatement(SQLINS);
							statementWD.executeUpdate();
						}

						if (listaConstraits['indtermo'] == 'S') {
							var SQLINS = "insert into kbt_t_instalacoes_itens (idinstalacao, seqinstall, idseq, idproduto, inditem, idproposta, descricao, local) values ";
							SQLINS += "(" + listaConstraits['idregistro'] + "," + listaConstraits['sequencia'] + ",-99, -99, 'T', " + listaConstraits['idproposta'] + ",'TERMO','TERMO') ";

							printLog('erro', 'SQL INC Termo: ' + SQLINS)
							statementWD = connectionWD.prepareStatement(SQLINS);
							statementWD.executeUpdate();
						}
					}
					var status = 'OK';
					var menagem = '';
				} catch (error) {
					var status = 'NOK';
					var menagem = error + '' + " linha: " + error.lineNumber;
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

			newDataset.addRow(new Array(status, menagem));

		}

		if (listaConstraits['indacao'] == 'UPD') {
			newDataset.addColumn('STATUS');
			newDataset.addColumn('MENSAGEM');

			var wValidaSenha = false;
			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				var SQL = "select 1 ";
				SQL += "from kbt_t_instalacoes kbt ";
				SQL += "where kbt.id = " + listaConstraits['idregistro'];
				SQL += "  and kbt.token = '" + listaConstraits['wtoken'] + "'";

				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();

				while (rsWD.next()) {
					wValidaSenha = true;
				}

				if (wValidaSenha) {
					var SQLUPD = "update kbt_t_instalacoes set aprova_instalacao = '" + listaConstraits['aprovar'] + "', visitou_obra = '" + listaConstraits['visitouobra'] + "', obs_obra = '" + listaConstraits['obsobra'] + "', indsituacao = 'A', id_status = 4, data_aprovado = current_date, num_nota = " + listaConstraits['numnota']
					SQLUPD += " where id = " + listaConstraits['idregistro'];
					statementWD = connectionWD.prepareStatement(SQLUPD);
					// newDataset.addRow(new Array(SQLUPD, ''));
					try {
						statementWD.executeUpdate();

						var status = 'OK';
						var menagem = '';
					} catch (error) {
						var status = 'NOK';
						var menagem = error + '';
					}
				} else {
					var status = 'NOK';
					var menagem = 'Token informado está incorreto.';
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

			newDataset.addRow(new Array(status, menagem));

		}

		if (listaConstraits['indacao'] == 'DEL') {
			newDataset.addColumn('STATUS');
			newDataset.addColumn('MENSAGEM');

			var wValidaSenha = false;
			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				try {
					f_gravaLog(newDataset, connectionWD, listaConstraits['usuario'], listaConstraits['idregistro'], listaConstraits['sequencia'], constraints);
				} catch (error) {
				}


				var SQLUPD = "update kbt_t_instalacoes set indsituacao = 'D', ind_sync = 'S', id_status = 11 ";
				SQLUPD += " where id = " + listaConstraits['idregistro'];
				statementWD = connectionWD.prepareStatement(SQLUPD);
				// newDataset.addRow(new Array(SQLUPD, ''));
				try {
					statementWD.executeUpdate();

					var status = 'OK';
					var menagem = '';
				} catch (error) {
					var status = 'NOK';
					var menagem = error + '';
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}
			newDataset.addRow(new Array(status, menagem));

		}

		if (listaConstraits['indacao'] == 'PAG') {
			newDataset.addColumn('STATUS');
			newDataset.addColumn('MENSAGEM');

			var wValidaSenha = false;
			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				try {
					f_gravaLog(newDataset, connectionWD, listaConstraits['usuario'], listaConstraits['idregistro'], listaConstraits['sequencia'], constraints);
				} catch (error) {
				}

				var SQLUPD = "update kbt_t_instalacoes set ind_pagamento = 'S' ";
				SQLUPD += " where id = " + listaConstraits['idregistro'];
				statementWD = connectionWD.prepareStatement(SQLUPD);
				// newDataset.addRow(new Array(SQLUPD, ''));
				try {
					statementWD.executeUpdate();

					var status = 'OK';
					var menagem = '';
				} catch (error) {
					var status = 'NOK';
					var menagem = error + '';
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}
			newDataset.addRow(new Array(status, menagem));

		}

		if (listaConstraits['indacao'] == 'SERVICOS') {

			newDataset.addColumn('RESPONSAVEL');
			newDataset.addColumn('PROPOSTA');
			newDataset.addColumn('ITENS');

			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();
				var gson = new com.google.gson.Gson();

				var SQL = "select kbt.id, kbt.idproposta, kbt.seq_proposta as seqProposta, CONCAT(pr.nr_proposta, '-', pr.nr_versao) as proposta, kbt.nom_responsavel ";
				SQL += "from kbt_t_instalacoes kbt ";
				SQL += "    inner join pon_proposta pr on(pr.id = kbt.idproposta) ";
				SQL += "where 1 = 1 ";
				SQL += "  and kbt.id = " + listaConstraits['idregistro'];

				statementWD = connectionWD.prepareStatement(SQL);
				var rsWD = statementWD.executeQuery();
				var arrItens = [];

				while (rsWD.next()) {
					var SQL = "select "
					SQL += "     kbti.idseq as seq, kbti.idproduto as idproduto, COALESCE(pp.descricao,kbti.descricao) as descricao, kbti.local, kbti.idproposta, kbtI.ind_situacao    ";
					SQL += "from kbt_t_instalacoes_itens kbti ";
					SQL += "    left join pon_proposta_itens pI on(pI.id = kbti.idproposta) ";
					SQL += "                                    and (pI.id = kbti.idseq) ";
					SQL += "    left join pon_proposta_componentes d on(pI.id = d.id_proposta_item) ";
					SQL += "    left join pon_produtos pp on(pp.id = d.id_produto)";
					SQL += "                and(pp.id_produto_tipo in (1, 7, 12, 24, 25, 26, 4, 22)) ";
					SQL += "where kbtI.idinstalacao = " + listaConstraits['idregistro'];
					SQL += " and kbtI.seqinstall = " + rsWD.getString('seqProposta');

					statementWD = connectionWD.prepareStatement(SQL);
					var rsWD2 = statementWD.executeQuery();

					while (rsWD2.next()) {
						var data = {
							idproposta: rsWD2.getString('idproposta') + "",
							seq: rsWD2.getString('seq') + "",
							produto: rsWD2.getString('idproduto') + "",
							descricao: rsWD2.getString('descricao') + "",
							local: rsWD2.getString('local') + "",
							situacao: rsWD2.getString('ind_situacao') + ""
						}
						arrItens.push(data)
					}

					if (rsWD2 != null) rsWD2.close();

					newDataset.addRow(new Array(
						rsWD.getString("nom_responsavel") + "",
						rsWD.getString('proposta') + "",
						gson.toJson(arrItens)
					));
				}


			} catch (error) {
				newDataset.addRow(new Array('Erro Serv: ' + error));
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}


		}

		if (listaConstraits['indacao'] == 'FOTOS') {
			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();
				var gson = new com.google.gson.Gson();

				var SQL = "select kbt.id, kbt.idproposta, kbt.seq_proposta as seqProposta ";
				SQL += "from kbt_t_instalacoes kbt ";
				SQL += "where kbt.id = '" + listaConstraits['idregistro'] + "' ";

				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();
				var wRetorno = [];

				while (rsWD.next()) {
					var endpoint = '/01/listainstalacao?idproposta=' + rsWD.getString("idproposta") + "&seqinstall=" + rsWD.getString("seqProposta") + "&fotos=S&servico=" + listaConstraits['seqitem'] + '@' + listaConstraits['produto']
					newDataset.addColumn('ID');
					newDataset.addColumn('FOTO');

					// newDataset.addRow(new Array('AQUI: ' + endpoint));
					var wObj = f_atualizarRegistro(endpoint.replace(/'/g, ''), gToken, '', newDataset, 'arquitetos');

					if (wObj != null) {
						for (var x = 0; x < wObj[0].SERVICOS[0].FOTOS.length; x++) {

							newDataset.addRow(new Array(
								wObj[0].SERVICOS[0].FOTOS[x].ID,
								wObj[0].SERVICOS[0].FOTOS[x].FOTO
							));

						}
					}

					// if (wObj != null) {
					//     for (var x = 0; x < wObj.length; x++) {
					//         newDataset.addRow(new Array(
					//             wObj[x].ID,
					//             wObj[x].FOTO
					//         ));

					//     }
					// }
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

		}

		if (listaConstraits['indacao'] == 'ACEITE') {
			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();
				var gson = new com.google.gson.Gson();

				var SQL = "select kbt.id, kbt.idproposta, kbt.seq_proposta as seqProposta ";
				SQL += "from kbt_t_instalacoes kbt ";
				SQL += "where kbt.id = '" + listaConstraits['idregistro'] + "' ";

				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();
				var wRetorno = [];

				while (rsWD.next()) {
					var endpoint = '/01/listainstalacao?idproposta=' + rsWD.getString("idproposta") + "&seqinstall=" + rsWD.getString("seqProposta") + "&fotos=N&servico=&aceite=S"
					newDataset.addColumn('FOTO');

					// newDataset.addRow(new Array('AQUI: ' + endpoint));
					var wObj = f_atualizarRegistro(endpoint.replace(/'/g, ''), gToken, '', newDataset, 'arquitetos');

					if (wObj != null) {
						if (wObj[0].ACEITE.FOTO != null) {
							newDataset.addRow(new Array(
								wObj[0].ACEITE.FOTO
							));
						}
					}
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

		}

		if (listaConstraits['indacao'] == 'MENSAGEM') {

		}

		if (listaConstraits['indacao'] == 'UPDMSG') {
			newDataset.addColumn('STATUS');
			newDataset.addColumn('MENSAGEM');

			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				try {
					f_gravaLog(newDataset, connectionWD, listaConstraits['usuario'], listaConstraits['idregistro'], listaConstraits['sequencia'], constraints);
				} catch (error) {
				}


				var SQLUPD = "update kbt_t_instalacoes set nom_responsavel = '" + listaConstraits['responsavel'] + "', num_telefone = '" + listaConstraits['num_whats'] + "'";
				SQLUPD += " where id = " + listaConstraits['idregistro'];
				statementWD = connectionWD.prepareStatement(SQLUPD);
				try {
					statementWD.executeUpdate();

					var SQL = "select id, idproposta, token, num_telefone  from kbt_t_instalacoes where id = " + listaConstraits['idregistro'];
					statementWD = connectionWD.prepareStatement(SQL);
					rsWD = statementWD.executeQuery();

					while (rsWD.next()) {
						var wNumTelefone = (rsWD.getString("num_telefone").substring(0, 2) != "55" ? '55' + justNumbers(rsWD.getString("num_telefone")) : justNumbers(rsWD.getString("num_telefone")));
						var wToken = rsWD.getString("token");
						var widInstalacao = rsWD.getString("id")
						var widInstalacao64 = java.util.Base64.getEncoder().encodeToString(widInstalacao.getBytes());

						f_sendMensagem(newDataset, wNumTelefone, widInstalacao64, wToken, widInstalacao)
					}

					var status = 'OK';
					var menagem = '';
				} catch (error) {
					var status = 'NOK';
					var menagem = error + '';
				}

			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}

			newDataset.addRow(new Array(status, menagem));
		}

		if (listaConstraits['indacao'] == 'VERSION') {
			newDataset.addColumn('id');
			newDataset.addColumn('numversion');
			newDataset.addColumn('strversion');
			newDataset.addColumn('manutencao');


			var connectionWD = null;
			var statementWD = null;
			var rsWD = null;
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
			try {
				connectionWD = dataSourceWD.getConnection();

				var SQL = "select id, numversao, strversao, manutencao from kbt_t_versao_widget where codwidget = '" + listaConstraits['codwidget'] + "' ";
				statementWD = connectionWD.prepareStatement(SQL);
				rsWD = statementWD.executeQuery();

				while (rsWD.next()) {
					newDataset.addRow(new Array(
						rsWD.getString('id') + "",
						rsWD.getString('numversao') + "",
						rsWD.getString('strversao') + "",
						(rsWD.getString('manutencao') == 'f' ? false : true)
					));
				}
			} catch (e) {
				log.error("ERRO==============> " + e.message);
			} finally {
				if (rsWD != null) rsWD.close();
				if (statementWD != null) statementWD.close();
				if (connectionWD != null) connectionWD.close();
			}
		}



	} catch (error) {
		newDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
	} finally {
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();

		return newDataset;
	}
}

function onMobileSync(user) { }

var debug = false;
function printLog(tipo, msg) {
	if (debug) {
		var msgs = getValue('WKDef') + ' - ' + getValue('WKNumProces') + ' - ' + msg;
		if (tipo == 'info') {
			//log.info(msgs);
		} else if (tipo == 'error') {
			log.error(msgs);
		} else if (tipo == 'fatal') {
			log.fatal(msgs);
		} else {
			log.warn(msgs);
		}
	}
}


function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function justNumbers(text) {
	var numbers = text.replaceAll("[^0-9]", "")
	return parseInt(numbers);
}

function f_atualizarRegistro(PendPoint, Ptoken, jsonFile, pDataset, pIndServico) {

	var retorno = null;
	var metodo = "GET";
	var wServiceCode = "tracking";
	var gson = new com.google.gson.Gson();

	if (pIndServico != undefined) {
		wServiceCode = pIndServico
	}

	if (jsonFile != "") {
		metodo = "POST";
		var params = {
			json: gson.toJson(jsonFile)
		};
	}

	var clientService = fluigAPI.getAuthorizeClientService();
	var data = {
		companyId: getValue("WKCompany") + "",
		serviceCode: wServiceCode,
		endpoint: PendPoint,
		timeoutService: "240",
		method: metodo,
	};

	// var params;
	var headers = {};
	headers["x-access-token"] = Ptoken;
	headers["Content-Type"] = "application/json";
	data["headers"] = headers;
	data["params"] = params;

	try {
		var jj = gson.toJson(data);
		var vo = clientService.invoke(jj);
		if (vo.getResult() == "" || vo.getResult().isEmpty()) {
			throw "Retorno esta vazio";
		} else {
			var jr = JSON.parse(vo.getResult());
			retorno = jr;
		}
	} catch (error) {
		// pDataset.addRow(new Array("Servico: " + wServiceCode + " EndPoint: " + PendPoint));
		pDataset.addRow(new Array('ERRO API: ' + error.toString() + " linha: " + error.lineNumber));
	}

	return retorno;


}

function f_sendMensagem(pDataset, pNumTelefone, pidInstalacao64, pToken, pidInstalacao) {

	var connectionWD = null;
	var statementWD = null;
	var rsWD = null;
	var contextWD = new javax.naming.InitialContext();
	var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
	try {
		connectionWD = dataSourceWD.getConnection();

		var ct = new Array();
		ct.push(DatasetFactory.createConstraint('endpoint', 'mensagem', null, ConstraintType.MUST));
		ct.push(DatasetFactory.createConstraint('codMensagem', '5', '5', ConstraintType.MUST));
		ct.push(DatasetFactory.createConstraint('num_destinatario', pNumTelefone, pNumTelefone, ConstraintType.MUST));
		ct.push(DatasetFactory.createConstraint('link', 'https://fluig.pormade.com.br:8443/portal/1/wdk_confirmacao_instalador/' + pidInstalacao64, 'https://fluig.pormade.com.br:8443/portal/1/wdk_confirmacao_instalador/' + pidInstalacao64, ConstraintType.MUST));
		ct.push(DatasetFactory.createConstraint('token', pToken, pToken, ConstraintType.MUST));
		ct.push(DatasetFactory.createConstraint('telefone', '0800-642-3521', '0800-642-3521', ConstraintType.MUST));
		var ds = DatasetFactory.getDataset('dsk_fortics', null, ct, null);
		if ((ds != null) && (ds.rowsCount > 0)) {
			if (ds.rowsCount > 0) {
				if (ds.getValue(0, "STATUS") == true) {
					var SQLINS = "insert into kbt_t_instalacoes_whats ( id, idinstalacao, dataregistro, numtelefone, idmensagem)  values ";
					SQLINS += "((select COALESCE(max(id) +1 ,1) from kbt_t_instalacoes_whats), " + pidInstalacao + ",CURRENT_DATE,'" + pNumTelefone + "','" + ds.getValue(0, "ID") + "')";
					statementWD = connectionWD.prepareStatement(SQLINS);
					statementWD.executeUpdate();

					// pDataset.addRow(new Array("Enviou a mensagem, ID: " + ds.getValue(0, "ID")));
				} else {
					pDataset.addRow(new Array("Não enviou, Error: " + ds.getValue(0, "MENSAGEM")));
				}
			}
		}
	} catch (error) {
		pDataset.addRow(new Array("Erro: " + error + " linha: " + error.lineNumber));
	} finally {
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}
}

function f_getOrdemStatus(pIdStatus) {

	var wRetorno = null;
	var connectionWD = null;
	var statementWD = null;
	var rsWD = null;
	var contextWD = new javax.naming.InitialContext();
	var dataSourceWD = contextWD.lookup('java:/jdbc/CRMDS');
	try {
		connectionWD = dataSourceWD.getConnection();
		var SQL = "select id, descricao, indsinc, ordem from kbt_t_instalacoes_status where id = " + pIdStatus
		statementWD = connectionWD.prepareStatement(SQL);
		rsWD = statementWD.executeQuery();

		while (rsWD.next()) {
			var data = {
				codigo: rsWD.getString("id"),
				descricao: rsWD.getString("descricao"),
				sync: rsWD.getString("indsinc"),
				ordem: rsWD.getString("ordem")
			}
			wRetorno = data;
		}

	} catch (error) {

	} finally {
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();

		return wRetorno;
	}
}

function f_loadItensProposta(pDataset, pConnection, pIdProposta) {
	var rsWD = null;
	var statementWD = null;
	try {
		var wRetItens = [];
		var SQL = "select " +
			"    itm.id as seq, " +
			"    prod.id as idproduto, " +
			"    prod.descricao as descricao, " +
			"    itm.local      " +
			"from pon_produtos prod    " +
			"       left join pon_proposta_componentes comp on(comp.id_produto = prod.id)  " +
			"       left join pon_proposta_itens itm on(comp.id_proposta_item = itm.id)   " +
			"       left join pon_proposta prop on(itm.id_proposta = prop.id)  " +
			"       left join pon_categoria cat on(prod.id_categoria = cat.id)  " +
			"where cat.id not in (5, 6, 8, 9, 16, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 37, 38, 42, 43, 44, 45, 46, 47, 48, 49, 50, 52, 54, 55)  " +
			"  and prop.id_status in (3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 19, 20, 23, 24, 25, 26)  " +
			"  and prop.id = " + pIdProposta +
			"  and itm.id_produto_tipo in (7, 12) " +
			"  and prod.id_produto_tipo = 1 " +
			" and not exists(select * from kbt_t_instalacoes_itens where idproposta = itm.id_proposta  and idseq = itm.id and idproduto = prod.id) " +
			"union " +
			"select " +
			"    itm.id as seq, " +
			"    prod.id as idproduto, " +
			"    prod.descricao as descricao, " +
			"    itm.local     " +
			"from pon_produtos prod    " +
			"       left join pon_proposta_componentes comp on(comp.id_produto = prod.id)  " +
			"       left join pon_proposta_itens itm on(comp.id_proposta_item = itm.id)   " +
			"       left join pon_proposta prop on(itm.id_proposta = prop.id)  " +
			"       left join pon_categoria cat on(prod.id_categoria = cat.id)  " +
			"where cat.id not in (8, 9, 16, 19, 20, 21, 22, 23, 26, 27, 28, 29, 30, 31, 32, 33, 37, 38, 43, 44, 45, 46, 47, 49, 50, 52, 54, 55)  " +
			"  and prop.id_status in (3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 19, 20, 23, 24, 25, 26)  " +
			"  and prop.id = " + pIdProposta +
			"  and itm.id_produto_tipo not in (7, 12) " +
			" and not exists(select * from kbt_t_instalacoes_itens where idproposta = itm.id_proposta  and idseq = itm.id and idproduto = prod.id) ";

		statementWD = pConnection.prepareStatement(SQL);
		var rsWD = statementWD.executeQuery();

		while (rsWD.next()) {
			var data = {
				proposta: pIdProposta + "",
				seq: rsWD.getString('seq') + "",
				produto: rsWD.getString('idproduto') + "",
				descricao: rsWD.getString('descricao') + "",
				local: rsWD.getString('local') + "",
				situacao: ""
			}
			wRetItens.push(data)
		}

	} catch (error) {
		pDataset.addRow(new Array("Erro LoadItens: " + error.toString() + " linha: " + error.lineNumber));
	} finally {
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();
		return wRetItens;
	}
}

function f_gravaLog(pDataset, pConnection, pUsuario, pIdProposta, pSeqProposta, pConstraints) {
	var rsWD = null;
	var statementWD = null;
	try {
		var wRetItens = [];
		var gson = new com.google.gson.Gson();

		var SQL = "insert into kbt_t_instalacoes_log (id, dat_registro, user_fluig, idproposta, seqproposta, constrant) values " +
			"((select COALESCE(max(id) + 1, 1) from kbt_t_instalacoes_log), CURRENT_DATE,'" + pUsuario + "', " + pIdProposta + ", " + pSeqProposta + ", '" + gson.toJson(pConstraints) + "') ";

		statementWD = pConnection.prepareStatement(SQL);
		statementWD.executeUpdate();

		// pDataset.addRow(new Array('Log'));
		printLog("info", "SQLLog: " + SQL);
	} catch (error) {
		pDataset.addRow(new Array("Erro Log: " + error.toString() + " linha: " + error.lineNumber));
	} finally {
		if (rsWD != null) rsWD.close();
		if (statementWD != null) statementWD.close();

		return wRetItens;
	}

}