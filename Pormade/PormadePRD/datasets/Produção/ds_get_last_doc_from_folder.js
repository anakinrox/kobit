function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {
	
  var dataset = DatasetBuilder.newDataset();

  dataset.addColumn('documentId');
		
  var listaConstraints = {};

  if (constraints != null) {
    for (var i = 0; i < constraints.length; i++) {
    	listaConstraints[ constraints[i].fieldName.trim() ] = constraints[i].initialValue;
    }
  }
  
//  listaConstraints['folderId'] = '986216';
	
  var query =
	'select NR_DOCUMENTO as `id`, NR_VERSAO as `version`, COD_EMPRESA as companyId, TP_DOCUMENTO as `type` '+
	'from documento d where d.COD_EMPRESA = 1 and d.NR_DOCUMENTO_PAI = ? and VERSAO_ATIVA = 1 order by id desc limit 1';
	
  var connection = null;
  var statement = null;
  var resultSet = null;

  try {
    var context = new javax.naming.InitialContext();
    var dataSource = context.lookup('java:/jdbc/AppDS');

    connection = dataSource.getConnection();
    statement = connection.prepareStatement(query);

//    statement.setInt(1, listaConstraints['companyId'] );
    statement.setInt(1, listaConstraints['folderId'] );

    resultSet = statement.executeQuery();
    
    while (resultSet.next()) {    	
    	dataset.addRow([resultSet.getString('id')]);
    }
//    return parseResultsetObject(resultSet);
    
  } catch (error) {
    log.error('Erro ao executar query ' + query);
    log.error(error.toString());
    dataset.addRow([ error.toString() ]);
    throw error;
  } finally {
    if (resultSet != null) resultSet.close();
    if (statement != null) statement.close();
    if (connection != null) connection.close();
  }
  
  return dataset;

}
function onMobileSync(user) {

}