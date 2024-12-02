		function setMarcaraCpfCnpj(campo, id, testValor){
			
			valor = $('#'+id).val();
			
			if( $('#'+campo).val() != "" && testValor ){
				if( valor == 'F' ){
					$('#'+id).val('J');
				}else {
					$('#'+id).val('F');
				}
			}
			
			valor = $('#'+id).val();
			console.log('setMarcaraCpfCnpj entrada', campo, valor);
									
			if( valor == 'F' ){
				$('#'+campo).unmask();
				$('#'+campo).mask('000.000.000-00' );
			}else {
				$('#'+campo).unmask();
				$('#'+campo).mask('00.000.000/0000-00' );
			}			
		}
		
		
		function setUpper() {

			$("input, textarea").keypress(
							function(e) {
								var chr = String.fromCharCode(e.which);
								var name_campo;
								name_campo = $(this).attr("name");

								if ("'\"^¨´`\|~".indexOf(chr) > 0) {
									return false;
								}
							});

			$("input:text, textarea").keyup(function() {
				$(this).val($(this).val().toUpperCase());
			});
		}
		function loadBody(){
	
			
			$('.decimal_6').maskMoney({precision : 6,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
			$('.decimal_5').maskMoney({precision : 5,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
			$('.decimal_4').maskMoney({precision : 4,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
			$('.decimal_3').maskMoney({precision : 3,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
			$('.decimal_2').maskMoney({precision : 2,thousands : '.',decimal : ',', defaultZero : true, allowZero : true});
			$('.decimal_1').maskMoney({precision : 1,thousands : '.',decimal : ',',	defaultZero : true,	allowZero : true});
			$('.decimal_0').maskMoney({precision : 0,thousands : '.',decimal : ',',	defaultZero : true, allowZero : true});
			$('.integer_0').maskMoney({	precision : 0,thousands : '',decimal : '',defaultZero : true,allowZero : true});

			setUpper();
			loadDatatable();

			pctBonus();

			showDestino();
			trataOrcamento();

			loadDsCombo('showroom', 'selectTableMySql', 'role_code_atrib', 'description', 'dataBase,table', 'java:/jdbc/FluigDS,fluig_v_role_showroom', 'description', 'N' );

			var dsTipoCadastro = DatasetFactory.getDataset('ds_tipo_parceria', null, null, null );
			var valDefault = $("#tipo_cadastro").val();
			$("#tipo_cadastro option").remove();
			$('#tipo_cadastro').append("<option value='' ></option>");
			for ( var i = 0; i < dsTipoCadastro.values.length > 0 ; i++ ){
				$('#tipo_cadastro').append("<option value='"+dsTipoCadastro.values[i]['cod_tipo_parceria']+"' cod_sis='"+dsTipoCadastro.values[i]['cod_sis']+"'>"+dsTipoCadastro.values[i]['den_tipo_parceria']+"</option>");
			}

			if ( valDefault != '' ){
				$("#tipo_cadastro").val( valDefault );
			}
			// loadDsCombo('tipo_cadastro', 'ds_tipo_parceria', 'cod_tipo_parceria', 'den_tipo_parceria', '', '', 'description', 'N' );
			
			// setMarcaraCpfCnpj('cnpj_cpf','fisico_juridico', false);
			// setMarcaraCpfCnpj('cpf_cnpj_titular','tipo_pessoa', false);

			

			// Mascara de CPF e CNPJ mesmo campo
			if ( $('#fisico_juridico').val() == 'F' ){
				
				var mask = '000.000.000-009';
				$('#fisico_juridico').val('F');
				if( $('#sis_integracao').val() == 2 ) $('#area').val('PP');
				$($('#rg_ie').parent().children()[0]).html('RG');
				$($('#nome').parent().children()[0]).html('Nome&nbsp;<b style="color:red">*</b>');
				$($('#email').parent().children()[0]).html('E-mail&nbsp;<b style="color:red">*</b>');
				$($('#telefone1').parent().children()[0]).html('Telefone&nbsp;<b style="color:red">*</b>');
				// $('#num_cau_crea').removeAttr('readonly');
				// $('#num_cau_crea').attr('valida','true');
				$('.juridico').hide();

				// if ( $('#num_cau_crea').val() == '' || $('#num_cau_crea').val() == '0'  ){
					$('.conselho').show();
				// }
			} else {
				var mask = '00.000.000/0000-00';
				if( $('#sis_integracao').val() == 2 ) $('#area').val('PO');
				$($('#rg_ie').parent().children()[0]).html('IE');
				$($('#nome').parent().children()[0]).html('Razão Social&nbsp;<b style="color:red">*</b>');
				$($('#email').parent().children()[0]).html('E-mail da Empresa&nbsp;<b style="color:red">*</b>');
				$($('#telefone1').parent().children()[0]).html('Telefone da Empresa&nbsp;<b style="color:red">*</b>');
				// $('#num_cau_crea').attr('readonly','readonly');
				// $('#num_cau_crea').removeAttr('valida');
				$('.juridico').show();
			}

			var CpfCnpjMaskBehavior = function (val) {

				if ( val.replace(/\D/g, '').length <= 11 ){
					var retorno = '000.000.000-009';
					$('#fisico_juridico').val('F');
					if( $('#sis_integracao').val() == 2 ) $('#area').val('PP');
					$($('#rg_ie').parent().children()[0]).html('RG');
					$($('#nome').parent().children()[0]).html('Nome&nbsp;<b style="color:red">*</b>');
					$($('#email').parent().children()[0]).html('E-mail&nbsp;<b style="color:red">*</b>');
					$($('#telefone1').parent().children()[0]).html('Telefone&nbsp;<b style="color:red">*</b>');
					// $('#num_cau_crea').removeAttr('readonly');
					// $('#num_cau_crea').attr('valida','true');
					$('.juridico').hide();
				} else { 
					var retorno = '00.000.000/0000-00';
					$('#fisico_juridico').val('J');
					if( $('#sis_integracao').val() == 2 ) $('#area').val('PO');
					$($('#rg_ie').parent().children()[0]).html('IE');
					$($('#nome').parent().children()[0]).html('Razão Social&nbsp;<b style="color:red">*</b>');
					$($('#email').parent().children()[0]).html('E-mail da Empresa&nbsp;<b style="color:red">*</b>');
					$($('#telefone1').parent().children()[0]).html('Telefone da Empresa&nbsp;<b style="color:red">*</b>');
					// $('#num_cau_crea').attr('readonly','readonly');
					// $('#num_cau_crea').removeAttr('valida');
					$('.juridico').show();
				}
				return retorno;
			},
			
			cpfCnpjpOptions = {
				onKeyPress: function(val, e, field, options) {
				field.mask(CpfCnpjMaskBehavior.apply({}, arguments), options);
				}
			};
		
			$('#cnpj_cpf').mask(mask, cpfCnpjpOptions);

			$('#cpf_pessoa').mask('000.000.000-00' );

			
			if( $('#cnpj').val() != "" ){
				$('#cnpj').attr('readonly',true);
			}
						
			autosize();
						
			var d = new Date(); 
			$('#data_fup').val( d.toLocaleString() ) ;
			
			$("#descricao").val( "" );			
			FLUIGC.calendar('#data_nascimento', {showToday: false} );

			var calendarDaraPrevFup = FLUIGC.calendar('#data_prev_fup', {pickDate: true, pickTime: true, sideBySide: true } );
			//calendarDaraPrevFup.setDate( d.toLocaleDateString()+' 00:00' );

			loadPerguntas();

			if ( $('#task').val() == '51' ){
				$('input, textarea, select').each(function () {
					if( $(this).is('select') ){			
						$('#'+ $(this).attr('id') +' option:not(:selected)').prop('disabled', true);
					}else{
						$(this).attr('readonly',true);
					}
					// $(this).attr("readonly", true);
				});

				disableSeach('.robo');

				$('#descricao').attr("readonly", false);
			}

			if ( $('#task').val() == '0' || $('#task').val() == '4' ){
				$('#status_cadastro').val('A');
				$('#status_cadastro option:not(:selected)').prop('disabled', true);
				$('.user_pipedrive').hide();
			} else {
				$('#status_cadastro option:not(:selected)').prop('disabled', true);
				$('#solicitou_orcamento option:not(:selected)').prop('disabled', true);
			}

			if ( $('#id_user_vendedor').val() != '' && $('#task').val() != '12'){
				$('.dest').hide();
			}
							
		}
				
		var beforeSendValidate = function(numState,nextState){
						
			console.log("numState: " + numState);
			console.log("nextState: " + nextState);
			
			if( $('#solicitou_orcamento').val() == 'S' 
			 && $('#destino').val() == '' && $('#startAutomatico').val() == 'P'){
				alert( 'Para solicitar orçamento você deve informar uma área de destino.' );
				return false;
			}
			
			if( nextState == "12" ){
				console.log(" Entrei isso 12 ");
				if( !validaForm( 'valida' )  ){
					alert( 'Existem campos obrigatorios não preenchidos.' );
					return false;
				}
			}
			
			if( nextState == "51"){
				console.log(" Entrei isso 20 ");
				
				if( !validaForm( 'valida' ) ){
					alert( 'Existem campos obrigatorios não preenchidos.' );
					return false;
				}
				
				if( $("#tipo_cadastro").val() == "A" 
				 &&	$("#num_cau_crea").val() == "" ){
					alert( 'Para parceiro Arquiteto, você deve informar o CAU.' );
					return false;
				}
				
			}

			if ( nextState == '38'){
				var retorno = true;

				if ( $('#id_pessoa').val() == '' ){
					var cnpj_cpf = $('#cnpj_cpf').val().replace(/\D/g, '');

					// var SQL =   "select pe.id, pat.nr_cupom "+
					// 			"from online.pon_pessoa_arquiteto pat "+
					// 			"join online.pon_pessoa pe on (pe.id = pat.id_pessoa ) "+
					// 			"where  pe.cnpj_cpf = '"+ cnpj_cpf +"' ";

					var SQL = 	"select  "+
								"	p.id, pt.nr_cupom,  "+
								"	e.id as idendereco,  "+
								"	t.id as idtelefone,  "+
								"	m.id as idemail, "+
								"	pt.id_patrocinador IS NOT NULL AS sponsor, "+
								"	pt.id_patrocinador AS usuario_responsavel, "+
								"	pc.id_grupo AS sponsorGroupId, "+
								"	pc.pc_comissao AS sponsorBonus, "+
								"	pt.utiliza_rpa, "+
								"	pt.ativo "+
								"FROM online.pon_pessoa p "+
								"JOIN online.pon_pessoa_arquiteto pt ON (pt.id_pessoa = p.id) "+
								"JOIN online.pon_grupo_pessoa gp on (pt.id_grupo = gp.id) "+
								"LEFT JOIN online.pon_pessoa_endereco e ON (e.id_pessoa = p.id) AND (e.principal = true)  "+
								"LEFT JOIN online.pon_pessoa_telefone t ON (t.id_pessoa = p.id) AND (t.principal = true) "+
								"LEFT JOIN online.pon_pessoa_email m ON (m.id_pessoa = p.id) AND (m.principal = true) "+
								// "LEFT JOIN online.pon_pessoa_patrocinador pc ON (pc.id_pessoa = p.id) "+
								"LEFT JOIN online.pon_pessoa_patrocinador pc ON (pc.id = pt.id_patrocinador)  "+
								"WHERE "+
								"	p.cnpj_cpf = '"+ cnpj_cpf +"' ";

					console.log(SQL);
					var constraints = new Array();
					constraints.push( DatasetFactory.createConstraint('SQL' , SQL, null, ConstraintType.MUST) );
					constraints.push( DatasetFactory.createConstraint('DATABASE' , 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
					var datasetSIS = DatasetFactory.getDataset('select', null, constraints, null );

					if ( datasetSIS != null && datasetSIS != undefined ){

						if (datasetSIS.values.length > 0){

							$('#altera').val('S');
							$('#id_pessoa').val( datasetSIS.values[0]['id'] );
							$('#cupon').val( datasetSIS.values[0]['nr_cupom'] );
							$('#idendereco').val( datasetSIS.values[0]['idendereco'] );
							$('#idtelefone').val( datasetSIS.values[0]['idtelefone'] );
							$('#idemail').val( datasetSIS.values[0]['idemail'] );
							$('#sponsor').val( 'false' );
							$('#usuario_responsavel').val( datasetSIS.values[0]['usuario_responsavel'] );
							$('#sponsorGroupId').val( datasetSIS.values[0]['sponsorgroupid'] );
							$('#sponsorBonus').val( datasetSIS.values[0]['sponsorbonus'] );
							$('#utiliza_rpa').val( datasetSIS.values[0]['utiliza_rpa'] );
							$('#ativo').val( datasetSIS.values[0]['ativo'] );

							if (!confirm('Parceiro já cadastrado :' + datasetSIS.values[0]['nr_cupom'] + ' deseja atualizar? ')) {
								retorno = false;
							}
						}
						
					}
				}

				if( !validaForm( 'valida' ) || !validaForm( 'valida-cupom' )   ){
					alert( 'Existem campos obrigatorios não preenchidos.' );
					retorno = false;
				}

				return retorno;
			}

			if ( nextState == '57' ){
				
				if( !validaForm( 'valida' ) ){
					alert( 'Existem campos obrigatorios não preenchidos.' );
					return false;
				}
				
				if( $('#solicitou_orcamento').val() == 'S' 
					&&  $('#nome').val() != ""  
					&& $('#telefone1').val() != "" ){

					if ( $('#sis_integracao').val() != '2' ){

						if ( $('#fisico_juridico').val() == 'J' ){

							if (  $('#id_org').val() == '' ) {
	
								var constraints = new Array();
								constraints.push( DatasetFactory.createConstraint('area' , $('#area').val(), $('#area').val(), ConstraintType.MUST) );
								constraints.push( DatasetFactory.createConstraint('nome' , $('#nome').val(), $('#nome').val(), ConstraintType.MUST) );
								var datasetOrg = DatasetFactory.getDataset('pipedriveOrganizations', null, constraints, null );
								console.log('datasetOrg...',datasetOrg);
	
								if ( Object.keys(datasetOrg).length === 0 ){
									if ( !confirm( "Organização não cadastrado no PipeDrive, deseja criar cadastro?" ) ){
										return false;
									}
								// if ( datasetOrg.values.length == 0 ){
									// if ( !confirm( "Organização não cadastrado no PipeDrive, deseja criar cadastro?" ) ){
										// return false;
									// }
								}else if ( datasetOrg.values.length > 1 ){
									alert("Organização possui mais de um cadastro no PipeDrive, utilize o zoom para selecionar");
									$('#id_org').parent().addClass('has-error has-feedback');
									return false;
								}else if ( datasetOrg.values.length == 1 ){
									$('#id_org').val( datasetOrg.values[0]['id'] );
									$('#id_org').parent().removeClass('has-error has-feedback');
								}
	
							} else {
								$('#id_org').parent().removeClass('has-error has-feedback');
							}
	
							if (  $('#id_person').val() == '' ) {
	
								var constraints = new Array();
								constraints.push( DatasetFactory.createConstraint('area', $('#area').val(), null, ConstraintType.MUST) );
								constraints.push( DatasetFactory.createConstraint('phone', $('#telefone_pessoa').val(), null, ConstraintType.MUST) );
								// constraints.push( DatasetFactory.createConstraint('name', $('#pessoa_contato').val(), null, ConstraintType.MUST) );
								var person = DatasetFactory.getDataset("pipedrivePerson", null, constraints, null);
								console.log('person...',person);
								if( Object.keys(person).length === 0 ){
									if ( !confirm( "Nome ou Telefone não cadastrado no PipeDrive, deseja criar cadastro?" ) ){
										$('#id_org').parent().addClass('has-error has-feedback');
										return false;
									}
								}else if ( person.values.length > 1 ){
									alert("Nome ou Telefone possui mais de um cadastro no PipeDrive, utilize o zoom para selecionar");
									$('#id_person').parent().addClass('has-error has-feedback');
									return false;
								}else if ( person.values.length == 1 ){
									$('#id_person').val( person.values[0]['id'] );
									$('#id_person').parent().removeClass('has-error has-feedback');
								}
							} else {
								$('#id_person').parent().removeClass('has-error has-feedback');
							}
	
						} else {
							if (  $('#id_person').val() == '' ) {
								
								var constraints = new Array();
								constraints.push( DatasetFactory.createConstraint('area', $('#area').val(), null, ConstraintType.MUST) );
								constraints.push( DatasetFactory.createConstraint('phone', $('#telefone1').val(), null, ConstraintType.MUST) );
								// constraints.push( DatasetFactory.createConstraint('name', $('#nome').val(), null, ConstraintType.MUST) );
								var person = DatasetFactory.getDataset("pipedrivePerson", null, constraints, null);
								console.log('person...',person);
								if( Object.keys(person).length === 0 ){
									if ( !confirm( "Nome ou Telefone não cadastrado no PipeDrive, deseja criar cadastro?" ) ){
										return false;
									}						
								}else if ( person.values.length > 1 ){
									alert("Nome ou Telefone possui mais de um cadastro no PipeDrive, utilize o zoom para selecionar");
									$('#id_person').parent().addClass('has-error has-feedback');
									return false;
								}else if ( person.values.length == 1 ){
									$('#id_person').val( person.values[0]['id'] );
									$('#id_person').parent().removeClass('has-error has-feedback');
								}
	
							} else {
								$('#id_person').parent().removeClass('has-error has-feedback');
							}
	
						}
						
					}

				}

			}
			
			return true;
			
		}
		
		function autoSize(){
			$('textarea').each(function (){
				$(this).on(
					 'keyup input keypress keydown change',
					 function(e) {
					  var tamanhoMin = $(this).attr('rows')
						* $(this).css('line-height').replace(
						  /[^0-9\.]+/g, '');
					  $(this).css({
					   'height' : 'auto'
					  });
					  var novoTamanho = this.scrollHeight
						+ parseFloat($(this).css("borderTopWidth"))
						+ parseFloat($(this).css("borderBottomWidth"));
					  if (tamanhoMin > novoTamanho)
					   novoTamanho = tamanhoMin;
					  $(this).css({
					   'height' : novoTamanho
					  });
					 }).css({
					'overflow' : 'hidden',
					'resize' : 'none'
				   }).delay(0).show(0, function() {
					var el = $(this);
					setTimeout(function() {
					 el.trigger('keyup');
					}, 100);
				   });
			});
		}

		function isNull( valor, padrao ){
			if ( isNaN( valor ) ){
				return padrao;
			}else{
				return valor;
			}
		}		

		function maskFone( id ){
			if( $('#'+id).val() == undefined || $('#'+id).val() == null ){
				$('#'+id).val( '' );
			}
			if($('#'+id).val().length > 14 ) {  
				$('#'+id).unmask();
				$('#'+id).mask("(99) 99999-9999");  
			} else {  
				$('#'+id).unmask();
				$('#'+id).mask("(99) 9999-9999?9");  
			} 
		}

		function textToFone( val ){
			if( val == undefined || val == null ){
				return '';
			}
			if( val.length == 10 ){
			    return '('+val.substring(0,2)+') '+val.substring(2,6)+'-'+val.substring(6,10);
			}else if( val.length == 11 ){
			    return '('+val.substring(0,2)+') '+val.substring(2,7)+'-'+val.substring(7,11);
			}else{
				return val;
			}
			
		}
		
	   function fnCustomDelete(oElement){
	
			fnWdkRemoveChild(oElement);
		}
		
	   
		
		function openProcCacaObra(){
			var WCMAPI = window.parent.WCMAPI;
			var url = WCMAPI.getServerURL()+WCMAPI.getServerContextURL()+'/p/'+WCMAPI.getOrganizationId()+'/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID='+$('#proc_caca_obra').val();
		    console.log( 'URL..... ', url );
		    window.open(url, '_blank');
		    return true;
		}


		function carrega_cnpj(cnpj){
			var wcnpj = cnpj.replace(/\D/g, '');
			// console.log(cnpj);
			if (wcnpj != "") {
				var validacnpj = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/g;
				if(validacnpj.test(wcnpj)) {
					
					var url = "https://www.receitaws.com.br/v1/cnpj/"+ wcnpj
					console.log("teste "+url);
					$.ajax({
						type: "GET",
						dataType: "jsonp",
						url: url,
						crossDomain: true,
						data: "",
						timeout: 3000,
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							FLUIGC.toast({ title: '',message: 'CNPJ pesquisado não foi encontrado na receita' , type: 'warning' });
						},
						success: function (data, status, xhr) {
							console.log(data);
							$("#nome").val(data.nome);
							$('#atividade').val(data.atividade_principal[0]['text']);
							$("#cep").val(data.cep.replace(".",""));
							buscaCep('cep');
							$("#numero").val(data.numero);
							$("#bairro").val(data.bairro);
							$("#site").val(data.complemento);
							$("#endereco").val(data.logradouro);
							
						}
					});
				}else{
					//cnpj é inválido.
					// limpa_formulario_cnpj();
					console.log("teste "+validacnpj)
					FLUIGC.toast({ title: '',message: 'Formato de CNPJ inválido.' , type: 'warning' });
				}
			} else {
				// limpa_formulario_cnpj();
			}
		}

		function trataDestino(){
			$('#id_user_pipedrive').val('');
			if ( $('#destino').val() == 'S' ){
				$('.showroom').show();
			}
			
			if ( $('#destino').val() == 'CC' ){
				$('.showroom').hide();
				
				getUserVendedor();
			}
		}

		function showDestino(){
			if ( $('#destino').val() == 'S' ){
				$('.showroom').show();
				
			} else {
				$('.showroom').hide();
			}
		}

		function trataOrcamento(){
			if ( $('#solicitou_orcamento').val() == 'S' &&  $('#startAutomatico').val() != 'A' ){
				$('.destino').show();
				if ( $('#id_user_vendedor').val() == '' ){
					$('#destino').attr('valida','true');
				}				
				$('#dados_orcamento').attr('valida','true');
				$('.aba_dadosOrcamento').show();
			} else {
				$('#destino').val('');
				$('.destino').hide();
				if ( $('#startAutomatico').val() == 'A' ){
					$('.robo').show();
				}				
				$('#destino').removeAttr('valida');
				$('#dados_orcamento').removeAttr('valida');
				$('.aba_dadosOrcamento').hide();
			}
			showDestino();
		}

		function getUserShowroom(){

			// if ( $('#id_user_vendedor').val() == '' ){
		
				if ( $("#area").val() == '' ){
					$('#showroom').val('');
					alert( 'informe CPF/CNPJ');
					return false;
				}
				
				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/FluigDS', null, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint('table', 'fluig_v_user_group_role', null, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint('origem', 'ROLE', 'ROLE', ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint('group_role_code', $("#showroom").val().split(':')[2], $("#showroom").val().split(':')[2], ConstraintType.MUST) );
				var dsUser = DatasetFactory.getDataset("selectTableMySql", ['user_code','email'], constraints, null);
				console.log('compon......',dsUser);
				
				if( dsUser != null && dsUser.values.length > 0 ){					
					var row = Math.floor(Math.random() * dsUser.values.length ); 
					
					var constraints = new Array();
					constraints.push( DatasetFactory.createConstraint('area', $("#area").val(), null, ConstraintType.MUST) );
					constraints.push( DatasetFactory.createConstraint('email', dsUser.values[ row ]['email'], null, ConstraintType.MUST) );
					var pipedriveUser = DatasetFactory.getDataset("pipedriveUser", null, constraints, null);
					
					if( pipedriveUser == null || pipedriveUser.values.length == 0 ){
						alert("Email não cadastrado no pipeDrive.");
						// return false;
					}else{
						$('#id_user_vendedor').val( pipedriveUser.values[0]["id"] );
						$('#nome_user_vendedor').val( pipedriveUser.values[0]["name"] );
					}
				}
			// }
				
		}
		
		function getUserVendedor(){
		
			
			// $('#id_user_pipedrive').val('11390759');
		
			if ( $('#id_user_vendedor').val() == '' ){
		
				// var sql = 	"select kbt.id_pipedrive, kbt.usr_nome "+
							// "from online.pon_pessoa pe "+
							// "join online.pon_proposta pro on (pro.id_cliente = pe.id) "+
							// "join fr_usuario us on (us.usr_codigo = pro.id_usuario) "+
							// "left join kbt_t_vendedor_estatisica kbt on (us.usr_codigo = kbt.usr_codigo) "+
							// "where pe.cnpj_cpf = '"+ $('#cnpj_cpf').val() +"' "+
							// "and us.usr_ativo = 'true' "+
							// "order by pro.dh_emissao desc "+
							// "LIMIT 1 ";

				var sql =   "select kbt.id_pipedrive, kbt.usr_nome "+
                    "from online.pon_pessoa_arquiteto pat "+
                    "join online.pon_pessoa pe on (pe.id = pat.id_pessoa)  "+
                    "join online.pon_proposta pro on (pro.id_arquiteto = pat.id and COALESCE(pro.id_origem_negocio,0) != 73)   "+
                    "join fr_usuario us on (us.usr_codigo = pro.id_usuario)   "+
                    "join online.pon_pessoa_vendedor ve on (ve.id = pro.id_vendedor)  "+
                    "left join kbt_t_vendedor_estatisica kbt on (us.usr_codigo = kbt.usr_codigo)   "+
                    "where pe.cnpj_cpf = '"+$('#cnpj_cpf').val().replace('-','').replace('.','').replace('/','')+"' "+
                    "and pe.ativo = 'true'  "+
                    "and tp_proposta = 'P'  "+
                    "and pro.id_status not in (14,22,21) "+
                    "order by pro.dh_emissao desc   "+
                    "LIMIT 1 ";
		
				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
				constraints.push( DatasetFactory.createConstraint('sql', 	 sql, null, ConstraintType.MUST) );
				var getAntigoVendedor = DatasetFactory.getDataset("select", null, constraints, null);
		
				if ( getAntigoVendedor != null && getAntigoVendedor != undefined ){
					if ( getAntigoVendedor.values.length > 0 && getAntigoVendedor.values[0]["id_pipedrive"] != 'null' ){
						$('#id_user_pipedrive').val( getAntigoVendedor.values[0]["id_pipedrive"] );
						$('#nome_user_pipedrive').val( getAntigoVendedor.values[0]["usr_nome"] );
					} else {
						var sql = "select public.kbt_f_get_next_loja ( 6 )";
		
						var constraints = new Array();
						constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
						constraints.push( DatasetFactory.createConstraint('sql', 	 sql, null, ConstraintType.MUST) );
						var getVendedor = DatasetFactory.getDataset("select", null, constraints, null);
		
						var sql = "select id_pipedrive, usr_nome from kbt_t_vendedor_estatisica where usr_codigo = " + getVendedor.values[0]['kbt_f_get_next_loja'];
		
						var constraints = new Array();
						constraints.push( DatasetFactory.createConstraint('dataBase', 'java:/jdbc/CRMDS', null, ConstraintType.MUST) );
						constraints.push( DatasetFactory.createConstraint('sql', 	 sql, null, ConstraintType.MUST) );
						var getPipeDrive = DatasetFactory.getDataset("select", null, constraints, null);
		
						if( getPipeDrive == null || getPipeDrive.values.length == 0 ){
							alert("Usuário não encontrado na kbt_t_vendedor_estatisica.");
							// return false;
						}else{
							$('#id_user_vendedor').val( getPipeDrive.values[0]["id_pipedrive"] );
							$('#nome_user_vendedor').val( getPipeDrive.values[0]["usr_nome"] );
						}
					}
				}
				
			}
		
		}

		function pctBonus(){
			if ($('#task').val() != '20'){
				if ( $('#tipo_cadastro').val() == 'A' || $('#tipo_cadastro').val() == 'I' ){
					var comissao = $('#comissao').val();
					$("#comissao option[value='']").prop('selected', true);
					$('#comissao option:not(:selected)').prop('disabled', true);
					if ( $('#profissao').val() == 'IDQ'){
						$("#comissao option[value='0.00']").prop('disabled', false);
					}
					$("#comissao option[value='5.00']").prop('disabled', false);
					$("#comissao option[value='10.00']").prop('disabled', false);
					if(comissao == '5.00' || comissao == '10.00'){
						$('#comissao').val(comissao);
					}
	
					// $('#banco').attr('valida','true');
					// $('#agencia').attr('valida','true');
					// $('#conta').attr('valida','true');
					// $('#operacao').attr('valida','true');
					
				}
	
				if ( $('#tipo_cadastro').val() == 'S' ){
					$("#comissao option[value='15.00']").prop('selected', true);
					$('#comissao option:not(:selected)').prop('disabled', true);
					$("#comissao option[value='15.00']").prop('disabled', false);
					$('#comissao').val("15.00");
	
					// $('#banco').attr('valida','true');
					// $('#agencia').attr('valida','true');
					// $('#conta').attr('valida','true');
					// $('#operacao').attr('valida','true');
				}
	
				if ( $('#tipo_cadastro').val() == 'V' ){
					$("#comissao option[value='0.00']").prop('selected', true);
					$('#comissao option:not(:selected)').prop('disabled', true);
					$("#comissao option[value='0.00']").prop('disabled', false);
					$('#comissao').val("0.00");
	
					// $('#banco').removeAttr('valida');
					// $('#agencia').removeAttr('valida');
					// $('#conta').removeAttr('valida');
					// $('#operacao').removeAttr('valida');
				}
			}
			
			
		}

		//Desabilita pesquisa do input
		function disableSeach(obj) {
			// $(obj).hide();
			
			$(obj + ' div').each(function(){
				if ( $(this).hasClass('input-group') ){
					$(this).removeClass('input-group');
					$(this).children().each(function(){
						if( $(this).hasClass('input-group-addon') ){
							$(this).hide();
						};
					});
				};
			});
		}

		function visualizaContrato(id){

			var constraints = new Array();
			constraints.push( DatasetFactory.createConstraint('DOC_ASSINATURA', $('#'+id).val(), null, ConstraintType.MUST) );
			constraints.push( DatasetFactory.createConstraint('ACTION', 	 'VISUALIZA_CONTRATO', null, ConstraintType.MUST) );
			var dsContrato = DatasetFactory.getDataset("dsk_parceiros_contrato", null, constraints, null);

			openFile(dsContrato.values[0]['doc_contrato']);
		}

		function openFile( id ){

			//Visualizar documento nova aba
			// window.open( WCMAPI.getTenantURL() + '/ecmnavigation?app_ecm_navigation_doc=' +  $($(obj).parent().children()[0]).val() );
		
			var parentOBJ;
		
			if (window.opener) {
				parentOBJ = window.opener.parent;
			} else {
				parentOBJ = parent;
			}
		
			var cfg = {
					url : "/ecm_documentview/documentView.ftl",
					maximized : true,
					title : "Anexo: " + id,
					callBack : function() {
						parentOBJ.ECM.documentView.getDocument( id ); //, 1000 );
					},
					customButtons : []
			};
			parentOBJ.ECM.documentView.panel = parentOBJ.WCMC.panel(cfg);
			
		}