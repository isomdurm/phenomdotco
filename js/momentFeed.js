$(document).ready(function(){

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api1.phenomapp.com:8081/webFeed",
      "method": "GET"
    }

     $.ajax(settings).done(function (res) {
      console.log(res.results);

      res.results.forEach(function(moment){
        $('body').append('<div class="col-xs-12" style="margin-top: 10px; margin-bottom: 10px;"><img src="' + moment.image + '" width="100%" height="auto" /><span> Moment ID: ' + moment.id + '</span><br><span> Likes: ' + moment.likesCount + '</span></div>')
      });

    });


});