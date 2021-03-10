var cron = require('node-cron');
const axios = require('axios');
var moment = require('moment');

cron.schedule('* * * * *', () => {
    axios({
        method: 'get',
        url: 'https://mojeezdravie.nczisk.sk/api/v1/web/get_all_drivein_times_vacc',
        headers: { 'Content-Type': 'application/json' },
    }).then(response => {
        let free = false;
        for (payload of response.data.payload) {
            for (data of payload.calendar_data) {
                if (payload.region_name === 'Košický' && data.free_capacity > 0) {
                    console.log(moment().format('YYYY.MM.DD HH:mm:ss') + ' ' + payload.city + ' ' + payload.street_name + ' ' + payload.street_number + ' ' + data.c_date + ' volne miesta: ' + data.free_capacity);
                    free = true;
                }
            }
        }
        if (!free) {
            console.log(moment().format('YYYY.MM.DD HH:mm:ss') + " Nie je volny termin.");
        }
    }).catch(error => {
        console.log(moment().format('YYYY.MM.DD HH:mm:ss') + " Nedostupny server.");
    });

});