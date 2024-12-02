const buscarUsuarios = async evento => {
  const { documentid } = evento;
  const tableName = DatasetFactory.createConstraint('tablename', 'tabela_usuario', 'tabela_usuario', ConstraintType.MUST);
  const active = DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST);
  const constraintDocumentId = DatasetFactory.createConstraint('documentid', documentid, documentid, ConstraintType.MUST);

  const constraints = [tableName, active, constraintDocumentId];

  const dsEventosUsuarios = await new Promise((success, error) =>
    DatasetFactory.getDataset('ds_cadastro_eventos', null, constraints, null, { success, error })
  );

  return dsEventosUsuarios.values;
};

const buscarParceiros = async evento => {
  const { documentid } = evento;
  const tableName = DatasetFactory.createConstraint('tablename', 'tabela_parceiro', 'tabela_parceiro', ConstraintType.MUST);
  const active = DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST);
  const constraintDocumentId = DatasetFactory.createConstraint('documentid', documentid, documentid, ConstraintType.MUST);

  const constraints = [tableName, active, constraintDocumentId];

  const dsEventosUsuarios = await new Promise((success, error) =>
    DatasetFactory.getDataset('ds_cadastro_eventos', null, constraints, null, { success, error })
  );

  return dsEventosUsuarios.values;
};

const buscarEventos = async () => {
  const dsEventosPrincipal = await new Promise((success, error) =>
    DatasetFactory.getDataset('ds_cadastro_eventos', null, [], null, { success, error })
  );

  const eventos = [];
  for (const evento of dsEventosPrincipal.values) {
    const usuariosPromise = buscarUsuarios(evento);
    const parceirosPromise = buscarParceiros(evento);

    const [usuarios, parceiros] = await Promise.all([usuariosPromise, parceirosPromise]);

    eventos.push({
      ...evento,
      usuarios,
      parceiros
    });
  }

  return eventos;
};

window.datasetUtils = { buscarEventos };
