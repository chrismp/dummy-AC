$(function(){
	var $clock = $('#clock');
	var $roomTemperature = $('#room-temperature');
	var $hvacStatus = $('#hvac-status');
	var $fanStatus = $('#fan-status');
	var $hvacRadioInputArray = $('input:radio[name=hvac]');
	var $fanRadioInputArray = $('input:radio[name=fan]');

	// $(document).ajaxStart(function(){
	// 	do something to show AJAX request is processing
	// }).ajaxStop(function(){
	// 	do something once AJAX request stops
	// });

	$.get('/status',function(data){
		var unixTime = data.unixTime;
		var hvacStatus = data.hvacStatus;
		var fanStatus = data.fanStatus;
		var roomTemperature = data.roomTemperature;
		var cool = data.cool;
		var heat = data.heat;

		$clock.html(new Date(Date.now()));
		$roomTemperature.html(roomTemperature);
		$hvacStatus.html(hvacStatus);
		$fanStatus.html(fanStatus);

		setRadioInputOnLoad($hvacRadioInputArray, hvacStatus)
		setRadioInputOnLoad($fanRadioInputArray, fanStatus)
	});

	var arrayOfRadioInputArrays = [
		$hvacRadioInputArray,
		$fanRadioInputArray
	];

	for (var i=0; i<arrayOfRadioInputArrays.length; i++) {
		arrayOfRadioInputArrays[i].click(function(){
			var hvacMode = null;
			var fanMode = null;
			var cool = null;
			var heat = null;

			var $this = $(this);
			var name = $this.attr('name');

			// `val` attribute of `input` user clicked.
			// For HVAC: 0 is off, 1 is cool, 2 is heat
			// For fan: 0 is off, 1 is on
			var val = $this.val();
			var temperature = $(':input[name=temperature]').val();

			if(name==='hvac'){
				hvacMode = +val;
				if(hvacMode===1){
					cool = +temperature;
				} else if(hvacMode===2){
					heat = +temperature;
				}
				fanMode = getOtherDeviceSetting($fanRadioInputArray);
			} else if(name==='fan'){
				fanMode = val;
				fanMode = getOtherDeviceSetting($hvacRadioInputArray);
			}


			var dataToSend = {
				'hvacMode': hvacMode,
				'cool': cool,
				'heat': heat,
				'fanMode': fanMode
			};

			console.log('sending data');
			console.log(dataToSend);

			$.ajax({
				url: '/status',
				type: 'POST',
				data: JSON.stringify(dataToSend),
				contentType: 'application/json; charset=utf-8',
				timeout: 20000, // give the A/C 20 seconds
				success: function(data){
					console.log('got response');
					console.log(data);
				},
				error: function(error){
					alert('HVAC/fan did not get your request!');
					console.log(error);
				}
			});
		});
	};

});