var debug = false;
var pathFiles = "";
var csvDivisor = ";";

var JsonParam = [
    {//Revisado 16/10/24
        id: 0,
        arquivo: 'empresa',
        tabela: 'adp_empresas'
    },
    {//Revisado 16/10/24
        id: 1,
        arquivo: 'resultado',
        tabela: 'adp_centro_resultado'
    },
    { //Revisado 16/10/24
        id: 2,
        arquivo: 'filial',
        tabela: 'adp_filial'
    },
    { //Revisado 16/10/24
        id: 3,
        arquivo: 'funcionario',
        tabela: 'adp_funcionarios'
    },
    { //Revisado 16/10/24
        id: 4,
        arquivo: 'cargo',
        tabela: 'adp_cargos'
    },
    { //Revisado 16/10/24
        id: 5,
        arquivo: 'funcao',
        tabela: 'adp_funcoes'
    }
]


var JSONEmpresa = [];
var JSONResultado = [];
var JSONFilial = [];
var JSONFuncionario = [];
var JSONCargos = [];
var JSONFuncoes = [];

function defineStructure() {
    addColumn('Status');
    addColumn('Registros');
    addColumn('DataLog');
}

function onSync(lastSyncDate) {
    try {
        var newDataset = DatasetBuilder.newDataset();
        // newDataset.addColumn('Processamento');

        f_processaArquivos(newDataset);

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    }

    return newDataset;
}

function createDataset(fields, constraints, sortFields) {

    try {
        var newDataset = DatasetBuilder.newDataset();
        newDataset.addColumn('Processamento');

        f_processaArquivos(newDataset);

    } catch (error) {
        newDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    }

    return newDataset;
}

function f_identityFile(pNameFile, pDataset) {
    try {
        var wRetorno = null;

        for (let i = 0; i < JsonParam.length; i++) {
            var reg = new RegExp(JsonParam[i].arquivo.toUpperCase(), "g");

            if (pNameFile.match(reg)) {
                wRetorno = JsonParam[i].id;
            }
        }

    } catch (error) {
    }
    return wRetorno;
}

