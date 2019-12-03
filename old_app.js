let days = [];
let vacations = [];
let actual = planned = 0;

document.getElementById('sheet').addEventListener('change', function (e) {
    if (!e.target.files || !e.target.files.length) {
        return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
        let workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        let values = workbook.Sheets[workbook.SheetNames[0]];

        for (let key in values) {
            let date;
            if (key.startsWith('C') && key != 'C1') {
                days.push({
                    date: values[key].v
                })
            }
        }
        let counter = 0;
        for (let key in values) {
            let date;
            if (key.startsWith('G') && key != 'G1') {
                days[counter++].checkIn = values[key].v;
            }
        }
        counter = 0;
        for (let key in values) {
            let date;
            if (key.startsWith('H') && key != 'H1') {
                days[counter++].checkOut = values[key].v;
            }
        }
    }
    reader.readAsArrayBuffer(e.target.files[0]);
});

document.getElementById('vacations').addEventListener('change', function (e) {
    if (!vacations.includes(e.target.value)) {
        vacations.push(e.target.value);
    }
    e.target.value = '';
    let vacationsPreview = document.getElementById('vacations_preview');
    vacationsPreview.innerHTML = '';
    for (let vacation of vacations) {
        vacationsPreview.innerHTML += `<h3>${vacation}</h3>`;
    }
});

document.getElementById('done').addEventListener('click', function (e) {
    weekEnds = [];
    document.getElementsByName('weekends').forEach(function (element) {
        if (element.checked) {
            weekEnds.push(element.value * 1);
        }
    });
    for (let day of days) {
        let checkInDate = moment(new Date(day.date + ' ' + day.checkIn));
		console.log(moment(checkInDate));
		return;
        let checkOutDate = moment(new Date(day.date + ' ' + day.checkOut));

        let diffInMinutes = moment(checkOutDate).diff(checkInDate, 'minutes');

        if (!dayIsOff(day.date) && diffInMinutes > 0) {
            planned += 8 * 60;
        }

        if (diffInMinutes >= 0) {
            actual += diffInMinutes;
        }
    }
    
    let plannedInterval = humanInterval(planned);
    let actualInterval = humanInterval(actual);
    let diffInterval = humanInterval(actual - planned);
    
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 
        `<h2>Planned:  ${plannedInterval.hours} Hours, ${plannedInterval.minutes} Minutes</h2>` +
        `<h2>Actual:  ${actualInterval.hours} Hours, ${actualInterval.minutes} Minutes</h2>` +
        `<h2>Difference:  ${diffInterval.hours} Hours, ${diffInterval.minutes} Minutes</h2>`;
    actual = planned = 0;
});


function dayIsOff(date) {
    if (weekEnds.includes(moment(new Date(date)).day())) {
        return true;
    }

    for (let vacation of vacations) {
        if (moment(new Date(date)).isSame(new Date(vacation), 'day')) {
            return true;
        }
    }
}


function humanInterval(mins) {
    let hours = Math.floor(mins / 60);
    let minutes = mins - hours * 60;
    return {
        hours, minutes
    };
}