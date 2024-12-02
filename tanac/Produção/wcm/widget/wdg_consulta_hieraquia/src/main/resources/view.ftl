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


                        <div class="col-md-3">
                            <label class="control-label" for="txtNome">Gestor</label>
                            <div class="input-group">
                                <input type="hidden" class="grp_cadastro" name="cod_cadastro_${instanceId}" id="cod_cadastro_${instanceId}"/>
                                <input type="text" class="form-control grp_nivel valida" name="nome_cadastro_${instanceId}'" id="nome_cadastro_${instanceId}" valida="field" readonly/>
                                <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_cadastro').val('')"></span>
                                <span id="bt_cadastro" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                            </div> 
                        </div> 

                        <div class="col-md-2">
                            <label class="control-label" for="txtNome">Empresa</label>
                            <div class="input-group">
                                <input type="hidden" class="grp_empresa" name="cod_empresa_${instanceId}" id="cod_empresa_${instanceId}"/>
                                <input type="text" class="form-control grp_empresa valida" name="nome_empresa_${instanceId}'" id="nome_empresa_${instanceId}" valida="field" readonly/>
                                <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_empresa').val('')"></span>
                                <span id="bt_empresa" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                            </div> 
                        </div> 

                        <div class="col-md-2">
                            <label class="control-label" for="txtNome">Filial</label>
                            <div class="input-group">
                                <input type="hidden" class="grp_filial" name="cod_filial_${instanceId}" id="cod_filial_${instanceId}"/>
                                <input type="text" class="form-control grp_filial valida" name="nome_filial_${instanceId}'" id="nome_filial_${instanceId}" valida="field" readonly/>
                                <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_filial').val('')"></span>
                                <span id="bt_filial" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                            </div> 
                        </div> 

                        <div class="col-md-2">
                            <label class="control-label" for="txtNome">Seção</label>
                            <div class="input-group">
                                <input type="hidden" class="grp_secao" name="cod_secao_${instanceId}" id="cod_secao_${instanceId}"/>
                                <input type="text" class="form-control grp_secao valida" name="nome_secao_${instanceId}'" id="nome_secao_${instanceId}" valida="field" readonly/>
                                <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_secao').val('')"></span>
                                <span id="bt_secao" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                            </div> 
                        </div>                         
					</div>
					<div class="row">


                        <div class="col-md-2">
                            <label class="control-label" for="txtNome">Departamento</label>
                            <div class="input-group">
                                <input type="hidden" class="grp_departamento" name="cod_departamento_${instanceId}" id="cod_departamento_${instanceId}"/>
                                <input type="text" class="form-control grp_departamento valida" name="nome_departamento_${instanceId}'" id="nome_departamento_${instanceId}" valida="field" readonly/>
                                <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_departamento').val('')"></span>
                                <span id="bt_departamento" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                            </div> 
                        </div> 	

                        <div class="col-md-2">
                            <label class="control-label" for="txtNome">Função</label>
                            <div class="input-group">
                                <input type="hidden" class="grp_funcao" name="cod_funcao_${instanceId}" id="cod_funcao_${instanceId}"/>
                                <input type="text" class="form-control grp_funcao valida" name="nome_funcao_${instanceId}'" id="nome_funcao_${instanceId}" valida="field" readonly/>
                                <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_funcao').val('')"></span>
                                <span id="bt_funcao" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                            </div> 
                        </div> 																								


						<div class="col-md-2">
                            <label class="control-label" for="indParametro_">Situacao</label>
                            <select id="indSituacao_${instanceId}" name="indSituacao_${instanceId}" class="form-control grp_user valida" onchange="loadDataTable(this.value);" >
                                <option value="A" selected>Ativos</option>
                                <option value="D">Demitidos</option>
                            </select>
						</div>	


						<div class="col-sm-3">
							
							<label class="control-label">&nbsp;</label>
							<div class="input-group">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-default" data-load-filtrar >Consultar</button>
                                    <button type="button" class="btn btn-default" data-load-excel>Exportar</button>
                      
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
				<div class="panel panel-success class">
					<div class="panel-heading fs-txt-center">
						<table width="100%">
							<tr>
								<td width="5%" align=left></button></td>
								<td width="90%" align=center><b><span style="color:white;">Colaboradores</span></b></td>
								<td width="5%" align=right><b></b></td>
							</tr>
						</table>
					</div>
					<div class="panel-body"> <div id="idtable_${instanceId}"></div>  </div>
				</div>

								
			</div>
		</div>      
    </form>
</div>