function f_mountDados(pIndArquivo, pArrayData, pDataset) {
    try {
        var gson = new com.google.gson.Gson();
        if (pIndArquivo == 0) {
            var data = {
                empresa: pArrayData[0].trim(),
                nomeFantasia: pArrayData[1].trim(),
                cnpj: pArrayData[2].trim(),
                nomRazao: pArrayData[3].trim(),
                inscricao: pArrayData[4].trim(),
                telefone: pArrayData[5].trim(),
                fax: pArrayData[6].trim(),
                email: pArrayData[7].trim(),
                endereco: pArrayData[8].trim(),
                numero: pArrayData[9].trim(),
                complemento: pArrayData[10].trim(),
                bairro: pArrayData[11].trim(),
                cidade: pArrayData[12].trim(),
                uf: pArrayData[13].trim(),
                pais: pArrayData[14].trim(),
                cep: pArrayData[15].trim()
            }
            JSONEmpresa.push(data);
        }

        if (pIndArquivo == 1) {
            var data = {
                empresa: pArrayData[0].trim(),
                nomeRazao: pArrayData[1].trim(),
                EstabADP: pArrayData[2].trim(),
                EstabCliente: pArrayData[3].trim(),
                codADP: pArrayData[4].trim().replace(' ','').replace('_',''), //pArrayData[4].trim().substring(pArrayData[4].trim().length() - 1) == '_' ? pArrayData[4].trim().substring(0, pArrayData[4].trim().length() - 1) : pArrayData[4].trim(),
                codConta: pArrayData[5].trim(),
                sigla: pArrayData[6].trim(),
                nome: pArrayData[7].trim(),
                descricao: pArrayData[8].trim(),
                situacao: pArrayData[9].trim(),
                pagaInsalubridade: pArrayData[10].trim(),
                insalubridade: pArrayData[11].trim()
            }

            // pDataset.addRow(new Array('codADP: ' + pArrayData[4].trim() + ' - codADP2: ' + data.codADP));
            JSONResultado.push(data);
        }

        if (pIndArquivo == 2) {
            // pDataset.addRow(new Array('Cidade: ' + pArrayData[11].trim()));
            var data = {
                empresa: pArrayData[0].trim(),
                nomeRazao: pArrayData[1].trim(),
                EstabADP: pArrayData[2].trim(),
                EstabCliente: pArrayData[3].trim(),
                nomeFantasia: pArrayData[4].trim(),
                cnpj: pArrayData[5].trim(),
                endereco: pArrayData[6].trim(),
                numero: pArrayData[7].trim(),
                bairro: pArrayData[8].trim(),
                complemento: pArrayData[9].trim(),
                cep: pArrayData[10].trim(),
                cidade: pArrayData[11].trim(),
                uf: pArrayData[12].trim(),
                pais: pArrayData[13].trim()
            }
            JSONFilial.push(data)
        }

        if (pIndArquivo == 3) {
            // pDataset.addRow(new Array('Funcionario: ' + pArrayData[6].trim()));

            var data = {
                empresa: pArrayData[0].trim(),
                nomeRazao: pArrayData[1].trim(),
                EstabADP: pArrayData[2].trim(),
                EstabCliente: pArrayData[3].trim(),
                estabelecimento: pArrayData[4].trim(),
                matricula: leftPad(pArrayData[5].trim(), 10, '0', pDataset),
                nome: pArrayData[6].trim(),
                datNascimento: pArrayData[7].trim().split('/').reverse().join('-'),
                datAdmissao: pArrayData[8].trim().split('/').reverse().join('-'),
                datDesligamento: pArrayData[9].trim().split('/').reverse().join('-'),
                salario: pArrayData[10].trim(),
                codEscala: pArrayData[11].trim(),
                codTurma: pArrayData[12].trim(),
                horasMensais: pArrayData[13].trim(),
                cpf: pArrayData[14].trim(),
                rg: pArrayData[15].trim(),
                codCentroResultado: pArrayData[16].trim().replace(' ','').replace('_',''), //pArrayData[16].trim().substring(pArrayData[16].trim().length() - 1) == '_' ? pArrayData[16].trim().substring(0, pArrayData[16].trim().length() - 1) : pArrayData[16].trim(),
                codContabilidade: pArrayData[17].trim(),
                codSindicato: pArrayData[18].trim(),
                sindicato: pArrayData[19].trim(),
                codCargo: leftPad(pArrayData[20].trim(), 5, '0', pDataset),
                cargo: pArrayData[21].trim(),
                codFuncao: leftPad(pArrayData[22].trim(), 5, '0', pDataset),
                funcao: pArrayData[23].trim(),
                level: pArrayData[24].trim(),
                matriculaGestor: leftPad(pArrayData[25].trim(), 10, '0', pDataset),
                nomeGestor: pArrayData[26].trim(),
                sitEmpregado: pArrayData[27].trim(),
                sitEmpregadoStatus: pArrayData[28].trim(),
                siglaAfastamento: pArrayData[29].trim(),
                salarioHora: pArrayData[30].trim()
            }
            JSONFuncionario.push(data)
        }

        if (pIndArquivo == 4) {
            // pDataset.addRow(new Array('cargo: ' + pArrayData[0].trim()));
            var data = {
                codCargo: leftPad(pArrayData[0].trim(), 5, '0', pDataset),
                cargo: pArrayData[1].trim(),
                reduzido: pArrayData[2].trim(),
                cbo: pArrayData[3].trim(),
                situacao: pArrayData[4].trim(),
            }
            JSONCargos.push(data)
        }

        if (pIndArquivo == 5) {

            var data = {
                codFuncao: leftPad(pArrayData[0].trim(), 5, '0', pDataset),
                funcao: pArrayData[1].trim(),
                level: pArrayData[2].trim(),
                codCargo: pArrayData[3].trim(),
                cboCargo: pArrayData[4].trim()
            }
            JSONFuncoes.push(data)
        }

    } catch (error) {
        pDataset.addRow(new Array('Erro ao processar: ' + pIndArquivo + ' - ' + error.toString() + " - Linha: " + error.lineNumber));
    }
}

function f_getFilesFolder(pPath, pDataset, pArrRetorno) {
    try {
        var arFiles = pPath.listFiles();
        var arrRetorno = pArrRetorno;

        for (let i = 0; i < arFiles.length; i++) {
            let arquivo = arFiles[i];

            if (arquivo.getName().endsWith("csv")) {

                let wPathFile = pPath.getParent() + '/' + pPath.getName() + "/" + arquivo.getName();
                var data = {
                    arquivo: wPathFile
                }

                // pDataset.addRow(new Array('Arquivo Encontrado', wPathFile, ''));

                // if (arquivo.getName() == 'adp_fluig_centro_de_resultado.csv') {
                arrRetorno.push(data);
                // }
            }
        }

    } catch (error) {
    }

    return arrRetorno;
}

