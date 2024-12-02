function defineStructure() {
    addColumn('status');
}

function onSync(lastSyncDate) {
    printLog("info", "## pipedriveDeals START ##");
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn('status');


    var listaConstraits = {};
    var params = {};

    var connectionWD = null;
    var statementWD = null;

    var hoje = new Date();
    var ontem = new Date(hoje.getTime());
    ontem.setDate(hoje.getDate() - 1);

    var token = "a22cfde57728dfc655c420cce014d01cb701fe65";
    var endpoint = "/v1/deals/timeline?start_date=" + ontem.toJSON().substring(0, 10) + "&interval=day&amount=365&field_key=update_time&api_token=" + token;
    // var endpoint = "/v1/deals/timeline?start_date=2021-05-06&interval=day&amount=1&field_key=update_time&api_token=" + token;
    try {
        var clientService = fluigAPI.getAuthorizeClientService();
        var data = {
            companyId: getValue("WKCompany") + "",
            serviceCode: "pipedrive",
            endpoint: endpoint,
            timeoutService: "240",
            method: "GET",
        };

        var headers = {};
        headers["Content-Type"] = "application/json";
        data["headers"] = headers;
        data["params"] = params;

        var jj = JSON.stringify(data);

        var vo = clientService.invoke(jj);
        if (vo.getResult() == "" || vo.getResult().isEmpty()) {
            printLog("info", "Retorno Vazio");
            newDataset.addRown(new Array("Retorno Vazio"));
            //throw "Retorno esta vazio";
        } else {
            var jr = JSON.parse(vo.getResult());
            printLog("info", "## pipedriveDeals Sucesso ## " + jr.success);

            if (!jr.success) {
                throw 'Erro na integração com PipeDrive';
            }
            // printLog("info", "## pipedriveDealsSummary Data ## " + jr.da ta);
            if (jr.data != null) {
                var contextWD = new javax.naming.InitialContext();
                var dataSourceWD = contextWD.lookup("java:/jdbc/CRMDS");
                connectionWD = dataSourceWD.getConnection();

                for (var i = 0; i < jr.data.length; i++) {
                    // printLog("info", "Registros Deals : " + jr.data.length)
                    for (var j = 0; j < jr.data[i].deals.length; j++) {
                        // printLog("info", "Registros Dados : " + jr.data[i].deals.length)

                        var SQL = "delete from public.kbt_t_dealsEng where id = " + jr.data[i].deals[j]['id'];
                        var statementWD = connectionWD.prepareStatement(SQL);
                        statementWD.executeUpdate();

                        var SQL = "INSERT INTO public.kbt_t_dealsEng( id, cod_empresa, creator_user_id, user_id, person_id, org_id, " +
                            "   stage_id, title, value, currency, add_time, update_time, " +
                            "   stage_change_time, active, deleted, status, probability, " +
                            "   lost_reason, visible_to, close_time, pipeline_id, won_time, " +
                            "   first_won_time, lost_time, expected_close_date, label, " +
                            "   cepobra, cnpjemprendimento, cnpjincorporador, descontofinal, " +
                            "   emailnotafiscal, enderecoobra, entregaestimada, gatilhoativvencida, " +
                            "   gatilhoemailvencido, idwwsobra, nomobra, nomempreendimento, nomincorporadora, " +
                            "   numpropostamodelo, numpropostalicitacao, numpropostatotal, numpropostacomple, " +
                            "   numpropostaparcial, origemprospeccao, padraoobra, numprocessofluig, showroom, " + "    " +
                            "   tempnegocio, unidadestotal, area,  " +
                            "   renewal_type, stage_order_nr, person_name, " +
                            "   org_name, group_id, group_name, rotten_time," +
                            "	next_activity_date, last_activity_date, next_activity_time, next_activity_id, last_activity_id, " +
                            "	next_activity_subject, next_activity_type, next_activity_duration, next_activity_note ) VALUES " +
                            "   (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +
                            "    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +
                            "    ?, ?, ?, ?, ?, ?, ?) ";




                        // if (jr.data[i].deals[j]['id'] != 15182) {
                        printLog("error", "SINC DEAL: " + jr.data[i].deals[j]['id']);
                        printLog("error", "SINC ADDTIME: " + frmDataSQL(jr.data[i].deals[j]['add_time']));
                        statementWD = connectionWD.prepareStatement(SQL);

                        statementWD.setInt(1, jr.data[i].deals[j]['id']);
                        statementWD.setInt(2, 1);

                        if (jr.data[i].deals[j]['creator_user_id'] != null) {
                            statementWD.setInt(3, jr.data[i].deals[j]['creator_user_id']);
                        } else {
                            statementWD.setNull(3, java.sql.Types.NULL);
                        }

                        if (jr.data[i].deals[j]['user_id'] != null) {
                            statementWD.setInt(4, jr.data[i].deals[j]['user_id']);
                        } else {
                            statementWD.setNull(4, java.sql.Types.NULL);
                        }
                        if (jr.data[i].deals[j]['person_id'] != null) {
                            statementWD.setInt(5, jr.data[i].deals[j]['person_id']);
                        } else {
                            statementWD.setNull(5, java.sql.Types.NULL);
                        }
                        if (jr.data[i].deals[j]['org_id'] != null) {
                            statementWD.setInt(6, jr.data[i].deals[j]['org_id']);
                        } else {
                            statementWD.setNull(6, java.sql.Types.NULL);
                        }
                        if (jr.data[i].deals[j]['stage_id'] != null) {
                            statementWD.setInt(7, jr.data[i].deals[j]['stage_id']);
                        } else {
                            statementWD.setNull(7, java.sql.Types.NULL);
                        }
                        statementWD.setString(8, removeAcentos(isnull(jr.data[i].deals[j]['title'], 'null'), 255));
                        statementWD.setDouble(9, jr.data[i].deals[j]['value']);

                        statementWD.setString(10, jr.data[i].deals[j]['currency']);


                        var sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                        var sdD = new java.text.SimpleDateFormat("yyyy-MM-dd");
                        if (jr.data[i].deals[j]['add_time'] != null) {
                            statementWD.setDate(11, new java.sql.Date(sdf.parse(jr.data[i].deals[j]['add_time']).getTime()));
                        } else {
                            statementWD.setNull(11, java.sql.Types.NULL);
                        }

                        if (jr.data[i].deals[j]['update_time'] != null) {
                            statementWD.setDate(12, new java.sql.Date(sdf.parse(jr.data[i].deals[j]['update_time']).getTime()));
                        } else {
                            statementWD.setNull(12, java.sql.Types.NULL);
                        }

                        if (jr.data[i].deals[j]['stage_change_time'] != null) {
                            statementWD.setDate(13, new java.sql.Date(sdf.parse(jr.data[i].deals[j]['stage_change_time']).getTime()));
                        } else {
                            statementWD.setNull(13, java.sql.Types.NULL);
                        }
                        statementWD.setBoolean(14, jr.data[i].deals[j]['active'])
                        statementWD.setBoolean(15, jr.data[i].deals[j]['deleted'])
                        statementWD.setString(16, jr.data[i].deals[j]['status']);
                        statementWD.setString(17, jr.data[i].deals[j]['probability']);
                        statementWD.setString(18, jr.data[i].deals[j]['lost_reason']);
                        statementWD.setString(19, jr.data[i].deals[j]['visible_to']);

                        if (jr.data[i].deals[j]['close_time'] != null) {
                            statementWD.setDate(20, new java.sql.Date(sdf.parse(jr.data[i].deals[j]['close_time']).getTime()));
                        } else {
                            statementWD.setNull(20, java.sql.Types.NULL);
                        }

                        if (jr.data[i].deals[j]['pipeline_id'] != null) {
                            statementWD.setInt(21, jr.data[i].deals[j]['pipeline_id']);
                        } else {
                            statementWD.setNull(21, java.sql.Types.NULL);
                        }

                        if (jr.data[i].deals[j]['won_time'] != null) {
                            statementWD.setDate(22, new java.sql.Date(sdf.parse(jr.data[i].deals[j]['won_time']).getTime()));
                        } else {
                            statementWD.setNull(22, java.sql.Types.NULL);
                        }


                        if (jr.data[i].deals[j]['first_won_time'] != null) {
                            statementWD.setDate(23, new java.sql.Date(sdf.parse(jr.data[i].deals[j]['first_won_time']).getTime()));
                        } else {
                            statementWD.setNull(23, java.sql.Types.NULL);
                        }

                        if (jr.data[i].deals[j]['lost_time'] != null) {
                            statementWD.setDate(24, new java.sql.Date(sdf.parse(jr.data[i].deals[j]['lost_time']).getTime()));
                        } else {
                            statementWD.setNull(24, java.sql.Types.NULL);
                        }

                        if (jr.data[i].deals[j]['expected_close_date'] != null) {
                            statementWD.setDate(25, new java.sql.Date(sdD.parse(jr.data[i].deals[j]['expected_close_date']).getDate()));
                        } else {
                            statementWD.setNull(25, java.sql.Types.NULL);
                        }

                        if (jr.data[i].deals[j]['label'] != null) {
                            statementWD.setInt(26, jr.data[i].deals[j]['label']);
                        } else {
                            statementWD.setNull(26, java.sql.Types.NULL);
                        }


                        statementWD.setString(27, isnull(jr.data[i].deals[j]['a59ff2f4caad4df9440a519038b64dd3d8b205f7'], 'null'));
                        statementWD.setString(28, removeAcentos(isnull(jr.data[i].deals[j]['d7d2be2f932240b3d2c5f773f0cbf12cb8345860'], 'null'), 100));
                        statementWD.setString(29, isnull(jr.data[i].deals[j]['77f2d4604803b2166f25ab36d0535f0ecb3a0a85'], 'null'));
                        statementWD.setString(30, isnull(jr.data[i].deals[j]['f41edbb59ada8768ebb86009861359683d8279b9'], 'null'));
                        statementWD.setString(31, isnull(jr.data[i].deals[j]['f8f3ce002f633ce348f70d03f29f3d7ba3862fce'], 'null'));

                        try {
                            statementWD.setString(32, removeAcentos(isnull(jr.data[i].deals[j]['80ed4423b1ece1cf81bbe37087a8092efd1ffa6a'], 'null'), 100));
                        } catch (error) {
                            statementWD.setNull(32, java.sql.Types.NULL);
                        }


                        if (jr.data[i].deals[j]['aaee9df42f2305d1ade2a9fb0d223c89ca100f79'] != null) {
                            statementWD.setDate(33, new java.sql.Date(sdD.parse(jr.data[i].deals[j]['aaee9df42f2305d1ade2a9fb0d223c89ca100f79']).getDate()));
                        } else {
                            statementWD.setNull(33, java.sql.Types.NULL);
                        }

                        statementWD.setString(34, isnull(jr.data[i].deals[j]['24ab0cbc6b7ec8c8d37f5aba40d183caceaf7800'], 'null'));

                        statementWD.setString(35, isnull(jr.data[i].deals[j]['f4a1cefb53c568d2004762fc1ebb0fef37f1d3f7'], 'null'));
                        statementWD.setString(36, isnull(jr.data[i].deals[j]['514826f403987aeae248f15f01fb9120b09643bf'], 'null'));
                        statementWD.setString(37, removeAcentos(isnull(jr.data[i].deals[j]['294383f75a14f8f911c5f556efe215fe9defa857'], 'null'), 100));

                        statementWD.setString(38, removeAcentos(isnull(jr.data[i].deals[j]['cb741a6f045ab748b2561c3f92cd1ca32cb83776'], 'null'), 90));
                        statementWD.setString(39, removeAcentos(isnull(jr.data[i].deals[j]['b3682c84c83f1f4569326bed4c57c7157b7be1f7'], 'null'), 100));
                        statementWD.setString(40, isnull(jr.data[i].deals[j]['94c6481730f0bb80dc1afd8ff5929c88cb7efba4'], 'null'));

                        statementWD.setString(41, isnull(jr.data[i].deals[j]['ffbd12532f81d3ff30031438aa8f85d93ac12217'], 'null'));
                        statementWD.setString(42, isnull(jr.data[i].deals[j]['40331fcfd443f28b0fd610f1f14d096cda39c19c'], 'null'));
                        statementWD.setString(43, isnull(jr.data[i].deals[j]['eed2c121a224b9b70f5228f9d6d7aa38776880a9'], 'null'));


                        statementWD.setString(44, isnull(jr.data[i].deals[j]['6be8abfa06949351119d00d3fb3ad27bce8fc963'], 'null'));
                        statementWD.setString(45, isnull(jr.data[i].deals[j]['d014a279a535d682114527067d34413d44d1b60d'], 'null'));
                        statementWD.setString(46, isnull(jr.data[i].deals[j]['8cd40472309eaff88b366530c6a99bfb2cbc886a'], 'null'));

                        statementWD.setString(47, isnull(jr.data[i].deals[j]['1c207033de6244723272ec05f0dd54107800ccd1'], 'null'));
                        statementWD.setString(48, isnull(jr.data[i].deals[j]['35496edfe62ef748c95c19fca7ae36c592a203ee'], 'null'));
                        statementWD.setString(49, isnull(jr.data[i].deals[j]['d92746bba725cbcba37172f7120379b6369d5af9'], 'null'));

                        if (jr.data[i].deals[j]['f7663c14693bf4f3722cc9056a9c16ecb0404c9b'] != null) {
                            statementWD.setInt(50, jr.data[i].deals[j]['f7663c14693bf4f3722cc9056a9c16ecb0404c9b']);
                        } else {
                            statementWD.setNull(50, java.sql.Types.NULL);
                        }

                        statementWD.setString(51, isnull(jr.data[i].deals[j]['20db38b06275aa3b60055976a0bdadf8238bd62d'], 'null'));
                        statementWD.setString(52, jr.data[i].deals[j]['renewal_type']);

                        if (jr.data[i].deals[j]['stage_order_nr'] != null) {
                            statementWD.setInt(53, jr.data[i].deals[j]['stage_order_nr']);
                        } else {
                            statementWD.setNull(53, java.sql.Types.NULL);
                        }

                        statementWD.setString(54, removeAcentos(isnull(jr.data[i].deals[j]['person_name'], 'null'), 255));
                        statementWD.setString(55, removeAcentos(isnull(jr.data[i].deals[j]['org_name'], 'null'), 255));
                        statementWD.setString(56, jr.data[i].deals[j]['group_id']);

                        statementWD.setString(57, removeAcentos(isnull(jr.data[i].deals[j]['group_name'], 'null'), 40));
                        statementWD.setString(58, jr.data[i].deals[j]['rotten_time']);


                        if (jr.data[i].deals[j]['next_activity_date'] != null) {
                            statementWD.setString(59, jr.data[i].deals[j]['next_activity_date']);
                        } else {
                            statementWD.setNull(59, java.sql.Types.NULL);
                        }

                        if (jr.data[i].deals[j]['last_activity_date'] != null) {
                            statementWD.setString(60, jr.data[i].deals[j]['last_activity_date']);
                        } else {
                            statementWD.setNull(60, java.sql.Types.NULL);
                        }
                        statementWD.setString(61, isnull(jr.data[i].deals[j]['next_activity_time'], 'null'));

                        if (jr.data[i].deals[j]['next_activity_id'] != null) {
                            statementWD.setInt(62, jr.data[i].deals[j]['next_activity_id']);
                        } else {
                            statementWD.setNull(62, java.sql.Types.NULL);
                        }

                        if (jr.data[i].deals[j]['last_activity_id'] != null) {
                            statementWD.setInt(63, jr.data[i].deals[j]['last_activity_id']);
                        } else {
                            statementWD.setNull(63, java.sql.Types.NULL);
                        }

                        statementWD.setString(64, removeAcentos(isnull(jr.data[i].deals[j]['next_activity_subject'], 'null'), 255));
                        statementWD.setString(65, removeAcentos(isnull(jr.data[i].deals[j]['next_activity_type'], 'null'), 255));
                        statementWD.setString(66, removeAcentos(isnull(jr.data[i].deals[j]['next_activity_duration'], 'null'), 255));
                        statementWD.setString(67, removeAcentos(isnull(jr.data[i].deals[j]['next_activity_note'], 'null'), 255));

                        statementWD.executeUpdate();

                    }
                }

                newDataset.addRow(new Array("SQL: Importado com sucesso."));


            }
        }

    } catch (error) {
        printLog("error", "SINC DEAL: " + SQL);
        printLog("error", "Error SQL deal: " + error.toString());
        newDataset.addRow(new Array(error.toString()));
        newDataset.addRow(new Array("SINC DEAL: " + jr.data[i].deals[j]['id'] + ' - ' + utf8String + ' - ' + jr.data[i].deals[j]['next_activity_date']));

    } finally {
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
        return newDataset;
    }
}

function createDataset(fields, constraints, sortFields) {

}

function removeAcentos(valor, tamanho) {
    if (valor != null && valor != "") {
        var retorno = valor.replace(/[^a-zA-Z0-9 ]/g, "").substring(0, tamanho);

        return retorno.replace("–", "");
    } else {
        return valor;
    }
}


function isnull(valor, valorAlter) {
    if (valor == null || valor == undefined || valor == "null" || valor == "") {
        return valorAlter;
    } else {
        return valor
    }
}

function frmDataSQL(data) {
    // log.info('frmDataSQL........' + data)
    var valor = isnull(data, "");
    if (valor == null || valor == undefined || valor == "null" || valor == "") {
        return null;
    } else {
        return "'" + valor + "'";
    }
}


function onMobileSync(user) {

}


var debug = true;
function printLog(tipo, msg) {

    if (debug) {
        var msgs = getValue("WKDef") + " - " + getValue("WKNumProces") + " - " + msg
        if (tipo == 'info') {
            log.info(msgs);
        } else if (tipo == 'error') {
            log.error(msgs);
        } else if (tipo == 'fatal') {
            log.fatal(msgs);
        } else {
            log.warn(msgs);
        }
    }
}


