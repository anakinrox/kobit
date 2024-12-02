<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>

<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
    <form class="form-horizontal">
		<#--  Título  -->
        <div class="row page-header">
            <div class="col-md-10 fs-no-padding fs-cursor-pointer">
                <h1 id="page_title"></h1>
            </div>
            <div class="col-md-2 text-right fs-no-padding">
                <h1 class="fluigicon fluigicon-info-sign icon-md bs-docs-popover-hover"></h1>
            </div>
        </div>

        <#--  Painel  -->
        <div class="panel panel-default">
            <#--  Header  -->
			<div class="panel-heading">
				<h4 class="panel-title">
					<a class="collapse-icon up" data-toggle="collapse" data-parent="#accordion" href="#collapseGeral" aria-expanded="true">Filtros</a>
				</h4>
			</div>
            <#--  Body  -->
            <div id="collapseGeral" class="panel-collapse collapse in" aria-expanded="true">
				<div class="panel-body">
					<div class="row">

						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Gestor Vendas</label>
							<div class="input-group">
								<input type="hidden" class="grp_user" name="cod_gestor_${instanceId}" id="cod_gestor_${instanceId}"/>
								<input type="text" class="form-control grp_user valida" name="nome_gestor_${instanceId}" id="nome_gestor_${instanceId}" valida="field" readonly/>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_user').val('')"></span>
								<span id="bt_gestor" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
							</div>
						</div>

						<div class="col-sm-2">
							<label class="control-label" for="nomeUF">Estado</label>
							<div class="input-group">
								<select id="nomeUF_${instanceId}" name="nomeUF_${instanceId}" class="form-control grp_user valida">
									<option value="" selected>Escolha o estado</option>
									<option value="AC">Acre</option>
									<option value="AL">Alagoas</option>
									<option value="AP">Amapá</option>
									<option value="AM">Amazonas</option>
									<option value="BA">Bahia</option>
									<option value="CE">Ceará</option>
									<option value="DF">Distrito Federal</option>
									<option value="ES">Espírito Santo</option>
									<option value="GO">Goiás</option>
									<option value="MA">Maranhão</option>
									<option value="MT">Mato Grosso</option>
									<option value="MS">Mato Grosso do Sul</option>
									<option value="MG">Minas Gerais</option>
									<option value="PA">Pará</option>
									<option value="PB">Paraíba</option>
									<option value="PR">Paraná</option>
									<option value="PE">Pernambuco</option>
									<option value="PI">Piauí</option>
									<option value="RJ">Rio de Janeiro</option>
									<option value="RN">Rio Grande do Norte</option>
									<option value="RS">Rio Grande do Sul</option>
									<option value="RO">Rondônia</option>
									<option value="RR">Roraima</option>
									<option value="SC">Santa Catarina</option>
									<option value="SP">São Paulo</option>
									<option value="SE">Sergipe</option>
									<option value="TO">Tocantins</option>
								</select>
							</div>
						</div>						

						<div class="col-sm-2">
							<label class="control-label" for="txtNome">Tipo Cadastro</label>
							<div class="input-group">
								<input type="hidden" class="grp_user" name="codregistro_${instanceId}" id="codregistro_${instanceId}"/>
								<input type="text" class="form-control grp_user valida" name="nome_registro_${instanceId}" id="nome_registro_${instanceId}" valida="field" readonly/>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_user').val('')"></span>
								<span id="bt_cadastro" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
							</div>
						</div>


						<div class="col-sm-3">
							<label class="control-label" for="txtNome">Usuário</label>
							<div class="input-group">
								<input type="hidden" class="grp_user" name="matricula_${instanceId}" id="matricula_${instanceId}"/>
								<input type="text" class="form-control grp_user valida" name="nome_usuario_${instanceId}" id="nome_usuario_${instanceId}" valida="field" readonly/>
								<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_user').val('')"></span>
								<span id="bt_user" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
							</div>
						</div>

						<div class="col-md-2">
							<label class="control-label">&nbsp;</label>
							<div class="input-group">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default" data-load-filtrar >Consultar</button>
                                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">									
                                        <span class="caret"></span>
                                        <span class="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <ul class="dropdown-menu" role="menu">
                                        <#--  <li class="divider"></li>  -->
                                        <li data-load-editarMeta id="btNovaMeta" onclick="localChamado='inc';"><a href="#">Incluir Meta</a></li>
                                        <#--  <li data-load-excel id="loadExcel" ><a href="#">Exportar Excel</a></li>  -->
                                    </ul>
                                </div>
							</div>
						</div>
					</div>
                
				</div>
			</div>
        </div>

		<#--  table para listar dados  -->
		<div class="row">
			<div class="col-md-12">
				<div id="idtable_${instanceId}"></div>					
			</div>
		</div>      
    </form>
</div>