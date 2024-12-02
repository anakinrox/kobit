function defineStructure() {}
function onSync(lastSyncDate) {}

function createDataset(fields, constraints, sortFields) {
	log.info( "##INICIANDO O DATASET CLIENT_REST## ");
	var cliente = '003138281000131';
	
	log.info( "passo 0001 ");
	
	if (constraints != null) {			
        for (var i = 0; i < constraints.length; i++) {
    		if ( constraints[i].fieldName == 'cod_cliente' ){
    				cliente = constraints[i].initialValue;
    		}
        }
	}
	
	log.info( "passo 0002 ");	
	var dataset = DatasetBuilder.newDataset();
	
	dataset.addColumn( "bairro" );
	dataset.addColumn( "cod_cliente" );
	dataset.addColumn( "cod_class" );
	dataset.addColumn( "nom_cliente" );
	dataset.addColumn( "end_cliente" );
	dataset.addColumn( "den_bairro" );
	dataset.addColumn( "cod_cidade" );
	dataset.addColumn( "cod_cep" );
	dataset.addColumn( "num_caixa_postal" );
	dataset.addColumn( "num_telefone" );
	dataset.addColumn( "num_fax" );
	dataset.addColumn( "num_telex" );
	dataset.addColumn( "num_suframa" );
	dataset.addColumn( "cod_tip_cli" );
	dataset.addColumn( "den_marca" );
	dataset.addColumn( "nom_reduzido" );
	dataset.addColumn( "den_frete_posto" );
	dataset.addColumn( "num_cgc_cpf" );
	dataset.addColumn( "ins_estadual" );
	dataset.addColumn( "cod_portador" );
	dataset.addColumn( "ies_tip_portador" );
	dataset.addColumn( "cod_cliente_matriz" );
	dataset.addColumn( "cod_consig" );
	dataset.addColumn( "ies_cli_forn" );
	dataset.addColumn( "ies_zona_franca" );
	dataset.addColumn( "ies_situacao" );
	dataset.addColumn( "cod_rota" );
	dataset.addColumn( "cod_praca" );
	dataset.addColumn( "dat_cadastro" );
	dataset.addColumn( "dat_atualiz" );
	dataset.addColumn( "nom_contato" );
	dataset.addColumn( "dat_fundacao" );
	dataset.addColumn( "cod_local" );
	dataset.addColumn( "correio_eletronico" );
	dataset.addColumn( "correi_eletr_secd" );
	dataset.addColumn( "correi_eletr_venda" );
	dataset.addColumn( "endereco_web" );
	dataset.addColumn( "telefone_2" );
	dataset.addColumn( "compl_endereco" );
	dataset.addColumn( "tip_logradouro" );
	dataset.addColumn( "num_iden_lograd" );
	dataset.addColumn( "iden_estrangeiro" );
	dataset.addColumn( "ies_contrib_ipi" );
	dataset.addColumn( "ies_fis_juridica" );
	dataset.addColumn( "cod_uni_feder" );
	dataset.addColumn( "cod_pais" );
	dataset.addColumn( "nom_guerra" );
	dataset.addColumn( "cod_cidade_pgto" );
	dataset.addColumn( "camara_comp" );
	dataset.addColumn( "cod_banco" );
	dataset.addColumn( "num_agencia" );
	dataset.addColumn( "num_conta_banco" );
	dataset.addColumn( "tmp_transpor" );
	dataset.addColumn( "tex_observ" );
	dataset.addColumn( "num_lote_transf" );
	dataset.addColumn( "pct_aceite_div" );
	dataset.addColumn( "ies_tip_entrega" );
	dataset.addColumn( "ies_dep_cred" );
	dataset.addColumn( "ult_num_coleta" );
	dataset.addColumn( "ies_gera_ap" );
	dataset.addColumn( "end_cobr" );
	dataset.addColumn( "den_bairro_end_cob" );
	dataset.addColumn( "cod_cidade_end_cob" );
	dataset.addColumn( "cod_cep_end_cob" );
	dataset.addColumn( "cod_nivel_1" );
	dataset.addColumn( "cod_nivel_2" );
	dataset.addColumn( "cod_nivel_3" );
	dataset.addColumn( "cod_nivel_4" );
	dataset.addColumn( "cod_nivel_5" );
	dataset.addColumn( "cod_nivel_6" );
	dataset.addColumn( "cod_nivel_7" );
	dataset.addColumn( "ies_nivel" );
	dataset.addColumn( "cod_tip_carteira" );
	dataset.addColumn( "cod_mercado" );
	dataset.addColumn( "cod_continente" );
	dataset.addColumn( "cod_regiao" );
	dataset.addColumn( "qtd_dias_atr_dupl" );
	dataset.addColumn( "qtd_dias_atr_med" );
	dataset.addColumn( "val_ped_carteira" );
	dataset.addColumn( "val_dup_aberto" );
	dataset.addColumn( "dat_ult_fat" );
	dataset.addColumn( "val_limite_cred" );
	dataset.addColumn( "dat_val_lmt_cr" );
	dataset.addColumn( "ies_nota_debito" );
	dataset.addColumn( "logradouro" );
	dataset.addColumn( "logradouro_end_cob" );
	dataset.addColumn( "num_iden_lograd_end_cob" );
	dataset.addColumn( "tip_logradouro_end_cob" );
	dataset.addColumn( "bairro_cobr_entga" );
	dataset.addColumn( "complemento_endereco_end_cob" );
	dataset.addColumn( "email_cob" );
	dataset.addColumn( "lista_mail" );
	dataset.addColumn( "lista_contato" );
	dataset.addColumn( "lista_socio" );
			
	log.info( "passo 0003 ");
	
	try{
	    var clientService = fluigAPI.getAuthorizeClientService();
	    var data = {
	    	companyId : "1",
	        serviceCode : 'Logix_PRD',
	        endpoint : '/LOGIXREST/cerr3/cliente/'+cliente,
	        method : 'get' //'post', 'delete', 'patch', 'put', 'get'     
	    }
		log.info( "passo 0004 ");
    	
	    var vo = clientService.invoke( JSON.stringify( data ) );
	    
	    log.dir( vo );
	    
	    if(vo.getResult()== null || vo.getResult().isEmpty()){
	        throw new Exception("Retorno está vazio");
	    }else{
	    	log.info( "passo 0005 ");
	    	var jr = JSON.parse( vo.getResult() );
	    	
	    	log.info( "passo 0005 cliente_rest");
	    	
	    	log.dir( jr );
	    	
	    			var cli = new Array();
	    	log.info( "passo 0005 1");	    			
	    			cli.push( jr.data.bairro );
	    			cli.push( jr.data.cod_cliente );
	    			cli.push( jr.data.cod_class );
	    			cli.push( jr.data.nom_cliente );
	    			cli.push( jr.data.end_cliente );
	    			cli.push( jr.data.den_bairro );
	    			cli.push( jr.data.cod_cidade );
	    			cli.push( jr.data.cod_cep );
	    			cli.push( jr.data.num_caixa_postal );
	    			cli.push( jr.data.num_telefone );
	    			cli.push( jr.data.num_fax );
	    			cli.push( jr.data.num_telex );
	    	log.info( "passo 0005 2");
	    			cli.push( jr.data.num_suframa );
	    			cli.push( jr.data.cod_tip_cli );
	    			cli.push( jr.data.den_marca );
	    			cli.push( jr.data.nom_reduzido );
	    			cli.push( jr.data.den_frete_posto );
	    			cli.push( jr.data.num_cgc_cpf );
	    			
	    			if( jr.data.ins_estadual == "" || jr.data.ins_estadual == null || jr.data.ins_estadual == undefined ){
	    				cli.push( "ISENTO" );
	    			}else{
	    				cli.push( jr.data.ins_estadual );
	    			}
	    			cli.push( jr.data.cod_portador );
	    			cli.push( jr.data.ies_tip_portador );
	    			cli.push( jr.data.cod_cliente_matriz );
	    			cli.push( jr.data.cod_consig );
	    			cli.push( jr.data.ies_cli_forn );
	    			cli.push( jr.data.ies_zona_franca );
	    			cli.push( jr.data.ies_situacao );
	    			cli.push( jr.data.cod_rota );
	    			cli.push( jr.data.cod_praca );
	    			cli.push( jr.data.dat_cadastro );
	    			cli.push( jr.data.dat_atualiz );
	    			cli.push( jr.data.nom_contato );
	    			cli.push( jr.data.dat_fundacao );
	    			cli.push( jr.data.cod_local );
	    	log.info( "passo 0005 3");
	    			cli.push( jr.data.correio_eletronico );
	    			cli.push( jr.data.correi_eletr_secd );
	    			cli.push( jr.data.correi_eletr_venda );
	    			cli.push( jr.data.endereco_web );
	    			cli.push( jr.data.telefone_2 );
	    			cli.push( jr.data.compl_endereco );
	    			cli.push( jr.data.tip_logradouro );
	    			cli.push( jr.data.num_iden_lograd );
	    			cli.push( jr.data.iden_estrangeiro );
	    			cli.push( jr.data.ies_contrib_ipi );
	    			cli.push( jr.data.ies_fis_juridica );
	    			cli.push( jr.data.cod_uni_feder );
	    			cli.push( jr.data.cod_pais );
	    			cli.push( jr.data.nom_guerra );
	    			cli.push( jr.data.cod_cidade_pgto );
	    			cli.push( jr.data.camara_comp );
	    			cli.push( jr.data.cod_banco );
	    			cli.push( jr.data.num_agencia );
	    			cli.push( jr.data.num_conta_banco );
	    			cli.push( jr.data.tmp_transpor );
	    			cli.push( jr.data.tex_observ );
	    	log.info( "passo 0005 4");	    			
	    			cli.push( jr.data.num_lote_transf );
	    			cli.push( jr.data.pct_aceite_div );
	    			cli.push( jr.data.ies_tip_entrega );
	    			cli.push( jr.data.ies_dep_cred );
	    			cli.push( jr.data.ult_num_coleta );
	    			cli.push( jr.data.ies_gera_ap );
	    			cli.push( jr.data.end_cobr );
	    			cli.push( jr.data.den_bairro_end_cob );
	    			cli.push( jr.data.cod_cidade_end_cob );
	    			cli.push( jr.data.cod_cep_end_cob );
	    			cli.push( jr.data.cod_nivel_1 );
	    			cli.push( jr.data.cod_nivel_2 );
	    			cli.push( jr.data.cod_nivel_3 );
	    			cli.push( jr.data.cod_nivel_4 );
	    			cli.push( jr.data.cod_nivel_5 );
	    			cli.push( jr.data.cod_nivel_6 );
	    			cli.push( jr.data.cod_nivel_7 );
	    			cli.push( jr.data.ies_nivel );
	    			cli.push( jr.data.cod_tip_carteira );
	    			cli.push( jr.data.cod_mercado );
	    			cli.push( jr.data.cod_continente );
	    			cli.push( jr.data.cod_regiao );
	    			cli.push( jr.data.qtd_dias_atr_dupl );
	    			cli.push( jr.data.qtd_dias_atr_med );
	    	log.info( "passo 0005 5");
	    			cli.push( jr.data.val_ped_carteira );
	    			cli.push( jr.data.val_dup_aberto );
	    			cli.push( jr.data.dat_ult_fat );
	    			cli.push( jr.data.val_limite_cred );
	    			cli.push( jr.data.dat_val_lmt_cr );
	    			cli.push( jr.data.ies_nota_debito );
	    			cli.push( jr.data.logradouro );
	    	log.info( "passo 0005 6");
	    			cli.push( jr.data.logradouro_end_cob );
	    			cli.push( jr.data.num_iden_lograd_end_cob );
	    			cli.push( jr.data.tip_logradouro_end_cob );
	    			cli.push( jr.data.bairro_cobr_entga );
	    			cli.push( jr.data.complemento_endereco_end_cob );
	    	log.info( "passo 0005 7");
	    			log.info( 'TAMANHO... '+jr.data.parametro );
	    			if( jr.data.parametro != null )
	    				cli.push( jr.data.parametro.substring(306, 377) );
	    			else
	    				cli.push( '' );
	    			log.info( "passo 0005 A ");
	    			cli.push( JSON.stringify( jr.data.cli_emails ) );
	    			log.info( "passo 0005 B ");
	    			cli.push( JSON.stringify( jr.data.cli_contatos ) );
	    			log.info( "passo 0005 C ");
	    			cli.push( JSON.stringify( jr.data.credcad_socios ) );
	    			log.info( "passo 0005 D ");
	    			dataset.addRow( cli );
	        //}
	    	log.info( "passo 0007 ");
	    }
	} catch(err) {
	    throw err;
	}
	log.info( "passo 0008 ");
	return dataset;
	
}

function onMobileSync(user) {}