function f_processaDados(pDataset) {
    try {
        var statementWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();

        var SQL = "delete ztabposicaofuncperiodo where AnoMesPeriodo = CONVERT(VARCHAR(7), GETDATE(), 120)"
        statementWD = connectionWD.prepareStatement(SQL);
        statementWD.executeUpdate();


        SQL = "insert into ztabposicaofuncperiodo " +
            " select CONVERT(VARCHAR(7), GETDATE(), 120) as AnoMesPeriodo, " +
            "     f.codEmpresa as CodEmpresa, " +
            "     f.estabCliente as CodFilial, " +
            "     f.matricula as Chapa, " +
            "     f.nome as NomeFuncionario, " +
            "     '' as PisPasep, " +
            "     f.salario as ValorSalario, " +
            "     dbo.kbt_f_formata_secao(sec.codADP) as Codsecao "+ //substring(sec.codADP, 1, 1) + '.' + substring(sec.codADP, 2, 3) + '.' + substring(sec.codADP, 5, 2) + '.' + substring(sec.codADP, 7, 3) + '.' + substring(sec.codADP, 10, 3) as Codsecao, " +
            "     sec.nome as NomeSecao, " +
            "     f.codContabilidade as CODCCUSTO, " +
            "     f.codFuncao as CodCargo, " +
            "     f.funcao as NomeCargo, " +
            "     f.codSindicato as CodSindicato, " +
            "     f.sindicato as NomeSindicato, " +
            "     f.datAdimissao as DataAdmissao, " +
            "     f.datDesligamento as DataDemissao, " +
            "     DAY(EOMONTH(GETDATE())) as NumDiasMes, " +
            "     DAY(EOMONTH(GETDATE())) as NumDiasAtivoNoMes, " +
            "     f.estabelecimento as NomeLocal " +
            " from adp_funcionarios f " +
            " join adp_centro_resultado sec on(sec.codADP = f.codCentroResultado)" +
            " where ( f.datDesligamento between DATEADD(DAY, 1, EOMONTH(GETDATE(), -1)) and EOMONTH(GETDATE()) "+
            "      or f.datDesligamento is null ) ";
        statementWD = connectionWD.prepareStatement(SQL);
        statementWD.executeUpdate();

    } catch (error) {
        pDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();
    }
}

