<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>

<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
<div id="root_${instanceId}">

		<form class="form-horizontal">

        <div class="panel panel-default" id="geral">
					<div class="panel-heading">
						<h4 class="panel-title">
							<a class="collapse-icon up" data-toggle="collapse" data-parent="#accordion" href="#collapseGeral" aria-expanded="true">Filtros</a>
						</h4>
					</div>
					<div id="collapseGeral" class="panel-collapse collapse in" aria-expanded="true">
						<div class="panel-body" id="body_filtros_${instanceId}">
							<div class="row">

								<div class="col-sm-2">
                  <label for="txtNome">Lançamentos</label>
									<select name="lancamentos_${instanceId}" id="lancamentos_${instanceId}" class="form-control" onchange="mostraFiltros();">
										<option value='R'>Receitas</option>
										<option value='D'>Despesas</option>
										<option value='G'>Descarga</option>										
                    <option value='A'>Abastecimento</option>
									</select> 
                </div>

                <div class="col-sm-2">
                  <label for="txtNome">Data Refer</label>
									<select name="data_refer_${instanceId}" id="data_refer_${instanceId}" class="form-control" >
										<option value='F'>Data Fechamento</option>
										<option value='C'>Data Chegada</option>
										<option value='S'>Data Saída</option>
                    <option value='L'>Data Lançamento</option>                    
									</select> 
                </div>	

                <div class="col-md-3">
                  <div class="col-md-6" style="padding-left: 0px; padding-right: 0px;" >
										<label class="control-label" for="dt_ini_${instanceId}">Data ini</label>
										<input type="text" class="form-control data-fluig" name="dt_ini_${instanceId}" id="dt_ini_${instanceId}" />
									</div>
									<div class="col-md-6" style="padding-left: 0px; padding-right: 0px;" >
										<label class="control-label" for="dt_fim_${instanceId}">Data fim</label>
										<input type="text" class="form-control data-fluig" name="dt_fim_${instanceId}" id="dt_fim_${instanceId}" />
									</div>
								</div>	
                
								<div class="col-sm-3">
                  <label for="txtNome">Motorista</label>
                  <div class="input-group">
                    <input type="text" name="motorista_${instanceId}" id="motorista_${instanceId}" class="form-control grp_motorista" readonly>
                    <input type="hidden" name="cod_motorista_${instanceId}" id="cod_motorista_${instanceId}" class="grp_motorista">
										<span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_motorista').val('')"></span>
                    <span id="bt_motorista" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>										
                  </div>
                </div>

				        <div class="col-sm-2">
                  <label for="txtNome">Placa</label>
                  <div class="input-group">
                    <input name="placa_${instanceId}" id="placa_${instanceId}" type="text" class="form-control">
                    <span id="bt_placa" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>
                  </div>
                </div>
              
              </div>

              <div class="row">

               
                <div class="col-sm-2">
                  <label for="txtNome">Proprietário</label>
                  <div class="input-group">
                    <input type="text" name="den_proprietaria_${instanceId}" id="den_proprietaria_${instanceId}" class="form-control grp_proprietaria" readonly>
                    <input type="hidden" name="cod_proprietaria_${instanceId}" id="cod_proprietaria_${instanceId}" class="grp_proprietaria">
                    <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_proprietaria').val('')"></span>
                    <span id="bt_proprietaria" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>										
                  </div>
                </div>

                <div class="col-sm-2">
                  <label for="txtNome">Estado</label>
                  <div class="input-group">
                    <input type="hidden" name="estado_${instanceId}" id="estado_${instanceId}" class="grp_estado">
                    <input type="text" name="uf_${instanceId}" id="uf_${instanceId}" class="form-control grp_estado" readonly>                    
                    <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_estado').val('')"></span>
                    <span id="bt_estado" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>										
                  </div>
                </div>

                <div class="col-sm-2">
                  <label for="txtNome">NF</label>
                  <input type="text" name="nf_${instanceId}" id="nf_${instanceId}" class="form-control">
                </div>
                
                <div class="receitas">
                  <div class="col-sm-3">
                    <label for="txtNome">Tipo Receita</label>
                    <div class="input-group">
                      <input type="text" name="den_receita_${instanceId}" id="den_receita_${instanceId}" class="form-control grp_receita" readonly>
                      <input type="hidden" name="cod_receita_${instanceId}" id="cod_receita_${instanceId}" class="grp_receita">
                      <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_receita').val('')"></span>
                      <span id="bt_receita" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>										
                    </div>
                  </div>

                  <div class="col-sm-2">
                    <label for="txtNome">Tipo Frete</label>
                    <select name="tipo_frete_${instanceId}" id="tipo_frete_${instanceId}" class="form-control">
                      <option value="">Todos</option>
                      <option value="P">Frete Pormade</option>
                      <option value="R">Retorno Pormade</option>
                      <option value="T">Frete Terceiro</option>                      
                    </select>
                  </div>

                  <div class="col-sm-1">
                    <label for="txtNome">Retorno</label>
                    <select name="retorno_${instanceId}" id="retorno_${instanceId}" class="form-control">
                      <option value="">Todos</option>
                      <option value="S">Sim</option>
                      <option value="N">Não</option>
                    </select>
                  </div>
                </div>

                <div class="despesas">
                  <div class="col-sm-3">
                    <label for="txtNome">Tipo Despesa</label>
                    <div class="input-group">
                      <input type="text" name="den_despesa_${instanceId}" id="den_despesa_${instanceId}" class="form-control grp_despesa" readonly>
                      <input type="hidden" name="cod_despesa_${instanceId}" id="cod_despesa_${instanceId}" class="grp_despesa">
                      <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_despesa').val('')"></span>
                      <span id="bt_despesa" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>										
                    </div>
                  </div>
                </div>

                <div class="descarga">
                  <div class="col-sm-3">
                    <label for="txtNome">Ajudante</label>
                    <div class="input-group">
                      <input type="text" name="den_ajudante_${instanceId}" id="den_ajudante_${instanceId}" class="form-control grp_descarga" readonly>
                      <input type="hidden" name="cod_ajudante_${instanceId}" id="cod_ajudante_${instanceId}" class="grp_descarga">
                      <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_descarga').val('')"></span>
                      <span id="bt_descarga" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>										
                    </div>
                  </div>
                </div>

                <div class="abastecimento">
                  <div class="col-sm-3">
                    <label for="txtNome">Posto</label>
                    <div class="input-group">
                      <input type="text" name="den_posto_${instanceId}" id="den_posto_${instanceId}" class="form-control grp_abast" readonly>
                      <input type="hidden" name="cod_posto_${instanceId}" id="cod_posto_${instanceId}" class="grp_abast">
                      <span class="input-group-addon fluigicon fluigicon-eraser fluigicon-sm" onclick="$('.grp_abast').val('')"></span>
                      <span id="bt_abastecimento" class="input-group-addon fluigicon fluigicon-zoom-in fluigicon-sm" onclick="zoom(this.id)"></span>										
                    </div>
                  </div>

                  <div class="col-sm-1">
                    <label for="txtNome">Pago</label>
                    <select name="pago_abastecimento_${instanceId}" id="pago_abastecimento_${instanceId}" class="form-control">
                      <option value="">Todos</option>
                      <option value="S">Sim</option>
                      <option value="N">Não</option>
                    </select>
                  </div>
                  
                  <div class="col-sm-2">
                    <label for="txtNome">Posto Próprio</label>
                    <select name="posto_proprio_${instanceId}" id="posto_proprio_${instanceId}" class="form-control">
                      <option value="">Todos</option>
                      <option value="S">Sim</option>
                      <option value="N">Não</option>
                    </select>
                  </div>

                  <div class="col-sm-1">
                    <label for="txtNome">Agrupador</label>
                    <select name="agrupador_${instanceId}" id="agrupador_${instanceId}" class="form-control">
                      <option value="motorista">Motorista</option>
                      <option value="nome_posto">Posto</option>
                    </select>
                  </div>
                  
                </div>

								<div class="col-md-2">
									<label for="txtNome">&nbsp;</label>
									<div class="input-group btDataTable" style="width: 100%;">
										<div class="btn-group">
										    <button type="button" class="btn btn-default btDataTable" data-load-filtrar >&nbsp;&nbsp;&nbsp;&nbsp;Filtro&nbsp;&nbsp;&nbsp;&nbsp;</button>
										    <button type="button" class="btn btn-default btDataTable dropdown-toggle" data-toggle="dropdown">
										    	<span class="caret"></span>
										    	<span class="sr-only">Toggle Dropdown</span>
										    </button>
											<ul class="dropdown-menu" role="menu">
												<li data-load-filtrar ><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Filtro&nbsp;&nbsp;&nbsp;&nbsp;</a></li>
                        <li class="divider"></li>
                        <#--  <li data-load-imprimir id="btImprimir" ><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Imprimir&nbsp;&nbsp;&nbsp;&nbsp;</a></li>  -->
                        <#--  <li data-load-print ><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Print&nbsp;&nbsp;&nbsp;&nbsp;</a></li>  -->
                        <li data-load-excel id="loadExcel" ><a href="#">&nbsp;&nbsp;&nbsp;&nbsp;Excel&nbsp;&nbsp;&nbsp;&nbsp;</a></li>
											</ul>
										</div>
									</div>												
								</div>

                <div class="col-md-12">

                <div id="idtable_${instanceId}"></div>
                
                </div>
							</div>																					
						</div>
					</div>          
				</div>        
      
      
    </form>
  v 08/01/2021 13:46
  </div> 
</div>