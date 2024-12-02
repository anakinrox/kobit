function createDataset(fields, constraints, sortFields) {
  var controller = Manager('java:/jdbc/FluigDS', 'DS_SolicitacaoParceiros');

  controller.openConnection();

  controller.createConstraint(constraints);

  controller.logs('INICIO - ' + controller.constraint.ACTION);

  var statementWD = null;

  if (controller.constraint.ACTION == 'LOGIN_VALIDATE') {
    //log.info(' ENTREI LOGIN_VALIDATE ');
    statementWD = getSQL_validLogin(controller.constraint, controller.connectionWD, controller.logs);
    //log.info(' STATEMENT LOGIN_VALIDATE ');
    controller.executeSQL(statementWD);
    //log.info(' CONTROLLER LOGIN_VALIDATE ');
  }
  if (controller.constraint.ACTION == 'GET_REQ') {
    statementWD = getSQL_Reqs(controller.constraint, controller.connectionWD, controller.logs);
    controller.executeSQL(statementWD);
  }
  if (controller.constraint.ACTION == 'LIST_CUPONS') {
    statementWD = getSQL_listCupons(controller.constraint, controller.connectionWD, controller.logs);
    controller.executeSQL(statementWD);
  }
  if (controller.constraint.ACTION == 'INSERT_TABLE') {
    // statementWD = getSQL_CreateTablePartners(controller.constraint, controller.connectionWD, controller.logs);
    // controller.executeSQL(statementWD, 'INSERT');
  }
  if (controller.constraint.ACTION == 'INSERT_CUPOM') {
    statementWD = getSQL_InsertCupon(controller.constraint, controller.connectionWD, controller.logs);
    controller.executeSQL(statementWD, 'INSERT');
  }
  if (controller.constraint.ACTION == 'UPDATE_CUPOM') {
    statementWD = getSQL_UpdateCupon(controller.constraint, controller.connectionWD, controller.logs, false);
    controller.executeSQL(statementWD, 'UPDATE');
  }
  if (controller.constraint.ACTION == 'UPDATE_CUPOM_SAVED') {
    statementWD = getSQL_UpdateCupon(controller.constraint, controller.connectionWD, controller.logs, true);
    controller.executeSQL(statementWD, 'UPDATE');
  }

  if (controller.constraint.ACTION == 'SEND_EMAIL_ASSINATURA') {
    SendEmailAssinatura(controller.constraint, controller.connectionWD);
  }

  if (controller.constraint.ACTION == 'GEN_DEAL_VENDEDOR') {
    postDealVendedor(controller.constraint);
  }

  if (controller.constraint.ACTION == 'UPDATE_IDFLUIG') {
    attIdFluigPipedrive(controller.constraint);
  }

  if (controller.constraint.ACTION == 'RESEND_EMAIL_ASSINATURA') {
    ResendEmailAssinatura(controller.constraint);
  }

  if (controller.constraint.ACTION == 'GET_ASSINATURA') {
    getAssinatura(controller.constraint);
  }

  if (controller.constraint.ACTION == 'LOG_LGPD') {
    statementWD = getSQL_logLGPD(controller.constraint, controller.connectionWD, controller.logs);
    controller.executeSQL(statementWD, 'INSERT');
  }

  controller.closeConnection(statementWD);

  controller.logs('FIM');

  return controller.getDataset();
}

function getSQL_CreateTablePartners(constraint, connection, logs) {
  var SQL =
    '   CREATE TABLE kbt_t_parceiros_cupons (  ' +
    '   	ID INT AUTO_INCREMENT PRIMARY KEY,  ' +
    '   	ID_PARCEIRO INT,  ' +
    '   	ID_DESTINO INT,  ' +
    '   	IDFLUIG INT,  ' +
    '   	NOME VARCHAR(150) NOT NULL,  ' +
    '   	EMAIL VARCHAR(150) NOT NULL,  ' +
    '   	CIDADE VARCHAR(150) NOT NULL,  ' +
    '   	TELEFONE VARCHAR(150) NOT NULL,  ' +
    '   	DATA DATETIME,  ' +
    '   	DATA_ULTIMO_CONTATO DATETIME,  ' +
    '   	CUPOM VARCHAR(150) NOT NULL,  ' +
    '   	STATUS VARCHAR(150) NOT NULL,  ' +
    '       JSON MEDIUMTEXT ' +
    '  )  ';
  var statement = connection.prepareStatement(SQL);

  logs(' getSQL_CreateTablePartners - SQL: ' + SQL);

  return statement;
}

function getSQL_Reqs(constraint, connection, logs) {
  //log.info('#### getSQL_Reqs ####');
  var SQL = 'SELECT * FROM kbt_t_parceiros_cupons WHERE ID = ? ';

  var statement = connection.prepareStatement(SQL);

  //    statement.setString(1, constraint.ID_PARCEIRO);
  statement.setString(1, constraint.ID);

  return statement;
}

function getSQL_UpdateCupon(constraint, connection, logs, saved) {
  var seq = 1;

  //log.info(constraint.IDFLUIG);

  var json = JSON.parse(constraint.JSON);

  json['processo'] = '';

  var SQL = 'UPDATE kbt_t_parceiros_cupons SET';

  if (constraint.IDFLUIG != '') {
    SQL += ' IDFLUIG = ?, ';
  }

  SQL += ' NOME = ?, EMAIL = ?, CIDADE = ?, TELEFONE = ?, JSON = ?, STATUS = ?, CUPOM = ? WHERE ID = ? ';
  //log.info(SQL);
  var statement = connection.prepareStatement(SQL);
  if (constraint.IDFLUIG != '' && constraint.IDFLUIG != 'null') {
    statement.setString(seq++, constraint.IDFLUIG);
    json['processo'] = String(constraint.IDFLUIG);
  }

  if (constraint.IDFLUIG == 'null') {
    statement.setNull(seq++, java.sql.Types.INTEGER);
  }

  statement.setString(seq++, constraint.NOME);
  statement.setString(seq++, constraint.EMAIL);
  statement.setString(seq++, constraint.CIDADE);
  statement.setString(seq++, constraint.TELEFONE);
  //statement.setString(7, constraint.DATA);
  statement.setString(seq++, JSON.stringify(json));
  statement.setString(seq++, constraint.STATUS);
  statement.setString(seq++, constraint.CUPOM);

  //    statement.setString(seq++, constraint.ID_PARCEIRO);
  statement.setString(seq++, constraint.ID);

  //log.info(statement);
  return statement;
}

