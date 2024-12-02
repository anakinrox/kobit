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
  "fluigService" : "APP_RM",
  "operation" : "eis_v_func_nivel_chefia",
  "tableType" : "VIEW",
  "parameters" : [ ],
  "inputValues" : {
    "CHAPA" : [ ],
    "COD_DPTO" : [ ],
    "CODCHEFE_N1" : [ ],
    "CODCHEFE_N2" : [ ],
    "CODCHEFE_N3" : [ ],
    "CODCHEFE_N4" : [ ],
    "CODCHEFE_N5" : [ ],
    "CODCHEFE_N6" : [ ],
    "CODCOLIGADA" : [ ],
    "CODCOLIGADAFILIAL" : [ ],
    "CODEQUIPE" : [ ],
    "CODFILIAL" : [ ],
    "CODFUNCAO" : [ ],
    "CODSECAO" : [ ],
    "CODSECAO_N1" : [ ],
    "CODSECAO_N2" : [ ],
    "CODSECAO_N3" : [ ],
    "CODSECAO_N4" : [ ],
    "CODSECAO_N5" : [ ],
    "CODSITUACAO" : [ ],
    "DATAADMISSAO" : [ ],
    "DATADEMISSAO" : [ ],
    "DENEQUIPE" : [ ],
    "DENSECAO_N1" : [ ],
    "DENSECAO_N2" : [ ],
    "DENSECAO_N3" : [ ],
    "DENSECAO_N4" : [ ],
    "DENSECAO_N5" : [ ],
    "DEPARTAMENTO" : [ ],
    "eh_demitido" : [ ],
    "NOME" : [ ],
    "NOME_SECAO" : [ ],
    "NOMECHEFE_N1" : [ ],
    "NOMECHEFE_N2" : [ ],
    "NOMECHEFE_N3" : [ ],
    "NOMECHEFE_N4" : [ ],
    "NOMECHEFE_N5" : [ ],
    "NOMECHEFE_N6" : [ ],
    "NOMEEMPRESA" : [ ],
    "NOMEFANTASIA" : [ ],
    "NOMEFUNCAO" : [ ],
    "UNIDADEFUNCIONAL" : [ ]
  },
  "inputAssignments" : { },
  "outputValues" : {
    "CHAPA" : {
      "result" : true,
      "type" : "varchar"
    },
    "COD_DPTO" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODCHEFE_N1" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODCHEFE_N2" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODCHEFE_N3" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODCHEFE_N4" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODCHEFE_N5" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODCHEFE_N6" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODCOLIGADA" : {
      "result" : true,
      "type" : "smallint"
    },
    "CODCOLIGADAFILIAL" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODEQUIPE" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODFILIAL" : {
      "result" : true,
      "type" : "smallint"
    },
    "CODFUNCAO" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODSECAO" : {
      "result" : true,
      "type" : "varchar"
    },
    "CODSECAO_N1" : {
      "result" : true,
      "type" : "char"
    },
    "CODSECAO_N2" : {
      "result" : true,
      "type" : "char"
    },
    "CODSECAO_N3" : {
      "result" : true,
      "type" : "char"
    },
    "CODSECAO_N4" : {
      "result" : true,
      "type" : "char"
    },
    "CODSECAO_N5" : {
      "result" : true,
      "type" : "char"
    },
    "CODSITUACAO" : {
      "result" : true,
      "type" : "char"
    },
    "DATAADMISSAO" : {
      "result" : true,
      "type" : "varchar"
    },
    "DATADEMISSAO" : {
      "result" : true,
      "type" : "varchar"
    },
    "DENEQUIPE" : {
      "result" : true,
      "type" : "varchar"
    },
    "DENSECAO_N1" : {
      "result" : true,
      "type" : "varchar"
    },
    "DENSECAO_N2" : {
      "result" : true,
      "type" : "varchar"
    },
    "DENSECAO_N3" : {
      "result" : true,
      "type" : "varchar"
    },
    "DENSECAO_N4" : {
      "result" : true,
      "type" : "varchar"
    },
    "DENSECAO_N5" : {
      "result" : true,
      "type" : "varchar"
    },
    "DEPARTAMENTO" : {
      "result" : true,
      "type" : "varchar"
    },
    "eh_demitido" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOME" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOME_SECAO" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOMECHEFE_N1" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOMECHEFE_N2" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOMECHEFE_N3" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOMECHEFE_N4" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOMECHEFE_N5" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOMECHEFE_N6" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOMEEMPRESA" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOMEFANTASIA" : {
      "result" : true,
      "type" : "varchar"
    },
    "NOMEFUNCAO" : {
      "result" : true,
      "type" : "varchar"
    },
    "UNIDADEFUNCIONAL" : {
      "result" : true,
      "type" : "varchar"
    }
  },
  "outputAssignments" : { },
  "extraParams" : { }
};
}