/*** Funções para controle de data ***/
//Mês em extenso
var arrayMes = new Array();
arrayMes[1] = "Janeiro"; arrayMes[2] = "Fevereiro"; arrayMes[3] = "Março"; arrayMes[4] = "Abril"; arrayMes[5] = "Maio"; arrayMes[6] = "Junho";
arrayMes[7] = "Julho"; arrayMes[8] = "Agosto"; arrayMes[9] = "Setembro"; arrayMes[10] = "Outubro"; arrayMes[11] = "Novembro"; arrayMes[12] = "Dezembro";

//retorna ultimo dia mês
function retUltimoDia(year, month) {
    var ultimoDia = (new Date(year, month, 0)).getDate();
    return ultimoDia;
}

//retorna data atual
function DataHoje(pRet) {
    var mydate = new Date();
    var year = mydate.getFullYear();
    var daym = mydate.getDate();

    if (daym < 10) {
        daym = "0" + daym;
    }

    var monthm = mydate.getMonth() + 1;
    if (monthm < 10) {
        monthm = "0" + monthm;
    }


    var dateNow = pRet == undefined ? daym + "/" + monthm + "/" + year : year + "-" + monthm + "-" + daym;

    return dateNow;
}

//retorna hora atual
function HoraHoje() {
    var mydate = new Date();
    var hour = mydate.getHours();
    var minute = mydate.getMinutes();
    var second = mydate.getSeconds();

    if (hour < 10) {
        hour = "0" + hour;
    }

    if (minute < 10) {
        minute = "0" + minute;
    }

    if (second < 10) {
        second = "0" + second;
    }

    var hourNow = hour + ":" + minute + ":" + second;

    return hourNow;
}

//diferença entre datas em horas
function diffDatesHours(date1, date2) {
    var diffMs = (date2 - date1);
    // console.log(date1, date2, diffMs);
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    // console.log( diffHrs );
    var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
    // console.log( diffMins );
    var diffSec = Math.floor((((diffMs % 86400000) % 3600000) % 60000) / 1000);
    // console.log( diffSec );
    var hora = (diffHrs < 10) ? '0' + diffHrs : diffHrs;
    var minuto = (diffMins < 10) ? '0' + diffMins : diffMins;
    var segundo = (diffSec < 10) ? '0' + diffSec : diffSec;
    var diff = hora + ':' + minuto + ':' + segundo;
    return diff
}
