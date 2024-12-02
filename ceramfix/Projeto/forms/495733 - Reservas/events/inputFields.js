function inputFields(form) {
  var timeZone = form.getValue('timeZone') + '';
  var dataHoraInicio = form.getValue('dataHoraInicio') + '';
  var dataHoraFim = form.getValue('dataHoraFim') + '';

  form.setValue('dataHoraInicioMillis', convertDateToMillis(dataHoraInicio, timeZone));
  form.setValue('dataHoraFimMillis', convertDateToMillis(dataHoraFim, timeZone));
}

function convertDateToMillis(dateString, timeZone) {
  var timeZoneJava = timeZone ? java.util.TimeZone.getTimeZone(new java.lang.String(timeZone)) : java.util.TimeZone.getDefault();
  var dateFormatInput = new java.text.SimpleDateFormat('dd/MM/yyyy HH:mm');
  dateFormatInput.setTimeZone(timeZoneJava);
  var dateJava = dateFormatInput.parse(new java.lang.String(dateString));
  return dateJava.getTime() + '';
}
