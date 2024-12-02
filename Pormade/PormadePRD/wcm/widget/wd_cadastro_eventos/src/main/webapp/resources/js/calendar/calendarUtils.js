const { utils } = window;

const dayWeek = day => {
  const days = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
  return days[day];
};

const getTimeZone = () => ({
  zones: [
    {
      timezoneName: 'America/Sao_Paulo',
      displayLabel: 'GMT-03:00',
      tooltip: 'São Paulo'
    }
  ],
  offsetCalculator: (timezoneName, timestamp) => moment.tz.zone(timezoneName).utcOffset(timestamp)
});

const padStart = (value, pad, caracter) => (value + '').padStart(pad, caracter);

const getTemplate = () => {
  return {
    alldayTitle: () => '<span class="tui-full-calendar-left-content">Dia todo</span>',
    weekDayname: model =>
      `</span>&nbsp;&nbsp;<span class="tui-full-calendar-dayname-name"> ${dayWeek(model.day)} (${moment(model.renderDate, 'YYYY-MM-DD').format(
        'DD/MM/YYYY'
      )}) </span>`,
    monthDayname: model => dayWeek(model.day),
    timegridDisplayPrimaryTime: time => `${padStart(time.hour, 2, '0')}:${padStart(time.minutes, 2, '0')}`,
    popupSave: () => 'Salvar',
    popupUpdate: () => 'Atualizar',
    titlePlaceholder: () => 'Descrição',
    popupIsAllDay: () => 'Dia todo',
    popupStateFree: () => 'Livre',
    popupStateBusy: () => 'Ocupado',
    locationPlaceholder: () => 'Localização',
    startDatePlaceholder: () => 'Data inicial',
    endDatePlaceholder: () => 'Data final',
    popupEdit: () => 'Editar',
    popupDelete: () => 'Apagar',
    popupDetailDate: (isAllDay, start, end) => {
      const isSameDate = moment(start.getTime()).isSame(end.getTime());

      if (isAllDay) {
        return isSameDate
          ? moment(start.getTime()).format('DD/MM/YYYY ')
          : moment(start.getTime()).format('DD/MM/YYYY ') + ' - ' + moment(end.getTime()).format('DD/MM/YYYY ');
      }

      return isSameDate
        ? moment(start.getTime()).format('DD/MM/YYYY  HH:mm')
        : moment(start.getTime()).format('DD/MM/YYYY  HH:mm') + ' - ' + moment(end.getTime()).format('DD/MM/YYYY  HH:mm');
    }
  };
};

const parseUsersToCalendars = users =>
  users.map(user => ({
    id: user.codigo_usuario,
    name: user.usuario,
    color: user.cor || utils.getRandomColor(),
    bgColor: user.bgCor || utils.getRandomColor(),
    borderColor: user.borderCor || utils.getRandomColor(),
    dragBgColor: user.dragCor || utils.getRandomColor()
  }));

const parseEventsToSchedules = events =>
  events.flatMap(event =>
    event.usuarios.map(user => ({
      id: `${user.documentid}_${user.wdk_sequence_id}`,
      calendarId: user.codigo_usuario,
      title: event.descricao,
      location: event.cidade,
      body: event.detalhes,
      category: 'time',
      dueDateClass: '',
      start: moment(user.horario_inicio, 'DD/MM/YYYY HH:mm').toDate(),
      end: moment(user.horario_fim, 'DD/MM/YYYY HH:mm').toDate(),
      isReadOnly: false
    }))
  );

window.calendarUtils = { getTimeZone, getTemplate, parseUsersToCalendars, parseEventsToSchedules };
