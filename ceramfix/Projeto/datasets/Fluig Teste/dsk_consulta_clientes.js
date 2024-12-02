function defineStructure() {

}
function onSync(lastSyncDate) {

}

function createDataset(fields, constraints, sortFields) {
	try {
		log.info("Start dsk_consulta_clientes...........");
		var newDataset = DatasetBuilder.newDataset();
		newDataset.addColumn('status');
		/*
				var listaConstraits = {};
		
				if (constraints != null) {
					for (var i = 0; i < constraints.length; i++) {
						listaConstraits[constraints[i].fieldName] = constraints[i].initialValue + "";
						log.info("CT " + constraints[i].fieldName + " ..... " + constraints[i].initialValue + "");
		
					}
				}
		
				var cliComProp = getClientesPropAberto();
				var SQL = "";
				var contextWD = new javax.naming.InitialContext();
				var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
		
		
				var where = "";
		
				if (listaConstraits['cod_repres'] != '' && listaConstraits['cod_repres'] != undefined) {
					where += "  and rep.cod_repres in ( '" + listaConstraits['cod_repres'].split("|").join("','") + "' )";
				}
		
				if (listaConstraits['cod_uni_feder'] != '' && listaConstraits['cod_uni_feder'] != undefined) {
					where += "  and ci.cod_uni_feder in ( '" + listaConstraits['cod_uni_feder'].split("|").join("','") + "' )";
				}
		
				if (listaConstraits['cod_cidade'] != '' && listaConstraits['cod_cidade'] != undefined) {
					where += "  and cli.cod_cidade in ( '" + listaConstraits['cod_cidade'].split("|").join("','") + "' )";
				}
		
				if (listaConstraits['nom_cliente'] != '' && listaConstraits['nom_cliente'] != undefined) {
					where += "  and cli.nom_cliente like '%" + listaConstraits['nom_cliente'].toUpperCase() + "%' ";
				}
		
				if (listaConstraits['cod_cliente'] != '' && listaConstraits['num_cgc_cpf'] != undefined) {
					where += "  and cli.cod_cliente like '%" + listaConstraits['num_cgc_cpf'] + "%' ";
				}
		
				if (listaConstraits['num_cgc_cpf'] != '' && listaConstraits['num_cgc_cpf'] != undefined) {
					where += "  and cli.num_cgc_cpf like '%" + listaConstraits['num_cgc_cpf'] + "%' ";
				}
		
				if (listaConstraits['ies_situacao'] != '' && listaConstraits['ies_situacao'] != undefined) {
					where += "  and cli.ies_situacao = '" + listaConstraits['ies_situacao'] + "' ";
				}
		
				if ((listaConstraits['dat_ult_fat_de'] != '' && listaConstraits['dat_ult_fat_de'] != undefined)
					|| (listaConstraits['dat_ult_fat_ate'] != '' && listaConstraits['dat_ult_fat_ate'] != undefined)
				) {
		
		
		
					if (listaConstraits['dat_ult_fat_de'] != '' && listaConstraits['dat_ult_fat_de'] != undefined) {
						where += "                        and nvl( nf.dat_hor_emissao, '' ) >= '" + listaConstraits['dat_ult_fat_de'].split("/").reverse().join("-") + "' ";
					}
		
					if (listaConstraits['dat_ult_fat_de'] != '' && listaConstraits['dat_ult_fat_de'] != undefined
						&& listaConstraits['dat_ult_fat_ate'] != '' && listaConstraits['dat_ult_fat_ate'] != undefined) {
						where += " group by 1 " +
							" having max( nvl( nf.dat_hor_emissao, '' ) ) between '" + listaConstraits['dat_ult_fat_de'].split("/").reverse().join("-") + "' " +
							"                        						 and '" + listaConstraits['dat_ult_fat_ate'].split("/").reverse().join("-") + "' ";
					}
		
					where += " ) ";
				}
		
				log.info("Filtros adicionado: " + where);
		*/
		var SQL = "select * from ( " +
			" select cli.cod_cliente, " +
			" cli.num_cgc_cpf, " +
			" cli.nom_cliente," +
			" cli.nom_reduzido," +
			" cli.cod_cidade, " +
			" ci.den_cidade, " +
			" ci.cod_uni_feder," +
			" rep.cod_repres," +
			" rep.nom_repres," +
			" rep.nom_guerra," +
			" cv.cod_tip_carteira," +
			" tc.den_tip_carteira," +
			" cli.ies_situacao," +
			" case cli.ies_situacao when 'A' then 'Ativo' " +
			" when 'C' then 'Cencelado' " +
			" when 'P' then 'Pendente' " +
			" when 'S' then 'Suspenso' " +
			" else 'Outro' end as situacao," +
			"             " +
			" ( select max( nvl(nf.dat_hor_emissao, '') ) as max_data    " +
			" from fat_nf_mestre nf" +
			" join fat_nf_item nfi on (nf.empresa = nfi.empresa and nf.trans_nota_fiscal = nfi.trans_nota_fiscal)" +
			" where nf.cliente = cli.cod_cliente" +
			" and nf.sit_nota_fiscal != 'C'" +
			" and nf.val_duplicata > 0 ) as dat_ultimo_faturamento " +
			" from clientes cli " +
			" join cidades ci on (cli.cod_cidade = ci.cod_cidade) " +
			" join cli_canal_venda cv on (cv.cod_cliente = cli.cod_cliente and cv.ies_nivel = '07')" +
			" join tipo_carteira tc on (tc.cod_tip_carteira = cv.cod_tip_carteira) " +
			" join representante rep on (rep.cod_repres = cv.cod_nivel_7) " +
			"	 where 1=1 " + where +
			") t " +
			" WHERE ROWNUM <= 500 " +
			" order by nom_cliente ";

		// "	union all" +
		// "	select cli.cod_cliente, " +
		// "	cli.num_cgc_cpf, " +
		// "	cli.nom_cliente, " +
		// "	cli.nom_reduzido, " +
		// "	cli.cod_cidade, " +
		// "	ci.den_cidade, " +
		// "	ci.cod_uni_feder, " +
		// "	rep.cod_repres, " +
		// "	rep.nom_repres, " +
		// "	rep.nom_guerra, " +
		// "	cv.cod_tip_carteira, " +
		// "	tc.den_tip_carteira, " +
		// "	cli.ies_situacao, " +
		// "	case cli.ies_situacao when 'A' then 'Ativo' " +
		// "		when 'C' then 'Cencelado' " +
		// "		when 'P' then 'Pendente' " +
		// "		when 'S' then 'Suspenso' " +
		// "		else 'Outro' end as situacao," +
		// "	( select max( nvl(nf.dat_hor_emissao, '') ) as max_data    " +
		// "		from fat_nf_mestre nf" +
		// "		join fat_nf_item nfi on (nf.empresa = nfi.empresa and nf.trans_nota_fiscal = nfi.trans_nota_fiscal)" +
		// "		where nf.cliente = cli.cod_cliente" +
		// "		and nf.sit_nota_fiscal != 'C'" +
		// "		and nf.val_duplicata > 0 ) as dat_ultimo_faturamento " +
		// "	from clientes cli " +
		// "	join cidades ci on (cli.cod_cidade = ci.cod_cidade) " +
		// "	join cli_canal_venda cv on (cv.cod_cliente = cli.cod_cliente and cv.ies_nivel = '07') " +
		// "	join tipo_carteira tc on (tc.cod_tip_carteira = cv.cod_tip_carteira) " +
		// "	join representante rep on (rep.cod_repres = cv.cod_nivel_4) " +
		// "	 where 1=1 "+ where + 

		// log.info("######### SQL:  " + SQL);



		newDataset.addRow(new Array("SQL: " + SQL))
		// connectionWD = dataSourceWD.getConnection();
		// statementWD = connectionWD.createStatement();
		// //statementWD.setFetchSize(500);
		// var rs = statementWD.executeQuery(SQL);
		// var columnCount = rs.getMetaData().getColumnCount();
		// for(var i=1;i<=columnCount; i++) {
		// 	newDataset.addColumn(rs.getMetaData().getColumnName(i).toLowerCase() );
		// }
		// newDataset.addColumn( "ies_proposta" );
		// while(rs.next()) {
		// 	var Arr = new Array();	                                           
		//     for(var i=1;i<=columnCount; i++) {
		//       	var obj = rs.getObject(rs.getMetaData().getColumnName(i));
		//         if(null!=obj){                                                                    
		//           	Arr[i-1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString();
		//         }else {
		//           	Arr[i-1] = "null";
		//         }
		//     }

		//     if( cliComProp.indexOf( rs.getString("cod_cliente").trim()+"" ) > -1 ){
		//     	Arr.push("S");
		//     }else{
		//     	Arr.push("N");
		//     }
		// 	log.info("######### ARRAY LIST:  "+Arr);
		//     newDataset.addRow(Arr);

		// }
	} catch (e) {
		// log.error("ERRO==============> " + e.message);
		//var newDataset = DatasetBuilder.newDataset();
		newDataset.addColumn('status');
		newDataset.addRow(new Array("Erro: " + e + " - Linha: " + e.lineNumber));
	} finally {
		// if (statementWD != null) statementWD.close();
		// if (connectionWD != null) connectionWD.close();
	}

	return newDataset;


}

