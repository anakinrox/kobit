function defineStructure() {
	addColumn('status');
}
function onSync(lastSyncDate) {

	log.info('START aprov_cap_ad.js ... ');
	
	var newDataset = DatasetBuilder.newDataset();
	newDataset.addColumn('status');

    var statementWD = null;
	var stDmlWD = null;
	var connectionWD = null;
	var conn = null;

	try {
		log.info('$001... ');
		var contextWD = new javax.naming.InitialContext();
		log.info('$002... ');
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
		log.info('$003... ');
		connectionWD = dataSourceWD.getConnection();
		log.info('$004... ');
		//connectionWD.setAutoCommit(false);
		log.info('$004a... ');

		//conn = connectionWD = dataSourceWD.getConnection();
		//conn.setAutoCommit(false);
		
		var atividadeIni = '2';
		var procAprova = 'aprov_ad_cap';
		var empresaEcm = '1';

		var ds = DatasetFactory.getDataset('userIntegraFluig', null, null, null );
		var userEcm = ds.getValue(0, "user_fluig");
		var senhaEcm = ds.getValue(0, "pass_fluig");
	
		var workflowEngineServiceProvider = ServiceManager.getServiceInstance("WorkflowEngineService");
		var workflowEngineServiceLocator = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService");
		var workflowEngineService = workflowEngineServiceLocator.getWorkflowEngineServicePort();

		
		// ########### CANCELA PEDIDOS PADRÃO ##############
		sql = "select * " +
			" from kbt_v_canc_ad_fluig " +
			" order by cod_empresa ";

		log.info('$005... ' + sql);
		statementWD = connectionWD.prepareStatement(sql);
		resultSetWD = statementWD.executeQuery();

		while (resultSetWD.next()) {

			log.info('Informação aprov_cap_ad ...... ' + resultSetWD.getString("cod_empresa").trim() + ' - ' + resultSetWD.getInt("num_ad") + ' - ' + resultSetWD.getString("cod_nivel_autorid").trim())

			try {
				//connectionWD.setSavepoint( resultSetWD.getString("processo_ecm")+"" );
				var Retorno = workflowEngineService.cancelInstance(userEcm.trim(),
					senhaEcm.trim(),
					parseInt(empresaEcm),
					resultSetWD.getInt("processo_ecm"),
					userEcm.trim(),
					'Cancelado via DataSet por manutenção do AD no Logix.');
			
				sqlDml = " update kbt_aprov_ped_ecm " +
					"         set ies_aprovado = 'C', " +
					"		      sistema_aprov = 'F' " +
					" where processo_ecm = ? ";
				log.info("sqlDml.......... " + sqlDml);
				stDmlWD = connectionWD.prepareStatement(sqlDml);
				stDmlWD.setInt(1, resultSetWD.getInt("processo_ecm"));
				stDmlWD.executeUpdate();
				//connectionWD.commit();
			} catch (e) {
				log.info("ERRO workflowEngineService...." + e.toString());
				//connectionWD.rollback( resultSetWD.getString("processo_ecm")+"" );
			}
		}

		
		// ########### ENVIA NOVAS AD ##############

		sql = "select distinct cod_empresa, " +
				"			   num_ad, " +
				"			   num_versao, " +
				"				cod_nivel_autor, " +
				"				today as dat_inclusao, " +
				"				cod_usuario_inc," +
				"				cod_uni_funcio," +
				"				id_linha  " +
			" from kbt_v_ad_fluig" +
			" where 1=1" +
			"	and dat_rec_nf >= today-20 or num_ad = 377985 " +
			//"   and num_ad in ( 325203, 292479, 324394, 109615, 119422, 119450,  82067 ) " +
			/*" where cod_empresa in (select empresa " +
			"				    	  from log_val_parametro " +
			"				   	     where parametro = 'proc_aprova_sup_ecm')" +*/
			" order by cod_empresa ";

		log.info('aprov_cap_ad $005... ' + sql);
		statementWD = connectionWD.prepareStatement(sql);
		resultSetWD = statementWD.executeQuery();

		while (resultSetWD.next()) {
			
			//connectionWD.setSavepoint( resultSetWD.getString("num_ad") );
			
			log.info('aprov_cap_ad $00000... ');
			log.info('aprov_cap_ad Informação...... ' + resultSetWD.getString("cod_empresa").trim() + ' - ' + resultSetWD.getInt("num_ad") + ' - ' + resultSetWD.getString("cod_nivel_autor").trim())

			sqlDml = " insert into kbt_aprov_ped_ecm " +
				" ( cod_empresa, cod_nivel_autorid, num_docum, num_versao_docum, tipo_docum, num_versao_grade, " +
				"	 usuario_inclusao, dat_inclusao, hor_inclusao, ies_aprovado, rowid_aprov, usuario_responsavel, usuario_fluig ) " +
				" values( ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?, ? ) ";
			log.info('aprov_cap_ad $005ui... ' + sqlDml);
			stDmlWD = connectionWD.prepareStatement(sqlDml);
			log.info('aprov_cap_ad $005ui...1 ');
			stDmlWD.setString(1, resultSetWD.getString("cod_empresa").trim());
			log.info('aprov_cap_ad $005ui...2 ');
			stDmlWD.setString(2, resultSetWD.getString("cod_nivel_autor").trim());
			log.info('aprov_cap_ad $005ui...3 ');
			stDmlWD.setInt(3, resultSetWD.getInt("num_ad"));
			log.info('aprov_cap_ad $005ui...4 ');
			stDmlWD.setInt(4, resultSetWD.getInt("num_versao"));
			log.info('aprov_cap_ad $005ui...5 ');
			stDmlWD.setString(5, "A");
			log.info('aprov_cap_ad $005ui...6 ');
			stDmlWD.setInt(6, resultSetWD.getInt("num_versao"));
			log.info('aprov_cap_ad $005ui...7 ');
			stDmlWD.setString(7, resultSetWD.getString("cod_usuario_inc").trim());
			log.info('aprov_cap_ad $005ui...8 ');
			stDmlWD.setDate(8, resultSetWD.getDate("dat_inclusao"));
			log.info('aprov_cap_ad $005ui...9 ');
			stDmlWD.setString(9, '00:00:00');
			log.info('aprov_cap_ad $005ui...10 ');
			stDmlWD.setString(10, 'N');
			log.info('aprov_cap_ad $005ux... ');
			stDmlWD.setString(11, resultSetWD.getInt("id_linha"));
			log.info('aprov_cap_ad $005ux... ');

			// ####  RECUPERA USUARIOS
			var colleagues = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArray");
			sql = "SELECT DISTINCT cod_usuario, cod_usuario_inc " +
				"    FROM kbt_v_aprov_ad_cap_fluig " +
				"   WHERE COD_EMPRESA = ? " +
				" 	  AND num_ad = ? " +
				"	  AND cod_nivel_autor = ? ";

			stWD = connectionWD.prepareStatement(sql);
			stWD.setString(1, resultSetWD.getString("cod_empresa").trim());
			stWD.setInt(2, resultSetWD.getInt("num_ad"));
			stWD.setString(3, resultSetWD.getString("cod_nivel_autor").trim());

			var rsWD = stWD.executeQuery();
			log.info('aprov_cap_ad $005t1... ' + sql + rsWD);
			userAprov = new Array();
			var iesUserBranco = 'N';
			log.info('aprov_cap_ad $005t2..');
			if (rsWD == null) {
				log.info('$005t3..');
				//connectionWD.rollback();
				continue;
			}
			
			log.info('aprov_cap_ad $005t4..');
			while (rsWD.next()) {
				log.info('aprov_cap_ad Antes getUserFluig colleagues ...' );
				userFluig = getUserFluig( rsWD.getString("cod_usuario"), resultSetWD.getString("cod_empresa"), resultSetWD.getInt("num_ad"), 'A' );
				log.info('aprov_cap_ad Após getUserFluig colleagues ...'+userFluig );
				log.info('aprov_cap_ad "' + rsWD.getString("cod_usuario") + '" - "' + userFluig + '"');
				log.info('aprov_cap_ad $005ia....');
				log.info('aprov_cap_ad $005ic....');
				if (userFluig == "") {
					iesUserBranco = 'S';
				} else {
					colleagues.getItem().add(userFluig);
					//stDmlWD.executeUpdate();
					userAprov.push([rsWD.getString("cod_usuario"), userFluig]);
				}
			}
			log.info('aprov_cap_ad $005t5..' + iesUserBranco);
			if (stWD != null) stWD.close();
			log.info('aprov_cap_ad $005t6..' + userAprov.length);

			log.info('aprov_cap_ad $005t7..');
			var objectFactory = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.ObjectFactory");
			var cardData = objectFactory.createStringArrayArray();

			var processAttachmentDtoArray = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray");
			var ProcessTaskAppointmentDto = workflowEngineServiceProvider.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray");

			var stringArray = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArray");
			stringArray.getItem().add('cod_empresa');
			stringArray.getItem().add(resultSetWD.getString("cod_empresa"));
			cardData.getItem().add(stringArray);

			var stringArray = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArray");
			stringArray.getItem().add('num_ad');
			stringArray.getItem().add(resultSetWD.getString("num_ad"));
			cardData.getItem().add(stringArray);

			var stringArray = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArray");
			stringArray.getItem().add('cod_nivel_autorid');
			stringArray.getItem().add(resultSetWD.getString("cod_nivel_autor").trim());
			cardData.getItem().add(stringArray);

			var stringArray = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArray");
			stringArray.getItem().add('num_versao');
			stringArray.getItem().add(resultSetWD.getString("num_versao").trim());
			cardData.getItem().add(stringArray);
			
			var stringArray = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArray");
			stringArray.getItem().add('cod_uni_funcio');
			stringArray.getItem().add(resultSetWD.getString("cod_uni_funcio").trim());
			cardData.getItem().add(stringArray);
			
			var stringArray = workflowEngineServiceProvider.instantiate("net.java.dev.jaxb.array.StringArray");
			stringArray.getItem().add('usuario_aprovador');
			stringArray.getItem().add(userAprov.join(','));
			cardData.getItem().add(stringArray);

			if (stWD != null) stWD.close();

			log.info('aprov_cap_ad Antes getUserFluig ...' );
			var userInc = getUserFluig( resultSetWD.getString("cod_usuario_inc").trim(), resultSetWD.getString("cod_empresa"), resultSetWD.getInt("num_ad"), 'A' );
			log.info('aprov_cap_ad Após getUserFluig ...'+userInc );
			
			if( userInc == "" ){
				log.info('aprov_cap_ad Entrei continue userInc...'+resultSetWD.getString("cod_usuario_inc").trim()+' '+userInc);
				//connectionWD.rollback();
				continue;
			}
			
			// ## Fim Usuarios
			if (userAprov.length == 0 || iesUserBranco == 'S') {
				if (stWD != null) stWD.close();
				log.info('aprov_cap_ad Entrei continue user...'+userAprov.length+' '+iesUserBranco);
				//connectionWD.rollback();
				continue;
			} else {
				for (var y = 0; y < userAprov.length; y++) {
					stDmlWD.setString(12, userAprov[y][0]);
					stDmlWD.setString(13, userAprov[y][1]);
					stDmlWD.executeUpdate();
				}
			}
			
			try {
				
				log.info('aprov_cap_ad Antes WS ...'+userEcm.trim()+' '+
						senhaEcm.trim()+' '+
						parseInt(empresaEcm)+' '+
						procAprova.trim()+' '+
						parseInt(atividadeIni) );
				
				var Retorno = workflowEngineService.startProcess(userEcm.trim(),
					senhaEcm.trim(),
					parseInt(empresaEcm),
					procAprova.trim(),
					parseInt(atividadeIni),
					colleagues,
					"Processo iniciado via dataSet Fluig.",
					userInc.trim(),
					true,
					processAttachmentDtoArray,
					cardData,
					ProcessTaskAppointmentDto,
					true);

				log.info("aprov_cap_ad passo 0010 " + Retorno);
				var iProcessoCriado = '0';
				for (var x = 0; x < Retorno.getItem().size(); x++) {
					log.info(" retorno " + Retorno.getItem().get(x).getItem().get(0) + " - " + Retorno.getItem().get(x).getItem().get(1));
					if (Retorno.getItem().get(x).getItem().get(0) == 'iProcess') {
						iProcessoCriado = Retorno.getItem().get(x).getItem().get(1);
					}
				}
				//var iProcessoCriado = Retorno.getItem().get(4).getItem().get(1);

				log.info("aprov_cap_ad iProcessoCriado " + iProcessoCriado);
				
				if( iProcessoCriado != 0 ){
					sqlDml = " update kbt_aprov_ped_ecm " +
						"    set processo_ecm = ? " +
						" where cod_empresa = ? " +
						"	 and cod_nivel_autorid = ? " +
						"    and num_docum = ? " +
						"	 and num_versao_docum = ?" +
						"	 and tipo_docum = ? " +
						"	 and rowid_aprov = ? ";
					log.info("sqlDml.......... " + sqlDml);
					stDmlWD = connectionWD.prepareStatement(sqlDml);
					stDmlWD.setInt(1, parseInt(iProcessoCriado));
					stDmlWD.setString(2, resultSetWD.getString("cod_empresa").trim());
					stDmlWD.setString(3, resultSetWD.getString("cod_nivel_autor").trim());
					stDmlWD.setInt(4, resultSetWD.getInt("num_ad"));
					stDmlWD.setInt(5, resultSetWD.getString("num_versao").trim());
					stDmlWD.setString(6, "A");
					stDmlWD.setInt(7, resultSetWD.getString("id_linha").trim());
					stDmlWD.executeUpdate();
				}else{
					sqlDml = " delete kbt_aprov_ped_ecm " +
						"    where cod_empresa = ? " +
						"	   and cod_nivel_autorid = ? " +
						"      and num_docum = ? " +
						"	   and num_versao_docum = ? " +
						"	   and tipo_docum = ? " +
						"	   and rowid_aprov = ? ";
					log.info("sqlDml.......... " + sqlDml);
					stDmlWD = connectionWD.prepareStatement(sqlDml);
					stDmlWD.setString(1, resultSetWD.getString("cod_empresa").trim());
					stDmlWD.setString(2, resultSetWD.getString("cod_nivel_autor").trim());
					stDmlWD.setInt(3, resultSetWD.getInt("num_ad"));
					stDmlWD.setInt(4, resultSetWD.getString("num_versao").trim());
					stDmlWD.setString(5, "A");
					stDmlWD.setInt(6, resultSetWD.getString("id_linha").trim());
					stDmlWD.executeUpdate();
				}

				//connectionWD.commit( );
				//if(stWD != null) stWD.close();
				//if(stDmlWD != null) stDmlWD.close();
				//connectionWD.commit();
			} catch (e) {
				log.info("aprov_cap_ad ERRO workflowEngineService...." + e.toString());
				//connectionWD.rollback();
			}
		}
		//connectionWD.commit();
	} catch (e) {
		log.info("aprov_cap_ad ERRO workflowEngineService G...." + e.toString());
		//connectionWD.rollback();
	}
	finally {
		log.info('aprov_cap_ad ##### 6 #####');
		//connectionWD.commit();
		if (statementWD != null) statementWD.close();
		if (stDmlWD != null ) stDmlWD.close();
		if (connectionWD != null) connectionWD.close();
		//if (conn != null) conn.close();
	}
	return newDataset;

}
function createDataset(fields, constraints, sortFields) {


}
function onMobileSync(user) {

}

