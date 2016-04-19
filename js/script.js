var plivo = require('plivo');

var p = plivo.RestAPI({
  authId: 'MAYTRMYJNLYTG0YWRHNT',
  authToken: 'MjU4ODE2NTg4NGI4OWE0NzljMWUwMGE5Y2FlZTJi'
});

var sendText = function(phoneNumber) {

    console.log(phoneNumber);

    var params = {
        'src': '18054701920', // Sender's phone number with country code
        'dst' : phoneNumber.phoneNumber, // Receiver's phone Number with country code
        'text' : "Make Some Noise! Tap the link below to download Phenom in the Apple App Store! 🏆 http://hwk.io/s/fjsir4", // Your SMS Text Message - English
        'url' : "http://www.phenom.co/download", // The URL to which with the status of the message is sent
        'method' : "GET" // The method used to call the url
    };

    p.send_message(params, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
        console.log('Message UUID:\n', response['message_uuid']);
        console.log('Api ID:\n', response['api_id']);
    });
};

module.exports = {sendText};