function onMobileSync(user) {

}


function getClientesPropAberto() {

	var tProposta = getTable('proposta', '');

	var SQL = " select distinct sc.cod_cliente " +
		"	  from " + tProposta + " sc " +
		"	   join proces_workflow u on ( u.COD_EMPRESA = sc.companyid " +
		"                			   and u.NR_DOCUMENTO_CARD = sc.documentid ) " +
		"   where u.status = '0' and u.LOG_ATIV = 1 and sc.cod_cliente <> '' and sc.cod_cliente is not null ";

	var arrClientes = [];

	try {

		var contextWD = new javax.naming.InitialContext();
		var dataSourceWD = contextWD.lookup("java:/jdbc/AppDS");

		connectionWD = dataSourceWD.getConnection();
		statementWD = connectionWD.createStatement();
		statementWD.setFetchSize(500);

		log.info("SQL........" + SQL);
		var rs = statementWD.executeQuery(SQL);

		while (rs.next()) {
			arrClientes.push(rs.getString("cod_cliente").trim() + "");
		}
	} catch (e) {
		log.error("ERRO==============> " + e.message);
	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}

	return arrClientes;
}

function getTable(dataSet, table) {

	var ct = new Array();
	ct.push(DatasetFactory.createConstraint("dataSet", dataSet, null, ConstraintType.MUST));
	if (table != ""
		&& table != null
		&& table != undefined) {
		ct.push(DatasetFactory.createConstraint("table", table, null, ConstraintType.MUST));
	}
	var ds = DatasetFactory.getDataset('dsk_table_name', null, ct, null);

	if (table != ""
		&& table != null
		&& table != undefined) {
		return ds.getValue(0, 'tableFilha');
	} else {
		return ds.getValue(0, 'table');
	}
}