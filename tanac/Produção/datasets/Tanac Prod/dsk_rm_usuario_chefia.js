function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

	
	var listaConstraits = {};
	
	listaConstraits['user'] = '';
	listaConstraits['chapa'] = '';
	
	if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
        	listaConstraits[ constraints[i].fieldName.trim() ] = constraints[i].initialValue;
        	log.info('fieldName.....'+constraints[i].fieldName+'...value....'+constraints[i].initialValue);
        }
    }
	log.info( 'Start dataset dsk_rm_usuario_chefia.js '+listaConstraits['user'] );
	
	if (listaConstraits['chapa'] == '') { listaConstraits['chapa']= '0000000159'; }
		
    var newDataset = DatasetBuilder.newDataset();
    
    var funcRM = {} 
    
    newDataset.addColumn( 'user_funcionario' );
    newDataset.addColumn( 'nome_funcionario' );
    newDataset.addColumn( 'login_funcionario' );
    newDataset.addColumn( 'matricula_funcionario' );

    newDataset.addColumn( 'user_coordenador' );
    newDataset.addColumn( 'nome_coordenador' );
    newDataset.addColumn( 'login_coordenador' );
    newDataset.addColumn( 'matricula_coordenador' );
    
    newDataset.addColumn( 'user_gerente' );
    newDataset.addColumn( 'nome_gerente' );
    newDataset.addColumn( 'login_gerente' );
    newDataset.addColumn( 'matricula_gerente' );

    newDataset.addColumn( 'user_diretor' );
    newDataset.addColumn( 'nome_diretor' );
    newDataset.addColumn( 'login_diretor' );
    newDataset.addColumn( 'matricula_diretor' );

    newDataset.addColumn( 'user_presidente' );
    newDataset.addColumn( 'nome_presidente' );
    newDataset.addColumn( 'login_presidente' );
    newDataset.addColumn( 'matricula_presidente' );
	
    newDataset.addColumn( 'user_chefe' );
    newDataset.addColumn( 'nome_chefe' );
    newDataset.addColumn( 'login_chefe' );
    newDataset.addColumn( 'matricula_chefe' );
    
    newDataset.addColumn( 'user_chefe2' );
    newDataset.addColumn( 'nome_chefe2' );
    newDataset.addColumn( 'login_chefe2' );
    newDataset.addColumn( 'matricula_chefe2' );
    
    var matriculaRm = '';
    
    if( listaConstraits['user'] != "" ){
		log.info('###### user ##### '+listaConstraits['user'] );
		var ctColleague = [];
		ctColleague.push( DatasetFactory.createConstraint("colleaguePK.companyId", "1", "1", ConstraintType.MUST) );
		ctColleague.push( DatasetFactory.createConstraint("colleaguePK.colleagueId", listaConstraits['user'], listaConstraits['user'], ConstraintType.MUST) );
		var dsColleague = DatasetFactory.getDataset("colleague", null, ctColleague, null);
		if (dsColleague != null && dsColleague.rowsCount > 0 ) {
			
			funcRM['user_funcionario'] = listaConstraits['user'];
			funcRM['nome_funcionario'] = dsColleague.getValue(0,"colleagueName");
			funcRM['login_funcionario'] = dsColleague.getValue(0,"login");
	
			log.info('###### login ##### '+dsColleague.getValue(0,"login"));
			
			var ctFicha = [ DatasetFactory.createConstraint("login_rede", dsColleague.getValue(0,"login"), dsColleague.getValue(0,"login"), ConstraintType.MUST),
							DatasetFactory.createConstraint("tipo", "Bloqueado", "Bloqueado", ConstraintType.MUST_NOT) ];
			var dsFicha = DatasetFactory.getDataset("ficha_habilitacao_atual ", null, ctFicha, null);
			if (dsFicha != null && dsFicha.rowsCount > 0 ) {
				log.info('###### dsFicha.rowsCount ##### '+dsFicha.rowsCount);
				matriculaRm = dsFicha.getValue(0,"matricula")+"";
			}
			funcRM['matricula_funcionario'] = matriculaRm; 
		}
    }else if( listaConstraits['chapa'] != "" ){
    	matriculaRm = listaConstraits['chapa'];
    	funcRM['matricula_funcionario'] = matriculaRm; 
    }
    
    if( matriculaRm != "" ){
    	
    	var arr = new Array();
    	
		log.info('###### matriculaRm ##### '+matriculaRm);
		matriculaRm = org.apache.commons.lang3.StringUtils.leftPad(matriculaRm, 10, "0");
		log.info('###### matriculaRm ##### '+matriculaRm);
		var ctChefeRM = [ DatasetFactory.createConstraint("CHAPA", matriculaRm, matriculaRm, ConstraintType.MUST) ];
		var dsChefeRM = DatasetFactory.getDataset("rm_func_nivel_chefia_imediata ", null, ctChefeRM, null);
		
		if (dsChefeRM != null && dsChefeRM.rowsCount > 0 ) {
			
			if( listaConstraits['chapa'] != "" ){
				funcRM['user_funcionario'] = "";
				funcRM['nome_funcionario'] = dsChefeRM.getValue(0,"NOME");
				funcRM['login_funcionario'] = "";
			}
			
			funcRM['nome_coordenador'] = dsChefeRM.getValue(0,"NOMECHEFE_N6");
			funcRM['matricula_coordenador'] = dsChefeRM.getValue(0,"CODCHEFE_N6");
				
			var matriculaChefe = dsChefeRM.getValue(0,"CODCHEFE_N6")+"";
			matriculaChefe = org.apache.commons.lang3.StringUtils.stripStart(matriculaChefe, "0");
			log.info('###### matriculaChefe ##### '+matriculaChefe );
			var ctFicha = [ DatasetFactory.createConstraint("matricula", matriculaChefe, matriculaChefe, ConstraintType.MUST) ];
			var dsFicha = DatasetFactory.getDataset("ficha_habilitacao_atual ", null, ctFicha, null);
			if (dsFicha != null && dsFicha.rowsCount > 0 ) {
				log.info('###### dsFicha.rowsCount ##### '+dsFicha.rowsCount);
				login = dsFicha.getValue(0,"login_rede");
				funcRM['login_coordenador'] = login;
				log.info('###### login ##### '+login );
				var ctColleague = [];
				ctColleague.push( DatasetFactory.createConstraint("colleaguePK.companyId", "1", "1", ConstraintType.MUST) );
				ctColleague.push( DatasetFactory.createConstraint("login", login, login, ConstraintType.MUST) );
				var dsColleague = DatasetFactory.getDataset("colleague", null, ctColleague, null);
				if (dsColleague != null && dsColleague.rowsCount > 0 ) {
					log.info('###### user_gerente ##### '+dsColleague.getValue(0,"colleaguePK.colleagueId") );
					funcRM['user_coordenador'] = dsColleague.getValue(0,"colleaguePK.colleagueId");
				}
			}
			
			funcRM['nome_gerente'] = dsChefeRM.getValue(0,"NOMECHEFE_N4");
			funcRM['matricula_gerente'] = dsChefeRM.getValue(0,"CODCHEFE_N4");
				
			var matriculaChefe = dsChefeRM.getValue(0,"CODCHEFE_N4")+"";
			matriculaChefe = org.apache.commons.lang3.StringUtils.stripStart(matriculaChefe, "0");
			log.info('###### matriculaChefe ##### '+matriculaChefe );
			var ctFicha = [ DatasetFactory.createConstraint("matricula", matriculaChefe, matriculaChefe, ConstraintType.MUST) ];
			var dsFicha = DatasetFactory.getDataset("ficha_habilitacao_atual ", null, ctFicha, null);
			if (dsFicha != null && dsFicha.rowsCount > 0 ) {
				log.info('###### dsFicha.rowsCount ##### '+dsFicha.rowsCount);
				login = dsFicha.getValue(0,"login_rede");
				funcRM['login_gerente'] = login;
				log.info('###### login ##### '+login );
				var ctColleague = [];
				ctColleague.push( DatasetFactory.createConstraint("colleaguePK.companyId", "1", "1", ConstraintType.MUST) );
				ctColleague.push( DatasetFactory.createConstraint("login", login, login, ConstraintType.MUST) );
				var dsColleague = DatasetFactory.getDataset("colleague", null, ctColleague, null);
				if (dsColleague != null && dsColleague.rowsCount > 0 ) {
					log.info('###### user_gerente ##### '+dsColleague.getValue(0,"colleaguePK.colleagueId") );
					funcRM['user_gerente'] = dsColleague.getValue(0,"colleaguePK.colleagueId");
				}
			}
			
			funcRM['nome_diretor'] = dsChefeRM.getValue(0,"NOMECHEFE_N3");
			funcRM['matricula_diretor'] = dsChefeRM.getValue(0,"CODCHEFE_N3");
				
			var matriculaChefe = dsChefeRM.getValue(0,"CODCHEFE_N3")+"";
			matriculaChefe = org.apache.commons.lang3.StringUtils.stripStart(matriculaChefe, "0");
			log.info('###### matriculaChefe ##### '+matriculaChefe );
			var ctFicha = [ DatasetFactory.createConstraint("matricula", matriculaChefe, matriculaChefe, ConstraintType.MUST) ];
			var dsFicha = DatasetFactory.getDataset("ficha_habilitacao_atual ", null, ctFicha, null);
			if (dsFicha != null && dsFicha.rowsCount > 0 ) {
				log.info('###### dsFicha.rowsCount ##### '+dsFicha.rowsCount);
				login = dsFicha.getValue(0,"login_rede");
				funcRM['login_diretor'] = login;
				log.info('###### login ##### '+login );
				var ctColleague = [];
				ctColleague.push( DatasetFactory.createConstraint("colleaguePK.companyId", "1", "1", ConstraintType.MUST) );
				ctColleague.push( DatasetFactory.createConstraint("login", login, login, ConstraintType.MUST) );
				var dsColleague = DatasetFactory.getDataset("colleague", null, ctColleague, null);
				if (dsColleague != null && dsColleague.rowsCount > 0 ) {
					log.info('###### user_gerente ##### '+dsColleague.getValue(0,"colleaguePK.colleagueId") );
					funcRM['user_diretor'] = dsColleague.getValue(0,"colleaguePK.colleagueId");
				}
			}
			
			funcRM['nome_presidente'] = dsChefeRM.getValue(0,"NOMECHEFE_N2");
			funcRM['matricula_presidente'] = dsChefeRM.getValue(0,"CODCHEFE_N2");
				
			var matriculaChefe = dsChefeRM.getValue(0,"CODCHEFE_N2")+"";
			matriculaChefe = org.apache.commons.lang3.StringUtils.stripStart(matriculaChefe, "0");
			log.info('###### matriculaChefe ##### '+matriculaChefe );
			var ctFicha = [ DatasetFactory.createConstraint("matricula", matriculaChefe, matriculaChefe, ConstraintType.MUST) ];
			var dsFicha = DatasetFactory.getDataset("ficha_habilitacao_atual ", null, ctFicha, null);
			if (dsFicha != null && dsFicha.rowsCount > 0 ) {
				log.info('###### dsFicha.rowsCount ##### '+dsFicha.rowsCount);
				login = dsFicha.getValue(0,"login_rede");
				funcRM['login_presidente'] = login;
				log.info('###### login ##### '+login );
				var ctColleague = [];
				ctColleague.push( DatasetFactory.createConstraint("colleaguePK.companyId", "1", "1", ConstraintType.MUST) );
				ctColleague.push( DatasetFactory.createConstraint("login", login, login, ConstraintType.MUST) );
				var dsColleague = DatasetFactory.getDataset("colleague", null, ctColleague, null);
				if (dsColleague != null && dsColleague.rowsCount > 0 ) {
					log.info('###### user_gerente ##### '+dsColleague.getValue(0,"colleaguePK.colleagueId") );
					funcRM['user_presidente'] = dsColleague.getValue(0,"colleaguePK.colleagueId");
				}
			}
			
			funcRM['nome_chefe'] = dsChefeRM.getValue(0,"NOMECHEFEIMEDIATO1");
			funcRM['matricula_chefe'] = dsChefeRM.getValue(0,"CODCHEFEIMEDIATO1");
				
			var matriculaChefe = dsChefeRM.getValue(0,"CODCHEFEIMEDIATO1")+"";
			matriculaChefe = org.apache.commons.lang3.StringUtils.stripStart(matriculaChefe, "0");
			log.info('###### matriculaChefe ##### '+matriculaChefe );
			var ctFicha = [ DatasetFactory.createConstraint("matricula", matriculaChefe, matriculaChefe, ConstraintType.MUST) ];
			var dsFicha = DatasetFactory.getDataset("ficha_habilitacao_atual ", null, ctFicha, null);
			if (dsFicha != null && dsFicha.rowsCount > 0 ) {
				log.info('###### dsFicha.rowsCount ##### '+dsFicha.rowsCount);
				login = dsFicha.getValue(0,"login_rede");
				funcRM['login_chefe'] = login;
				log.info('###### login ##### '+login );
				var ctColleague = [];
				ctColleague.push( DatasetFactory.createConstraint("colleaguePK.companyId", "1", "1", ConstraintType.MUST) );
				ctColleague.push( DatasetFactory.createConstraint("login", login, login, ConstraintType.MUST) );
				var dsColleague = DatasetFactory.getDataset("colleague", null, ctColleague, null);
				if (dsColleague != null && dsColleague.rowsCount > 0 ) {
					log.info('###### user_gerente ##### '+dsColleague.getValue(0,"colleaguePK.colleagueId") );
					funcRM['user_chefe'] = dsColleague.getValue(0,"colleaguePK.colleagueId");
				}
			}
			
			funcRM['nome_chefe2'] = dsChefeRM.getValue(0,"NOMECHEFEIMEDIATO2");
			funcRM['matricula_chefe2'] = dsChefeRM.getValue(0,"CODCHEFEIMEDIATO2");
				
			var matriculaChefe = dsChefeRM.getValue(0,"CODCHEFEIMEDIATO2")+"";
			matriculaChefe = org.apache.commons.lang3.StringUtils.stripStart(matriculaChefe, "0");
			log.info('###### matriculaChefe ##### '+matriculaChefe );
			var ctFicha = [ DatasetFactory.createConstraint("matricula", matriculaChefe, matriculaChefe, ConstraintType.MUST) ];
			var dsFicha = DatasetFactory.getDataset("ficha_habilitacao_atual ", null, ctFicha, null);
			if (dsFicha != null && dsFicha.rowsCount > 0 ) {
				log.info('###### dsFicha.rowsCount ##### '+dsFicha.rowsCount);
				login = dsFicha.getValue(0,"login_rede");
				funcRM['login_chefe2'] = login;
				log.info('###### login ##### '+login );
				var ctColleague = [];
				ctColleague.push( DatasetFactory.createConstraint("colleaguePK.companyId", "1", "1", ConstraintType.MUST) );
				ctColleague.push( DatasetFactory.createConstraint("login", login, login, ConstraintType.MUST) );
				var dsColleague = DatasetFactory.getDataset("colleague", null, ctColleague, null);
				if (dsColleague != null && dsColleague.rowsCount > 0 ) {
					log.info('###### user_gerente ##### '+dsColleague.getValue(0,"colleaguePK.colleagueId") );
					funcRM['user_chefe2'] = dsColleague.getValue(0,"colleaguePK.colleagueId");
				}
			}
			
		}
		arr.push( funcRM['user_funcionario'] );
		arr.push( funcRM['nome_funcionario'] );
		arr.push( funcRM['login_funcionario'] );
		arr.push( funcRM['matricula_funcionario'] );
		
		arr.push( funcRM['user_coordenador'] );
		arr.push( funcRM['nome_coordenador'] );
		arr.push( funcRM['login_coordenador'] );
		arr.push( funcRM['matricula_coordenador'] );
		
		arr.push( funcRM['user_gerente'] );
		arr.push( funcRM['nome_gerente'] );
		arr.push( funcRM['login_gerente'] );
		arr.push( funcRM['matricula_gerente'] );
		
		arr.push( funcRM['user_diretor'] );
		arr.push( funcRM['nome_diretor'] );
		arr.push( funcRM['login_diretor'] );
		arr.push( funcRM['matricula_diretor'] );
		
		arr.push( funcRM['user_presidente'] );
		arr.push( funcRM['nome_presidente'] );
		arr.push( funcRM['login_presidente'] );
		arr.push( funcRM['matricula_presidente'] );
		
		arr.push( funcRM['user_chefe'] );
		arr.push( funcRM['nome_chefe'] );
		arr.push( funcRM['login_chefe'] );
		arr.push( funcRM['matricula_chefe'] );
		
		arr.push( funcRM['user_chefe2'] );
		arr.push( funcRM['nome_chefe2'] );
		arr.push( funcRM['login_chefe2'] );
		arr.push( funcRM['matricula_chefe2'] );
		
		newDataset.addRow(arr);
		
	}
	
	return newDataset;
	
}function onMobileSync(user) 
{

}