function getSQL_InsertCupon(constraint, connection, logs) {
  var seq = 1;
  var SQL = '	INSERT INTO kbt_t_parceiros_cupons ( ' + '	ID_PARCEIRO, ';
  if (constraint.IDFLUIG != '') {
    SQL += '	IDFLUIG,';
  }
  SQL +=
    'NOME, ' +
    '	EMAIL, ' +
    '	CIDADE, ' +
    '	TELEFONE, ' +
    '	DATA, ' +
    '	DATA_ULTIMO_CONTATO, ' +
    '	CUPOM, ' +
    '	STATUS, ' +
    '   ID_DESTINO, ' +
    '	JSON) ' +
    ' VALUES (?,';

  if (constraint.IDFLUIG != '') {
    SQL += '?,';
  }

  SQL += '?,?,?,?,CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP(),?,?,?,?)';

  var statement = connection.prepareStatement(SQL);
  statement.setString(seq++, constraint.ID_PARCEIRO);

  if (constraint.IDFLUIG != '') {
    statement.setString(seq++, constraint.IDFLUIG);
  }

  statement.setString(seq++, constraint.NOME);
  statement.setString(seq++, constraint.EMAIL);
  statement.setString(seq++, constraint.CIDADE);
  statement.setString(seq++, constraint.TELEFONE);
  //statement.setString(7, constraint.DATA);
  statement.setString(seq++, constraint.CUPOM);
  statement.setString(seq++, constraint.STATUS);
  if (constraint.ID_DESTINO == '') {
    statement.setNull(seq++, java.sql.Types.INTEGER);
  } else {
    statement.setString(seq++, constraint.ID_DESTINO);
  }
  statement.setString(seq++, constraint.JSON);

  return statement;
}

function getSQL_listCupons(constraint, connection, logs) {
  //log.info('#### getSQL_listCupons #### ' + constraint.STATUS);

  var SQL =
    "SELECT IFNULL(IDFLUIG, '') as IDFLUIG, ktpc.*, DATE_FORMAT(DATA,'%d/%m/%Y') AS DATA_FORMATED, DATE_FORMAT(DATA_ULTIMO_CONTATO,'%d/%m/%Y') AS DATA_ULTIMO_CONTATO_FORMATED, case when (STATUS = 'CADASTRADO' and CUPOM != '') then '<button class=\"btn btn-info btn-xs\" data-request-orcamento title=\"Solicitar Orçamento\" ><span class=\"flaticon flaticon-add-box icon-sm\"> </button>' else '' end AS TS FROM kbt_t_parceiros_cupons ktpc WHERE ( ID_PARCEIRO = ? or ID_DESTINO = ? ) ";

  if (constraint.STATUS == 'P') {
    //    	SQL += " AND STATUS != 'ARQUIVADO' AND (STATUS IN ('NÃO ENVIADO','COMPLEMENTO') OR CUPOM = '') ";
    SQL += " AND STATUS NOT IN ('ARQUIVADO','CADASTRADO','PROPOSTA SOLICITADA') ";
  }

  if (constraint.STATUS == 'N') {
    SQL += " AND STATUS = 'NÃO ENVIADO' ";
  }

  if (constraint.STATUS == 'S') {
    SQL += " AND STATUS = 'SOLICITADO' ";
  }

  if (constraint.STATUS == 'R') {
    SQL += " AND STATUS = 'PROPOSTA SOLICITADA' ";
  }

  if (constraint.STATUS == 'A') {
    SQL += " AND STATUS = 'ARQUIVADO' ";
  }

  if (constraint.STATUS == 'E') {
    SQL += " AND STATUS = 'ENVIADO' ";
  }

  if (constraint.STATUS == 'C') {
    SQL += " AND STATUS = 'CADASTRADO' ";
  }

  var statement = connection.prepareStatement(SQL);

  statement.setString(1, constraint.ID_PARCEIRO);
  statement.setString(2, constraint.ID_PARCEIRO);

  return statement;
}

function getSQL_validLogin(constraint, connection, logs) {
  var SQL = 'SELECT * FROM kbt_t_parceiros WHERE EMAIL = ? AND SEGREDO = MD5(?) AND INATIVO = 0';

  //log.info('SQL....' + SQL);

  var statement = connection.prepareStatement(SQL);

  statement.setString(1, constraint.EMAIL);
  statement.setString(2, constraint.PASS);
  return statement;
}

