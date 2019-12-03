let days = [];
let actual = planned = 0;
let vacations = [];
let weekEnds= [];
document.getElementById('sheet').addEventListener('change',function(e){
	if(!e.target.files || !e.target.files.length){
		return ;
	}
	let  reader = new FileReader();
    reader.onload = function (e) {
	let workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
	let values = workbook.Sheets[workbook.SheetNames[0]];
		for(let key in values){
		  if(key.startsWith('C') && key != 'C1'){
			  let date;
			  days.push({
				  date: values[key].v
				});
			}
		}
		let counter = 0 ;
		for(let key in values){
			if(key.startsWith('G') && key !='G1'){
				days[counter++].checkIn= values[key].v ;
			}
		}
		 counter = 0;
		for(let key in values){
			if(key.startsWith('H') && key != 'H1'){
				days[counter++].checkOut = values[key].v ;
			}
		}
	}
	reader.readAsArrayBuffer(e.target.files[0]);
});

document.getElementById('vacations').addEventListener('change',function(e){

	if(!vacations.includes(e.target.value)){
		vacations.push(e.target.value);
	}
	let vacations_preview = document.getElementById('vacations_preview') ;
	vacations_preview.innerHTML = '';
	for(let vacation of vacations){
	vacations_preview.innerHTML += `<h4>${vacation}</h4>` ;
	}

});
document.getElementById('done').addEventListener('click',function(e){
 let t = document.getElementsByName('weekends');
  for (var i=0; i<t.length; i++) {
	  if(t[i].checked){
		  weekEnds.push(t[i].value *1);
	  }
    }
	for(let day of days){
		dateCheckin = moment(new Date(day.date + ' ' +day.checkIn));
		dateCheckOut = moment(new Date(day.date + ' ' +day.checkOut));
		dateDiffMinutes = dateCheckOut.diff(dateCheckin,'minutes');
		if(!dayIsOff(day.date) && dateDiffMinutes > 0){
			planned+= 8 * 60 ;
		}
		if( dateDiffMinutes >= 0){
			actual+= dateDiffMinutes ;
		}
	}
	let plannedInterval = timeInterrval(planned);
	let actualInterval = timeInterrval(actual);
	let diffInterval = timeInterrval(actual - planned);
	let divResult = document.getElementById('results');
	divResult.innerHTML = `<h2> planned : ${plannedInterval.hours} Hours , ${plannedInterval.mins} Minutes</h2>`+
							`<h2> acutal : ${actualInterval.hours} Hours , ${actualInterval.mins} Minutes</h2>`+
							`<h2> difference : ${diffInterval.hours} Hours , ${diffInterval.mins} Minutes</h2>`;
							    actual = planned = 0;

})

function dayIsOff(date){
	if(weekEnds.includes(moment(new Date(date)).day())){
		return true ;
	}
	for(let vacation of vacations){
		if(moment(new Date(date)).isSame(new Date(vacation), 'day')){
			return true ;
		}
	}
}
function timeInterrval(minutes){
	let hours = Math.floor(minutes/60);
	let mins = minutes - 60* hours ;
	return {
		hours , mins
	};
}
//console.log( document.getElementsByName('weekends').value);
