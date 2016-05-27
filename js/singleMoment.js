$(document).ready(function(){

    console.log(window.location.pathname);

    var string = window.location.pathname;

    var headline;

    if (string.charAt(0) == "/") {
        string = string.substr(1);
}
    console.log(string);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:8081/webProfiles?momentId=" + string,
      "method": "GET"
    }

     $.ajax(settings).done(function (response) {
      console.log(response);
      $('body').append('<img src="' + response.results.image + '" height="350" width="100%" style="display: inline-block;" />');
    
      var headline = response.results.headline;
      var userId = response.results.userId;

      var user = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:8081/userForWeb?userId=" + userId,
      "method": "GET"
    }

      $.ajax(user).done(function (response) {

            $('body').append('&nbsp;&nbsp;&nbsp;&nbsp;<div style="display: inline-block; margin-top: 15px; color: black; font-size: 15px;"><span style="font-weight: bold;">' + response.results.username + ' ' + '</span>' + ' ' + ' ' + headline + '</div>');
            $('#momentUser').append('<div class="col-sm-3" style="display: inline-block;"><img src="' + response.results.imageUrl + '" height="50" width="50" style="border-radius: 25px; margin-top: 15px; margin-bottom: 15px;"/></div>');
            $('#momentUser').append('<div class="col-sm-9" style="display: inline-block; margin: 0px; font-size: 20px; color: black;">' + response.results.firstName + ' ' + ' ' + response.results.lastName + '</div>');
        });

    });

});