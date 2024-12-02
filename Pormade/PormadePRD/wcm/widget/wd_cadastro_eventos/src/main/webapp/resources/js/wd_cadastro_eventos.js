var Eventos = SuperWidget.extend({
  init: function () {
    const that = this;

    const ambienteHomolog = WCMAPI.serverURL.includes('fluigtst.pormade.com.br');
    const documentIdForm = ambienteHomolog ? '88415' : '';

    const load = FLUIGC.loading('#app');

    const { formularioUtils, fluigAPI, calendarUtils, datasetUtils, utils } = window;

    if (that.isEditMode == false)
      that.app = new Vue({
        el: '#app',
        data: {
          calendar: null,
          modoVisualizacao: 'month',
          eventos: []
        },

        methods: {
          async iniciarFormulario() {
            const formulario = await formularioUtils.abrirFormulario(null, documentIdForm);
            if (!!formulario == false) return;

            load.show();

            const response = await fluigAPI.salvarFormulario(documentIdForm, formulario);
            if (response.success) {
              FLUIGC.toast({ message: 'Evento criado com sucesso', type: 'success' });
            } else {
              FLUIGC.toast({ message: 'Erro ao criar evento', type: 'danger' });
              console.log(response.data);
            }

            load.hide();
          }
        },

        computed: {
          intervaloData() {
            if (this.calendar == null) return '';

            const viewName = this.calendar.getViewName();

            if (viewName === 'day') return moment(this.calendar.getDateRangeStart().getTime()).format('DD/MM/YYYY');
            if (viewName === 'month') return moment(this.calendar.getDate().getTime()).format('MM/YYYY');
            return `${moment(this.calendar.getDateRangeStart().getTime()).format('DD/MM/YYYY')} ~ ${moment(
              this.calendar.getDateRangeEnd().getTime()
            ).format('DD/MM/YYYY')}`;
          }
        },

        watch: {
          modoVisualizacao(value) {
            this.calendar.changeView(value, true);
          }
        },

        async mounted() {
          load.show();
          const eventos = await datasetUtils.buscarEventos();
          load.hide();

          const usuarios = utils.extractUserFromEvents(eventos);
          const calendars = calendarUtils.parseUsersToCalendars(usuarios);
          const schedules = calendarUtils.parseEventsToSchedules(eventos);

          const calendar = new tui.Calendar('#calendar', {
            defaultView: this.modoVisualizacao,
            taskView: false,
            usageStatistics: false,
            useCreationPopup: false,
            useDetailPopup: true,
            timezone: calendarUtils.getTimeZone(),
            template: calendarUtils.getTemplate(),
            calendars
          });

          calendar.createSchedules(schedules);

          calendar.on('clickDayname', event => {
            console.log(event);
            if (calendar.getViewName() === 'week') {
              calendar.setDate(event.date);
              this.modoVisualizacao = 'day';
            }
          });

          calendar.on('beforeDeleteSchedule', event => {
            console.log(event);
          });

          calendar.on('beforeUpdateSchedule', event => {
            console.log(event);
          });


          this.eventos = eventos;
          this.calendar = calendar;
        }
      });
  }
});
