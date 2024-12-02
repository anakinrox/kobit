<script src="/webdesk/vcXMLRPC.js" type="text/javascript"></script>

<div id="MyWidget_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyWidget.instance()">
    <form class="form-horizontal">
 		<#--  Título  -->
        
        <div class="row page-header">
            <div class="col-md-10 fs-no-padding fs-cursor-pointer">
                <h1 id="page_title"></h1>
            </div>
            <div class="col-md-12 text-right fs-no-padding">
                <h1 class="fluigicon fluigicon-info-sign icon-md bs-docs-popover-hover"></h1>
            </div>
        </div>

        <div class="CorpoConfirmacao" style="display:none;">
            <div class="row">
                <div class="col-md-12 text-left">
                    <blockquote>
                        <p>Sua opinião é a nossa prioridade!</p>
                        <p>Estamos constantemente buscando maneiras de aprimorar nossos processos para atender às suas expectativas. </p>
                        <p>Obrigado pelas informações. </p>
                    </blockquote>
                </div>
            </div>
        </div>        
        
        <div class="CorpoMensagem">
            <div class="row">
                <div class="col-md-12 text-left">
                    <h1><strong>Caro Sr(a). <span id="nomCLiente"></span></strong></h1>
                    <blockquote>
                        <p>Estamos informando que as portas já foram instaladas. .</p>
                        <p>Gostaríamos da sua presença na obra para a conferência e avaliação do nosso prestador de serviço/Instalador</p>
                        <p>Sua presença é muito importante!.</p>
                    </blockquote>
                </div>
            </div>
    
            <div class="row">
                <div class="col-md-4" id="target">
                    <h1><label class="control-label" for="txtNome">Aprova a instalação</label></h1>

                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="aprovar" value="S" id="aprovar">
                        <label for="aprovar">Sim</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="aprovar" value="N" id="naprovar">
                        <label for="naprovar">Não</label>
                    </div>                
                </div>
            </div>

            <div class="row" id="idNotaAprovacao" style="display:none;">
                <div class="col-sm-12">     
                    <h2><label class="control-label" for="txtNome">Qual a nota você dá para instalação realizada</label></h2>

                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="0" id="0">
                        <label for="0">0</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="0" id="1">
                        <label for="1">1</label>
                    </div>                    
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="2" id="2">
                        <label for="2">2</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="3" id="3">
                        <label for="3">3</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="4" id="4">
                        <label for="4">4</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="5" id="5">
                        <label for="5">5</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="6" id="6">
                        <label for="6">6</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="7" id="7">
                        <label for="7">7</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="8" id="8">
                        <label for="8">8</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="9" id="9">
                        <label for="9">9</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="numNota" value="10" id="10">
                        <label for="10">10</label>
                    </div>                                                                                                                                                                                    
                </div>                
            </div> 

            <div class="row" id="idMotivoAprovacao" style="display:none;">
                <div class="col-sm-12">     
                    <h2><label class="control-label" for="txtNome">Descreva os motivos para não aprovação</label></h2>
                    <textarea
                        class="form-control fs-no-resize"
                        name="desc_motivo"
                        id="desc_motivo"
                        rows="6"></textarea>
                </div>                
            </div>              

            <div class="row">
                <div class="col-md-8" id="target">
                    <h2><label class="control-label" for="txtNome">Você visitou o local da instalação após a conclusão para validar o serviço prestado?</label></h2>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="foi_local" value="S" id="radio-3">
                        <label for="radio-3">Sim</label>
                    </div>
                    <div class="custom-radio custom-radio-inline custom-radio-primary custom-radio-xl">
                        <input type="radio" name="foi_local" value="N" id="radio-4">
                        <label for="radio-4">Não</label>
                    </div>          
                </div>
            </div>                        
        
            <div class="row">
                <div class="col-md-12">&nbsp;</div>
            </div>     

            <div class="row">
                <div class="col-md-12" id="target">
                    <div id="idtable_${instanceId}" ></div>
                </div>
            </div>   
            <div class="row">
                <div class="col-md-12">&nbsp;</div>
            </div>   
            <div class="row">
                <div class="col-md-12">
                    <p class="text-right"><button type="button" class="btn btn-success" data-load-confirmaInstalacao ><i class="flaticon flaticon-done icon-md" aria-hidden="true">Confirmar</i></button></p>   
                </div>
            </div>   
        </div>             
    </form>
</div>

