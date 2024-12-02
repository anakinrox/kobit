var dataTable = null;
var dadosTbl = [];
var dataSet = null ;
var rContent = [];
var rHeader = [];

function loaddataTable(msg) {

  console.log('loaddataTable');
	
  // rContent = ['documentid','cod_setor','nome_setor','matricula','nome_usuario',
  //             'reacao_pessoas','questao1_1','resp1_1','questao1_2','resp1_2','questao1_3','resp1_3','questao1_4','resp1_4','total1',
  //             'posicao_pessoas','questao2_1','resp2_1','questao2_2','resp2_2','questao2_3','resp2_3','total2',
  //             'protecao_pessoas','questao3_1','resp3_1','questao3_2','resp3_2','questao3_3','resp3_3','questao3_4','resp3_4','questao3_5','resp3_5','questao3_6','resp3_6','questao3_7','resp3_7','total3',
  //             'ferramenta_equipamento','questao4_1','resp4_1','questao4_2','resp4_2','questao4_3','resp4_3','total4',
  //             'procedimentos','questao5_1','resp5_1','questao5_2','resp5_2','questao5_3','resp5_3','questao5_4','resp5_4','questao5_5','resp5_5','questao5_6','resp5_6','questao5_7','resp5_7','questao5_8','resp5_8',
  //                             'questao5_9','resp5_9','questao5_10','resp5_10','questao5_11','resp5_11','questao5_12','resp5_12','questao5_13','resp5_13','questao5_14','resp5_14','questao5_15','resp5_15',
  //                             'total5',
  //             'padrao_limpeza','questao6_1','resp6_1','questao6_2','resp6_2','questao6_3','resp6_3','total6',
  //             'data_refer','ts'];

  rContent = ['documentid','concatenado','matricula','nome_usuario',
              'reacao_pessoas','resp1_1','resp1_2','resp1_3','resp1_4','resp1_5','resp1_6',
              'posicao_pessoas','resp2_1','resp2_2','resp2_3','resp2_4','resp2_5','resp2_6','resp2_7','resp2_8',
              'protecao_pessoas','resp3_1','resp3_2','resp3_3','resp3_4','resp3_5','resp3_6','resp3_7',
              'ferramenta_equipamento','resp4_1','resp4_2','resp4_3',
              'procedimentos','resp5_1','resp5_2','resp5_3','resp5_4','resp5_5','resp5_6','resp5_7','resp5_8',
                              'resp5_9','resp5_10','resp5_11','resp5_12','resp5_13','resp5_14','resp5_15',
              'padrao_limpeza','resp6_1','resp6_2','resp6_3', 
              'obs2','obs3','terceiro','pessoas_obs','desvios_obs','obs1', 'anexo',
              'data_refer','ts'];

  rHeader = [ {'title': 'Documento','dataorder':'documentid','width':'0%'},
              {'title': 'Concatenado','dataorder': 'concatenado','width':'25%' },
              {'title': 'Código Usuário','display': false,'width':'0%'},
              {'title': 'Usuário','dataorder': 'nome_usuario','width':'25%' },
              {'title': 'Reação Pessoas','dataorder': 'reacao_pessoas','width':'7%' },
              // {'title': 'Questão1_1','display': false,'width':'0%'},
              {'title': 'Mudando de posição','display': false,'width':'0%'},
              // {'title': 'Questão1_2','display': false,'width':'0%'},
              {'title': 'Parando o serviço','display': false,'width':'0%'},
              // {'title': 'Questão1_2','display': false,'width':'0%'},
              {'title': 'Ajustando EPI','display': false,'width':'0%'},
              // {'title': 'Questão1_3','display': false,'width':'0%'},
              {'title': 'Adequando Serviço','display': false,'width':'0%'},
              // {'title': 'Questão1_4','display': false,'width':'0%'},
              {'title': 'Fazendo o aterramento','display': false,'width':'0%'},
              // {'title': 'Questão1_2','display': false,'width':'0%'},
              {'title': 'Bloqueando o equipamento','display': false,'width':'0%'},
              // {'title': 'Total1','display': false,'width':'0%'},
              {'title': 'Posição Pessoas','dataorder': 'posicao_pessoas','width':'7%' },
              // {'title': 'Questão2_1','display': false,'width':'0%'},
              {'title': 'Bater contra ou ser atingido por','display': false,'width':'0%'},
              // {'title': 'Questão2_2','display': false,'width':'0%'},
              {'title': 'Preso em, Sobre ou Entre Objetos','display': false,'width':'0%'},
              {'title': 'Risco de queda','display': false,'width':'0%'},
              {'title': 'Contato com temperaturas extremas','display': false,'width':'0%'},
              {'title': 'Em contato com corrente elétrica','display': false,'width':'0%'},
              {'title': 'Inalar, absorver ou ingerir uma substância / materiais perigosos','display': false,'width':'0%'},
              {'title': 'Fazendo movimentos repetitivos','display': false,'width':'0%'},
              // {'title': 'Questão2_3','display': false,'width':'0%'},
              {'title': 'Postura inadequada ou estática','display': false,'width':'0%'},
              // {'title': 'Total2','display': false,'width':'0%'},
              {'title': 'Proteção Pessoas','dataorder': 'protecao_pessoas','width':'7%' },
              // {'title': 'Questão3_1','display': false,'width':'0%'},
              {'title': 'Cabeça','display': false,'width':'0%'},
              // {'title': 'Questão3_2','display': false,'width':'0%'},
              {'title': 'Olhos e Face','display': false,'width':'0%'},
              // {'title': 'Questão3_3','display': false,'width':'0%'},
              {'title': 'Sistema Respiratório','display': false,'width':'0%'},
              // {'title': 'Questão3_4','display': false,'width':'0%'},
              {'title': 'Ouvidos','display': false,'width':'0%'},
              // {'title': 'Questão3_5','display': false,'width':'0%'},
              {'title': 'Mãos e Braços','display': false,'width':'0%'},
              // {'title': 'Questão3_6','display': false,'width':'0%'},
              {'title': 'Tronco','display': false,'width':'0%'},
              // {'title': 'Questão3_7','display': false,'width':'0%'},
              {'title': 'Pés e Pernas','display': false,'width':'0%'},
              // {'title': 'Total3','display': false,'width':'0%'},
              {'title': 'Ferra. Equip.','dataorder': 'ferramenta_equipamento','width':'7%' },
              // {'title': 'Questão4_1','display': false,'width':'0%'},
              {'title': 'Inadequada para o trabalho','display': false,'width':'0%'},
              // {'title': 'Questão4_2','display': false,'width':'0%'},
              {'title': 'Usados Incorretamente','display': false,'width':'0%'},
              // {'title': 'Questão4_3','display': false,'width':'0%'},
              {'title': 'Em condições inseguras','display': false,'width':'0%'},
              // {'title': 'Total4','display': false,'width':'0%'},
              {'title': 'Procedimentos','dataorder': 'procedimentos','width':'7%' },
              // {'title': 'Questão5_1','display': false,'width':'0%'},
              {'title': 'Inadequados','display': false,'width':'0%'},
              // {'title': 'Questão5_2','display': false,'width':'0%'},
              {'title': 'Indisponíveis / Desconhecidos','display': false,'width':'0%'},
              // {'title': 'Questão5_3','display': false,'width':'0%'},
              {'title': 'Não entendidos / Não seguidos','display': false,'width':'0%'},
              // {'title': 'Questão5_4','display': false,'width':'0%'},
              {'title': 'Checklist do veículo','display': false,'width':'0%'},
              // {'title': 'Questão5_5','display': false,'width':'0%'},
              {'title': 'Regulagem de espelhos','display': false,'width':'0%'},
              // {'title': 'Questão5_6','display': false,'width':'0%'},
              {'title': 'Documentação do veículo','display': false,'width':'0%'},
              // {'title': 'Questão5_7','display': false,'width':'0%'},
              {'title': 'Manter distância segura (3s)','display': false,'width':'0%'},
              // {'title': 'Questão5_8','display': false,'width':'0%'},
              {'title': 'Respeitar velocidade da via','display': false,'width':'0%'},
              // {'title': 'Questão5_9','display': false,'width':'0%'},
              {'title': 'Uso do celular ao volante','display': false,'width':'0%'},
              // {'title': 'Questão5_10','display': false,'width':'0%'},
              {'title': 'Respeitar pedestres','display': false,'width':'0%'},
              // {'title': 'Questão5_11','display': false,'width':'0%'},
              {'title': 'Ajustar-se a condições climáticas','display': false,'width':'0%'},
              // {'title': 'Questão5_12','display': false,'width':'0%'},
              {'title': 'Utilizar as duas mãos ao volante','display': false,'width':'0%'},
              // {'title': 'Questão5_13','display': false,'width':'0%'},
              {'title': 'Condições de Ultrapassagens','display': false,'width':'0%'},
              // {'title': 'Questão5_14','display': false,'width':'0%'},
              {'title': 'Procedimento com presença de animais','display': false,'width':'0%'},
              // {'title': 'Questão5_15','display': false,'width':'0%'},
              {'title': 'Indicação para mudança de pista','display': false,'width':'0%'},
              // {'title': 'Total5','display': false,'width':'0%'},
              {'title': 'Padrão Limpeza','dataorder': 'padrao_limpeza','width':'7%' },
              // {'title': 'Questão6_1','display': false,'width':'0%'},
              {'title': 'Local ou Veículo Sujo','display': false,'width':'0%'},
              // {'title': 'Questão6_2','display': false,'width':'0%'},
              {'title': 'Local ou Veículo Desorganizado','display': false,'width':'0%'},
              // {'title': 'Questão6_3','display': false,'width':'0%'},
              {'title': 'Local ou Veículo com poluição ambiental','display': false,'width':'0%'},
              // {'title': 'Total6','display': false,'width':'0%'},
              {'title': 'Reconhecimento de Trabalho Seguro','display': false,'width':'0%'},
              {'title': 'Condição Insegura','display': false,'width':'0%'},
              {'title': 'Terceiro','dataorder': 'terceiro','width':'8%'},
              {'title': 'N º Pessoas Observadas','display': false,'width':'0%'},
              {'title': 'N º Desvios Observados','display': false,'width':'0%'},
              {'title': 'Descrição dos desvios comportamentais/Ações Recomendadas','display': false,'width':'0%'},
              {'title': 'Anexo','display': false,'width':'0%'},
              {'title': 'Data','dataorder': 'data_refer','width':'8%' },
              {'title': '','width':'0%'},
	          ];
	
  dataTable = FLUIGC.datatable('#table_'+$this.instanceId, {
	dataRequest: dadosTbl,
	renderContent: rContent,
	limit:10,
	responsive: true,
	tableStyle:'table table-striped table-responsive',
	emptyMessage: '<div class="text-center">Utilize o filtro para exibir dados!</div>',
	header: rHeader,			  	
    search: {
    	enabled: false,
      onSearch: function(res) {
        console.log( res );
          var data = dadosTbl;
          var search = data.filter(function(el) {
              return (el.nome_setor.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                      el.nome_usuario.toUpperCase().indexOf(res.toUpperCase()) >= 0 || 
                      el.data_refer.toUpperCase().indexOf(res.toUpperCase()) >= 0  ) 
          });
          dataTable.reload(search);
      },
      onlyEnterkey: false,
      searchAreaStyle: 'col-md-3'
    },
	scroll: {
				target: '#table_'+$this.instanceId,
				enabled: false
			},
	navButtons: {
				enabled: false,
			},
	draggable: {
				enabled: false
			},

	}, function(err, data) {
		if (err) {
				FLUIGC.toast({
					message: err,
					type: 'danger'
				});
			}else
			{
			}
	});
}

