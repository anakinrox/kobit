			function loadPerguntas() {
				
				var qtd = 0;
				$("input[name^='pergunta___']").each( function() {
					qtd += 1;
				});
				if( qtd > 0 ){
					return;
				}
				
				var constraints = new Array();
				constraints.push( DatasetFactory.createConstraint("tipo_processo", 'P', 'P', ConstraintType.MUST ) );				
				var perguntas = DatasetFactory.getDataset("pergunta_qualificacao", null, constraints, null);
				if (perguntas != null) {
					for (var x = 0; x < perguntas.values.length; x++) {
						var row = perguntas.values[x];
						console.log(row);
						var seq = wdkAddChild('perguntas');
						$('#pergunta___' + seq).val( initCap( row.descricao_pergunta ) );
						$('#pergunta_documentid___' + seq).val(row.documentid);
						$('#pergunta_version___' + seq).val(row.version);											
						loadPaiFilhoComboVersio( 'questao___'+seq, 'pergunta_qualificacao', 'opcoes', row.documentid, row.version, 'sequencia', 'opcao' );					
					}
				}
				console.log('SAIU AS PERGUNTAS');
				$('#loadPergunta').val('S');
			}			
			
			function loadOptionPergunta(){
				$("input[name^='pergunta___']").each( function() {
							console.log('Item...', $(this).attr('name'));
							var seq = $(this).attr('name').split('___')[1];
							loadPaiFilhoComboVersio( 'questao___'+seq, 'pergunta_qualificacao', 'opcoes', $('#pergunta_documentid___' + seq).val(), $('#pergunta_version___' + seq).val(), 'sequencia', 'opcao' );
				});
			}
			
			function loadPaiFilhoComboVersio( combo, dataSet, table, idDocPai, versionDocPai, fieldCodigo, fieldDesc ){
				
				console.log( combo, dataSet, table, idDocPai, versionDocPai, fieldCodigo, fieldDesc );
				
				var constraintsFilhos = new Array();
				constraintsFilhos.push( DatasetFactory.createConstraint("tablename", table, table, ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#id", idDocPai, idDocPai, ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#version", versionDocPai, versionDocPai, ConstraintType.MUST) );
				constraintsFilhos.push( DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST) );

				var orderFilhos = new Array();
				orderFilhos.push( fieldCodigo );						
				var datasetFilhos = DatasetFactory.getDataset(dataSet, null, constraintsFilhos, orderFilhos );
				console.log('DataSet',datasetFilhos);
				if ( datasetFilhos != null ){
					var valDefault = "";
					console.log('ANTES TESTE VALOR DEFAULT.....',$("#"+combo).val());
					if ( $("#"+combo).val() != "" && $("#"+combo).val() != null ){
						valDefault = $("#"+combo).val();
						console.log('TEM VALOR DEFAULT Jah EXISTEMTE.....',valDefault);
					}
					$("#"+combo+" option").remove();
					var filhos = datasetFilhos.values;
					console.log('DataSet',datasetFilhos);
					console.log('DataSet',filhos);
					//$("#empresa").append("<option value='' ></option>");
					
					for ( var i in filhos ) {
						
						console.log('Linha DataSet.....',i);
						
						var filho = filhos[i];
						var den = '';

						
						if ( $.inArray(  filho[ fieldCodigo ], getOptCombo( combo ) ) > -1 ){
							continue;
						} 
						
						if ( fieldDesc == '' ){
							den = filho[ fieldCodigo ];
						}else{
							den = filho[ fieldCodigo ]+' - '+filho[ fieldDesc ];
						}
						console.log("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
						$("#"+combo).append("<option value='"+ filho[ fieldCodigo ] +"' >"+ den +"</option>");
						
					}
					console.log('antes de setar valor.....',valDefault, $("#"+combo).val() );
					$("#"+combo).val( valDefault );
					console.log('depois de setar valor.....',valDefault, $("#"+combo).val() );
				}
			}
			
			function getOptCombo( combo ){
				
				var optArray = new Array();
				$("#"+combo+" option").each(function () {
					optArray.push( $(this).val() );
				});
				return optArray;
			}

			function isNullTXT( valor, padrao ){
				if ( valor == null || valor == 'null' || valor == undefined ){
					return padrao;
				}else{
					return valor;
				}
			}


		function initCap( texto ) {
			console.log('texto....',texto);
			if( texto == '' || texto == 'null' || texto == null ){
				return '';
			}
			var tmp = texto+"";
			return tmp.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
		}