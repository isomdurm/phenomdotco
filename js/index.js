$(document).ready(function(){

	$('#phoneNumber').keyup(function(){
    	$(this).val($(this).val().replace(/(\d{3})\-?(\d{3})\-?(\d{4})/,'$1-$2-$3'))
	});

	$('#btn-test').on('click', function() {

		var str = $('#phoneNumber').val();

		var newStr = str.replace(/-/g, "");

		var phone = "1" + newStr;

		var phoneNumber = {phoneNumber: phone};
		$.post('/send', phoneNumber, function (data) {
		});
	});

});