function attIdFluigPipedrive(constraint) {
  newDataset = DatasetBuilder.newDataset();

  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint('f00de0b109d9c4ea0d3258f12f99837c8d164c72', constraint.IDFLUIG, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('area', constraint.AREA, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('deal', constraint.DEAL, null, ConstraintType.MUST));
  var deals = DatasetFactory.getDataset('pipedriveDealsUPD', null, constraints, null);

  return deals;
}

function getSQL_logLGPD(constraint, connection, logs) {
  if (constraint.STATUS == 'A') {
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('TABLE', 'kbt_t_parceiros', null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('COMMIT', 'N', null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('DATABASE', 'java:/jdbc/FluigDS', null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('ACTION', 'U', null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('FIELD_C', 'IES_LGPD', 'A', ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('WHERE_C', 'ID', constraint.USER_APROV, ConstraintType.MUST));
    var dsStatus = DatasetFactory.getDataset('dsk_table_dml', null, constraints, null);
  }

  var seq = 1;

  var SQL =
    'insert into kbt_aprov_publica (cod_empresa, ' +
    'documentid, ' +
    'num_proces, ' +
    'num_seq_aprov, ' +
    'user_seq_aprov, ' +
    'num_seq_reprov, ' +
    'user_seq_reprov, ' +
    'status, ' +
    'document_aprov, ' +
    'email_aprov, ' +
    'data_envio, ' +
    'chave, ' +
    'conteudo, ' +
    'data_aprov, ' +
    'user_aprov , ' +
    'obs_aprov , ' +
    'ip_aprov )' +
    " values ('1', " + //Empresa
    "'0', " +
    "'0', " +
    ' 0, ' +
    "'0', " +
    ' 0, ' +
    "'0', " +
    '?, ' + //status
    '?, ' + // document_aprov
    '?, ' + // email_aprov
    ' sysdate(), ' +
    "'', " +
    "'', " +
    ' sysdate(), ' +
    '?, ' + //user_aprov
    '?, ' + //obs_aprov
    '? )'; // ip_aprov
  //log.info(SQL);
  //log.info(constraint.STATUS);
  //log.info(constraint.DOCUMENT_APROV);
  //log.info(constraint.EMAIL_APROV);
  //log.info(constraint.USER_APROV);
  //log.info(constraint.OBS_APROV);
  //log.info(constraint.IP_APROV);
  var statement = connection.prepareStatement(SQL);
  statement.setString(seq++, constraint.STATUS);
  statement.setString(seq++, constraint.DOCUMENT_APROV);
  statement.setString(seq++, constraint.EMAIL_APROV);
  statement.setString(seq++, constraint.USER_APROV);
  statement.setString(seq++, constraint.OBS_APROV);
  statement.setString(seq++, constraint.IP_APROV);

  return statement;
}

function getAssinatura(constraint) {
  newDataset = DatasetBuilder.newDataset();
  newDataset.addColumn('status');
  newDataset.addColumn('msg');

  //Contrato PF 88344 / 457014
  //Contrato PJ 88345 / 457011
  //LGPD 88343 / 457012

  var folderId = '';
  var status = '';
  var msg = '';

  //Recupera dados Parceiro
  var sql = '	SELECT * FROM kbt_t_parceiros WHERE ID = ' + constraint.ID;

  var ct = new Array();
  ct.push(DatasetFactory.createConstraint('SQL', sql, null, ConstraintType.MUST));
  ct.push(DatasetFactory.createConstraint('DATABASE', 'java:/jdbc/FluigDS', null, ConstraintType.MUST));
  var dsParceiro = DatasetFactory.getDataset('select', null, ct, null);

  if (dsParceiro.getValue(0, 'tipo_cadastro') == 'D' || dsParceiro.getValue(0, 'tipo_cadastro') == 'L') {
    if (constraint.TIPO == 'contrato') {
      if (dsParceiro.getValue(0, 'tipo_cadastro') == 'D') {
        dsParceiro.getValue(0, 'documento').length() <= 15 ? (folderId = 457014) : (folderId = 457011);
      }

      if (dsParceiro.getValue(0, 'tipo_cadastro') == 'L') {
        dsParceiro.getValue(0, 'documento').length() <= 15 ? (folderId = 573523) : (folderId = 525430);
      }

      //	dsParceiro.getValue(0, "documento").length() <= 15 ? folderId = 422697 : folderId = 422697;
      //		//log.info('DOC: ' + dsParceiro.getValue(0, "documento") + ' - ' + dsParceiro.getValue(0, "documento").length() )
      //log.info('PASTA: ' + folderId);
      //Recupera Processos
      var ct = new Array();
      ct.push(DatasetFactory.createConstraint('dataSet', 'assinatura_parceiros', null, ConstraintType.MUST));
      var table = DatasetFactory.getDataset('dsk_table_name', null, ct, null).getValue(0, 'table');

      var sql =
        '	SELECT an.num_proces, ap.document_aprov, pr.status, ass.email_contrato ' +
        '	FROM ' +
        table +
        ' ass   ' +
        '	JOIN documento doc ON ( ass.companyid = doc.COD_EMPRESA ' +
        '						AND ass.documentid = doc.NR_DOCUMENTO ' +
        '						AND ass.version = doc.NR_VERSAO ) ' +
        '	JOIN anexo_proces an ON (an.COD_EMPRESA = doc.COD_EMPRESA ' +
        '								AND an.NR_DOCUMENTO = doc.NR_DOCUMENTO ' +
        '								AND an.NR_VERSAO = doc.NR_VERSAO) ' +
        '	JOIN proces_workflow pr ON (pr.COD_EMPRESA = an.COD_EMPRESA ' +
        '									AND pr.NUM_PROCES = an.NUM_PROCES) ' +
        '	left JOIN kbt_aprov_publica ap ON (ap.cod_empresa = pr.COD_EMPRESA ' +
        '									AND ap.num_proces = pr.NUM_PROCES) ' +
        '	left JOIN kbt_acesso_publica ac ON (ac.id_aprov_ws = ap.id_ws)  ' +
        '	WHERE ass.id_parceiro = ' +
        constraint.ID +
        ' ' +
        '		AND doc.VERSAO_ATIVA = 1 ' +
        '		AND pr.STATUS <> 1' +
        '	ORDER BY pr.NUM_PROCES DESC, ac.data_acesso desc limit 1';

      //log.info('Usuario contrato: ' + constraint.ID)

      var ct = new Array();
      ct.push(DatasetFactory.createConstraint('SQL', sql, null, ConstraintType.MUST));
      ct.push(DatasetFactory.createConstraint('DATABASE', 'java:/jdbc/FluigDS', null, ConstraintType.MUST));
      var dsUltDoc = DatasetFactory.getDataset('select', null, ct, null);
      //log.info('dsUltDoc: ' + dsUltDoc.rowsCount);
      if (dsUltDoc.rowsCount > 0) {
        if (dsUltDoc.getValue(0, 'document_aprov') != '') {
          //log.info('document_aprov != branco ');
          //Carrega Ulimo Contrato
          //log.info('Antes de buscar pasta');
          //   var folder = fluigAPI.getFolderDocumentService().list(folderId);
          var companyId = getValue('WKCompany') || '1';
          var folder = getDocumentsFromFolder(folderId, companyId);
          //log.info('Depois de buscar pasta');
          //log.info('Tamanho da pasta: ' + folder.length);

          var docsContrato = new Array();

          /*
          for (var i = 0; i < folder.size(); i++) {
            docsContrato.push(folder.get(i).getDocumentId());
          }
          */
          folder.forEach(function (doc) {
            if (doc.type == '1') {
              doc.children.forEach(function (innerDoc) {
                docsContrato.push(innerDoc.id);
              });
            } else docsContrato.push(doc.id);
          });

          docsContrato.sort(function (a, b) {
            return b - a;
          });

          //log.info('Documentos de contrato: ');
          //docsContrato.forEach(function (doc) {
            //log.info(doc);
          //});

          //log.info(dsUltDoc.getValue(0, 'document_aprov') + '-' + docsContrato[0]);

          if (dsUltDoc.getValue(0, 'document_aprov') != docsContrato[0]) {
            //log.info('Para o usuário de código ' + constraint.ID);
            //log.info('Documento diferente da versao atual: ' + dsUltDoc.getValue(0, 'status'));
            if (dsUltDoc.getValue(0, 'status') == '0') {
              //							var cancelInstanceVO = new com.fluig.sdk.api.workflow.CancelInstanceVO;
              //							cancelInstanceVO.setReplacedId('admlog');
              //							cancelInstanceVO.setCancelText('Processo cancelado por atualização do Contrato');
              //							cancelInstanceVO.setProcessInstanceId( parseInt( dsUltDoc.getValue(0,'num_proces') ) );
              //							fluigAPI.getWorkflowService().cancelInstance(cancelInstanceVO);

              var constraint = new Array();
              constraint.push(DatasetFactory.createConstraint('processId', parseInt(dsUltDoc.getValue(0, 'num_proces')), null, ConstraintType.MUST));
              constraint.push(DatasetFactory.createConstraint('cancelText', 'Processo cancelado por reenvio de email', null, ConstraintType.MUST));
              DatasetFactory.getDataset('cancelaProcesso', null, constraint, null);
            }
            status = '-1';
            msg =
              '<h1>O contrato foi atualizado!</h1>' +
              'Informe seu email abaixo para prosseguir com a assinatura' +
              '<input type="text" id="email_contrato" class="form-control"/>';

            newDataset.addRow([status, msg]);
          } else if (dsParceiro.getValue(0, 'ies_contrato') == '0' || dsParceiro.getValue(0, 'ies_contrato') == 'null') {
            status = '0';
            msg = 'Email enviado, verifique a caixa de entrada do email: ' + dsUltDoc.getValue(0, 'email_contrato');

            newDataset.addRow([status, msg]);
          } else if (dsParceiro.getValue(0, 'ies_contrato') == '1') {
            status = '1';
            msg = 'O contrato está para avaliação da equipe interna';

            newDataset.addRow([status, msg]);
          } else if (dsParceiro.getValue(0, 'ies_contrato') == '2') {
            status = '2';
            msg = 'Contrato já aprovado';

            newDataset.addRow([status, msg]);
          }
        }
      } else {
        //log.info('else');
        //log.info(dsParceiro.getValue(0, 'ies_contrato'));

        msg =
          '<h1>O contrato foi atualizado!</h1>' +
          'Informe seu email abaixo para prosseguir com a assinatura' +
          '<input type="text" id="email_contrato" class="form-control"/>';

        newDataset.addRow(['-1', msg]);
      }
    }

    if (constraint.TIPO == 'lgpd') {
      //Carrega ultima versão LGPD

      //   var folder = fluigAPI.getFolderDocumentService().list(457012);
      var companyId = getValue('WKCompany') || '1';
      var folder = getDocumentsFromFolder(457012, companyId);

      var docsLGPD = new Array();

      //for (var i = 0; i < folder.size(); i++) {
      //  docsLGPD.push(folder.get(i).getDocumentId());
      //}

      folder.forEach(function (doc) {
        if (doc.type == '1') {
          doc.children.forEach(function (innerDoc) {
            docsLGPD.push(innerDoc.id);
          });
        } else docsLGPD.push(doc.id);
      });

      docsLGPD.sort(function (a, b) {
        return b - a;
      });

      //Recupera Ultima aprovação
      var ct = new Array();
      ct.push(DatasetFactory.createConstraint('dataSet', 'assinatura_parceiros', null, ConstraintType.MUST));
      var table = DatasetFactory.getDataset('dsk_table_name', null, ct, null).getValue(0, 'table');

      var sql = "	select * from kbt_aprov_publica where user_aprov = '" + constraint.ID + "' order by id_ws desc limit 1";
      //				"	ORDER BY pr.NUM_PROCES DESC, ac.data_acesso desc limit 1";

      var ct = new Array();
      ct.push(DatasetFactory.createConstraint('SQL', sql, null, ConstraintType.MUST));
      ct.push(DatasetFactory.createConstraint('DATABASE', 'java:/jdbc/FluigDS', null, ConstraintType.MUST));
      var dsUltDoc = DatasetFactory.getDataset('select', null, ct, null);
      //log.info('dsUltDoc: ' + dsUltDoc.rowsCount);
      if (dsUltDoc.rowsCount > 0) {
        if (dsUltDoc.getValue(0, 'document_aprov') != '') {
          if (dsUltDoc.getValue(0, 'document_aprov') != docsLGPD[0]) {
            //log.info('Documento diferente da versao atual');

            status = '-1';
            msg = docsLGPD[0];

            newDataset.addRow([status, msg]);
          } else {
            //log.info('ELSE: ' + dsParceiro.getValue(0, 'ies_lgpd'));
            if (dsParceiro.getValue(0, 'ies_lgpd') != 'A') {
              status = '-1';
              msg = docsLGPD[0];
            } else {
              status = '2';
              msg = '';
            }
            newDataset.addRow([status, msg]);
          }
        }
      } else {
        status = '-1';
        msg = docsLGPD[0];
        newDataset.addRow(['-1', msg]);
      }
    }
  } else {
    status = '2';
    msg = 'Tipo de usuário não exige contrato';

    newDataset.addRow([status, msg]);
  }
}

function ResendEmailAssinatura(constraint) {
  newDataset = DatasetBuilder.newDataset();
  newDataset.addColumn('status');
  newDataset.addColumn('msg');

  var ct = new Array();
  ct.push(DatasetFactory.createConstraint('dataSet', 'assinatura_parceiros', null, ConstraintType.MUST));
  var table = DatasetFactory.getDataset('dsk_table_name', null, ct, null).getValue(0, 'table');

  var sql =
    '	SELECT an.num_proces, ap.document_aprov, pr.status ' +
    '	FROM ' +
    table +
    ' ass   ' +
    '	JOIN documento doc ON ( ass.companyid = doc.COD_EMPRESA ' +
    '						AND ass.documentid = doc.NR_DOCUMENTO ' +
    '						AND ass.version = doc.NR_VERSAO ) ' +
    '	JOIN anexo_proces an ON (an.COD_EMPRESA = doc.COD_EMPRESA ' +
    '								AND an.NR_DOCUMENTO = doc.NR_DOCUMENTO ' +
    '								AND an.NR_VERSAO = doc.NR_VERSAO) ' +
    '	JOIN proces_workflow pr ON (pr.COD_EMPRESA = an.COD_EMPRESA ' +
    '									AND pr.NUM_PROCES = an.NUM_PROCES) ' +
    '	left JOIN kbt_aprov_publica ap ON (ap.cod_empresa = pr.COD_EMPRESA ' +
    '									AND ap.num_proces = pr.NUM_PROCES) ' +
    '	left JOIN kbt_acesso_publica ac ON (ac.id_aprov_ws = ap.id_ws)  ' +
    '	WHERE ass.id_parceiro = ' +
    constraint.ID +
    ' ' +
    '		AND doc.VERSAO_ATIVA = 1 ' +
    '		AND pr.STATUS = 0 ' +
    '	ORDER BY pr.NUM_PROCES DESC, ac.data_acesso desc limit 1';

  var ct = new Array();
  ct.push(DatasetFactory.createConstraint('SQL', sql, null, ConstraintType.MUST));
  ct.push(DatasetFactory.createConstraint('DATABASE', 'java:/jdbc/FluigDS', null, ConstraintType.MUST));
  var dsUltDoc = DatasetFactory.getDataset('select', null, ct, null);
  if (dsUltDoc.rowsCount > 0) {
    var constraint = new Array();
    constraint.push(DatasetFactory.createConstraint('processId', parseInt(dsUltDoc.getValue(0, 'num_proces')), null, ConstraintType.MUST));
    constraint.push(DatasetFactory.createConstraint('cancelText', 'Processo cancelado por reenvio de email', null, ConstraintType.MUST));
    DatasetFactory.getDataset('cancelaProcesso', null, constraint, null);
  }

  newDataset.addRow(['OK', '']);
}

function SendEmailAssinatura(constraint) {
  newDataset = DatasetBuilder.newDataset();
  newDataset.addColumn('status');
  newDataset.addColumn('msg');

  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint('iniciarProcesso', 'S', null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('processo', 'wf_assinatura_parceiros', null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('atividade', '11', null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('usuario', 'admlog', null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('id_parceiro', constraint.ID, 'field', ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('email_contrato', constraint.EMAIL_CONTRATO, 'field', ConstraintType.MUST));

  var dsProcesso = DatasetFactory.getDataset('processo_movimento', null, constraints, null);

  if (dsProcesso != '' && dsProcesso != null) {
    if (dsProcesso.getValue(0, 'retorno') != '') {
      newDataset.addRow(['OK', dsProcesso.getValue(0, 'retorno')]);
    }
  } else {
    newDataset.addRow(['ERRO', 'ERRO AO GERAR O PROCESSO DE ASSINATURA']);
  }
}

function postDealVendedor(constraint) {
  newDataset = DatasetBuilder.newDataset();
  newDataset.addColumn('id_org');
  newDataset.addColumn('id_person');
  newDataset.addColumn('id_deals_vendedor');

  //log.info(constraint.JSON);

  var jsonObj = JSON.parse(constraint.JSON);

  var area = jsonObj['area'];

  //log.info('########## AREA postDealVendedor ############# ' + area);

  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST));
  var pipe = DatasetFactory.getDataset('pipedrive', null, constraints, null);

  if (pipe.rowsCount == 0) {
    throw 'Não cadastrado parametro para esse tipo de integração.';
  }

  var tipoPessoa = jsonObj['fisico_juridico'];
  var idPerson = jsonObj['id_person'];
  var orgId = jsonObj['id_org'];

  if (tipoPessoa == 'J') {
    if (orgId == '') {
      var constraints = new Array();
      constraints.push(DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST));
      constraints.push(DatasetFactory.createConstraint('name', jsonObj['nome'], jsonObj['nome'], ConstraintType.MUST));
      var datasetOrg = DatasetFactory.getDataset('pipedriveOrganizations', null, constraints, null);

      if (datasetOrg.values.length == 0) {
        var constraintsFilhos = new Array();
        constraintsFilhos.push(DatasetFactory.createConstraint('tablename', 'token_organization', 'token_organization', ConstraintType.MUST));
        constraintsFilhos.push(
          DatasetFactory.createConstraint('metadata#id', pipe.getValue(0, 'documentid'), pipe.getValue(0, 'documentid'), ConstraintType.MUST)
        );
        constraintsFilhos.push(
          DatasetFactory.createConstraint('metadata#version', pipe.getValue(0, 'version'), pipe.getValue(0, 'version'), ConstraintType.MUST)
        );
        constraintsFilhos.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));

        var datasetFilhos = DatasetFactory.getDataset('pipedrive', null, constraintsFilhos, null);
        if (datasetFilhos != null) {
          for (var i = 0; i < datasetFilhos.rowsCount; i++) {
            constraints.push(
              DatasetFactory.createConstraint(
                datasetFilhos.getValue(i, 'token_org'),
                jsonObj[datasetFilhos.getValue(i, 'campo_org')],
                null,
                ConstraintType.MUST
              )
            );
          }
        }
        var pipedriveOrganizationsDML = DatasetFactory.getDataset('pipedriveOrganizationsDML', null, constraints, null);
        if (pipedriveOrganizationsDML.rowsCount == 0) {
          throw 'Não foi possivel registrar nova organização.';
        } else {
          orgId = pipedriveOrganizationsDML.getValue(0, 'id');
        }
      } else {
        orgId = datasetOrg.getValue(0, 'id');
      }

      var constraints = new Array();
      constraints.push(DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST));
      constraints.push(DatasetFactory.createConstraint('phone', jsonObj['telefone_pessoa'], jsonObj['telefone_pessoa'], ConstraintType.MUST));
      if (jsonObj['only_phone'] == 'S') {
        constraints.push(DatasetFactory.createConstraint('name', '', '', ConstraintType.MUST));
      } else {
        constraints.push(DatasetFactory.createConstraint('name', jsonObj['pessoa_contato'], jsonObj['pessoa_contato'], ConstraintType.MUST));
      }
      var person = DatasetFactory.getDataset('pipedrivePerson', null, constraints, null);

      if (person.values.length == 0) {
        var constraintsFilhos = new Array();
        constraintsFilhos.push(DatasetFactory.createConstraint('tablename', 'token_person', 'token_person', ConstraintType.MUST));
        constraintsFilhos.push(
          DatasetFactory.createConstraint('metadata#id', pipe.getValue(0, 'documentid'), pipe.getValue(0, 'documentid'), ConstraintType.MUST)
        );
        constraintsFilhos.push(
          DatasetFactory.createConstraint('metadata#version', pipe.getValue(0, 'version'), pipe.getValue(0, 'version'), ConstraintType.MUST)
        );
        constraintsFilhos.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));

        var datasetFilhos = DatasetFactory.getDataset('pipedrive', null, constraintsFilhos, null);
        if (datasetFilhos != null) {
          var constraints = new Array();
          for (var i = 0; i < datasetFilhos.rowsCount; i++) {
            constraints.push(
              DatasetFactory.createConstraint(
                datasetFilhos.getValue(i, 'token_pes'),
                jsonObj[datasetFilhos.getValue(i, 'campo_pes')],
                null,
                ConstraintType.MUST
              )
            );
          }
        }

        constraints.push(DatasetFactory.createConstraint('org_id', orgId, null, ConstraintType.MUST));

        var pipedrivePersonDML = DatasetFactory.getDataset('pipedrivePersonDML', null, constraints, null);
        if (pipedrivePersonDML.rowsCount == 0) {
          throw 'Não foi possivel registrar novo contato.';
        } else {
          idPerson = pipedrivePersonDML.getValue(0, 'id');
        }
      } else {
        idPerson = person.getValue(0, 'id');
      }
    }
  }

  if (tipoPessoa == 'F') {
    if (idPerson == '') {
      var constraints = new Array();
      constraints.push(DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST));
      constraints.push(DatasetFactory.createConstraint('phone', jsonObj['telefone1'], jsonObj['telefone1'], ConstraintType.MUST));
      if (jsonObj['only_phone'] == 'S') {
        constraints.push(DatasetFactory.createConstraint('name', '', '', ConstraintType.MUST));
      } else {
        constraints.push(DatasetFactory.createConstraint('name', jsonObj['nome'], jsonObj['nome'], ConstraintType.MUST));
      }
      var person = DatasetFactory.getDataset('pipedrivePerson', null, constraints, null);

      if (person.values.length == 0) {
        var constraintsFilhos = new Array();
        constraintsFilhos.push(DatasetFactory.createConstraint('tablename', 'token_person', 'token_person', ConstraintType.MUST));
        constraintsFilhos.push(
          DatasetFactory.createConstraint('metadata#id', pipe.getValue(0, 'documentid'), pipe.getValue(0, 'documentid'), ConstraintType.MUST)
        );
        constraintsFilhos.push(
          DatasetFactory.createConstraint('metadata#version', pipe.getValue(0, 'version'), pipe.getValue(0, 'version'), ConstraintType.MUST)
        );
        constraintsFilhos.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));

        var datasetFilhos = DatasetFactory.getDataset('pipedrive', null, constraintsFilhos, null);
        if (datasetFilhos != null) {
          var constraints = new Array();
          constraints.push(DatasetFactory.createConstraint('area', area, area, ConstraintType.MUST));
          for (var i = 0; i < datasetFilhos.rowsCount; i++) {
            constraints.push(
              DatasetFactory.createConstraint(
                datasetFilhos.getValue(i, 'token_pes'),
                jsonObj[datasetFilhos.getValue(i, 'campo_pes')],
                null,
                ConstraintType.MUST
              )
            );
          }
        }

        var pipedrivePersonDML = DatasetFactory.getDataset('pipedrivePersonDML', null, constraints, null);
        if (pipedrivePersonDML.rowsCount == 0) {
          throw 'Não foi possivel registrar novo contato.';
        } else {
          idPerson = pipedrivePersonDML.getValue(0, 'id');
        }
      } else {
        idPerson = person.getValue(0, 'id');
      }
    }
  }

  //	var pipeDriveVendedor = jsonObj['id_user_vendedor'];
  //
  //	if ( pipeDriveVendedor == "" ){
  var pipedriveUser = constraint.USERPIPEDRIVE;
  var tipoUser = constraint.TIPOUSER;
  //	} else {
  //		var pipedriveUser = jsonObj["id_user_vendedor"];
  //	}

  if (pipedriveUser == '') {
    throw 'Usuário PipeDrive não carregado, não será possível incluir a Deal.';
  }

  //	//log.info('Inclui DEAL......' );
  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint('title', constraint.TITULO, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('person_id', idPerson, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('org_id', orgId, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('pipeline_id', jsonObj['setor_destino'], null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('user_id', pipedriveUser, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint('area', area, null, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint(pipe.getValue(0, 'token_area'), area, null, ConstraintType.MUST));

  if (jsonObj['id_origem_pipedrive'] != '' && jsonObj['id_origem_pipedrive'] != undefined && jsonObj['id_origem_pipedrive'] != null) {
    constraints.push(DatasetFactory.createConstraint(pipe.getValue(0, 'token_origem'), jsonObj['id_origem_pipedrive'], null, ConstraintType.MUST));
  } else {
    var ctP = new Array();
    ctP.push(DatasetFactory.createConstraint('___int___id', jsonObj['cod_origem'], jsonObj['cod_origem'], ConstraintType.MUST));
    ctP.push(DatasetFactory.createConstraint('table', 'online.pon_origem_negocio', null, ConstraintType.MUST));
    var orig = DatasetFactory.getDataset('selectTablePostgreSQL', ['origem_negocio', 'id_pipedrive'], ctP, null);
    if (orig.rowsCount > 0) {
      constraints.push(
        DatasetFactory.createConstraint(pipe.getValue(0, 'token_origem'), orig.getValue(0, 'id_pipedrive'), null, ConstraintType.MUST)
      );
    }
  }

  constraints.push(DatasetFactory.createConstraint(pipe.getValue(0, 'token_proc_fluig'), jsonObj['processo'], null, ConstraintType.MUST));
  constraints.push(
    DatasetFactory.createConstraint(pipe.getValue(0, 'token_showroom'), jsonObj['showroom'].replace('Pool:Role:', ''), null, ConstraintType.MUST)
  );

  var constraintsFilhos = new Array();
  //	constraintsFilhos.push( DatasetFactory.createConstraint("area" , area, null, ConstraintType.MUST) );
  constraintsFilhos.push(DatasetFactory.createConstraint('tablename', 'token_deal', 'token_deal', ConstraintType.MUST));
  constraintsFilhos.push(
    DatasetFactory.createConstraint('metadata#id', pipe.getValue(0, 'documentid'), pipe.getValue(0, 'documentid'), ConstraintType.MUST)
  );
  constraintsFilhos.push(
    DatasetFactory.createConstraint('metadata#version', pipe.getValue(0, 'version'), pipe.getValue(0, 'version'), ConstraintType.MUST)
  );
  constraintsFilhos.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));
  var datasetFilhos = DatasetFactory.getDataset('pipedrive', null, constraintsFilhos, null);
  if (datasetFilhos != null) {
    for (var i = 0; i < datasetFilhos.rowsCount; i++) {
      constraints.push(
        DatasetFactory.createConstraint(
          datasetFilhos.getValue(i, 'token_opor'),
          jsonObj[datasetFilhos.getValue(i, 'campo_opor')],
          null,
          ConstraintType.MUST
        )
      );
    }
  }
  var deals = DatasetFactory.getDataset('pipedriveDealsDML', null, constraints, null);

  if (deals.rowsCount > 0) {
    idDealVendedor = deals.getValue(0, 'id');

    newDataset.addRow(new Array(orgId, idPerson, idDealVendedor));
  }

  //	try{
  //
  //	     var indexes = jsonObj['hist'];
  //
  //	     for (var i = 0; i < indexes.length; i++) {
  //
  //	    	 if( hAPI.getCardValue("user_hist___"+indexes[i]) != undefined
  //	    	  && hAPI.getCardValue("user_hist___"+indexes[i]) != null
  //	    	  && hAPI.getCardValue("desc_hist___"+indexes[i]) != undefined
  //	    	  && hAPI.getCardValue("desc_hist___"+indexes[i]) != null ){
  //
  //		    	 var constraints = new Array();
  //			   	  constraints.push( DatasetFactory.createConstraint( "area" , area, null, ConstraintType.MUST) );
  //
  //			   	  constraints.push( DatasetFactory.createConstraint( "content" , indexes[i]["user_hist"] +": "+indexes[i]["desc_hist"], null, ConstraintType.MUST) );
  //			   	  constraints.push( DatasetFactory.createConstraint( "user_id" , pipedriveUser, null, ConstraintType.MUST) );
  //			   	  constraints.push( DatasetFactory.createConstraint( "deal_id" , idDealVendedor, null, ConstraintType.MUST) );
  //			   	  var dh = indexes[i]['data_hist'];
  //			   	  dh = dh.split(' ')[0].split('/').reverse().join('-')+' '+dh.split(' ')[1]
  //			   	  constraints.push( DatasetFactory.createConstraint( "add_time" , dh, null, ConstraintType.MUST) );
  //			   	  constraints.push( DatasetFactory.createConstraint( "pinned_to_deal_flag" , "0", null, ConstraintType.MUST) );
  //
  //			   	  var pipedriveNote = DatasetFactory.getDataset("pipedriveNoteDML", null, constraints, null);
  //	    	 }
  //	     }
  //
  //	 }catch(e){
  //	 }

  try {
    var obsGeral = '';
    if (constraint.OBS != '' && constraint.OBS != undefined) {
      obsGeral = constraint.OBS;
    } else if (tipoUser == 'V') {
      obsGeral =
        'Solicitação de cadastro do Vendedor' +
        ' \n ' +
        ' \n ' +
        'Nome do Parceiro: ' +
        jsonObj['nome'] +
        ' \n ' +
        'Vendedor: ' +
        jsonObj['nome_user_vendedor'] +
        '\n ' +
        'Dados de Cadastro: ' +
        jsonObj['dados_orcamento'];
    } else if (tipoUser == 'AA' || tipoUser == 'AI') {
      obsGeral =
        'Solicitação de cadastro do ADVA/ADVI Pleno' +
        ' \n ' +
        ' \n ' +
        'Nome do Parceiro: ' +
        jsonObj['nome'] +
        ' \n ' +
        'Vendedor: ' +
        jsonObj['nome_user_vendedor'] +
        '\n ' +
        'Dados de Cadastro: ' +
        jsonObj['dados_orcamento'];
    } else {
      obsGeral =
        'Solicitação de cadastro realizado via fluig' +
        ' \n ' +
        ' \n ' +
        'Nome do Parceiro: ' +
        jsonObj['nome'] +
        ' \n ' +
        'Patrocinador do Parceiro: ' +
        jsonObj['usuario_respon'] +
        '\n ' +
        'Dados Orçamento: ' +
        jsonObj['dados_orcamento'];
    }

    //    				   "Proprietario: "+hAPI.getCardValue("proprietario")+" - "+hAPI.getCardValue("telefone_prop")+" - "+hAPI.getCardValue("email_prop")+"\n "+
    //    	  			   "Profissional: "+fProf+" - "+hAPI.getCardValue("profissional")+" - "+hAPI.getCardValue("telefone_prof");
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('area', area, null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('content', obsGeral, null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('user_id', pipedriveUser, null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('deal_id', idDealVendedor, null, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint('pinned_to_deal_flag', '0', null, ConstraintType.MUST));
    var pipedriveNote = DatasetFactory.getDataset('pipedriveNoteDML', null, constraints, null);
  } catch (e) {}
}

//Don't touch in this code below...  It's just a class that do anything
var Manager = function (path, logName) {
  path = path;
  logName = logName;
  this.connectionWD = null;
  newDataset = DatasetBuilder.newDataset();
  constraint = {};
  columnsCreated = false;

  gettedRows = {}; //U can get an array dataset row values of col calling getRowValues('NAME_OF_COL'), then just using  " gettedRows.NAME_OF_COL " -> this return an array[]

  function openConnection() {
    try {
      var contextWD = new javax.naming.InitialContext();
      var dataSourceWD = contextWD.lookup(path);
      this.connectionWD = dataSourceWD.getConnection();
    } catch (e) {
      logs('ERRO 1: ' + e.message + '(#' + e.lineNumber + ')');
    }
  }

  function closeConnection(statementWD) {
    if (statementWD != null) {
      statementWD.close();
    }
    if (this.connectionWD != null) {
      this.connectionWD.close();
    }
  }

  function addColumnDataset(colums) {
    colums.map(function (name) {
      newDataset.addColumn(name);
    });

    columnsCreated = true;
  }

  function executeSQL(statementWD, action) {
    try {
      if (action == 'UPDATE' || action == 'INSERT') {
        statementWD.executeUpdate();

        newDataset.addColumn('SUCCESS');
        newDataset.addRow(['Success to execute ' + action]);
        return;
      } else {
        //log.info('executeSQL');

        var rsWD = statementWD.executeQuery();

        var columnCount = rsWD.getMetaData().getColumnCount();
        for (var i = 1; i <= columnCount; i++) {
          //log.info('Colunas ' + rsWD.getMetaData().getColumnName(i));
          newDataset.addColumn(rsWD.getMetaData().getColumnName(i));
        }
        var columsName = newDataset.getColumnsName();
        var qtd = 0;
        while (rsWD.next()) {
          qtd++;
          //log.info(' Linha ' + qtd);
          var resultSQL = columsName.map(function (name) {
            return rsWD.getString(name);
          });

          newDataset.addRow(resultSQL);
        }
        //log.info('executeSQL depois while');
      }
    } catch (e) {
      var message_error = 'ERRO 2: ' + e.message + '(#' + e.lineNumber + ')';
      logs(message_error);
      newDataset.addColumn('ERROR');
      newDataset.addRow([message_error]);
      return;
    } finally {
      closeConnection(statementWD);
    }
  }

  function getRowValues(colName) {
    var tmp = [];

    for (var i = 0; i < newDataset.getRowsCount(); i++) {
      tmp.push(newDataset.getValue(i, constraint[colName]));
    }

    gettedRows[colName] = tmp;
  }

  function createConstraint(constraints) {
    for (var ctrs in constraints) {
      typeName = constraints[ctrs].getFieldName().toString();
      constraint[typeName] = constraints[ctrs].initialValue;

      if (
        constraints[ctrs].initialValue != constraints[ctrs].finalValue &&
        constraints[ctrs].finalValue != null &&
        constraints[ctrs].finalValue != ''
      ) {
        constraint['FINAL_' + typeName] = constraints[ctrs].finalValue;
      }
    }
  }

  function logs(message) {
    //log.info(logName + ' - ' + message);
  }

  function getDataset() {
    return newDataset;
  }

  return {
    openConnection: openConnection,
    closeConnection: closeConnection,
    addColumnDataset: addColumnDataset,
    executeSQL: executeSQL,
    logs: logs,
    createConstraint: createConstraint,
    getDataset: getDataset,
    getRowValues: getRowValues,

    constraint: constraint
  };
};

function parseResultsetObject(resultSet) {
  var objects = [];
  var columnCount = resultSet.getMetaData().getColumnCount();
  while (resultSet.next()) {
    var obj = {};
    for (var i = 1; i <= columnCount; i++) {
      var columnName = resultSet.getMetaData().getColumnLabel(i);
      var value = resultSet.getObject(columnName) || '';
      obj[columnName] = value + '';
    }
    objects.push(obj);
  }

  return objects;
}

function getDocumentsFromFolder(folderId, companyId){
  var query = "select NR_DOCUMENTO as `id`, NR_VERSAO as `version`, COD_EMPRESA as companyId, TP_DOCUMENTO as `type` from documento d where d.COD_EMPRESA = ? and d.NR_DOCUMENTO_PAI = ? and VERSAO_ATIVA = 1";
  
  var connection = null;
  var statement = null;
  var resultSet = null;

  try {
    var context = new javax.naming.InitialContext();
    var dataSource = context.lookup("java:/jdbc/AppDS");

    connection = dataSource.getConnection();
    statement = connection.prepareStatement(query);
    
    statement.setInt(1, companyId);
    statement.setInt(2, folderId);
    
    resultSet = statement.executeQuery();
    return parseResultsetObject(resultSet);
  } catch (error) {
    log.error('Erro ao executar query ' + query);
    log.error(error.toString());
    throw error;
  } finally {
    if (resultSet != null) resultSet.close();
    if (statement != null) statement.close();
    if (connection != null) connection.close();
  }
}
/*function getDocumentsFromFolder(folderId, companyId) {
  var data = {
    companyId: companyId + '',
    serviceCode: 'FluigAPI',
    endpoint: '/api/public/ecm/document/listDocumentWithChildren/' + folderId,
    method: 'get',
    timeoutService: '100',
    options: {
      encoding: 'UTF-8',
      mediaType: 'application/json'
    },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };

  var clientService = fluigAPI.getAuthorizeClientService();
  var response = clientService.invoke(JSON.stringify(data));
  var result = response.getResult();

  if (result == null || result.isEmpty()) throw 'Retorno vazio ao chamar a API para listar documentos';

  var resultOBJ = parseJSON(result);
  if (resultOBJ) return resultOBJ.content;

  return null;
}*/

function parseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    //log.info('Erro ao converter para json: ' + error);
    //log.info('JSON: ' + json);
    return null;
  }
}
