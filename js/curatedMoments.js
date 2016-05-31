$(document).ready(function(){



    var momentIds = ["574dd19ce6703777229935eb", "574dc6d76699885122bc8c49", "574da9960750c05922bb8acd", "574d1cb0a7795c5022e13ae8","574d11901d1aaf71228ca055", "574dc8a21d1aaf71228ca12a", "574d026c6699885122bc8b59", "574cfd601d1aaf71228ca00f", "574c5e40d8450e51221eefa5", "574c5a691d1aaf71228c9e04"]
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api1.phenomapp.com:8081/topTenFeed?momentIds=" + momentIds,
      "method": "GET"
    }

     $.ajax(settings).done(function (res) {

      res.results.forEach(function(moment){
        $('body').append('<div class="col-xs-12" style="margin-top: 10px; margin-bottom: 10px;"><img src="' + moment.image + '" width="100%" height="auto" /><span> Moment ID: ' + moment.id + '</span><br><span> Likes: ' + moment.likesCount + '</span></div>')
      });

    });

});