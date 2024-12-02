function getPrint(data){

    if ( data['tipo'] == 'credito'){

        var myModal = FLUIGC.modal({
            title: '',
            content:    '<div class="col-md-6">'+
                        '    <label for="md_limite_credito" class="control-label">Imprime Limite Crédito?</label>'+
                        '    <select id="md_limite_credito" class="form-control">'+
                        '        <option value="S">Sim</option>'+
                        '        <option value="N">Não</option>'+
                        '    </select>'+
                        '</div>'+
                        '<div class="col-md-6">'+
                        '    <label for="md_maior_acumulo" class="control-label">Imprime Maior Acumulo?</label>'+
                        '    <select id="md_maior_acumulo" class="form-control">'+
                        '        <option value="S">Sim</option>'+
                        '        <option value="N">Não</option>'+
                        '    </select>'+
                        '</div>',
            id: 'md_imprime_credito',
            actions: [{
                'label': 'Confirmar',
                'bind': 'data-confirm-modal',
                'classType': 'btn-success'
            },{
                'label': 'Cancelar',
                'classType': 'btn-danger',
                'autoClose': true
            }]
        }, function(err, data) {
            if(err) {
                // do error handling
            } else {
                // do something with data
            }
        });

        $('#md_imprime_credito').on('click','[data-confirm-modal]', function(ev){
        
            var html = '';

            var dsCliente = getDadosCLiente(data['cod_cliente']);

            html += getHeader(dsCliente, data);
            
            html +=  getContentCredito(dsCliente, data);

            html += getFooter();
            
            var WindowObject = window.open('', "PrintWindow", "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
            WindowObject.document.writeln(html);

        });
    }

    if ( data['tipo'] == 'dtl'){

            var html = '';

            var dsCliente = getDadosCLiente(data['cod_cliente']);

            html += getHeader(dsCliente, data);
            
            html +=  getContentDtl(data);

            html += getFooter();
            
            var WindowObject = window.open('', "PrintWindow", "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
            WindowObject.document.writeln(html);

    }

}

function getDadosCLiente(cod_cliente){
        
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint('cod_cliente', cod_cliente, cod_cliente, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("table", 'kbt_v_clientes', null, ConstraintType.MUST));
    var dsCliente = DatasetFactory.getDataset("selectLogix", null, constraints, null);

    return dsCliente;

}

function getHeader(dsCliente, data){

    var html = '';

    html += '<html> '+
            '   <head> '+
            '      <style> '+
            '           table, th, td { border: 1px solid black; border-collapse: collapse; } '+
            '           th, td { padding: 5px; } '+
            '           .title { background-color: #ccc; text-align: center; } '+
            '           .subtitle { background-color: #ccc; } '+
            '           @media screen { div.divFooter { display: none; } } '+
            '           @media print { div.divFooter { position: fixed; bottom: 0; } '+
            '   		.bt_imprimir { display: none; } } '+
            ' </style> '+
            '   </head> '+
            '   <body> '+
            '      <table style="width: 100%"> '+
            '         <tbody> '+
            '            <tr> ';
    if( data['tipo'] != 'credito' ){
    	html += '				<td style="width: 30%" align="center">	<img src="https://fluig.guabifios.com.br:8443/portal/api/servlet/image/1/custom/logo_image.png" id="logo" data-height-percentage="60" data-actual-width="90" data-actual-height="70" style="max-height: 70px;max-width: 200px;"></td> ';
    }
    html += '				<td style="width: 40%" align="center"> '+
            '					<font size="2" >GUABIFIOS PRODUTOS TEXTEIS LTDA</font> '+
            '				</td> '+
            '               	<td style="width: 30%" align="center">	 '+
            '					<font size="2" > '+
            '						Extraído em:<br> '+
            '						'+DataHoje()+' AS '+ HoraHoje()+' HRS '+
            '					</font> '+
            '				</td> '+
            '            </tr> '+
            '         </tbody> '+
            '      </table> '+
            '      <font size="2" face="Courier New"> '+
            '         <table style="width: 100%; font-size: 11px;"> '+
            '            <tbody> '+
            '               <tr style="height: 0px;visibility: hidden;"> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '                  <td style="width: 4.16%;"> </td> '+
            '               </tr> '+
            '               <tr> '+
            '                  <td class="title" align="center" colspan="24"><b>CLIENTE</b></td> '+
            '               </tr> ';
    html += '               <tr style="border-bottom-style: hidden;"> '+
            '                  <td colspan="16" style="border-right-style: hidden; padding-bottom: 0px;"> '+
            '                     <b>Razão Social: </b> '+
            '                     '+ dsCliente.values[0]['nom_cliente'].trim() +' '+
            '                  </td> '+
            '                  <td colspan="8" style="border-left-style: hidden; padding-bottom: 0px;"> '+
            '                     <b>Telefone: </b> '+
            '                     '+ dsCliente.values[0]['num_telefone'].trim() +' '+
            '                  </td> '+
            '               </tr> '+
            '               <tr style="border-bottom-style: hidden;"> '+
            '                  <td colspan="16" style="border-right-style: hidden; padding-bottom: 0px;"> '+
            '                     <b>Enderço: </b> '+
            '                     '+ dsCliente.values[0]['logradouro'].trim() +' '+
            '                  </td> '+
            '                  <td colspan="4" style="border-left-style: hidden; border-right-style: hidden; padding-bottom: 0px;"> '+
            '                     <b>Nr.: </b> '+
            '                     '+dsCliente.values[0]['num_iden_lograd'].trim()+' '+
            '                  </td> '+
            '                  <td colspan="4" style="border-left-style: hidden; padding-bottom: 0px;"> '+
            '                     <b>CEP: </b> '+
            '                     '+dsCliente.values[0]['cod_cep'].trim()+' '+
            '                  </td> '+
            '               </tr> '+
            '               <tr style="border-bottom-style: hidden;"> '+
            '                  <td colspan="24" style="padding-bottom: 0px;"> '+
            '                     <b>Complemento: </b> '+
            '                  </td> '+
            '               </tr> '+
            '               <tr style="border-bottom-style: hidden;"> '+
            '                  <td colspan="8" style="border-right-style: hidden; padding-bottom: 0px;"> '+
            '                     <b>Bairro: </b> '+
            '                     '+dsCliente.values[0]['bairro'].trim()+' '+
            '                  </td> '+
            '                  <td colspan="8" style="border-left-style: hidden; border-right-style: hidden; padding-bottom: 0px;"> '+
            '                     <b>Cidade: </b> '+
            '                     '+dsCliente.values[0]['den_cidade'].trim()+' '+
            '                  </td> '+
            '                  <td colspan="8" style="border-left-style: hidden; padding-bottom: 0px;"> '+
            '                     <b>Estado: </b> '+
            '                     '+dsCliente.values[0]['cod_uni_feder'].trim()+' '+
            '                  </td> '+
            '               </tr> '+
            '               <tr> '+
            '                  <td colspan="6" style="border-right-style: hidden;"> '+
            '                     <b>CNPJ: </b> '+
            '                     '+dsCliente.values[0]['num_cgc_cpf'].trim()+' '+
            '                  </td> '+
            '                  <td colspan="6" style="border-left-style: hidden; border-right-style: hidden;"> '+
            '                     <b>Inscr.Est.: </b> '+
            '                     '+dsCliente.values[0]['ins_estadual'].trim()+' '+
            '                  </td> '+
            '                  <td colspan="12" style="border-left-style: hidden;"> '+
            '                     <b>E-Mail NFE: </b> '+
            '                     '+dsCliente.values[0]['correio_eletronico'].trim()+' '+
            '                  </td> '+
            '               </tr> ';

    if ( data['grupo'] == 'S' ){
            $("input[name^=cod_cliente_grp_econ___]").each(function (index, value) {
                var seq = this.id.split('___')[1];
                
                if ( this.value != data['cod_cliente'] ){
                    if ( index == 0 ){
    html += '               <tr> '+
            '                  <td class="title" colspan="24"><b>GRUPO ECONOMICO</b></td> '+
            '               </tr> ';
                    }
                    var border = 'style="border-bottom-style: hidden;"';
                    var padding = 'padding-bottom: 0px;';
                    if ( $("#grp_economico").find("tr").length - 3 == index ){
                        border = '';
                        padding = '';
                    }
    html += '               <tr '+border+'> '+
            '                  <td colspan="8" style="border-right-style: hidden; padding-bottom: 0px;"> '+
            '                     <b>CNPJ: </b> '+
            '                     '+ $('#cgc_cpf_grp_econ___'+ seq).val().trim() +' '+
            '                  </td> '+
            '                  <td colspan="16" style="border-left-style: hidden; '+padding+'"> '+
            '                     <b>Razão Social: </b> '+
            '                     '+ $('#nom_cliente_grp_econ___' + seq).val().trim() +' '+
            '                  </td> '+
            '               </tr> ';
                }
    
            });
    }

    return html;
}

function getContentCredito(dsCliente, data){
    var html = '';

    html += '               <tr> '+
            '                  <td class="title" colspan="24"><b>VALORES INFORMADOS NA MOEDA REAL</b></td> '+
            '               </tr> '+
            '               <tr>  '+
            '                  <td colspan="8" style="border-right: hidden;" align="right"><b>CLIENTE DESDE:</b></td>  '+
            '                  <td colspan="5" style="border-right: hidden;" align="right"><b>'+formataData( new Date( dsCliente.values[0]['dat_cadastro'] ) )+'</b></td>  '+
            '                  <td colspan="11" align="center"><b></b></td>	 '+
            '               </tr> '+
            '               <tr>  '+
            '                  <td colspan="8" style="border-right: hidden;" align="right"><b>ÚLTIMA COMPRA:<b></td>  '+
            '                  <td colspan="5" style="border-right: hidden;" align="right"><b>'+ data['val_ult_fat'] +'</b></td>  '+
            '                  <td colspan="11" align="center"><b>'+ data['dat_ult_fat'] +'</b></td>	 '+
            '               </tr>  ';
    if ( $('#md_maior_acumulo').val() == 'S' ){
    html += '               <tr>  '+
            '                  <td colspan="8" style="border-right: hidden;" align="right"><b>MAIOR ACÚMULO:</b></td>  '+
            '                  <td colspan="5" style="border-right: hidden;" align="right"><b>'+ data['val_maior_acumulo'] +'</b></td>  '+
            '                  <td colspan="11" align="center"><b>'+ data['dat_maior_acumulo'] +'</b></td>	 '+
            '               </tr>  ';
    }
    html += '               <tr>  '+
            '                  <td colspan="8" style="border-right: hidden;" align="right"><b>MAIOR FATURA:</b></td>  '+
            '                  <td colspan="5" style="border-right: hidden;" align="right"><b>'+ data['val_maior_fat'] +'</b></td>  '+
            '                  <td colspan="11" align="center"><b>'+ data['dat_maior_fat'] +'</b></td>	 '+
            '               </tr>  '+
            '               <tr>  '+
            '                  <td colspan="8" style="border-right: hidden;" align="right"><b>TÍTULOS VENCIDOS:</b></td>  '+
            '                  <td colspan="5" style="border-right: hidden;" align="right"><b>'+ data['val_debito_vencido'] +'</b></td>  '+
            '                  <td colspan="11" align="center"><b></b></td>	 '+
            '               </tr>  '+
            '               <tr>  '+
            '                  <td colspan="8" style="border-right: hidden;" align="right"><b>TÍTULOS A VENCER:</b></td>  '+
            '                  <td colspan="5" style="border-right: hidden;" align="right"><b>'+ data['val_debito_a_venc'] +'</b></td>  '+
            '                  <td colspan="11" align="center"><b></b></td>	 '+
            '               </tr>  ';
    if ( $('#md_limite_credito').val() == 'S' ){
    html += '               <tr>  '+
            '                  <td colspan="8" style="border-right: hidden;" align="right"><b>LIMÍTE CRÉDITO:</b></td>  '+
            '                  <td colspan="5" style="border-right: hidden;" align="right"><b>'+ formatStringValue( dsCliente.values[0]['val_credito_conced'], 2) +'</b></td>  '+
            '                  <td colspan="11" align="center"><b></b></td>	 '+
            '               </tr> ';
    }

    return html;
}

function getContentDtl(data){
    
    var html =  '               <tr> '+
                '                  <td class="title" colspan="24"><b>'+data['title']+'</b></td> '+
                '               </tr> ';

    var lst = [];
    $("#table_"+ data['table'] ).find("tr").each(function(el,ev){
        var arr = [];
        $($(this).children()).each(function(el,ev){
            if ($(this).css('display') != 'none'){
                var cl = '';
                if ( $(this).hasClass('text-right') ){
                    cl = 'text-align: right;';
                }
                var colspan = 0;
                if ( $(this).hasClass('colspan-pint-1') ){ colspan = 1; }
                else if ( $(this).hasClass('colspan-pint-2') ){ colspan = 2; }
                else if ( $(this).hasClass('colspan-pint-3') ){ colspan = 3; }
                else if ( $(this).hasClass('colspan-pint-4') ){ colspan = 4; }
                else if ( $(this).hasClass('colspan-pint-5') ){ colspan = 5; }
                else if ( $(this).hasClass('colspan-pint-6') ){ colspan = 6; }
                else if ( $(this).hasClass('colspan-pint-7') ){ colspan = 7; }
                else if ( $(this).hasClass('colspan-pint-8') ){ colspan = 8; }
                else if ( $(this).hasClass('colspan-pint-9') ){ colspan = 9; }
                else if ( $(this).hasClass('colspan-pint-10') ){ colspan = 10; }
                else if ( $(this).hasClass('colspan-pint-11') ){ colspan = 11; }
                else if ( $(this).hasClass('colspan-pint-12') ){ colspan = 12; }
                
                arr.push( {'texto': $(this).text(),
                		   'style': cl,
                		   'colspan': colspan });
            };
        });
        lst.push(arr);
    });

    var colspanCalc = 24 / parseInt(lst[0].length);

    for (var i = 0; i < lst.length; i++) {
        html += '               <tr> ';
        for (var j = 0; j < lst[i].length; j++) {
            var border = 'border-right: hidden;';
            if ( j == lst[i].length -1 ){
                border = '';
            }
            
            colspan = colspanCalc;
            if( lst[0][j]['colspan'] != 0 ){
            	colspan = lst[0][j]['colspan'];
            }
            
            if ( i == 0 ){
                html += '                  <td class="subtitle" style="'+border + lst[i][j]['style']+'" colspan="'+colspan+'"><b>'+ lst[i][j]['texto'] +'</b></td> ';    
            } else {

                html += '                  <td style="'+border + lst[i][j]['style']+'" colspan="'+colspan+'"><b>'+ lst[i][j]['texto'].trim() +'</b></td> ';
            }
            
        }
        
        html += '               <tr> ';
    }

    if ( data['footer'] ){
        var obj = data['footer'];
        var colspan = 24 / parseInt(Object.keys( obj ).length);
        html += '               <tr> ';
        Object.keys(obj).forEach(function(item){
            html += '                  <td class="subtitle" colspan="'+colspan+'"><b>'+ item + ': '+ obj[item] +'</b></td> ';
            console.log(item + " = " + obj[item]);
        });

        html += '               <tr> ';
    }

    return html;
    

}

function getFooter(){
    var html = '';

    html += '            </tbody> '+
            '         </table> '+
            '      </font> '+
            '      <div class="divFooter"> '+
            '         <table> '+
            '            <tbody> '+
            '               <tr> '+
            '                  <!-- <td style="width: 30%" align="center">				<font size="2">TST-GUABIFIOS PRODUTOS TEXTEIS LTDA 					- GUABIRUBA                      - SC					- (47)33540044   					- 006.925.672/0001-94				</font>			</td> --> '+
            '               </tr> '+
            '            </tbody> '+
            '         </table> '+
            '      </div> '+
            '      <br> '+
            '      <br>   '+
            '      <input type="button" value="Imprimir" onclick="window.print()" class="bt_imprimir">   '+
            '   </body> '+
            '</html> ';

    return html;
}