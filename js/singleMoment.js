$(document).ready(function(){

    /**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.5.2
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2015, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowPast: true,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      autoDispose: true,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixFromNow: "from now",
        inPast: 'any moment now',
        seconds: "<1M",
        minute: "1M",
        minutes: "%dM",
        hour: "1H",
        hours: "%dH",
        day: "1D",
        days: "%dD",
        month: "4W",
        months: "%dW",
        year: "1Y",
        years: "%dY",
        wordSeparator: " ",
        numbers: []
      }
    },

    inWords: function(distanceMillis) {
      if (!this.settings.allowPast && ! this.settings.allowFuture) {
          throw 'timeago allowPast and allowFuture settings can not both be set to false.';
      }

      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      if (!this.settings.allowPast && distanceMillis >= 0) {
        return this.settings.strings.inPast;
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 365 && substitute($l.months, Math.round(days / 7)) ||
        years < 1.5 && substitute($l.months, Math.round(days / 7)) ||
        substitute($l.months, Math.round(days / 7));

      var separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) { separator = " "; }
      return $.trim([prefix, words, suffix].join(separator));
    },

    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      s = s.replace(/([\+\-]\d\d)$/," $100"); // +09 -> +0900
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function() {
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function(timestamp) {
      var date = (timestamp instanceof Date) ? timestamp : $t.parse(timestamp);
      $(this).data('timeago', { datetime: date });
      if ($t.settings.localeTitle) $(this).attr("title", date.toLocaleString());
      refresh.apply(this);
    },
    updateFromDOM: function() {
      $(this).data('timeago', { datetime: $t.parse( $t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title") ) });
      refresh.apply(this);
    },
    dispose: function () {
      if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
      }
    }
  };

  $.fn.timeago = function(action, options) {
    var fn = action ? functions[action] : functions.init;
    if (!fn) {
      throw new Error("Unknown function name '"+ action +"' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function() {
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    var $s = $t.settings;

    //check if it's still visible
    if ($s.autoDispose && !$.contains(document.documentElement,this)) {
      //stop if it has been removed
      $(this).timeago("dispose");
      return this;
    }

    var data = prepareData(this);

    if (!isNaN(data.datetime)) {
      if ( $s.cutoff == 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr("title", element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}));

    $("time.timeago").timeago();

    console.log(window.location.href);

    var string = window.location.pathname;

    var headline;

    if (string.charAt(0) == "/") {
        string = string.substr(1);
    }

    if (string.charAt(0) == "m") {
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
      $('body').append('<img src="' + response.results.image + '" height="100%" width="100%" style="display: inline-block;" />');
    
      var headline = response.results.headline;
      var userId = response.results.userId;

      var createdAt = response.results.createdAt;

      console.log(createdAt);

      var user = {
      "async": true,
      "crossDomain": true,
      "url": "http://localhost:8081/userForWeb?userId=" + userId,
      "method": "GET"
    }

      $.ajax(user).done(function (response) {
            console.log(response);
            $('body').append('&nbsp;&nbsp;&nbsp;&nbsp;<div style="font-family: MaisonNeueWEB-Light, Helvetica, Arial, sans-serif; font-weight: lighter; display: inline-block; margin-left: 15px; margin-top: -5px; color: white; font-size: 15px;"><span style="font-family: MaisonNeueWEB-Light, Helvetica, Arial, sans-serif; color: #75ABBA;">' + response.results.username + ' ' + '</span>' + ' ' + ' ' + headline + '</div>');
            $('#momentUser').append('<div class="col-xs-2" style="height: 75px; padding-top: 18px;"><img src="' + response.results.imageUrl + '" height="40" width="40" style="border-radius: 20px; border: 2px solid white;"/></div>');
            $('#momentUser').append('<div class="col-xs-10" style="padding-left: 10px; margin-top: 18px; font-size: 20px; color: white; font-family: UnitedSansSmCdHv">' + response.results.firstName.toUpperCase() + ' ' + ' ' + response.results.lastName.toUpperCase() + '</div><div class="col-xs-10" style="margin-top: -8px; padding-left: 10px;"><time style="font-size: 10px; color: #90909A; font-family: MaisonNeueWEB-Light, Helvetica, Arial, sans-serif;" class="timeago" datetime="2014-05-26T20:10:32.486Z"></time><span style="font-size: 10px; color: #90909A; font-family: MaisonNeueWEB-Light, Helvetica, Arial, sans-serif;"> ' + ' ' + '-' + ' ' + response.results.hometown.toUpperCase() + '</span></div>');
            $("time.timeago").timeago();

        });

    });




});