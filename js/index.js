$(document).ready(function(){

	var dialog = new BootstrapDialog({
        message: function(dialogRef){
            var $message = $('<div></div>');
            var $button = $('<div style="text-align: center; font-size: 40px;">Text Message Sent!</div><br><p style="text-align: center;">Refresh the page to continue.</p>');
            $message.append($button);
    
            return $message;
        },
        closable: false
    });
    dialog.realize();
    dialog.getModalHeader().hide();
    dialog.getModalFooter().hide();
    dialog.getModalBody().css('background-color', 'white');
    dialog.getModalBody().css('color', '#a18858');
    dialog.getModalBody().css('border-radius', '5px');

    var dialogAlert = new BootstrapDialog({
        message: function(dialogRef){
            var $message = $('<div style="text-align: center; font-size: 20px;">The phone number you entered does not match the 555-555-5555 format. Please enter correct phone number.</div>');
            var $button = $('<button style="margin-top: 25px; background-color: #a18858; color: white; border: none;" class="btn btn-primary btn-sm btn-block">Enter Phone Number</button>');
            $button.on('click', {dialogRef: dialogRef}, function(event){
                event.data.dialogRef.close();
            });
            $message.append($button);
    
            return $message;
        },
        closable: false
    });
    dialog.realize();
    dialog.getModalHeader().css('background-color', '#A18858');
    dialog.getModalFooter().hide();
    dialog.getModalBody().css('background-color', 'white');
    dialog.getModalBody().css('color', '#a18858');
    dialog.getModalBody().css('border-radius', '5px');


	$('#phoneNumber').keyup(function(){
    	$(this).val($(this).val().replace(/(\d{3})\-?(\d{3})\-?(\d{4})/,'$1-$2-$3'))
	});

	$('#btn-test').on('click', function() {

		var str = $('#phoneNumber').val();

		var newStr = str.replace(/-/g, "");

        var regex = /(\d{3})(\d{3})(\d{4})/

        if (!regex.test(newStr)) {
            dialogAlert.open();
        } else {
            dialog.open();
        }

		var phone = "1" + newStr;

		var phoneNumber = {phoneNumber: phone};
		$.post('/send', phoneNumber, function (data) {

		});

		$('#phoneNumber').val('');

	});

});
