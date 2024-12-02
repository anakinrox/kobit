function defineStructure() { }

function onSync(lastSyncDate) { }

function createDataset(fields, constraints, sortFields) {

	var dataset = DatasetBuilder.newDataset();

	var dataBase = 'java:/jdbc/FluigDS';
	var param = 'user_logix';
	var user = '14-050057';
	var empresa = '';
	var val_param = "";
	dataset.addColumn("val_param");
	dataset.addColumn("chave");



	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			log.info('Campo....  ' + constraints[i].fieldName + ' ... ' + constraints[i].initialValue);
			if (constraints[i].fieldName == 'colleaguePK.companyId') {
				empresa = constraints[i].initialValue.trim();
			} else if (constraints[i].fieldName == 'colleaguePK.colleagueId') {
				user = constraints[i].initialValue.trim();
			} else if (constraints[i].fieldName == 'chave') {
				param = constraints[i].initialValue.trim();
			} if (constraints[i].fieldName == 'val_param') {
				val_param = constraints[i].initialValue.trim();
			}
		}
	}

	if (param == 'user_logix') {
		if (val_param == "") {
			var ct = new Array();
			ct.push(DatasetFactory.createConstraint("colleaguePK.companyId", 1, 1, ConstraintType.MUST));
			ct.push(DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST));
			var usuario = DatasetFactory.getDataset("colleague", ['mail'], ct, null);
			if (usuario.rowsCount > 0) {
				log.info(' Mail.......... ' + usuario.getValue(0, 'MAIL'));
				var ctl = new Array();
				ctl.push(DatasetFactory.createConstraint('table', 'usuarios', null, ConstraintType.MUST));
				ctl.push(DatasetFactory.createConstraint('___lower___e_mail', usuario.getValue(0, 'MAIL'), usuario.getValue(0, 'MAIL'), ConstraintType.MUST));
				var dsl = DatasetFactory.getDataset('selectLogix', ['cod_usuario'], ctl, null);
				if (dsl.rowsCount > 0) {
					var dados = new Array();
					dados.push(dsl.getValue(0, 'cod_usuario'));
					dados.push("user_logix");
					dataset.addRow(dados);
				}
			}
		} else {
			var ctl = new Array();
			ctl.push(DatasetFactory.createConstraint('table', 'usuarios', null, ConstraintType.MUST));
			ctl.push(DatasetFactory.createConstraint('cod_usuario', val_param, val_param, ConstraintType.MUST));
			var dsl = DatasetFactory.getDataset('selectLogix', ['e_mail'], ctl, null);
			if (dsl.rowsCount > 0) {
				log.info(' Mail.......... ' + dsl.getValue(0, 'e_mail'));
				var ct = new Array();
				ct.push(DatasetFactory.createConstraint("colleaguePK.companyId", 1, 1, ConstraintType.MUST));
				ct.push(DatasetFactory.createConstraint("mail", dsl.getValue(0, 'e_mail'), dsl.getValue(0, 'e_mail'), ConstraintType.MUST));
				var usuario = DatasetFactory.getDataset("colleague", ['colleaguePK.colleagueId'], ct, null);
				if (usuario.rowsCount > 0) {
					var dados = new Array();
					dados.push(usuario.getValue(0, "colleaguePK.colleagueId"));
					dados.push("user_logix");
					dataset.addRow(dados);

				}
			}
		}
	} else {
		try {
			var contextWD = new javax.naming.InitialContext();
			var dataSourceWD = contextWD.lookup(dataBase);
			var connectionWD = dataSourceWD.getConnection();

			var SQL = "";

			if (param == 'UserPhysicalVolumeUpload') {
				SQL = " select s.storage||'upload/'||e.user_code||'/' as DATA_VALUE, 'UserPhysicalVolumeUpload' as DATA_KEY " +
					"   from fdn_volumesite s " +
					"   join fdn_volume v on (v.volume_id = s.volume_id) " +
					"   join fdn_usertenant e on (e.tenant_id = v.tenant_id) " +
					"   left join fdn_userdata d on ( d.data_key = 'UserPhysicalVolume' " +
					"                             and d.data_value = v.volume_code " +
					"                             and d.user_tenant_id = e.user_tenant_id ) " +
					"   where ( d.userdata_id is not null or " +
					"         ( d.userdata_id is null and v.volume_type = 0 ) ) " +
					"     and v.tenant_id = " + empresa + "  " +
					"     and e.user_code = '" + user + "'  ";
			} else if (val_param == "") {
				if (param == 'cnpj_raiz' || param == 'fortics') {
					SQL = " select d.DATA_VALUE, d.DATA_KEY " +
						"   from fdn_usertenant u " +
						"   join fdn_userdata d on ( u.USER_TENANT_ID = d.USER_TENANT_ID ) " +
						"  where u.user_state = '1' " +
						"	   and u.TENANT_ID = " + empresa + " " +
						"    and u.USER_CODE = '" + user + "' " +
						"    and d.DATA_KEY like '" + param + "%'  ";
				} else {
					SQL = " select d.DATA_VALUE, d.DATA_KEY " +
						"   from fdn_usertenant u " +
						"   join fdn_userdata d on ( u.USER_TENANT_ID = d.USER_TENANT_ID ) " +
						"  where u.TENANT_ID = " + empresa + " " +
						"    and u.USER_CODE = '" + user + "' " +
						"    and d.DATA_KEY = '" + param + "'  ";
				}
			} else {
				if (param == 'cnpj_raiz' || param == 'fortics') {
					SQL = " select u.USER_CODE as DATA_VALUE, d.DATA_KEY " +
						"   from fdn_usertenant u " +
						"   join fdn_userdata d on ( u.USER_TENANT_ID = d.USER_TENANT_ID ) " +
						"  where u.TENANT_ID = " + empresa + " " +
						"    and d.DATA_VALUE = '" + val_param + "' " +
						"    and d.DATA_KEY like '" + param + "%'  ";
				} else {
					SQL = " select u.USER_CODE as DATA_VALUE, d.DATA_KEY " +
						"   from fdn_usertenant u " +
						"   join fdn_userdata d on ( u.USER_TENANT_ID = d.USER_TENANT_ID ) " +
						"  where u.TENANT_ID = " + empresa + " " +
						"    and d.DATA_VALUE = '" + val_param + "' " +
						"    and d.DATA_KEY = '" + param + "'  ";
				}
			}

			log.info("SQL..... " + SQL);

			var statementWD = connectionWD.prepareStatement(SQL);
			var rsWD = statementWD.executeQuery();

			while (rsWD.next()) {
				var dados = new Array();
				dados.push(rsWD.getString("DATA_VALUE"));
				dados.push(rsWD.getString("DATA_KEY"));
				dataset.addRow(dados);
			}

			rsWD.close();

		} catch (e) {
			log.info("ERROOOOOO" + e.getMessage());
		} finally {
			if (statementWD != null) {
				statementWD.close();
			}
			if (connectionWD != null) {
				connectionWD.close();
			}
		}
	}

	return dataset;

}

function onMobileSync(user) { }