// directives.js

angular.module('myApp.directives', [])
.directive('googleSignin', function() {
  return {
    restrict: 'A',
    template: '<span id="signinButton"></span>',
    replace: true,
    scope: {
      afterSignin: '&'
    },
    link: function(scope, ele, attrs) {
      // Set standard google class
      attrs.$set('class', 'g-signin');
      // Set the clientid
      attrs.$set('data-clientid', 
          attrs.clientId+'.apps.googleusercontent.com');
      // build scope urls
      var scopes = attrs.scopes || [
        'auth/plus.login', 
        'auth/userinfo.email'
      ];
      var scopeUrls = [];
      for (var i = 0; i < scopes.length; i++) {
        scopeUrls.push('https://www.googleapis.com/' + scopes[i]);
      };

      // Create a custom callback method
      var callbackId = "_googleSigninCallback",
          directiveScope = scope;
      window[callbackId] = function() {
        var oauth = arguments[0];
        directiveScope.afterSignin({oauth: oauth});
        console.log('afterSignin: ', oauth);
        window[callbackId] = null;
      };

      // Set standard google signin button settings
      attrs.$set('data-callback', callbackId);
      attrs.$set('data-cookiepolicy', 'single_host_origin');
      attrs.$set('data-requestvisibleactions', 'http://schemas.google.com/AddActivity')
      attrs.$set('data-scope', scopeUrls.join(' '));

      // Finally, reload the client library to 
      // force the button to be painted in the browser
      (function() {
       var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
       po.src = 'https://apis.google.com/js/client:plusone.js';
       var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    }
  }
})
.directive('fileUpload', function() {
  return {
    restrict: 'A',
    scope: { fileUpload: '&' },
    template: '<input type="file" id="file" /> ',
    replace: true,
    link: function(scope, ele, attrs) {
      ele.bind('change', function() {
        var file = ele[0].files;
        if (file) scope.fileUpload({files: file});
      })
    }
  }
});
