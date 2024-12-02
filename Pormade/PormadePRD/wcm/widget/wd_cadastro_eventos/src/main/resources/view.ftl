<!-- <link rel="stylesheet" type="text/css" href="https://uicdn.toast.com/tui-calendar/latest/tui-calendar.css" /> -->
<!-- If you use the default popups, use this. -->
<!-- <link rel="stylesheet" type="text/css" href="https://uicdn.toast.com/tui.date-picker/latest/tui-date-picker.css" /> -->
<!-- <link rel="stylesheet" type="text/css" href="https://uicdn.toast.com/tui.time-picker/latest/tui-time-picker.css" /> -->

<!-- JS -->

<!-- <script src="https://uicdn.toast.com/tui.code-snippet/v1.5.2/tui-code-snippet.min.js"></script> -->
<!-- <script src="https://uicdn.toast.com/tui.time-picker/latest/tui-time-picker.min.js"></script> -->
<!-- <script src="https://uicdn.toast.com/tui.date-picker/latest/tui-date-picker.min.js"></script> -->
<!-- <script src="https://uicdn.toast.com/tui-calendar/latest/tui-calendar.js"></script> -->

<div id="Eventos_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="Eventos.instance()">
  <div id="app">
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h4 class="panel-title">
          <i class="fluigicon fluigicon-calendar icon-sm"></i>
          <strong>Eventos</strong>
        </h4>
      </div>
      <div class="panel-body">
        <div class="text-right fs-lg-margin-bottom">
          <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-success" @click="iniciarFormulario">
              <i class="fluigicon fluigicon-plus icon-sm"></i>
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col-md-2 col-xs-12">
            <div class="form-group">
              <select class="form-control input-sm" v-model="modoVisualizacao">
                <option value="month">Mensal</option>
                <option value="week">Semanal</option>
                <option value="day">Diário</option>
              </select>
            </div>
          </div>
          <div class="col-md-1 col-xs-12">
            <div class="form-group">
              <button type="button" class="btn btn-default btn-sm btn-block" @click="calendar.today()">Hoje</button>
            </div>
          </div>
          <div class="btn-group btn-group-sm">
            <i class="btn btn-default fluigicon fluigicon-chevron-left icon-xs" @click="calendar.prev()"></i>
            <i class="btn btn-default fluigicon fluigicon-chevron-right icon-xs" @click="calendar.next()"></i>
          </div>

          <span class="fs-lg-margin-left">{{ intervaloData }}</span>
        </div>

        <div id="calendar" style="height: 600px"></div>
      </div>
    </div>
  </div>
</div>
<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>