function loadDados() {
  
  console.log('loadDados');

  dadosTbl = [];

  var tPai = getTable('stop','');
  var tFilho1 = getTable('stop','reacao_pessoas');
  var tFilho2 = getTable('stop','posicao_pessoas');
  var tFilho3 = getTable('stop','protecao_pessoas');
  var tFilho4 = getTable('stop','ferramenta_equipamento');
  var tFilho5 = getTable('stop','procedimentos');
  var tFilho6 = getTable('stop','padrao_limpeza');

  var SQL = 

          "  select "+
          "  sc.documentid, "+
          // "    sc.cod_setor, "+
          // "    sc.nome_setor, "+
          "    sc.concatenado, "+
          "    sc.data_refer, "+
          "    u.COD_MATR_REQUISIT, "+
          "    ra.FULL_NAME, "+
          "    isnull((select it1.resp1 from "+ tFilho1 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao1 = 'Mudando de posição') ),'0') resp1_1, "+
          "    isnull((select it1.resp1 from "+ tFilho1 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao1 = 'Parando o serviço') ),'0') resp1_2, "+
          "    isnull((select it1.resp1 from "+ tFilho1 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao1 = 'Ajustando EPI') ),'0') resp1_3, "+
          "    isnull((select it1.resp1 from "+ tFilho1 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao1 = 'Adequando Serviço') ),'0') resp1_4, "+
          "    isnull((select it1.resp1 from "+ tFilho1 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao1 = 'Fazendo o aterramento') ),'0') resp1_5, "+
          "    isnull((select it1.resp1 from "+ tFilho1 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao1 = 'Bloqueando o equipamento') ),'0') resp1_6, "+
          // "    (select ROUND(AVG(cast(it1.resp1 as int)),2) from "+ tFilho1 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) media1, "+
          "    isnull((select SUM(cast(it1.resp1 as int)) from "+ tFilho1 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),0) total1, "+
              
          "    isnull((select it1.resp2 from "+ tFilho2 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao2 = 'Bater contra ou ser atingido por') ),'0') resp2_1, "+
          "    isnull((select it1.resp2 from "+ tFilho2 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao2 = 'Preso em, Sobre ou Entre Objetos') ),'0') resp2_2, "+
          "    isnull((select it1.resp2 from "+ tFilho2 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao2 = 'Risco de queda') ),'0') resp2_3, "+
          "    isnull((select it1.resp2 from "+ tFilho2 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao2 = 'Contato com temperaturas extremas') ),'0') resp2_4, "+
          "    isnull((select it1.resp2 from "+ tFilho2 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao2 = 'Em contato com corrente elétrica') ),'0') resp2_5, "+
          "    isnull((select it1.resp2 from "+ tFilho2 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao2 = 'Inalar, absorver ou ingerir uma substância / materiais perigosos') ),'0') resp2_6, "+
          "    isnull((select it1.resp2 from "+ tFilho2 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao2 = 'Fazendo movimentos repetitivos') ),'0') resp2_7  , "+
          "    isnull((select it1.resp2 from "+ tFilho2 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao2 = 'Postura inadequada ou estática') ),'0') resp2_8, "+
          // "    (select ROUND(AVG(cast(it1.resp2 as int)),2) from "+ tFilho2 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) media2, "+
          "    isnull((select SUM(cast(it1.resp2 as int)) from "+ tFilho2 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),0) total2, "+
              
          "    isnull((select it1.resp3 from "+ tFilho3 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao3 = 'Cabeça') ),'0') resp3_1, "+
          "    isnull((select it1.resp3 from "+ tFilho3 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao3 = 'Olhos e Face') ),'0') resp3_2, "+
          "    isnull((select it1.resp3 from "+ tFilho3 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao3 = 'Sistema Respiratório') ),'0') resp3_3, "+
          "    isnull((select it1.resp3 from "+ tFilho3 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao3 = 'Ouvidos') ),'0') resp3_4, "+
          "    isnull((select it1.resp3 from "+ tFilho3 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao3 = 'Mãos e Braços') ),'0') resp3_5, "+
          "    isnull((select it1.resp3 from "+ tFilho3 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao3 = 'Tronco') ),'0') resp3_6, "+
          "    isnull((select it1.resp3 from "+ tFilho3 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao3 = 'Pés e Pernas') ),'0') resp3_7, "+
          // "    (select ROUND(AVG(cast(it1.resp3 as int)),2) from "+ tFilho3 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) media3, "+
          "    isnull((select SUM(cast(it1.resp3 as int)) from "+ tFilho3 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),0) total3, "+
              
          "    isnull((select it1.resp4 from "+ tFilho4 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao4 = 'Inadequada para o trabalho') ),'0') resp4_1, "+
          "    isnull((select it1.resp4 from "+ tFilho4 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao4 = 'Usados Incorretamente') ),'0') resp4_2, "+
          "    isnull((select it1.resp4 from "+ tFilho4 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao4 = 'Em condições inseguras') ),'0') resp4_3, "+
          // "    (select ROUND(AVG(cast(it1.resp4 as int)),2) from "+ tFilho4 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) media4, "+
          "    isnull((select SUM(cast(it1.resp4 as int)) from "+ tFilho4 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),0) total4, "+
              
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Inadequados') ),'0') resp5_1, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Indisponíveis / Desconhecidos') ),'0') resp5_2, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Não entendidos / Não seguidos') ),'0') resp5_3, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Checklist do veículo') ),'0') resp5_4, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Regulagem de espelhos') ),'0') resp5_5, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'DOcumentação do veículo') ),'0') resp5_6, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Manter distância segura (3s)') ),'0') resp5_7, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Respeitar velocidade da via') ),'0') resp5_8, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Uso do celular ao volante') ),'0') resp5_9, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Respeitar pedestres') ),'0') resp5_10, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Ajustar-se a condições climáticas') ),'0') resp5_11, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Utilizar as duas mãos ao volante') ),'0') resp5_12, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Condições de Ultrapassagens') ),'0') resp5_13, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Procedimento com presença de animais') ),'0') resp5_14, "+
          "    isnull((select it1.resp5 from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao5 = 'Indicação para mudança de pista') ),'0') resp5_15, "+
          // "    (select ROUND(AVG(cast(it1.resp5 as int)),2) from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) media5, "+
          "    isnull((select SUM(cast(it1.resp5 as int)) from "+ tFilho5 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),0) total5, "+
              
          "    isnull((select it1.resp6 from "+ tFilho6 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao6 = 'Local ou Veículo Sujo') ),'0') resp6_1, "+
          "    isnull((select it1.resp6 from "+ tFilho6 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao6 = 'Local ou Veículo Desorganizado') ),'0') resp6_2, "+
          "    isnull((select it1.resp6 from "+ tFilho6 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version and it1.questao6 = 'Local ou Veículo com poluição ambiental') ),'0') resp6_3,     "+
          // "    (select ROUND(AVG(cast(it1.resp6 as int)),2) from "+ tFilho6 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ) media6, "+
          "    isnull((select SUM(cast(it1.resp6 as int)) from "+ tFilho6 +" it1 where (it1.companyid = sc.companyid and it1.documentid = sc.documentid and it1.version = sc.version ) ),0) total6,     "+

          " sc.obs2, "+
          " sc.obs3, "+
          " case when sc.terceiro = 'on' "+
          "      then 'Sim' "+
          "      else 'Não' "+
          " end as terceiro, "+
          " sc.pessoas_obs, "+
          " sc.desvios_obs, "+
          " sc.obs1, "+
          " case when ( select count(*) from anexo_proces ap where NUM_PROCES = an.NUM_PROCES and NUM_SEQ_ANEXO != 1) > 0 "+
          "      then 'Sim' "+
          "      else 'Não' "+
          " end as anexo "+
          "from "+ tPai +" sc 	 "+
          "join documento dc on (dc.cod_empresa = sc.companyid and dc.nr_documento = sc.documentid and dc.nr_versao = sc.version) 	 "+
          "join anexo_proces an on (an.COD_EMPRESA = sc.companyid and an.NR_DOCUMENTO = sc.documentid) "+
          "join proces_workflow u on ( u.COD_EMPRESA = an.COD_EMPRESA and u.NUM_PROCES = an.NUM_PROCES )    "+
          "join fdn_usertenant na on (na.USER_CODE = u.COD_MATR_REQUISIT ) "+
          "join fdn_user ra on ( ra.USER_ID = na.USER_ID ) "+
          "where dc.versao_ativa = 1 "+
          "      and u.status <> 1  ";

  // Filtros table
  if( $('#zona_'+$this.instanceId ).val() != '' ){
    SQL += " and sc.zona = '"+ $('#zona_'+$this.instanceId ).val() +"' ";
  }

  if( $('#area_'+$this.instanceId ).val() != '' ){
    SQL += " and sc.area = '"+ $('#area_'+$this.instanceId ).val() +"' ";
  }

  if( $('#setor_'+$this.instanceId ).val() != '' ){
    SQL += " and sc.setor = '"+ $('#setor_'+$this.instanceId ).val() +"' ";
  }

  if( $('#matricula_'+$this.instanceId ).val() != '' ){
    SQL += " and u.COD_MATR_REQUISIT = '"+ $('#matricula_'+$this.instanceId ).val() +"' ";
  }

  if( $('#data_ini_'+$this.instanceId ).val() != '' && $('#data_fim_'+$this.instanceId ).val() != '' ){

	  var data_ini = $('#data_ini_'+$this.instanceId ).val().split('/').reverse().join('-');
      var data_fim = $('#data_fim_'+$this.instanceId ).val().split('/').reverse().join('-');
      //var data_ini = $('#data_ini_'+$this.instanceId ).val();
      //var data_fim = $('#data_fim_'+$this.instanceId ).val();

    SQL += " and case when charindex( '-', sc.data_refer ) <> 0 "+ 
        		"			then convert(datetime, sc.data_refer, 101) "+
        		"			else convert(datetime, sc.data_refer, 103) end between '" +data_ini+ "' and '"+data_fim+ "' ";
  }

  if( $('#doc_ini_'+$this.instanceId ).val() != '' && $('#doc_fim_'+$this.instanceId ).val() != '' ){
    SQL += " and sc.documentid between " +$('#doc_ini_'+$this.instanceId ).val()+ " and "+$('#doc_fim_'+$this.instanceId ).val()+ " ";
  }

  if( $('#terceiro_'+$this.instanceId ).val() == 'S' ){
    SQL += " and sc.terceiro = 'ON' ";
  }

  if( $('#terceiro_'+$this.instanceId ).val() == 'N' ){
    SQL += " and sc.terceiro != 'ON' ";
  }

  console.log( 'SQL.....', SQL );
  var constraints = new Array();
  constraints.push(DatasetFactory.createConstraint("SQL", SQL ,SQL, ConstraintType.MUST));
  constraints.push(DatasetFactory.createConstraint("DATABASE", 'java:/jdbc/FluigDS' ,null, ConstraintType.MUST));  
  dataSet = DatasetFactory.getDataset("select", null, constraints, null);

  console.log('dataSet...',dataSet);
  
  if( dataSet != null && dataSet != undefined ){
    
    for (var i = 0; i < dataSet.values.length; i++) {
      datatableRow = {
          documentid: dataSet.values[i]["documentid"],
          // cod_setor: dataSet.values[i]["cod_setor"],
          // nome_setor: dataSet.values[i]["nome_setor"],
          concatenado: dataSet.values[i]["concatenado"],
          matricula: dataSet.values[i]["cod_matr_requisit"],
          nome_usuario: dataSet.values[i]["full_name"],
          // reacao_pessoas: dataSet.values[i]["media1"],
          reacao_pessoas: dataSet.values[i]["total1"],
          // questao1_1: dataSet.values[i]["questao1_1"],
          resp1_1: dataSet.values[i]["resp1_1"],
          // questao1_2: dataSet.values[i]["questao1_2"],
          resp1_2: dataSet.values[i]["resp1_2"],
          // questao1_3: dataSet.values[i]["questao1_3"],
          resp1_3: dataSet.values[i]["resp1_3"],
          // questao1_4: dataSet.values[i]["questao1_4"],
          resp1_4: dataSet.values[i]["resp1_4"],
          resp1_5: dataSet.values[i]["resp1_5"],
          resp1_6: dataSet.values[i]["resp1_6"],
          // total1: dataSet.values[i]["total1"],
          // posicao_pessoas: dataSet.values[i]["media2"],
          posicao_pessoas: dataSet.values[i]["total2"],
          // questao2_1: dataSet.values[i]["questao2_1"],
          resp2_1: dataSet.values[i]["resp2_1"],
          // questao2_2: dataSet.values[i]["questao2_2"],
          resp2_2: dataSet.values[i]["resp2_2"],
          // questao2_3: dataSet.values[i]["questao2_3"],
          resp2_3: dataSet.values[i]["resp2_3"],
          resp2_4: dataSet.values[i]["resp2_4"],
          resp2_5: dataSet.values[i]["resp2_5"],
          resp2_6: dataSet.values[i]["resp2_6"],
          resp2_7: dataSet.values[i]["resp2_7"],
          resp2_8: dataSet.values[i]["resp2_8"],
          // total2: dataSet.values[i]["total2"],
          // protecao_pessoas: dataSet.values[i]["media3"],
          protecao_pessoas: dataSet.values[i]["total3"],
          // questao3_1: dataSet.values[i]["questao3_1"],
          resp3_1: dataSet.values[i]["resp3_1"],
          // questao3_2: dataSet.values[i]["questao3_2"],
          resp3_2: dataSet.values[i]["resp3_2"],
          // questao3_3: dataSet.values[i]["questao3_3"],
          resp3_3: dataSet.values[i]["resp3_3"],
          // questao3_4: dataSet.values[i]["questao3_4"],
          resp3_4: dataSet.values[i]["resp3_4"],
          // questao3_5: dataSet.values[i]["questao3_5"],
          resp3_5: dataSet.values[i]["resp3_5"],
          // questao3_6: dataSet.values[i]["questao3_6"],
          resp3_6: dataSet.values[i]["resp3_6"],
          // questao3_7: dataSet.values[i]["questao3_7"],
          resp3_7: dataSet.values[i]["resp3_7"],
          // total3: dataSet.values[i]["total3"],
          // ferramenta_equipamento: dataSet.values[i]["media4"],
          ferramenta_equipamento: dataSet.values[i]["total4"],
          // questao4_1: dataSet.values[i]["questao4_1"],
          resp4_1: dataSet.values[i]["resp4_1"],
          // questao4_2: dataSet.values[i]["questao4_2"],
          resp4_2: dataSet.values[i]["resp4_2"],
          // questao4_3: dataSet.values[i]["questao4_3"],
          resp4_3: dataSet.values[i]["resp4_3"],
          // total4: dataSet.values[i]["total4"],
          // procedimentos: dataSet.values[i]["media5"],
          procedimentos: dataSet.values[i]["total5"],
          // questao5_1: dataSet.values[i]["questao5_1"],
          resp5_1: dataSet.values[i]["resp5_1"],
          // questao5_2: dataSet.values[i]["questao5_2"],
          resp5_2: dataSet.values[i]["resp5_2"],
          // questao5_3: dataSet.values[i]["questao5_3"],
          resp5_3: dataSet.values[i]["resp5_3"],
          // questao5_4: dataSet.values[i]["questao5_4"],
          resp5_4: dataSet.values[i]["resp5_4"],
          // questao5_5: dataSet.values[i]["questao5_5"],
          resp5_5: dataSet.values[i]["resp5_5"],
          // questao5_6: dataSet.values[i]["questao5_6"],
          resp5_6: dataSet.values[i]["resp5_6"],
          // questao5_7: dataSet.values[i]["questao5_7"],
          resp5_7: dataSet.values[i]["resp5_7"],
          // questao5_8: dataSet.values[i]["questao5_8"],
          resp5_8: dataSet.values[i]["resp5_8"],
          // questao5_9: dataSet.values[i]["questao5_9"],
          resp5_9: dataSet.values[i]["resp5_9"],
          // questao5_10: dataSet.values[i]["questao5_10"],
          resp5_10: dataSet.values[i]["resp5_10"],
          // questao5_11: dataSet.values[i]["questao5_11"],
          resp5_11: dataSet.values[i]["resp5_11"],
          // questao5_12: dataSet.values[i]["questao5_12"],
          resp5_12: dataSet.values[i]["resp5_12"],
          // questao5_13: dataSet.values[i]["questao5_13"],
          resp5_13: dataSet.values[i]["resp5_13"],
          // questao5_14: dataSet.values[i]["questao5_14"],
          resp5_14: dataSet.values[i]["resp5_14"],
          // questao5_15: dataSet.values[i]["questao5_15"],
          resp5_15: dataSet.values[i]["resp5_15"],
          // total5: dataSet.values[i]["total5"],
          // padrao_limpeza: dataSet.values[i]["media6"],
          padrao_limpeza: dataSet.values[i]["total6"],
          // questao6_1: dataSet.values[i]["questao6_1"],
          resp6_1: dataSet.values[i]["resp6_1"],
          // questao6_2: dataSet.values[i]["questao6_2"],
          resp6_2: dataSet.values[i]["resp6_2"],
          // questao6_3: dataSet.values[i]["questao6_3"],
          resp6_3: dataSet.values[i]["resp6_3"],
          // total6: dataSet.values[i]["total6"],
          obs2: dataSet.values[i]["obs2"],
          obs3: dataSet.values[i]["obs3"],
          terceiro: dataSet.values[i]["terceiro"],
          pessoas_obs: dataSet.values[i]["pessoas_obs"],
          desvios_obs: parseInt( dataSet.values[i]["total1"] )+parseInt( dataSet.values[i]["total2"] )+parseInt( dataSet.values[i]["total3"] )+parseInt( dataSet.values[i]["total4"] )+parseInt( dataSet.values[i]["total5"] )+parseInt( dataSet.values[i]["total6"] ) ,/*dataSet.values[i]["desvios_obs"]*/
          obs1: dataSet.values[i]["obs1"],
          anexo: dataSet.values[i]["anexo"],
          data_refer: dataSet.values[i]["data_refer"],
          ts: '<button id="testbut" class="btn btn-info btn-xs" data-consulta-processo> '+
              '	<span class="fluigicon fluigicon-search-test icon-sm"> '+
              '</button>',
        };
      dadosTbl.push( datatableRow );
    }    
  }
  
  dataTable.reload( dadosTbl );
}