function f_gravaBanco(pDataset) {

    // log.info("antes data adp");
    formatter = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm");

    // log.info("data adp");
    // log.info(formatter.format(new java.util.Date()));
    try {
        const wRetorno = {
            status: true,
            mesage: ''
        };
        var statementWD = null;
        var connectionWD = null;
        var contextWD = new javax.naming.InitialContext();
        var dataSourceWD = contextWD.lookup("java:/jdbc/FluigDS");
        connectionWD = dataSourceWD.getConnection();

        connectionWD.setAutoCommit(false);

        for (let i = 0; i < JsonParam.length; i++) {
            statementWD = connectionWD.prepareStatement("delete from " + JsonParam[i].tabela);
            statementWD.executeUpdate();
        }
        pDataset.addRow(new Array('clear tabelas', JsonParam.length, formatter.format(new java.util.Date())));

        if (JSONEmpresa.length > 0) {

            var SQL = "insert into adp_empresas (codempresa,fantasia,cnpj,razao,inscricao,telefone,fax,email,endereco,numero,complemento,bairro,cidade,uf,pais,cep,datImportacao) " +
                " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,GETDATE())";
            statementWD = connectionWD.prepareStatement(SQL);

            for (let i = 0; i < JSONEmpresa.length; i++) {
                statementWD.setInt(1, JSONEmpresa[i].empresa);
                statementWD.setString(2, JSONEmpresa[i].nomeFantasia);
                statementWD.setString(3, JSONEmpresa[i].cnpj);
                statementWD.setString(4, JSONEmpresa[i].nomRazao);
                statementWD.setString(5, JSONEmpresa[i].inscricao);
                statementWD.setString(6, JSONEmpresa[i].telefone);
                statementWD.setString(7, JSONEmpresa[i].fax);
                statementWD.setString(8, JSONEmpresa[i].email);
                statementWD.setString(9, JSONEmpresa[i].endereco);
                // statementWD.setString(10, '557');
                statementWD.setString(10, JSONEmpresa[i].numero);
                statementWD.setString(11, JSONEmpresa[i].complemento);
                statementWD.setString(12, JSONEmpresa[i].bairro);
                statementWD.setString(13, JSONEmpresa[i].cidade);
                statementWD.setString(14, JSONEmpresa[i].uf);
                statementWD.setString(15, JSONEmpresa[i].pais);
                statementWD.setString(16, JSONEmpresa[i].cep);

                statementWD.executeUpdate();

            }

            pDataset.addRow(new Array('adp_empresas', JSONEmpresa.length, formatter.format(new java.util.Date())));


        }

        if (JSONResultado.length > 0) {

            var SQL = "insert into adp_centro_resultado (codEmpresa,razao,estabADP,estabCliente,codADP,codConta,sigla,nome,descricao,situacao,pagaInsalubridade,percInsalubridade,datImportacao) " +
                " values (?,?,?,?,?,?,?,?,?,?,?,?,GETDATE())";
            statementWD = connectionWD.prepareStatement(SQL);

            for (let i = 0; i < JSONResultado.length; i++) {
                statementWD.setInt(1, JSONResultado[i].empresa);
                statementWD.setString(2, JSONResultado[i].nomeRazao);
                statementWD.setString(3, JSONResultado[i].EstabADP);
                statementWD.setString(4, JSONResultado[i].EstabCliente);
                statementWD.setString(5, JSONResultado[i].codADP);
                statementWD.setString(6, JSONResultado[i].codConta);
                statementWD.setString(7, JSONResultado[i].sigla);
                statementWD.setString(8, JSONResultado[i].nome);
                statementWD.setString(9, JSONResultado[i].descricao);
                statementWD.setString(10, JSONResultado[i].situacao);
                statementWD.setString(11, JSONResultado[i].pagaInsalubridade);
                statementWD.setString(12, JSONResultado[i].insalubridade);

                statementWD.executeUpdate();

            }

            pDataset.addRow(new Array('adp_centro_resultado', JSONResultado.length, formatter.format(new java.util.Date())));
        }

        if (JSONFilial.length > 0) {

            var SQL = "insert into adp_filial (codEmpresa,razao,estabADP,estabCliente,fantasia,cnpj,endereco,numero,bairro,complemento,cep,cidade,uf,pais,datImportacao) " +
                " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,GETDATE())";
            statementWD = connectionWD.prepareStatement(SQL);

            for (let i = 0; i < JSONFilial.length; i++) {
                statementWD.setInt(1, JSONFilial[i].empresa);
                statementWD.setString(2, JSONFilial[i].nomeRazao);
                statementWD.setInt(3, JSONFilial[i].EstabADP);
                statementWD.setString(4, JSONFilial[i].EstabCliente);
                statementWD.setString(5, JSONFilial[i].nomeFantasia);
                statementWD.setString(6, JSONFilial[i].cnpj);
                statementWD.setString(7, JSONFilial[i].endereco);
                statementWD.setString(8, JSONFilial[i].numero);
                statementWD.setString(9, JSONFilial[i].bairro);
                statementWD.setString(10, JSONFilial[i].complemento);
                statementWD.setString(11, JSONFilial[i].cep);
                statementWD.setString(12, JSONFilial[i].cidade);
                statementWD.setString(13, JSONFilial[i].uf);
                statementWD.setString(14, JSONFilial[i].pais);

                statementWD.executeUpdate();

            }

            pDataset.addRow(new Array('adp_filial', JSONFilial.length, formatter.format(new java.util.Date())));
        }

        if (JSONFuncionario.length > 0) {

            var SQL = "insert into adp_funcionarios (codEmpresa,razao,estabADP,estabCliente,estabelecimento,matricula,nome,datNascimento,datAdimissao,datDesligamento, " +
                "   salario, codEscala, codTurma, horas, cpf, rg, codCentroResultado, codContabilidade, codSindicato, sindicato, codCargo, cargo, codFuncao, funcao, level, matriculaGestor, " +
                "   gestor, situacaoEmp, saituacaoEmpStatus, sigla,salarioHora,datImportacao) " +
                " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE())";
            statementWD = connectionWD.prepareStatement(SQL);

            var sdD = new java.text.SimpleDateFormat("yyyy-MM-dd");

            for (let i = 0; i < JSONFuncionario.length; i++) {
                statementWD.setInt(1, JSONFuncionario[i].empresa);
                statementWD.setString(2, JSONFuncionario[i].nomeRazao);
                statementWD.setInt(3, JSONFuncionario[i].EstabADP);
                statementWD.setString(4, JSONFuncionario[i].EstabCliente);
                statementWD.setString(5, JSONFuncionario[i].estabelecimento);
                statementWD.setString(6, JSONFuncionario[i].matricula);
                statementWD.setString(7, JSONFuncionario[i].nome);

                if (JSONFuncionario[i].datNascimento != null && JSONFuncionario[i].datNascimento != '') {
                    statementWD.setString(8, new java.sql.Date(sdD.parse(JSONFuncionario[i].datNascimento).getTime()));
                } else {
                    statementWD.setNull(8, java.sql.Types.NULL);
                }

                if (JSONFuncionario[i].datAdmissao != null && JSONFuncionario[i].datAdmissao != '') {
                    statementWD.setString(9, new java.sql.Date(sdD.parse(JSONFuncionario[i].datAdmissao).getTime()));
                } else {
                    statementWD.setNull(9, java.sql.Types.NULL);
                }

                if (JSONFuncionario[i].datDesligamento != null && JSONFuncionario[i].datDesligamento != '') {
                    statementWD.setString(10, new java.sql.Date(sdD.parse(JSONFuncionario[i].datDesligamento).getTime()));
                } else {
                    statementWD.setNull(10, java.sql.Types.NULL);
                }

                statementWD.setDouble(11, parseFloat(JSONFuncionario[i].salario.replace('.', '').replace(',', '.')));
                statementWD.setInt(12, JSONFuncionario[i].codEscala);
                statementWD.setInt(13, JSONFuncionario[i].codTurma);
                statementWD.setString(14, parseFloat(JSONFuncionario[i].horasMensais.replace('.', '').replace(',', '.')));
                statementWD.setString(15, JSONFuncionario[i].cpf);
                if (JSONFuncionario[i].rg.trim() != '#NOME?') {
                    statementWD.setString(16, JSONFuncionario[i].rg);
                } else {
                    statementWD.setNull(16, java.sql.Types.NULL);
                }

                statementWD.setString(17, JSONFuncionario[i].codCentroResultado);
                statementWD.setString(18, JSONFuncionario[i].codContabilidade);
                statementWD.setString(19, JSONFuncionario[i].codSindicato);
                statementWD.setString(20, JSONFuncionario[i].sindicato);
                statementWD.setString(21, JSONFuncionario[i].codCargo);
                statementWD.setString(22, JSONFuncionario[i].cargo);
                statementWD.setString(23, JSONFuncionario[i].codFuncao);
                statementWD.setString(24, JSONFuncionario[i].funcao);
                statementWD.setString(25, JSONFuncionario[i].level);
                statementWD.setString(26, JSONFuncionario[i].matriculaGestor);
                statementWD.setString(27, JSONFuncionario[i].nomeGestor);
                statementWD.setString(28, JSONFuncionario[i].sitEmpregado);
                statementWD.setString(29, JSONFuncionario[i].sitEmpregadoStatus);
                statementWD.setString(30, JSONFuncionario[i].siglaAfastamento);
                statementWD.setString(31, parseFloat(JSONFuncionario[i].salarioHora.replace('.', '').replace(',', '.')));

                statementWD.executeUpdate();

            }

            // pDataset.addRow(new Array('adp_funcionarios ' + JSONFuncionario.length));
            pDataset.addRow(new Array('adp_funcionarios', JSONFuncionario.length, formatter.format(new java.util.Date())));
        }

        if (JSONCargos.length > 0) {

            var SQL = "insert into adp_cargos (codCargo,cargo,reduzido,CBO,situacao,datimportacao) " +
                " values (?,?,?,?,?,GETDATE())";
            statementWD = connectionWD.prepareStatement(SQL);

            for (let i = 0; i < JSONCargos.length; i++) {
                statementWD.setString(1, JSONCargos[i].codCargo);
                statementWD.setString(2, JSONCargos[i].cargo);
                statementWD.setString(3, JSONCargos[i].reduzido);
                statementWD.setString(4, JSONCargos[i].cbo);
                statementWD.setString(5, JSONCargos[i].situacao);

                statementWD.executeUpdate();

            }
            pDataset.addRow(new Array('adp_cargos', JSONCargos.length, formatter.format(new java.util.Date())));
        }

        if (JSONFuncoes.length > 0) {

            var SQL = "insert into adp_funcoes (codFuncao,funcao,level,codCargo,cboCargo,datimportacao) " +
                " values (?,?,?,?,?,GETDATE())";
            statementWD = connectionWD.prepareStatement(SQL);

            for (let i = 0; i < JSONFuncoes.length; i++) {
                statementWD.setString(1, JSONFuncoes[i].codFuncao);
                statementWD.setString(2, JSONFuncoes[i].funcao);
                statementWD.setString(3, JSONFuncoes[i].level);
                statementWD.setString(4, JSONFuncoes[i].codCargo);
                statementWD.setString(5, JSONFuncoes[i].cboCargo);

                statementWD.executeUpdate();

            }
            pDataset.addRow(new Array('adp_funcoes', JSONFuncoes.length, formatter.format(new java.util.Date())));
        }

        connectionWD.commit();


    } catch (error) {
        wRetorno.status = false;
        wRetorno.mesage = "Erro: " + error + " - Linha: " + error.lineNumber
        connectionWD.rollback();
        // pDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    } finally {
        connectionWD.setAutoCommit(true);
        if (statementWD != null) statementWD.close();
        if (connectionWD != null) connectionWD.close();

        return wRetorno;
    }
}

