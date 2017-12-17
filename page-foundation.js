
if (typeof toastr != 'undefined') {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "progressBar": true,
    "preventDuplicates": true,
    "positionClass": "toast-top-right",
    "onclick": null,
    "showDuration": "400",
    "hideDuration": "1000",
    "timeOut": "7000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
}

$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  },
  method: 'POST',
  statusCode: {
    401: function() {
      toastr.remove();
      if (typeof Ladda != 'undefined') {
        Ladda.stopAll();
      }
      toastr.error("Sorry, you do not have permission. Reloading page...", '401 Unauthorized', {timeOut: 0});
      window.location.reload(true);
    },
    404: function() {
      toastr.remove();
      if (typeof Ladda != 'undefined') {
        Ladda.stopAll();
      }
      toastr.error("Oops, that request could not be processed.", '404 Not Found', {timeOut: 0});
    }
  },
  dataFilter: function(data, type) {
    if (data.substring(0, 4) === 'http') {
      toastr.remove();
      toastr.info("Loading page...", '', {timeOut: 0});
      window.location.href = data;
      return false;
    }
    return data;
  },
  error: function(jqXHR, textStatus, errorThrown) {
    
  },
  complete: function(jqXHR, textStatus) {
    if (jqXHR.getResponseHeader('X-FORCE_FRONTEND_REDIRECT') === '1') {
      toastr.remove();
      if (typeof Ladda != 'undefined') {
        Ladda.stopAll();
      }
      toastr.info("Loading page...", '', {timeOut: 0});
      window.location.href = jqXHR.responseText;
    } else {
      switch (textStatus) {
        case 'error':
          toastr.remove();
          if (typeof Ladda != 'undefined') {
            Ladda.stopAll();
          }
          toastr.error("Houston, we have a problem.", 'An error occurred :(', {timeOut: 0});
          break;
        case 'timeout':
          toastr.remove();
          if (typeof Ladda != 'undefined') {
            Ladda.stopAll();
          }
          toastr.error("Looks like we got stuck in the slow lane.", 'A timeout occurred :(', {timeOut: 0});
          break;
        case 'parsererror':
          toastr.remove();
          if (typeof Ladda != 'undefined') {
            Ladda.stopAll();
          }
          toastr.error("Looks like we got hit by a bug. Call the IT Support team.", 'A data error occurred :(', {timeOut: 0});
          break;
      }
    }
  }
});

(function() {
  var originalAddClass = jQuery.fn.addClass;
  jQuery.fn.addClass = function() {
    var result = originalAddClass.apply(this, arguments);
    jQuery(this).trigger('capture:addClass', ...arguments);
    return result;
  }
  var originalRemoveClass = jQuery.fn.removeClass;
  jQuery.fn.removeClass = function() {
    var result = originalRemoveClass.apply(this, arguments);
    jQuery(this).trigger('capture:removeClass', ...arguments);
    return result;
  }
})();


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

if (typeof jQuery.validator != 'undefined') {
  jQuery.validator.setDefaults({ignore: '.ignore'});
}