function getUserFluig(userLogix, codEmpresa, numDocum, tipoDocum ) {
	log.info('aprov_cap_ad $005p... ');
	var ct = new Array();
	ct.push(DatasetFactory.createConstraint('colleaguePK.companyId', '1', null, ConstraintType.MUST));
	ct.push(DatasetFactory.createConstraint('val_param', userLogix, null, ConstraintType.MUST));
	ct.push(DatasetFactory.createConstraint('chave', 'user_logix', null, ConstraintType.MUST));
	log.info('aprov_cap_ad $005q... ');
	var ds = DatasetFactory.getDataset('colleagueParam', null, ct, null);
	log.info('aprov_cap_ad $005u... ');
	if (ds != null && ds.rowsCount > 0) {
		return ds.getValue(0, 'val_param');
	}
    log.info("aprov_cap_ad Usuario não encontrado......: " + userLogix);

    var statementWD = null;
	var connectionWD = null;

	try {
		log.info('aprov_cap_ad $001 getUserFluig... ');
		var contextWD = new javax.naming.InitialContext();
		log.info('aprov_cap_ad $002 getUserFluig... ');
		var dataSourceWD = contextWD.lookup("java:/jdbc/LogixDS");
		log.info('aprov_cap_ad $003 getUserFluig... ');
		connectionWD = dataSourceWD.getConnection();
		log.info('aprov_cap_ad $004 getUserFluig... ');
    
	    var sql = "SELECT usuario_responsavel, dat_refer " +
			"    FROM kbt_erro_integra_user " +
			"   WHERE cod_empresa = ? " +
			"		and num_docum = ? " +
			"		and tipo_docum = ? " +
			"		and usuario_responsavel = ? " +
			" 	  	and dat_refer = today ";

	    log.info('aprov_cap_ad $005 getUserFluig... '+sql);
	    statementWD = connectionWD.prepareStatement(sql);
	    log.info('aprov_cap_ad $001 getUserFluig... a '+codEmpresa);
	    statementWD.setString(1, codEmpresa.trim() );
	    log.info('aprov_cap_ad $001 getUserFluig... b '+numDocum);
	    statementWD.setInt(2, parseInt( numDocum ) );
	    log.info('aprov_cap_ad $001 getUserFluig... c '+tipoDocum);
	    statementWD.setString(3, tipoDocum.trim() );
	    log.info('aprov_cap_ad $001 getUserFluig... d '+userLogix);
	    statementWD.setString(4, userLogix.trim() );
	    log.info('aprov_cap_ad $001 getUserFluig... e');
	    rsWD = statementWD.executeQuery();
	    if( rsWD.next() == 0 ){
	    	var sql = " insert into kbt_erro_integra_user "+
	        		"  	    ( cod_empresa, num_docum, tipo_docum, usuario_responsavel, dat_refer ) " +
	        		" values( ?, ?, ?, ?, today )"
	        log.info('$005 getUserFluig... '+sql);
	        statementWD = connectionWD.prepareStatement(sql);
	    	statementWD.setString(1, codEmpresa.trim() );
	    	statementWD.setInt(2, parseInt( numDocum ) );
	    	statementWD.setString(3, tipoDocum.trim() );
	    	statementWD.setString(4, userLogix.trim() );
	    	log.info('aprov_cap_ad $007 getUserFluig... ');
	    	statementWD.executeUpdate();
	    }
	} catch (e) {
		log.error("aprov_cap_ad ERRO getUserFluig ...." + e.toString());
	}
	finally {
		log.info('aprov_cap_ad ##### 6 #####');
		if (statementWD != null ) statementWD.close();
		if (connectionWD != null) connectionWD.close();
	}
	return '';
}