function f_processaArquivos(pDataset) {
    try {
        var constraints = new Array();
        var dataSetParam = DatasetFactory.getDataset("parametros_rh", null, null, null);
        if (dataSetParam != null) {
            if (dataSetParam.rowsCount == 0) {
                pDataset.addRow(new Array("Parâmetros de integração não encontrados"));
                throw "Parâmetros de integração não encontrados";
            }
        }

        pathFiles = dataSetParam.getValue(0, "camimho_adp");

        var arrRetorno = [];
        var Files = new java.io.File(pathFiles);
        f_getFilesFolder(Files, pDataset, arrRetorno);

        // return false;

        if (arrRetorno.length == 0) {
            // pDataset.addRow(new Array('Path: ' + pathFiles));
            pDataset.addRow(new Array('Nenhum arquivo encontrado na pasta: ' + pathFiles));
            return;
        }

        for (var i = 0; i < arrRetorno.length; i++) {
            var wArquivo = arrRetorno[i].arquivo;
            var reader = null;
            var charset = new java.nio.charset.Charset.forName("iso-8859-1");


            let wIdentity = f_identityFile(arrRetorno[i].arquivo.toUpperCase(), pDataset);
            if (wIdentity == null) continue;
            try {
                // reader = new java.io.BufferedReader(new java.io.FileReader(wArquivo));
                reader = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(wArquivo), charset));
                var line = null;
                var nLinha = 0;
                while ((line = reader.readLine()) != null) {
                    if (nLinha == 0) {
                        nLinha++;
                        continue;
                    }

                    var linha = line.split(csvDivisor);
                    f_mountDados(wIdentity, linha, pDataset)
                    nLinha++;
                    // return false;
                }

            } catch (e) {
                throw e;
            } finally {
                if (reader != null) {
                    reader.close();
                }
            }
        }

        const wIndRecSalve = f_gravaBanco(pDataset);
        if (wIndRecSalve.status) {
            f_processaDados(pDataset)
            pDataset.addRow(new Array('Processamento de arquivos completado...'));
        } else {
            pDataset.addRow(new Array('Erro ao processar os arquivos...'));
            pDataset.addRow(new Array(wIndRecSalve.mesage));
        }



    } catch (error) {
        pDataset.addRow(new Array("Erro: " + error + " - Linha: " + error.lineNumber));
    }
}

function onMobileSync(user) {

}

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

function leftPad(value, totalWidth, paddingChar, pDataset) {
    try {
        var stringL = value.length();
        var strAppend = '';

        for (let i = 0; i < (parseInt(totalWidth) - stringL); i++) {
            strAppend = strAppend + paddingChar;
        }

        return strAppend + value;

    } catch (error) {
        pDataset.addRow(new Array('Erro Padding: ' + error.toString()));
    }

}