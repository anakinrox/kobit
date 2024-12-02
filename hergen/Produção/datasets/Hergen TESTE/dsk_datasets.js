function createDataset(fields, constraints, sortFields) {
	try {
		return processResult(callService(fields, constraints, sortFields));
	} catch(e) {
		return processErrorResult(e, constraints);
	}
}

function callService(fields, constraints, sortFields) {
	var databaseData = data();
	var resultFields, queryClauses;

	resultFields = getOutputFields(databaseData.outputValues);
	queryClauses = verifyConstraints(databaseData, constraints);

	var result = DatabaseManager.select(databaseData.fluigService, databaseData.operation, resultFields, queryClauses, databaseData.extraParams);

	return result;
}

function defineStructure() {
	var databaseData = data();
	var columns = getOutputFields(databaseData.outputValues);

	for (column in columns) {
		var columnName = removeInvalidChars(columns[column]);
		if (!DatabaseManager.isReservedWord(columnName)) {
			addColumn(columnName);
		} else {
			addColumn('ds_' + columnName);
		}
	}
	if (databaseData.extraParams.key) {
		setKey([databaseData.extraParams.key]);
	}
}

function onSync(lastSyncDate) {
	var databaseData = data();
	var synchronizedDataset = DatasetBuilder.newDataset();

	try {
		var resultDataset = processResult(callService());
		if (resultDataset != null) {
			var values = resultDataset.getValues();
			for (var i = 0; i < values.length; i++) {
				if (databaseData.extraParams.key) {
					synchronizedDataset.addOrUpdateRow(values[i]);
				} else {
					synchronizedDataset.addRow(values[i]);
				}
			}
		}

	} catch(e) {
		log.info('Dataset synchronization error : ' + e.message);

	}
	return synchronizedDataset;
}

function verifyConstraints(params, constraints) {
	var allConstraints = new Array();

	if (constraints != null) {
		for (var i = 0; i < constraints.length; i++) {
			if (constraints[i].getFieldName().toLowerCase() == 'sqllimit') {
				params.extraParams['limit'] = constraints[i].getInitialValue();
			} else {
				allConstraints.push(constraints[i]);
			}
		}
	}

	if (allConstraints.length == 0) {
		for (i in params.inputValues) {
			for (j in params.inputValues[i]) {
				var param = params.inputValues[i][j];
				var constraint = DatasetFactory.createConstraint(param.fieldName, param.initialValue, param.finalValue, param.constraintType);
				constraint.setLikeSearch(param.likeSearch);
				constraint.setFieldType(DatasetFieldType.valueOf(param.fieldType));
				allConstraints.push(constraint);
			}
		}
	}
	return allConstraints;
}

function getOutputFields(outputValues) {
	var outputFields = new Array();
	if (outputValues != null) {
		for (field in outputValues) {
			if (outputValues[field].result) {
				outputFields.push(field);
			}
		}
	}
	return outputFields;
}

function processResult(result) {
	var databaseData = data();
	var dataset = DatasetBuilder.newDataset();
	var columns = getOutputFields(databaseData.outputValues);

	for (column in columns) {
		dataset.addColumn(columns[column]);
	}

	for (var i = 0; i < result.size(); i++) {
		var datasetRow = new Array();
		var item = result.get(i);
		for (param in columns) {
			datasetRow.push(item.get(columns[param]));
		}
		dataset.addRow(datasetRow);
	}

	return dataset;
}

function processErrorResult(error, constraints) {
	var dataset = DatasetBuilder.newDataset();

	dataset.addColumn('error');
	dataset.addRow([error.message]);

	return dataset;
}

function removeInvalidChars(columnName) {
	var invalidChars = '#';
	var newChar = '_';
	for (var i = 0; i < invalidChars.length; i++) {
		columnName = columnName.split(invalidChars[i]).join(newChar);
	}

	return columnName;
}

function data() {
	return {
  "fluigService" : "AppDS",
  "operation" : "serv_dataset",
  "tableType" : "TABLE",
  "parameters" : [ ],
  "inputValues" : {
    "COD_EMPRESA" : [ ],
    "COD_DATASET" : [ ],
    "DSL_BUILDER" : [ ],
    "DES_DATASET" : [ ],
    "DSL_DATASET" : [ ],
    "IS_ACTIVE" : [ ],
    "IS_DRAFT" : [ ],
    "JOURN_ADHERENCE" : [ ],
    "LAST_REMOTE_SYNC" : [ ],
    "LAST_RESET" : [ ],
    "COD_LISTA" : [ ],
    "MOBILE_OFFLINE" : [ ],
    "FORCE_MOBILE_OFFLINE" : [ ],
    "RESET_TYPE" : [ ],
    "SERVER_OFFLINE" : [ ],
    "SYNC_DETAILS" : [ ],
    "SYNC_STATUS" : [ ],
    "TYPE" : [ ],
    "UPDATE_INTERVAL" : [ ]
  },
  "inputAssignments" : { },
  "outputValues" : {
    "COD_EMPRESA" : {
      "result" : true,
      "type" : "bigint"
    },
    "COD_DATASET" : {
      "result" : true,
      "type" : "varchar"
    },
    "DSL_BUILDER" : {
      "result" : true,
      "type" : "varchar"
    },
    "DES_DATASET" : {
      "result" : true,
      "type" : "varchar"
    },
    "DSL_DATASET" : {
      "result" : true,
      "type" : "longtext"
    },
    "IS_ACTIVE" : {
      "result" : true,
      "type" : "bit"
    },
    "IS_DRAFT" : {
      "result" : true,
      "type" : "bit"
    },
    "JOURN_ADHERENCE" : {
      "result" : true,
      "type" : "int"
    },
    "LAST_REMOTE_SYNC" : {
      "result" : true,
      "type" : "bigint"
    },
    "LAST_RESET" : {
      "result" : true,
      "type" : "bigint"
    },
    "COD_LISTA" : {
      "result" : true,
      "type" : "int"
    },
    "MOBILE_OFFLINE" : {
      "result" : true,
      "type" : "bit"
    },
    "FORCE_MOBILE_OFFLINE" : {
      "result" : true,
      "type" : "bit"
    },
    "RESET_TYPE" : {
      "result" : true,
      "type" : "int"
    },
    "SERVER_OFFLINE" : {
      "result" : true,
      "type" : "bit"
    },
    "SYNC_DETAILS" : {
      "result" : true,
      "type" : "longtext"
    },
    "SYNC_STATUS" : {
      "result" : true,
      "type" : "int"
    },
    "TYPE" : {
      "result" : true,
      "type" : "varchar"
    },
    "UPDATE_INTERVAL" : {
      "result" : true,
      "type" : "bigint"
    }
  },
  "outputAssignments" : { },
  "extraParams" : { }
};
}