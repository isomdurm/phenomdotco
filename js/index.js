$(document).ready(function(){


	$('#button-test').on('click', function() {
		var phoneNumber = '4152605028'
		$.post('/send', phoneNumber, function (data) {
			console.log(data);
		});
	});

});
