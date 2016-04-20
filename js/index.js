$(document).ready(function(){

	var dialog = new BootstrapDialog({
            message: function(dialogRef){
                var $message = $('<div></div>');
                var $button = $('<div style="text-align: center; font-size: 40px;">Text Message Sent!</div>');
                $button.on('click', {dialogRef: dialogRef}, function(event){
                    event.data.dialogRef.close();
                });
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

		$('#phoneNumber').val('');

		dialog.open();

	});

});
