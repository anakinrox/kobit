function servicetask9(attempt, message) {
  var parentDocumentId = 317379; // Produção
  // var parentDocumentId = 87720; // Homologação
  var documentId = hAPI.getCardValue('reservaId') + '';

  var fields = getUpdatedFields(documentId);

  var clientService = fluigAPI.getAuthorizeClientService();
  var data = {
    companyId: getValue('WKCompany') + '',
    serviceCode: 'FluigAPI',
    endpoint: '/ecm-forms/api/v2/cardindex/' + parentDocumentId + '/cards/' + documentId,
    method: 'PUT',
    timeoutService: '100', // segundos
    options: {
      encoding: 'UTF-8',
      mediaType: 'application/json'
    },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: {
      values: fields
    }
  };

  var response = clientService.invoke(JSON.stringify(data));
  if (response.description != 'FluigAPI:SUCCESS') throw response.result;
}

function getUpdatedFields(documentId) {
  var fields = [];

  var cTablename = DatasetFactory.createConstraint('tablename', 'tabela_visitas', 'tabela_visitas', ConstraintType.MUST);
  var cDocumentId = DatasetFactory.createConstraint('metadata#id', documentId, documentId, ConstraintType.MUST);
  var cActive = DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST);
  var dsVisitas = DatasetFactory.getDataset('ds_ReservasSalas', null, [cTablename, cDocumentId, cActive], null);

  for (var i = 0; i < dsVisitas.rowsCount; i++) {
    fields.push(
      {
        fieldId: 'codigo_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'codigo_visita') + ''
      },
      {
        fieldId: 'local_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'local_visita') + ''
      },
      {
        fieldId: 'tipo_local_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'tipo_local_visita') + ''
      },
      {
        fieldId: 'data_inicio_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'data_inicio_visita') + ''
      },
      {
        fieldId: 'data_fim_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'data_fim_visita') + ''
      },
      {
        fieldId: 'contato_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'contato_visita') + ''
      },
      {
        fieldId: 'telefone_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'telefone_visita') + ''
      },
      {
        fieldId: 'cidade_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'cidade_visita') + ''
      },
      {
        fieldId: 'cod_cidade_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'cod_cidade_visita') + ''
      },
      {
        fieldId: 'uf_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'uf_visita') + ''
      },
      {
        fieldId: 'cod_uf_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'cod_uf_visita') + ''
      },
      {
        fieldId: 'cod_pais_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'cod_pais_visita') + ''
      },
      {
        fieldId: 'cidade_uf_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'cidade_uf_visita') + ''
      },
      {
        fieldId: 'solicitante_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'solicitante_visita') + ''
      },
      {
        fieldId: 'email_solicitante_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'email_solicitante_visita') + ''
      },
      {
        fieldId: 'id_solicitante_visita___' + parseInt(i + 1),
        value: dsVisitas.getValue(i, 'id_solicitante_visita') + ''
      }
    );
  }

  var cTablename = DatasetFactory.createConstraint('tablename', 'tabela_cidades', 'tabela_cidades', ConstraintType.MUST);
  var dsCidades = DatasetFactory.getDataset('ds_ReservasSalas', null, [cTablename, cDocumentId, cActive], null);
  for (var i = 0; i < dsCidades.rowsCount; i++) {
    fields.push(
      {
        fieldId: 'nome_cidade___' + parseInt(i + 1),
        value: dsCidades.getValue(i, 'nome_cidade') + ''
      },
      {
        fieldId: 'cidade_uf___' + parseInt(i + 1),
        value: dsCidades.getValue(i, 'cidade_uf') + ''
      },
      {
        fieldId: 'cod___' + parseInt(i + 1),
        value: dsCidades.getValue(i, 'cod') + ''
      },
      {
        fieldId: 'cod___' + parseInt(i + 1),
        value: dsCidades.getValue(i, 'cod') + ''
      },
      {
        fieldId: 'cod_pais___' + parseInt(i + 1),
        value: dsCidades.getValue(i, 'cod_pais') + ''
      },
      {
        fieldId: 'cod_uf___' + parseInt(i + 1),
        value: dsCidades.getValue(i, 'cod_uf') + ''
      },
      {
        fieldId: 'data_prevista___' + parseInt(i + 1),
        value: dsCidades.getValue(i, 'data_prevista') + ''
      },
      {
        fieldId: 'id_itinerario___' + parseInt(i + 1),
        value: dsCidades.getValue(i, 'id_itinerario') + ''
      },
      {
        fieldId: 'uf___' + parseInt(i + 1),
        value: dsCidades.getValue(i, 'uf') + ''
      }
    );
  }

  var cTablename = DatasetFactory.createConstraint('tablename', 'tabela_parceiros', 'tabela_parceiros', ConstraintType.MUST);
  var dsParceiros = DatasetFactory.getDataset('ds_ReservasSalas', null, [cTablename, cDocumentId, cActive], null);
  for (var i = 0; i < dsParceiros.rowsCount; i++) {
    fields.push(
      {
        fieldId: 'codigo_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'codigo_parceiro') + ''
      },
      {
        fieldId: 'nome_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'nome_parceiro') + ''
      },
      {
        fieldId: 'local_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'local_parceiro') + ''
      },
      {
        fieldId: 'codigo_cupom___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'codigo_cupom') + ''
      },
      {
        fieldId: 'data_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'data_parceiro') + ''
      },
      {
        fieldId: 'contato_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'contato_parceiro') + ''
      },
      {
        fieldId: 'telefone_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'telefone_parceiro') + ''
      },
      {
        fieldId: 'cidade_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'cidade_parceiro') + ''
      },
      {
        fieldId: 'cod_cidade_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'cod_cidade_parceiro') + ''
      },
      {
        fieldId: 'uf_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'uf_parceiro') + ''
      },
      {
        fieldId: 'cod_uf_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'cod_uf_parceiro') + ''
      },
      {
        fieldId: 'cod_pais_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'cod_pais_parceiro') + ''
      },
      {
        fieldId: 'cidade_uf_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'cidade_uf_parceiro') + ''
      },
      {
        fieldId: 'interesse_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'interesse_parceiro') + ''
      },
      {
        fieldId: 'area_interesse_parceiro___' + parseInt(i + 1),
        value: dsParceiros.getValue(i, 'area_interesse_parceiro') + ''
      }
    );
  }

  fields.push(
    {
      fieldId: 'codigo_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('num_solic') + ''
    },
    {
      fieldId: 'nome_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('nome') + ''
    },
    {
      fieldId: 'local_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('local_parceiro') + ''
    },
    {
      fieldId: 'codigo_cupom___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('codigo_cupom') + ''
    },
    {
      fieldId: 'data_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('data_parceiro') + ''
    },
    {
      fieldId: 'contato_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('contato') + ''
    },
    {
      fieldId: 'telefone_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('telefone') + ''
    },
    {
      fieldId: 'cidade_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('cidade') + ''
    },
    {
      fieldId: 'cod_cidade_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('cod_cidade') + ''
    },
    {
      fieldId: 'uf_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('uf') + ''
    },
    {
      fieldId: 'cod_uf_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('cod_uf') + ''
    },
    {
      fieldId: 'cod_pais_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('cod_pais') + ''
    },
    {
      fieldId: 'cidade_uf_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('cidade_uf') + ''
    },
    {
      fieldId: 'interesse_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('interesse') + ''
    },
    {
      fieldId: 'area_interesse_parceiro___' + parseInt(dsParceiros.rowsCount + 1),
      value: hAPI.getCardValue('area_interesse') + ''
    }
  );

  return fields;
}
