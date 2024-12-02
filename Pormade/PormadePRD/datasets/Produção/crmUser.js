function defineStructure() {


}
function onSync(lastSyncDate) {


}
function createDataset(fields, constraints, sortFields) {

	var user = "admin";
	var situacao = "";
	var situacaoFiltro = "";


	var listaConstraits = {};

	//listaConstraits[ 'id_funil' ] = '1'

	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			listaConstraits[constraints[i].fieldName] = constraints[i].initialValue;
		}
	}

	var SQL = "";

	var newDataset = DatasetBuilder.newDataset();

	var contextWD = new javax.naming.InitialContext();
	var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
	var connectionWD = null;
	var statementWD = null;
	//var connectionWD = dataSourceWD.getConnection();

	var SQL = "select usc.usuario_id as id " +
		"		    ,uss.usr_nome as name " +
		"			,COALESCE( usc.email_corporativo, '') as email " +
		"			,COALESCE( uss.usr_telefone, '') as phone " +
		"			,COALESCE( uss.usr_celular, '') as celphone " +
		"			,COALESCE( uss.usr_cpf, '') as document ";

	if (listaConstraits['id_funil']) {
		SQL += " 		,fu.funil_id " +
			" 			,fn.titulo ";
	}

	SQL += "	from crm.tb_usuario usc " +
		"	join fr_usuario uss on (uss.usr_codigo = usc.usuario_id) ";

	if (listaConstraits['id_funil']) {
		SQL += " join crm.tb_funil_usuario fu on (fu.usuario_id = usc.usuario_id )" +
			" join crm.tb_funil fn on (fn.id = fu.funil_id )";
	}

	if (listaConstraits['id']) {
		SQL += " AND usc.usuario_id = '" + listaConstraits['id'] + "'";
	}

	if (listaConstraits['id_funil']) {
		SQL += " AND fu.funil_id = '" + listaConstraits['id_funil'] + "'";

		if (listaConstraits['id_setor_funil']) {
			SQL += " AND usc.setor_id = '" + listaConstraits['id_setor_funil'] + "'";
		}
	}

	if (listaConstraits['name']) {
		SQL += " AND uss.usr_nome like '%" + listaConstraits['name'] + "%'";
	}

	if (listaConstraits['phone']) {
		SQL += " AND ( uss.usr_telefone = '" + listaConstraits['phone'].replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '') + "'" +
			"  or uss.usr_celular = '" + listaConstraits['phone'].replaceAll('(', '').replaceAll(')', '').replaceAll('-', '').replaceAll(' ', '') + "' )";
	}

	if (listaConstraits['email']) {
		SQL += " AND usc.email_corporativo = '" + listaConstraits['email'] + "'";
	}

	if (listaConstraits['document']) {
		SQL += " AND uss.usr_cpf = '" + listaConstraits['document'] + "'";
	}

	if (sortFields != null) {
		SQL += " order by " + sortFields.join(',');
	} else {
		SQL += " order by uss.usr_nome ";
	}
	// newDataset.addRow(new Array("SQL Funil: " + listaConstraits['id_funil'] + " SQL: " + SQL))
	log.info(SQL);

	try {
		connectionWD = dataSourceWD.getConnection();
		statementWD = connectionWD.createStatement();
		statementWD.setFetchSize(500);
		var rs = statementWD.executeQuery(SQL);

		var columnCount = rs.getMetaData().getColumnCount();
		for (var i = 1; i <= columnCount; i++) {
			newDataset.addColumn(rs.getMetaData().getColumnName(i));
		}

		while (rs.next()) {
			var Arr = new Array();
			for (var i = 1; i <= columnCount; i++) {
				var obj = rs.getObject(rs.getMetaData().getColumnName(i));
				if (null != obj) {
					Arr[i - 1] = rs.getObject(rs.getMetaData().getColumnName(i)).toString().trim();
				} else {
					Arr[i - 1] = "null";
				}
			}
			newDataset.addRow(Arr);

		}
	} catch (e) {
		log.error("ERRO==============> " + e.message);
		newDataset.addRow("Nao foram encontrados registros para esse filtro!");
	} finally {
		if (statementWD != null) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}

	return newDataset;

}
function onMobileSync(user) {

}