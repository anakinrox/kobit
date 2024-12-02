var editForm = true;

function loadBody() {

	console.log('loadBody');

	loadDsCombo('empresa', 'selectTable', 'mtc_id', 'mtc_nome', 'dataBase,table,banco,mtc_proprietario_motorista', 'java:/jdbc/LogixDS,ptv_motorista_cadastro_mtc,informix,P', 'mtc_nome', 'S', 'N')

	// loadDadosMotorista();

	loadDadosDespesas();

	setMask();

}

var beforeSendValidate = function (numState, nextState) {

	var task = $('#task').val();

	// if (task == 4 || task == 0){
	// 	if ( $('#motorista').val() == '' ){
	// 		alert('Motorista não informados');
	// 		return false;
	// 	}
	// }

	return true;

}

function loadDadosMotorista() {

	// Desabilitado pois não existe mais a integração com sistema da Forge.
	return true;

	var cod_motorista = $('#cod_motorista').val();

	if (cod_motorista != '') {

		var constraints = new Array();
		constraints.push(DatasetFactory.createConstraint('mtc_id', cod_motorista, cod_motorista, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('table', 'ptv_motorista_cadastro_mtc', null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('banco', 'informix', null, ConstraintType.MUST));
		constraints.push(DatasetFactory.createConstraint('dataBase', 'java:/jdbc/LogixDS', null, ConstraintType.MUST));
		var fields = ['mtc_id', 'mtc_nome', 'mtc_cpf', 'mtc_situacao', 'mtc_email', 'mtc_telefone', 'mtc_numero_cnh', 'mtc_whatsapp', 'mtc_rua', 'mtc_numero_end', 'mtc_bairro', 'mtc_cidade'];
		var ds = DatasetFactory.getDataset('selectTable', fields, constraints, null);

		// console.log(ds.values);

		if (ds.values.length > 0) {
			$('#cod_motorista').val(ds.values[0].mtc_id);
			$('#nome_motorista').val(ds.values[0].mtc_nome);
			$('#cpf').val(ds.values[0].mtc_cpf);
			//			$('#ativo').val(ds.values[0].mtc_situacao);
			$('#email').val(ds.values[0].mtc_email);
			$('#telefone').val(ds.values[0].mtc_telefone.replace(' ', ''));
			$('#cnh').val(ds.values[0].mtc_numero_cnh);
			$('#whatsapp').val(ds.values[0].mtc_whatsapp.replace(' ', ''));
			$('#endereco').val(ds.values[0].mtc_rua + ', nº ' + ds.values[0].mtc_numero_end + ', bairro ' + ds.values[0].mtc_bairro + ', cidade ' + ds.values[0].mtc_cidade);
		}

	}

}

function validValPadrao(id) {

	var seq = $(id).attr('id').split('___')[1];

	console.log($(id).val());

	if ($(id).val() == 'N') {
		$('#valor_despesa___' + seq).val('');
		$('#valor_despesa___' + seq).removeAttr('readonly');
	}

	if ($(id).val() == 'S') {
		// $('#valor_despesa___'+ seq).val('');
		// $('#valor_despesa___'+ seq).removeAttr('readonly');

		loadValDespesa($('#cod_tipo_despesa___' + seq).val(), seq);

	}


}

function loadValDespesa(codigo, seq) {

	// console.log('entrou loadValDespesa')

	var tTipDesp = getTable('tipo_despesa_acerto_viagem', '');
	var tTipDespF = getTable('tipo_despesa_acerto_viagem', 'tbl_despesas');

	var SQL = "	select " +
		// "			sc.*, " +
		"			ts.* " +
		"	from " + tTipDesp + " sc " +
		"	join documento dc on (dc.cod_empresa = sc.companyid " +
		"			           and dc.nr_documento = sc.documentid " +
		" 			           and dc.nr_versao = sc.version) " +
		"	join " + tTipDespF + " ts on (ts.companyid = sc.companyid " +
		"			       		and ts.documentid = sc.documentid " +
		"			       		and ts.version = sc.version) " +
		"	where dc.versao_ativa = 1 " +
		"	  and sc.cod_tipo_despesa = '" + codigo + "'";

	// console.log('SQL...' + SQL);

	var constraints = new Array();
	constraints.push(DatasetFactory.createConstraint("SQL", SQL, SQL, ConstraintType.MUST));
	var dataSet = DatasetFactory.getDataset("select", null, constraints, null);

	// console.log(dataSet);

	var hoje = new Date();

	if (dataSet.values.length > 0) {
		for (var i = 0; i < dataSet.values.length; i++) {
			var dat_ini = toDate(dataSet.values[i]['dt_ini_desp']);
			var dat_fim = toDate(dataSet.values[i]['dt_fim_desp']);

			// console.log(dat_ini,dat_fim, hoje, dat_ini <= hoje, dat_fim >= hoje);

			if (dat_ini <= hoje && dat_fim >= hoje) {

				$('#valor_despesa___' + seq).val(dataSet.values[i]['valor_despesa']);
				$('#valor_despesa___' + seq).attr('readonly', 'true');
				$('#val_padrao___' + seq).val('S');
				return false;
			}
		}
	} else {

		$('#valor_despesa___' + seq).val('');
		$('#valor_despesa___' + seq).removeAttr('readonly');
		$('#val_padrao___' + seq).val('N');

	}
}

function loadDadosDespesas() {

	$("input[name^='cod_tipo_despesa___']").each(function () {
		var seq = $(this).attr('id').split('___')[1]
		// console.log('loadDadosDespesas', $(this).val(), seq);
		loadValDespesa($(this).val(), seq);
	});

}