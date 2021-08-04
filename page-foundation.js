
$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  },
  method: 'POST',
  statusCode: {
    401: function() {
      $('#toast-container .toast').trigger('click');
      if (typeof Ladda != 'undefined') {
        Ladda.stopAll();
      }
      toastr.error("Sorry, you do not have permission. Reloading page...", '401 Unauthorized', {timeOut: 0});
      window.location.reload(true);
    },
    404: function() {
      $('#toast-container .toast').trigger('click');
      if (typeof Ladda != 'undefined') {
        Ladda.stopAll();
      }
      toastr.error("Oops, that request could not be processed.", '404 Not Found', {timeOut: 0});
    }
  },
  dataFilter: function(data, type) {
    if (data.substring(0, 4) === 'http') {
      $('#toast-container .toast').trigger('click');
      toastr.info("Loading page...", '', {timeOut: 0});
      if (window.location.href == data) {
        location.reload(true);
      }
      window.location.href = data;
      return false;
    }
    return data;
  },
  error: function(jqXHR, textStatus, errorThrown) {
    
  },
  complete: function(jqXHR, textStatus) {
    if (jqXHR.getResponseHeader('X-FORCE_FRONTEND_REDIRECT') === '1') {
      $('#toast-container .toast').trigger('click');
      if (typeof Ladda != 'undefined') {
        Ladda.stopAll();
      }
      toastr.info("Loading page...", '', {timeOut: 0});
      window.location.href = jqXHR.responseText;
      
      return;
    }

    switch (textStatus) {
      case 'error':
        // Server errors.
        if (jqXHR.status >= 500) {
          $('#toast-container .toast').trigger('click');
          if (typeof Ladda != 'undefined') {
            Ladda.stopAll();
          }
          toastr.error("Houston, we have a problem.", 'An error occurred :(', {timeOut: 0});
        }
        break;
      case 'timeout':
        $('#toast-container .toast').trigger('click');
        if (typeof Ladda != 'undefined') {
          Ladda.stopAll();
        }
        toastr.error("Looks like we got stuck in the slow lane.", 'A timeout occurred :(', {timeOut: 0});
        break;
      case 'parsererror':
        $('#toast-container .toast').trigger('click');
        if (typeof Ladda != 'undefined') {
          Ladda.stopAll();
        }
        toastr.error("Looks like we got hit by a bug. Call the IT Support team.", 'A data error occurred :(', {timeOut: 0});
        break;
    }

    if (jqXHR.getResponseHeader('X-TOASTR') != '') {
      var toastr_messages = JSON.parse(jqXHR.getResponseHeader('X-TOASTR'));
      $('#toast-container .toast').trigger('click');

      $.each(toastr_messages, function(key, value) {
        toastr[key](value);
      });
    }
  }
});

/**
 * Add a before and after trigger when one of the following methods are called.
 */
(function ($) {
  $.each(['show', 'hide', 'fadeIn', 'fadeOut', 'toggle', 'addClass', 'removeClass'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
      this.trigger('before:'+ev, [arguments]);
      $(window).trigger('before:'+ev, [arguments, this]);
      var result = el.apply(this, arguments);
      this.trigger('after:'+ev, [arguments]);
      $(window).trigger('after:'+ev, [arguments, this]);
      return result;
    };
  });
})(jQuery);

/**
 * Build html from a javascript object.
 *
 * @param string data
 *
 * @return string
 */
var $H = {
  build: function(data) {
    html = '';
    if (typeof data != 'undefined') {
      if (typeof data[0] == 'string') {
        if (data.length > 1) {
          html = '<'+data[0]+' '+data[1]+'>';
          html += data[2];
          for (var i = 0; i < data[3].length; i++) {
            html += $H.build(data[3][i]);
          }
          html += '</'+data[0]+'>';
        } else {
          html += data[0];
        }
      } else {
        for (var i = 0; i < data.length; i++) {
            html += $H.build(data[i]);
        }
      }
    }
    return html;
  }
}

/**
 * FontAwesome Icon.
 *
 * @param string icon_class
 *
 * @return string
 */
$.icon = function(icon_class)
{
  if (! icon_class) {
    return;
  }

  default_type = 'l';
  if (icon_class.substring(1, 2) == ' ') {
    default_type = icon_class.substring(0, 1);
    icon_class = icon_class.substring(2);
  }

  return '<i class="fa' + default_type + ' fa-fw fa-' + icon_class + '" aria-hidden="true"></i>';
}

/**
 * Add a replace options helper.
 *
 * @param string icon_class
 *
 * @return string
 */
$.fn.extend({
  replaceOptions: function(new_options, config) {

    // Default to empty array.
    if (typeof new_options == 'undefined') {
      new_options = [];
    }

    // Default to empty config.
    if (typeof config == 'undefined') {
      config = {};
    }

    return this.each(function() {
      var pulldown = $(this);

      // Only apply to select tags.
      if (pulldown.prop('tagName') != 'SELECT') {
        return;
      }

      // Maintain the selected option.
      var current_value = pulldown.val();

      // Optional to keep first option.
      if (typeof config['keep-first'] != 'undefined') {
        pulldown.find('option:gt(0)').remove();
      } else {
        pulldown.empty();
      }

      $.each(new_options, function(key, option) {
        pulldown.append(
          $("<option></option>")
           .attr("value", option[0])
           .text(option[1])
        );
      });

      // Check if the selected value exists, default to first selected index if it doesn't.
      if (pulldown.find('option[value="' + current_value + '"]').length) {
        pulldown.val(current_value);
      } else {
        pulldown.prop('selectedIndex', 0);
      }
    });
  }
});

/**
 * Add defaults for validator if it's defined.
 */
if (typeof $.validator != 'undefined') {
  $.validator.setDefaults({ignore: '.ignore'});
}
