/* jshint ignore:start */
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
angular.module('md5', []).constant('md5', (function() {

  /*
   * Configurable variables. You may need to tweak these to be compatible with
   * the server-side, but the defaults work in most cases.
   */
  var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
  var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */

  /*
   * These are the functions you'll usually want to call
   * They take string arguments and return either hex or base-64 encoded strings
   */
  function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
  function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
  function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
  function hex_hmac_md5(k, d)
    { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
  function b64_hmac_md5(k, d)
    { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
  function any_hmac_md5(k, d, e)
    { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

  /*
   * Perform a simple self-test to see if the VM is working
   */
  function md5_vm_test()
  {
    return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
  }

  /*
   * Calculate the MD5 of a raw string
   */
  function rstr_md5(s)
  {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
  }

  /*
   * Calculate the HMAC-MD5, of a key and some data (raw strings)
   */
  function rstr_hmac_md5(key, data)
  {
    var bkey = rstr2binl(key);
    if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
  }

  /*
   * Convert a raw string to a hex string
   */
  function rstr2hex(input)
  {
    try { hexcase } catch(e) { hexcase=0; }
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for(var i = 0; i < input.length; i++)
    {
      x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0F)
             +  hex_tab.charAt( x        & 0x0F);
    }
    return output;
  }

  /*
   * Convert a raw string to a base-64 string
   */
  function rstr2b64(input)
  {
    try { b64pad } catch(e) { b64pad=''; }
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for(var i = 0; i < len; i += 3)
    {
      var triplet = (input.charCodeAt(i) << 16)
                  | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                  | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
      for(var j = 0; j < 4; j++)
      {
        if(i * 8 + j * 6 > input.length * 8) output += b64pad;
        else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
      }
    }
    return output;
  }

  /*
   * Convert a raw string to an arbitrary string encoding
   */
  function rstr2any(input, encoding)
  {
    var divisor = encoding.length;
    var i, j, q, x, quotient;

    /* Convert to an array of 16-bit big-endian values, forming the dividend */
    var dividend = Array(Math.ceil(input.length / 2));
    for(i = 0; i < dividend.length; i++)
    {
      dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
    }

    /*
     * Repeatedly perform a long division. The binary array forms the dividend,
     * the length of the encoding is the divisor. Once computed, the quotient
     * forms the dividend for the next step. All remainders are stored for later
     * use.
     */
    var full_length = Math.ceil(input.length * 8 /
                                      (Math.log(encoding.length) / Math.log(2)));
    var remainders = Array(full_length);
    for(j = 0; j < full_length; j++)
    {
      quotient = Array();
      x = 0;
      for(i = 0; i < dividend.length; i++)
      {
        x = (x << 16) + dividend[i];
        q = Math.floor(x / divisor);
        x -= q * divisor;
        if(quotient.length > 0 || q > 0)
          quotient[quotient.length] = q;
      }
      remainders[j] = x;
      dividend = quotient;
    }

    /* Convert the remainders to the output string */
    var output = "";
    for(i = remainders.length - 1; i >= 0; i--)
      output += encoding.charAt(remainders[i]);

    return output;
  }

  /*
   * Encode a string as utf-8.
   * For efficiency, this assumes the input is valid utf-16.
   */
  function str2rstr_utf8(input)
  {
    var output = "";
    var i = -1;
    var x, y;

    while(++i < input.length)
    {
      /* Decode utf-16 surrogate pairs */
      x = input.charCodeAt(i);
      y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
      if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
      {
        x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
        i++;
      }

      /* Encode output as utf-8 */
      if(x <= 0x7F)
        output += String.fromCharCode(x);
      else if(x <= 0x7FF)
        output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                      0x80 | ( x         & 0x3F));
      else if(x <= 0xFFFF)
        output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                      0x80 | ((x >>> 6 ) & 0x3F),
                                      0x80 | ( x         & 0x3F));
      else if(x <= 0x1FFFFF)
        output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                      0x80 | ((x >>> 12) & 0x3F),
                                      0x80 | ((x >>> 6 ) & 0x3F),
                                      0x80 | ( x         & 0x3F));
    }
    return output;
  }

  /*
   * Encode a string as utf-16
   */
  function str2rstr_utf16le(input)
  {
    var output = "";
    for(var i = 0; i < input.length; i++)
      output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                    (input.charCodeAt(i) >>> 8) & 0xFF);
    return output;
  }

  function str2rstr_utf16be(input)
  {
    var output = "";
    for(var i = 0; i < input.length; i++)
      output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                     input.charCodeAt(i)        & 0xFF);
    return output;
  }

  /*
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */
  function rstr2binl(input)
  {
    var output = Array(input.length >> 2);
    for(var i = 0; i < output.length; i++)
      output[i] = 0;
    for(var i = 0; i < input.length * 8; i += 8)
      output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
    return output;
  }

  /*
   * Convert an array of little-endian words to a string
   */
  function binl2rstr(input)
  {
    var output = "";
    for(var i = 0; i < input.length * 32; i += 8)
      output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
    return output;
  }

  /*
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   */
  function binl_md5(x, len)
  {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;

    for(var i = 0; i < x.length; i += 16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
      d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
      b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
      d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
      c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
      d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
      d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

      a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
      d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
      c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
      b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
      d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
      c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
      d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
      c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
      a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
      d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
      c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
      b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

      a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
      d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
      b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
      d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
      c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
      d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
      a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
      d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
      b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

      a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
      d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
      c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
      d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
      d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
      a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
      d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
      b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
  }

  /*
   * These functions implement the four basic operations the algorithm uses.
   */
  function md5_cmn(q, a, b, x, s, t)
  {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
  }
  function md5_ff(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5_gg(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5_hh(a, b, c, d, x, s, t)
  {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5_ii(a, b, c, d, x, s, t)
  {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  function safe_add(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  function bit_rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  return hex_md5;
})());
/* jshint ignore:end */
(function() {
  var gravatarDirectiveFactory;

  gravatarDirectiveFactory = function(bindOnce) {
    return [
      'gravatarService', function(gravatarService) {
        var filterKeys;
        filterKeys = function(prefix, object) {
          var k, retVal, v;
          retVal = {};
          for (k in object) {
            v = object[k];
            if (k.indexOf(prefix) !== 0) {
              continue;
            }
            k = k.substr(prefix.length).toLowerCase();
            if (k.length > 0) {
              retVal[k] = v;
            }
          }
          return retVal;
        };
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var directiveName, item, opts, unbind;
            directiveName = bindOnce ? 'gravatarSrcOnce' : 'gravatarSrc';
            item = attrs[directiveName];
            delete attrs[directiveName];
            opts = filterKeys('gravatar', attrs);
            unbind = scope.$watch(item, function(newVal) {
              element.attr('src', gravatarService.url(newVal, opts));
              if (bindOnce) {
                if (newVal == null) {
                  return;
                }
                unbind();
              }
            });
          }
        };
      }
    ];
  };

  angular.module('ui.gravatar', ['md5']).provider('gravatarService', [
    'md5', function(md5) {
      var hashRegex, self, serialize;
      self = this;
      hashRegex = /^[0-9a-f]{32}$/i;
      serialize = function(object) {
        var k, params, v;
        params = [];
        for (k in object) {
          v = object[k];
          params.push("" + k + "=" + (encodeURIComponent(v)));
        }
        return params.join('&');
      };
      this.defaults = {};
      this.secure = false;
      this.protocol = null;
      this.urlFunc = function(opts) {
        var params, pieces, prefix, src, urlBase;
        prefix = opts.protocol ? opts.protocol + ':' : '';
        urlBase = opts.secure ? 'https://secure' : prefix + '//www';
        src = hashRegex.test(opts.src) ? opts.src : md5(opts.src);
        pieces = [urlBase, '.gravatar.com/avatar/', src];
        params = serialize(opts.params);
        if (params.length > 0) {
          pieces.push('?' + params);
        }
        return pieces.join('');
      };
      this.$get = [
        function() {
          return {
            url: function(src, params) {
              if (src == null) {
                src = '';
              }
              if (params == null) {
                params = {};
              }
              return self.urlFunc({
                params: angular.extend(angular.copy(self.defaults), params),
                protocol: self.protocol,
                secure: self.secure,
                src: src
              });
            }
          };
        }
      ];
      return this;
    }
  ]).directive('gravatarSrc', gravatarDirectiveFactory()).directive('gravatarSrcOnce', gravatarDirectiveFactory(true));

}).call(this);

/*jshint browser: true */
/*globals angular, ng */

(function () {
    'use strict';

    var barkbaudConfig = {
        apiUrl: 'https://barkbaud.herokuapp.com/'
    };

    function config($locationProvider, $urlRouterProvider, bbWindowConfig) {
        $locationProvider.html5Mode(false);

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('dashboard');
        });

        bbWindowConfig.productName = 'Barkbaud';
    }

    config.$inject = ['$locationProvider', '$urlRouterProvider', 'bbWindowConfig'];

    function run(bbDataConfig, bbWait, barkbaudAuthService, $rootScope, $state) {

        function addBaseUrl(url) {
            return barkbaudConfig.apiUrl + url;
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var redirect;
            if (!barkbaudAuthService.authenticated) {
                event.preventDefault();
                $rootScope.$emit('bbBeginWait');

                redirect = $state.href(toState, toParams, { absolute: true });
                barkbaudAuthService.isAuthenticated().then(function (authenticated) {
                    $rootScope.$emit('bbEndWait');
                    if (authenticated) {
                        $state.go(toState, toParams);
                    } else {
                        barkbaudAuthService.modal(redirect).then(function () {
                            return $state.go(toState.name, toParams);
                        });
                    }
                });
            }
        });

        $rootScope.$on('bbBeginWait', function (e, opts) {
            e.stopPropagation();
            bbWait.beginPageWait(opts);
        });

        $rootScope.$on('bbEndWait', function (e, opts) {
            e.stopPropagation();
            bbWait.endPageWait(opts);
        });

        bbDataConfig.dataUrlFilter = addBaseUrl;
        bbDataConfig.resourceUrlFilter = addBaseUrl;
    }

    run.$inject = ['bbDataConfig', 'bbWait', 'barkbaudAuthService', '$rootScope', '$state'];

    function MainController(barkbaudAuthService) {
        var self = this;
        self.logout = barkbaudAuthService.logout;
    }

    MainController.$inject = ['barkbaudAuthService'];

    angular.module('barkbaud', ['sky', 'ui.router', 'ngAnimate', 'barkbaud.templates', 'ui.gravatar'])
        .constant('barkbaudConfig', barkbaudConfig)
        .config(config)
        .run(run)
        .controller('MainController', MainController);
}());

/*global angular */

(function () {
    'use strict';

    function barkbaudAuthService(barkbaudConfig, bbData, bbModal, $q, $window) {
        var modal,
            service = {};

        function go(action, redirect) {
            $window.location.href = [
                barkbaudConfig.apiUrl,
                'auth/',
                action,
                '?redirect=',
                encodeURIComponent(redirect)
            ].join('');
        }

        service.isAuthenticated = function () {
            var deferred = $q.defer();
            bbData.load({
                data: 'auth/authenticated?' + (new Date().getTime())
            }).then(function (result) {
                service.authenticated = result.data.authenticated;
                service.tenantId = result.data.tenant_id;
                deferred.resolve(result.data.authenticated);
            });
            return deferred.promise;
        };

        service.login = function (redirect) {
            go('login', redirect);
        };

        service.logout = function (redirect) {
            go('logout', redirect);
        };

        service.update = function () {
            modal.close(service.authenticated);
        };

        service.modal = function (redirect) {
            if (!modal) {
                modal = bbModal.open({
                    controller: 'LoginPageController as loginPage',
                    templateUrl: 'login/loginpage.html',
                    resolve: {
                        barkbaudRedirect: function () {
                            return redirect;
                        }
                    }
                });
            }

            return modal.result;
        };

        return service;
    }

    barkbaudAuthService.$inject = [
        'barkbaudConfig',
        'bbData',
        'bbModal',
        '$q',
        '$window'
    ];

    angular.module('barkbaud')
        .factory('barkbaudAuthService', barkbaudAuthService);
}());

/*global angular */

(function () {
    'use strict';

    function constituentUrlFilter(barkbaudAuthService) {
        return function (constituentId) {
            return [
                'https://renxt.blackbaud.com/constituents/',
                encodeURIComponent(constituentId),
                '?tenantid=',
                barkbaudAuthService.tenantId
            ].join('');
        };
    }

    constituentUrlFilter.$inject = ['barkbaudAuthService'];

    angular.module('barkbaud')
        .filter('barkConstituentUrl', constituentUrlFilter);

}());

/*global angular */

(function () {
    'use strict';

    function barkPhoto(gravatarService) {
        return {
            scope: {
                barkPhotoUrl: '=',
                barkPhotoBase64: '=',
                barkPhotoGravatarEmail: '='
            },
            bindToController: true,
            controller: angular.noop,
            controllerAs: 'barkPhoto',
            link: function (scope, el, attr, barkPhoto) {

                function setImageData(data) {
                    el.css('background-image', 'url("data:image/png;base64,' + data + '")');
                }

                function setImageUrl(url) {
                    el.css('background-image', 'url(\'' + url + '\')');
                }

                scope.$watch(function () {
                    return barkPhoto.barkPhotoUrl;
                }, function (newValue) {
                    if (newValue) {
                        setImageUrl(newValue.replace('http://', '//'));
                    }
                });

                scope.$watch(function () {
                    return barkPhoto.barkPhotoBase64;
                }, function (newValue) {
                    if (newValue) {
                        setImageData(newValue);
                    }
                });

                scope.$watch(function () {
                    return barkPhoto.barkPhotoGravatarEmail;
                }, function (newValue) {
                    if (newValue) {
                        setImageUrl(gravatarService.url(newValue, {default: 'mm'}));
                    }
                });
            },
            replace: true,
            templateUrl: 'components/photo.directive.html'
        };
    }

    barkPhoto.$inject = [
        'gravatarService'
    ];

    angular.module('barkbaud')
        .directive('barkPhoto', barkPhoto);
}());

/*global angular */

(function () {
    'use strict';

    function dashboardPageConfig($stateProvider) {
        $stateProvider
            .state('dashboard', {
                controller: 'DashboardPageController as dashboardPage',
                templateUrl: 'dashboard/dashboardpage.html',
                url: '/dashboard'
            });
    }

    dashboardPageConfig.$inject = ['$stateProvider'];

    angular.module('barkbaud')
        .config(dashboardPageConfig);
}());

/*global angular */

(function () {
    'use strict';

    function DashboardPageController($scope, $stateParams, bbData, bbWindow) {
        var self = this;

        $scope.$emit('bbBeginWait');
        bbWindow.setWindowTitle('Dashboard');
        bbData.load({
            data: 'api/dogs'
        }).then(function (result) {
            self.dogs = result.data.value;
            $scope.$emit('bbEndWait');
        }).catch(function (result) {
            self.error = result.data.error;
        });
    }

    DashboardPageController.$inject = [
        '$scope',
        '$stateParams',
        'bbData',
        'bbWindow'
    ];

    angular.module('barkbaud')
        .controller('DashboardPageController', DashboardPageController);
}());

/*global angular */

(function () {
    'use strict';

    function BehaviorTrainingAddController($uibModalInstance, bbData, dogId) {
        var self = this;

        self.loadCategories = function(source) {
            self.categories = null;
            self.categoryValues = null;
            self.behaviortraining.category = null;
            self.behaviortraining.value = null;
            bbData.load({
                data: 'api/dogs/ratings/categories?sourceName=' + encodeURIComponent(source || '')
            }).then(function (result) {
                self.categories = result.data.value;
            });
        };

        self.checkLoadValues = function(categoryName) {
            // clear out value
            self.categoryValues = null; 
            self.behaviortraining.value = null;

            if (self.behaviortraining.category && self.behaviortraining.category.type === 'CodeTable') {
                bbData.load({
                    data: 'api/dogs/ratings/categories/values?categoryName=' + encodeURIComponent(self.behaviortraining.category.name)
                }).then(function (result) {
                    self.categoryValues = result.data.value;
                });
            }
        };

        self.saveData = function () {
            bbData.save({
                url: 'api/dogs/' + dogId + '/ratings',
                data: self.behaviortraining,
                type: 'POST'
            }).then(function (result) {
                $uibModalInstance.close(result.data);
            }).catch(function (result) {
                self.error = result.data.error;
            });
        };

        bbData.load({
            data: {
                sources: 'api/dogs/ratings/sources',
                categories: 'api/dogs/ratings/categories?sourceName='
            }
        }).then(function (result) {
            self.sources = result.data.sources.value;
            self.categories = result.data.categories.value;
        });

        self.behaviortraining = {}
        self.yesno = [{
                    value: true,
                    label: "Yes"
                }, {
                    value: false,
                    label: "No"
                }];
        self.minDate = 1700;
        self.maxDate = 3000;
    }

    BehaviorTrainingAddController.$inject = [
        '$uibModalInstance',
        'bbData',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('BehaviorTrainingAddController', BehaviorTrainingAddController);
}());

/*global angular */

(function () {
    'use strict';

    function barkBehaviorTrainingAdd(bbModal) {
        return {
            open: function (dogId) {
                return bbModal.open({
                    controller: 'BehaviorTrainingAddController as behaviorTrainingAdd',
                    templateUrl: 'dogs/behaviortraining/behaviortrainingadd.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        }
                    }
                });
            }
        };
    }

    barkBehaviorTrainingAdd.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('barkBehaviorTrainingAdd', barkBehaviorTrainingAdd);
}());

/*jslint browser: false */
/*global angular */

(function () {
    'use strict';

    function BehaviorTrainingDeleteController($uibModalInstance, bbData, dogId, behaviorTrainingId) {

        var self = this;

        self.saveData = function() {
            bbData.save({
                url: 'api/dogs/' + encodeURIComponent(dogId) + '/ratings/' + encodeURIComponent(behaviorTrainingId),
                type: 'DELETE'
            }).then(function (result) {
                $uibModalInstance.close(result.data);
            }).catch(function (result) {
                self.error = result.data.error;
            });
        }

        bbData.load({
            data: "api/dogs/" + encodeURIComponent(dogId) + '/ratings/' + encodeURIComponent(behaviorTrainingId)
        }).then(function (result) {
            self.rating = result.data;
        }).catch(function (result) {
            self.error = result.data.error;
        });
    }

    BehaviorTrainingDeleteController.$inject = ['$uibModalInstance', 'bbData', 'dogId', 'behaviorTrainingId'];

    angular.module('barkbaud')
        .controller('BehaviorTrainingDeleteController', BehaviorTrainingDeleteController)
}());
/*global angular */

(function () {
    'use strict';

    function barkBehaviorTrainingDelete(bbModal) {
        return {
            open: function (dogId, behaviorTrainingId) {
                return bbModal.open({
                    controller: 'BehaviorTrainingDeleteController as behaviorTrainingDelete',
                    templateUrl: 'dogs/behaviortraining/behaviortrainingdelete.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        },
                        behaviorTrainingId: function() {
                            return behaviorTrainingId;
                        }
                    }
                });
            }
        };
    }

    barkBehaviorTrainingDelete.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('barkBehaviorTrainingDelete', barkBehaviorTrainingDelete);
}());

/*global angular */

(function () {
    'use strict';

    function BehaviorTrainingEditController($uibModalInstance, bbData, behaviortraining, dogId) {
        var self = this;

        self.saveData = function () {
            bbData.save({
                url: 'api/dogs/' + encodeURIComponent(dogId) + '/ratings/' + encodeURIComponent(behaviortraining._id),
                data: self.behaviortraining,
                type: 'PATCH'
            }).then(function (result) {
                $uibModalInstance.close(result.data);
            }).catch(function (result) {
                self.error = result.data.error;
            });
        };

        self.behaviortraining = behaviortraining;
        self.yesno = [{
                    value: true,
                    label: "Yes"
                }, {
                    value: false,
                    label: "No"
                }];
        self.minDate = 1700;
        self.maxDate = 3000;

        if (self.behaviortraining.category.type === 'CodeTable') {
            bbData.load({
                data: 'api/dogs/ratings/categories/values?categoryName=' + encodeURIComponent(self.behaviortraining.category.name)
            }).then(function (result) {
                self.categoryValues = result.data.value;
            });
        }
    }

    BehaviorTrainingEditController.$inject = [
        '$uibModalInstance',
        'bbData',
        'behaviortraining',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('BehaviorTrainingEditController', BehaviorTrainingEditController);
}());

/*global angular */

(function () {
    'use strict';

    function barkBehaviorTrainingEdit(bbModal) {
        return {
            open: function (dogId, behaviortraining) {
                return bbModal.open({
                    controller: 'BehaviorTrainingEditController as behaviorTrainingEdit',
                    templateUrl: 'dogs/behaviortraining/behaviortrainingedit.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        },
                        behaviortraining: function () {
                            return behaviortraining;
                        }
                    }
                });
            }
        };
    }

    barkBehaviorTrainingEdit.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('barkBehaviorTrainingEdit', barkBehaviorTrainingEdit);
}());

/*global angular */

(function () {
    'use strict';

    function DogBehaviorTrainingTileController($scope, bbData, bbMoment, bbModal, dogId, barkBehaviorTrainingAdd, barkBehaviorTrainingEdit, barkBehaviorTrainingDelete) {
        var self = this;

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/ratings'
            }).then(function (result) {
                self.ratings = result.data.value;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function (result) {
                self.error = result.data.error;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.addBehaviorTraining = function () {
            barkBehaviorTrainingAdd.open(dogId).result.then(self.load, angular.noop);
        };

        self.editBehaviorTraining = function (behaviortraining) {
            barkBehaviorTrainingEdit.open(dogId, behaviortraining).result.then(self.load, angular.noop);
        };

        self.deleteBehaviorTraining = function (behaviorTrainingId) {
            barkBehaviorTrainingDelete.open(dogId, behaviorTrainingId).result.then(self.load, angular.noop);
        };

        self.load();
    };

    DogBehaviorTrainingTileController.$inject = [
        '$scope',
        'bbData',
        'bbMoment',
        'bbModal',
        'dogId',
        'barkBehaviorTrainingAdd',
        'barkBehaviorTrainingEdit',
        'barkBehaviorTrainingDelete'
    ];

    angular.module('barkbaud')
        .controller('DogBehaviorTrainingTileController', DogBehaviorTrainingTileController);
}());

/*global angular */

(function () {
    'use strict';

    function DogCurrentHomeTileController($rootScope, $scope, bbData, bbMoment, barkFindHome, dogId) {
        var self = this;

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/currenthome'
            }).then(function (result) {
                self.currentHome = result.data;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function (result) {
                self.error = result.data.error;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.getTimeInHome = function (fromDate) {
            var fromDateMoment = bbMoment(fromDate);
            return 'since ' + fromDateMoment.format('L') + ' (' + fromDateMoment.startOf('month').fromNow(true) + ')';
        };

        self.findHome = function () {
            barkFindHome.open(dogId).result.then(function () {
                self.load();
                $rootScope.$broadcast('bbNewCurrentOwner');
            },
            angular.noop);
        };

        self.load();
    }

    DogCurrentHomeTileController.$inject = [
        '$rootScope',
        '$scope',
        'bbData',
        'bbMoment',
        'barkFindHome',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogCurrentHomeTileController', DogCurrentHomeTileController);
}());

/*global angular */

(function () {
    'use strict';

    function FindHomeController($http, $q, $uibModalInstance, barkbaudConfig, bbData, dogId) {
        var self = this;

        self.results = [];
        self.searchCancelers = [];
        self.selectedResult = [];

        self.onSearch = function (args) {
            if (args.searchText && args.searchText.length > 0) {
                self.error = null;
 
                // Resolve/cancel any previous previous searches
                self.searchCancelers.forEach(function(canceler) {
                    canceler.resolve();
                });

                var searchCanceler = $q.defer();
                self.searchCancelers.push(searchCanceler);

                $http({ 
                    url: barkbaudConfig.apiUrl + 'api/dogs/' + dogId + '/findhome?searchText=' + args.searchText,
                    timeout: searchCanceler.promise,
                    withCredentials: true
                }).then(function (response) {
                    removeFromSearchCancelers(searchCanceler);
                    self.results = [];

                    response.data.value.forEach(function(constituent) {
                        self.results.push({
                            constituent: constituent,
                            description: constituent.address,
                            title: constituent.name + ' (' + constituent.id + ')'
                        });
                    });
                }).catch(function (result) {
                    removeFromSearchCancelers(searchCanceler);
                    if (result && result.status !== -1) { // -1 for canceled requests
                        self.error = {
                            message: "Search error: " + (result.data.message || result.statusText)
                        }
                    }
                });
            }
        };

        self.saveData = function () {
            if (self.selectedResult.length > 0 && self.selectedResult[0].constituent) {
                bbData.save({
                    url: 'api/dogs/' + dogId + '/currenthome',
                    data: self.selectedResult[0].constituent,
                    type: 'POST'
                }).then(function (result) {
                    $uibModalInstance.close(result.data);
                }).catch(function (result) {
                    self.error = result.data.error;
                });
            }
        };

        function removeFromSearchCancelers(canceler) {
            var index = self.searchCancelers.indexOf(canceler);
            if (index >= 0) {
                self.searchCancelers.splice(index, 1);
            }
        }
    }

    FindHomeController.$inject = [
        '$http',
        '$q',
        '$uibModalInstance',
        'barkbaudConfig',
        'bbData',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('FindHomeController', FindHomeController);
}());

/*global angular */

(function () {
    'use strict';

    function barkFindHome(bbModal) {
        return {
            open: function (dogId) {
                return bbModal.open({
                    controller: 'FindHomeController as findHome',
                    templateUrl: 'dogs/currenthome/findhome.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        }
                    }
                });
            }
        };
    }

    barkFindHome.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('barkFindHome', barkFindHome);
}());

/*global angular */

(function () {
    'use strict';

    function dogPageConfig($stateProvider) {
        $stateProvider
            .state('dog', {
                abstract: true,
                controller: 'DogPageController as dogPage',
                templateUrl: 'dogs/dogpage.html',
                url: '/dogs/:dogId',
                resolve: {
                    dogId: ['$stateParams', function ($stateParams) {
                        return $stateParams.dogId;
                    }]
                }
            })
            .state('dog.views', {
                url: '',
                views: {
                    'currenthome': {
                        controller: 'DogCurrentHomeTileController as dogCurrentHomeTile',
                        templateUrl: 'dogs/currenthome/currenthometile.html'
                    },
                    'previoushomes': {
                        controller: 'DogPreviousHomesTileController as dogPreviousHomesTile',
                        templateUrl: 'dogs/previoushomes/previoushomestile.html'
                    },
                    'notes': {
                        controller: 'DogNotesTileController as dogNotesTile',
                        templateUrl: 'dogs/notes/notestile.html'
                    },
                    'behaviortraining': {
                        controller: 'DogBehaviorTrainingTileController as dogBehaviorTrainingTile',
                        templateUrl: 'dogs/behaviortraining/behaviortrainingtile.html'
                    },
                }
            });
    }

    dogPageConfig.$inject = ['$stateProvider'];

    angular.module('barkbaud')
        .config(dogPageConfig);
}());

/*global angular */

(function () {
    'use strict';

    function DogPageController($scope, $stateParams, bbData, bbWindow, dogId) {
        var self = this;

        self.tiles = [
            {
                id: 'DogCurrentHomeTile',
                view_name: 'currenthome',
                collapsed: false,
                collapsed_small: false
            },
            {
                id: 'DogPreviousHomesTile',
                view_name: 'previoushomes',
                collapsed: false,
                collapsed_small: false
            },
            {
                id: 'DogNotesTile',
                view_name: 'notes',
                collapsed: false,
                collapsed_small: false
            },
            {
                id: 'DogBehaviorTrainingTile',
                view_name: 'behaviortraining',
                collapsed: false,
                collapsed_small: false
            }
        ];

        self.layout = {
            one_column_layout: [
                'DogCurrentHomeTile',
                'DogPreviousHomesTile',
                'DogNotesTile',
                'DogBehaviorTrainingTile'
            ],
            two_column_layout: [
                [
                    'DogCurrentHomeTile',
                    'DogPreviousHomesTile'
                ],
                [
                    'DogNotesTile',
                    'DogBehaviorTrainingTile'
                ]
            ]
        };

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId)
        }).then(function (result) {
            self.dog = result.data;
            bbWindow.setWindowTitle(self.dog.name);
        });
    }

    DogPageController.$inject = [
        '$scope',
        '$stateParams',
        'bbData',
        'bbWindow',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogPageController', DogPageController);
}());

/*global angular */

(function () {
    'use strict';

    function NoteAddController($uibModalInstance, bbData, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/notetypes'
        }).then(function (result) {
            self.noteTypes = result.data.value;
        });

        self.note = {};
        self.saveData = function () {
            bbData.save({
                url: 'api/dogs/' + dogId + '/notes',
                data: self.note,
                type: 'POST'
            }).then(function (result) {
                $uibModalInstance.close(result.data);
            }).catch(function (result) {
                self.error = result.data.error;
            });
        };
    }

    NoteAddController.$inject = [
        '$uibModalInstance',
        'bbData',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('NoteAddController', NoteAddController);
}());

/*global angular */

(function () {
    'use strict';

    function barkNoteAdd(bbModal) {
        return {
            open: function (dogId) {
                return bbModal.open({
                    controller: 'NoteAddController as noteAdd',
                    templateUrl: 'dogs/notes/noteadd.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        }
                    }
                });
            }
        };
    }

    barkNoteAdd.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('barkNoteAdd', barkNoteAdd);
}());

/*global angular */

(function () {
    'use strict';

    function DogNotesTileController($scope, bbData, bbMoment, barkNoteAdd, dogId) {
        var self = this;

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/notes'
            }).then(function (result) {
                self.notes = result.data.value;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function (result) {
                self.error = result.data.error;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.getNoteDate = function (date) {
            if (date && date.iso) {
                return bbMoment(date.iso).calendar();
            }
        };

        self.addNote = function () {
            barkNoteAdd.open(dogId).result.then(self.load, angular.noop);
        };

        self.load();
    }

    DogNotesTileController.$inject = [
        '$scope',
        'bbData',
        'bbMoment',
        'barkNoteAdd',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogNotesTileController', DogNotesTileController);
}());

/*global angular */

(function () {
    'use strict';

    function DogPreviousHomesTileController($scope, bbData, bbMoment, dogId) {
        var self = this;

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/previoushomes'
            }).then(function (result) {
                self.previousHomes = result.data.value;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function (result) {
                self.error = result.data.error;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.getSummaryDate = function (date) {
            if (date) {
                return bbMoment(date).format('MMM Do YY');
            }
        };

        $scope.$on('bbNewCurrentOwner', function () {
            self.load();
        });

        self.load();
    }

    DogPreviousHomesTileController.$inject = [
        '$scope',
        'bbData',
        'bbMoment',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogPreviousHomesTileController', DogPreviousHomesTileController);
}());


/*global angular */

(function () {
    'use strict';

    function DogSummaryTileController($timeout, bbData, bbMoment, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId) + '/summary'
        }).then(function (result) {
            self.summary = result.data;
        });

        self.getSummaryDate = function (date) {
            if (date && date.iso) {
                return bbMoment(date.iso).format('MMM Do YY');
            }
        };
    }

    DogSummaryTileController.$inject = ['$timeout', 'bbData', 'bbMoment', 'dogId'];

    angular.module('barkbaud')
        .controller('DogSummaryTileController', DogSummaryTileController);
}());

/*global angular */

(function () {
    'use strict';

    function LoginPageController($location, $window, bbWait, bbWindow, barkbaudAuthService, barkbaudRedirect) {
        var self = this;

        self.error = $location.search().error;
        self.logout = barkbaudAuthService.logout;

        self.login = function () {
            barkbaudAuthService.login(barkbaudRedirect);
        };

        bbWindow.setWindowTitle('Login');

        self.waitingForAuth = true;
        barkbaudAuthService.isAuthenticated().then(function (authenticated) {
            self.waitingForAuth = false;
            if (authenticated) {
                barkbaudAuthService.update(authenticated);
            }
        });

    }

    LoginPageController.$inject = [
        '$location',
        '$window',
        'bbWait',
        'bbWindow',
        'barkbaudAuthService',
        'barkbaudRedirect'
    ];

    angular.module('barkbaud')
        .controller('LoginPageController', LoginPageController);
}());

angular.module('barkbaud.templates', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('components/photo.directive.html',
        '<div class="bark-photo img-circle center-block">\n' +
        '</div>\n' +
        '');
    $templateCache.put('dashboard/dashboardpage.html',
        '<div class="container-fluid">\n' +
        '  <h1>Dashboard</h1>\n' +
        '  <section class="panel" ng-repeat="dog in dashboardPage.dogs">\n' +
        '    <div class="panel-body">\n' +
        '      <div class="row">\n' +
        '          <div class="col-md-3 col-lg-2">\n' +
        '            <a ui-sref="dog.views({ dogId: dog._id })">\n' +
        '              <bark-photo bark-photo-base64="dog.image.data"></bark-photo>\n' +
        '            </a>\n' +
        '          </div>\n' +
        '          <div class="col-md-9 col-lg-10">\n' +
        '              <h1>\n' +
        '                <a ui-sref="dog.views({ dogId: dog._id })">{{ dog.name }}</a>\n' +
        '              </h1>\n' +
        '              <h4>{{ dog.breed }} &middot; {{ dog.gender }}</h4>\n' +
        '              <p class="bb-text-block bark-dog-bio">{{ dog.bio }}</p>\n' +
        '          </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </section>\n' +
        '  <div bb-tile-section class="text-danger" ng-show="dashboardPage.error">\n' +
        '    Error loading dogs.\n' +
        '  </div>\n' +
        '</div>\n' +
        '');
    $templateCache.put('dogs/behaviortraining/behaviortrainingadd.html',
        '<bb-modal>\n' +
        '  <form name="behaviorTrainingAdd.formAdd" ng-submit="behaviorTrainingAdd.saveData()">\n' +
        '    <div class="modal-form">\n' +
        '      <bb-modal-header>Add Behavior/Training</bb-modal-header>\n' +
        '      <div bb-modal-body>\n' +
        '        <div class="row">\n' +
        '          <div class="col-sm-6">\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">Source:</label>\n' +
        '              <select class="form-control" ng-change="behaviorTrainingAdd.loadCategories(behaviorTrainingAdd.behaviortraining.source)" ng-model="behaviorTrainingAdd.behaviortraining.source">\n' +
        '                <option ng-repeat="sourceOption in behaviorTrainingAdd.sources" ng-bind="sourceOption" value="{{sourceOption}}"></option>\n' +
        '              </select>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '          <div class="col-sm-6">\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">Category:</label>\n' +
        '              <select class="form-control" ng-change="behaviorTrainingAdd.checkLoadValues(behaviorTrainingAdd.behaviortraining.category.name)" ng-options="categoryOption.name for categoryOption in behaviorTrainingAdd.categories" ng-model="behaviorTrainingAdd.behaviortraining.category">\n' +
        '               <option value=""></option>\n' +
        '             </select>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '        <div class="row">\n' +
        '          <div class="col-sm-12">\n' +
        '            <div class="form-group" ng-switch on="behaviorTrainingAdd.behaviortraining.category.type">\n' +
        '              <label class="control-label">Value:</label>\n' +
        '              <span ng-switch="behaviorTrainingAdd.behaviortraining.category.type">\n' +
        '                        <!--None selected -->\n' +
        '                        <input type="text" class="form-control" ng-disabled="true" ng-if="!behaviorTrainingAdd.behaviortraining.category" />\n' +
        '                        <!--Unknown -->\n' +
        '                        <input type="text" name="Value" class="form-control" ng-model="behaviorTrainingAdd.behaviortraining.value" ng-switch-when="Unknown" ng-maxlength="255" />\n' +
        '                        <!--Text -->\n' +
        '                        <input type="text" name="Value" class="form-control" ng-model="behaviorTrainingAdd.behaviortraining.value" ng-switch-when="Text" ng-maxlength="255" />\n' +
        '                        <!--Number -->\n' +
        '                        <input type="text" name="Value" class="form-control" ng-model="behaviorTrainingAdd.behaviortraining.value" ng-switch-when="Number" />\n' +
        '                        <!--Date -->\n' +
        '                        <bb-datepicker bb-datepicker-name="Value"\n' +
        '                                       ng-model="behaviorTrainingAdd.behaviortraining.value"\n' +
        '                                       ng-switch-when="DateTime"\n' +
        '                                       bb-datepicker-min="behaviorTrainingAdd.minDate"\n' +
        '                                       bb-datepicker-max="behaviorTrainingAdd.maxDate"\n' +
        '                                       bb-datepicker-append-to-body="true">\n' +
        '                        </bb-datepicker>\n' +
        '                        <!--Currency = 4, -->\n' +
        '                        <input type="text" class="form-control" ng-model="behaviorTrainingAdd.behaviortraining.value" ng-switch-when="Currency" />\n' +
        '                        <!--Boolean = 5, -->\n' +
        '                        <select class="form-control"\n' +
        '                                ng-model="behaviorTrainingAdd.behaviortraining.value"\n' +
        '                                ng-options="yes_or_no.value as yes_or_no.label for yes_or_no in behaviorTrainingAdd.yesno"\n' +
        '                                ng-switch-when="Boolean"></select>\n' +
        '                        <!--CodeTableEntry = 6, -->\n' +
        '                        <select class="form-control"\n' +
        '                                ng-model="behaviorTrainingAdd.behaviortraining.value"\n' +
        '                                ng-options="categoryValue as categoryValue for categoryValue in behaviorTrainingAdd.categoryValues"\n' +
        '                                ng-switch-when="CodeTable">\n' +
        '                        </select>\n' +
        '                    </span>\n' +
        '            </div>\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">\n' +
        '                <input type="checkbox" bb-check ng-model="behaviorTrainingAdd.behaviortraining.addConstituentRating" />\n' +
        '                Add as rating on current owner\'s Raisers Edge NXT record.\n' +
        '              </label>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '      <bb-modal-footer>\n' +
        '        <bb-modal-footer-button-primary></bb-modal-footer-button-primary>\n' +
        '        <bb-modal-footer-button-cancel></bb-modal-footer-button-cancel>\n' +
        '        <span ng-show="behaviorTrainingAdd.error" class="text-danger">\n' +
        '          <span ng-show="behaviorTrainingAdd.error.message">{{ behaviorTrainingAdd.error.message }}</span>\n' +
        '          <span ng-hide="behaviorTrainingAdd.error.message">Unknown error occured.</span>\n' +
        '        </span>\n' +
        '      </bb-modal-footer>\n' +
        '    </div>\n' +
        '  </form>\n' +
        '</bb-modal>\n' +
        '');
    $templateCache.put('dogs/behaviortraining/behaviortrainingdelete.html',
        '<bb-modal>\n' +
        '  <form name="behaviorTrainingDelete.formDelete" ng-submit="behaviorTrainingDelete.saveData()">\n' +
        '    <div class="modal-form">\n' +
        '      <bb-modal-header>Delete Behavior/Training</bb-modal-header>\n' +
        '      <div bb-modal-body>\n' +
        '        <div class="row">\n' +
        '          <div class="col-sm-12">\n' +
        '            <h3>Are you sure you want to delete the following rating?</h3>\n' +
        '            <h4>{{:: behaviorTrainingDelete.rating.category.name }}</h4>\n' +
        '            <h5>{{:: behaviorTrainingDelete.rating.value }}</h5>\n' +
        '            <p ng-if=":: rating.source">{{:: behaviorTrainingDelete.rating.source }}</p>\n' +
        '          </div>\n' +
        '      </div>\n' +
        '      <bb-modal-footer>\n' +
        '        <bb-modal-footer-button-primary>Confirm</bb-modal-footer-button-primary>\n' +
        '        <bb-modal-footer-button-cancel></bb-modal-footer-button-cancel>\n' +
        '        <span ng-show="behaviorTrainingAdd.error" class="text-danger">\n' +
        '          <span ng-show="behaviorTrainingAdd.error.message">{{ behaviorTrainingAdd.error.message }}</span>\n' +
        '          <span ng-hide="behaviorTrainingAdd.error.message">Unknown error occured.</span>\n' +
        '        </span>\n' +
        '      </bb-modal-footer>\n' +
        '    </div>\n' +
        '  </form>\n' +
        '</bb-modal>\n' +
        '');
    $templateCache.put('dogs/behaviortraining/behaviortrainingedit.html',
        '<bb-modal>\n' +
        '  <form name="behaviorTrainingEdit.formEdit" ng-submit="behaviorTrainingEdit.saveData()">\n' +
        '    <div class="modal-form">\n' +
        '      <bb-modal-header>Edit Behavior/Training</bb-modal-header>\n' +
        '      <div bb-modal-body>\n' +
        '        <div class="row">\n' +
        '          <div class="col-sm-6">\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">Source:</label>\n' +
        '              <select class="form-control" ng-disabled="true">\n' +
        '                <option ng-bind="behaviorTrainingEdit.behaviortraining.source"></option>\n' +
        '              </select>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '          <div class="col-sm-6">\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">Category:</label>\n' +
        '                <select class="form-control" ng-disabled="true">\n' +
        '                  <option ng-bind="behaviorTrainingEdit.behaviortraining.category.name"></option>\n' +
        '                </select>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '        <div class="row">\n' +
        '          <div class="col-sm-12">\n' +
        '            <div class="form-group" ng-switch on="behaviorTrainingEdit.behaviortraining.category.type">\n' +
        '              <label class="control-label">Value:</label>\n' +
        '              <span ng-switch="behaviorTrainingEdit.behaviortraining.category.type">\n' +
        '                        <!--None selected -->\n' +
        '                        <input type="text" class="form-control" ng-disabled="true" ng-if="!behaviorTrainingEdit.behaviortraining.category" />\n' +
        '                        <!--Unknown -->\n' +
        '                        <input type="text" name="Value" class="form-control" ng-model="behaviorTrainingEdit.behaviortraining.value" ng-switch-when="Unknown" ng-maxlength="255" />\n' +
        '                        <!--Text -->\n' +
        '                        <input type="text" name="Value" class="form-control" ng-model="behaviorTrainingEdit.behaviortraining.value" ng-switch-when="Text" ng-maxlength="255" />\n' +
        '                        <!--Number -->\n' +
        '                        <input type="text" name="Value" class="form-control" ng-model="behaviorTrainingEdit.behaviortraining.value" ng-switch-when="Number" />\n' +
        '                        <!--Date -->\n' +
        '                        <bb-datepicker bb-datepicker-name="Value"\n' +
        '                                       ng-model="behaviorTrainingEdit.behaviortraining.value"\n' +
        '                                       ng-switch-when="DateTime"\n' +
        '                                       bb-datepicker-min="behaviorTrainingEdit.minDate"\n' +
        '                                       bb-datepicker-max="behaviorTrainingEdit.maxDate"\n' +
        '                                       bb-datepicker-append-to-body="true">\n' +
        '                        </bb-datepicker>\n' +
        '                        <!--Currency = 4, -->\n' +
        '                        <input type="text" class="form-control" ng-model="behaviorTrainingEdit.behaviortraining.value" ng-switch-when="Currency" />\n' +
        '                        <!--Boolean = 5, -->\n' +
        '                        <select class="form-control"\n' +
        '                                ng-model="behaviorTrainingEdit.behaviortraining.value"\n' +
        '                                ng-options="yes_or_no.value as yes_or_no.label for yes_or_no in behaviorTrainingEdit.yesno"\n' +
        '                                ng-switch-when="Boolean"></select>\n' +
        '                        <!--CodeTableEntry = 6, -->\n' +
        '                        <select class="form-control"\n' +
        '                                ng-model="behaviorTrainingEdit.behaviortraining.value"\n' +
        '                                ng-options="categoryValue as categoryValue for categoryValue in behaviorTrainingEdit.categoryValues"\n' +
        '                                ng-switch-when="CodeTable">\n' +
        '                        </select>\n' +
        '                    </span>\n' +
        '            </div>\n' +
        '            <div class="form-group" ng-if="behaviorTrainingEdit.behaviortraining.constituentRatingId">\n' +
        '              <label class="control-label">\n' +
        '                <span>Added as rating on current owner\'s Raisers Edge NXT record.</span>\n' +
        '              </label>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '      <bb-modal-footer>\n' +
        '        <bb-modal-footer-button-primary></bb-modal-footer-button-primary>\n' +
        '        <bb-modal-footer-button-cancel></bb-modal-footer-button-cancel>\n' +
        '        <span ng-show="behaviorTrainingEdit.error" class="text-danger">\n' +
        '          <span ng-show="behaviorTrainingEdit.error.message">{{ behaviorTrainingEdit.error.message }}</span>\n' +
        '          <span ng-hide="behaviorTrainingEdit.error.message">Unknown error occured.</span>\n' +
        '        </span>\n' +
        '      </bb-modal-footer>\n' +
        '    </div>\n' +
        '  </form>\n' +
        '</bb-modal>\n' +
        '');
    $templateCache.put('dogs/behaviortraining/behaviortrainingtile.html',
        '<bb-tile bb-tile-header="\'Behavior/Training\'">\n' +
        '	<bb-tile-header-content ng-show="dogBehaviorTrainingTile.ratings.length">\n' +
        '		{{ dogBehaviorTrainingTile.ratings.length }}\n' +
        '	</bb-tile-header-content>\n' +
        '	<div>\n' +
        '		<div class="toolbar bb-tile-toolbar">\n' +
        '			<button type="button" class="btn bb-btn-secondary" ng-click="dogBehaviorTrainingTile.addBehaviorTraining()"><i class="fa fa-plus-circle"></i> Add Behavior/Training</button>\n' +
        '		</div>\n' +
        '		<div ng-show="dogBehaviorTrainingTile.ratings">\n' +
        '			<div ng-switch="dogBehaviorTrainingTile.ratings.length || 0">\n' +
        '				<div bb-tile-section ng-switch-when="0" class="bb-no-records">\n' +
        '					This dog has no behaviors/trainings.\n' +
        '				</div>\n' +
        '				<div ng-switch-default class="bb-repeater">\n' +
        '					<div ng-repeat="rating in dogBehaviorTrainingTile.ratings" class="bb-prospectui-custom-ratings-row">\n' +
        '							<div class="custom-rating-content-row">\n' +
        '									<div class="custom-ratings-rating-content">\n' +
        '										<div>\n' +
        '												<span class="custom-rating-dropdown">\n' +
        '														<bb-context-menu>\n' +
        '																<li role="presentation">\n' +
        '																		<a role="menuitem" href="" ng-click="dogBehaviorTrainingTile.editBehaviorTraining(rating)" >Edit Behavior/Training</a>\n' +
        '																</li>\n' +
        '																<li role="presentation">\n' +
        '																		<a role="menuitem" href="" ng-click="dogBehaviorTrainingTile.deleteBehaviorTraining(rating._id)" >Delete Behavior/Training</a>\n' +
        '																</li>\n' +
        '														</bb-context-menu>\n' +
        '												</span>\n' +
        '												<span class="emptyspace"></span>\n' +
        '												<span>\n' +
        '														<span>\n' +
        '																<span ng-switch="rating.category.type" class="bb-prospectui-rating-description bb-prospectui-ellipsis">\n' +
        '																		<span ng-switch-when="datetime">\n' +
        '																			<span ng-if="rating.value">{{::rating.value | date : "shortDate"}}</span>\n' +
        '																			<span ng-if="typeof rating.value === \'undefined\'">No Rating</span>\n' +
        '																		</span>\n' +
        '																		<span ng-switch-when="boolean">{{::rating.value ? \'Yes\' : \'No\'}}</span>\n' +
        '																		<span ng-switch-default>{{::rating.value != undefined ? rating.value : \'No Rating\'}}</span>\n' +
        '																</span>\n' +
        '														</span>\n' +
        '														<span class="custom-rating-category bb-prospectui-ellipsis">{{::rating.category.name}}</span>\n' +
        '												</span>\n' +
        '										</div>\n' +
        '										<div>\n' +
        '												<div>\n' +
        '														<span class="custom-rating-source bb-prospectui-ellipsis" ng-if="::rating.source">\n' +
        '																<span class="constituent-summary-label" data-bbauto-field="SourceLabel">Source:</span>\n' +
        '																<span>{{::rating.source}}</span>\n' +
        '														</span>\n' +
        '												</div>\n' +
        '										</div>\n' +
        '									</div>\n' +
        '									<div class="custom-rating-and" ng-if="::rating.constituentRatingId">\n' +
        '											<span class="bb-show-more" >\n' +
        '													<span>\n' +
        '															<span>Added To Owner</span>\n' +
        '													</span>\n' +
        '											</span>\n' +
        '									</div>\n' +
        '							</div>\n' +
        '					</div>\n' +
        '				</div>\n' +
        '			</div>\n' +
        '		</div>\n' +
        '	</div>\n' +
        '	<div bb-tile-section class="text-danger" ng-show="dogBehaviorTrainingTile.error">\n' +
        '		Error loading behaviors/trainings.\n' +
        '	</div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('dogs/currenthome/currenthometile.html',
        '<bb-tile bb-tile-header="\'Current home\'">\n' +
        '  <bb-tile-header-content ng-show="dogCurrentHomeTile.currentHome.constituentId">\n' +
        '      <bb-tile-header-check></bb-tile-header-check>\n' +
        '  </bb-tile-header-content>\n' +
        '  <div class="toolbar bb-tile-toolbar">\n' +
        '    <button type="button" class="btn bb-btn-secondary" ng-click="dogCurrentHomeTile.findHome()"><i class="fa fa-plus-circle"></i> Find Home</button>\n' +
        '  </div>\n' +
        '  <div ng-show="dogCurrentHomeTile.currentHome">\n' +
        '    <div ng-switch="dogCurrentHomeTile.currentHome.constituentId || 0">\n' +
        '      <div bb-tile-section ng-switch-when="0" class="bb-no-records">\n' +
        '        This dog has no current home.\n' +
        '      </div>\n' +
        '      <div ng-switch-default>\n' +
        '        <div ng-switch="dogCurrentHomeTile.currentHome.constituent.error || \'\'">\n' +
        '          <div bb-tile-section ng-switch-when="\'\'" class="bb-no-records">\n' +
        '            Error reading current home.\n' +
        '          </div>\n' +
        '          <div bb-tile-section ng-switch-default>\n' +
        '            <div class="row">\n' +
        '              <div class="col-sm-3 col-xs-4">\n' +
        '                <bark-photo class="bark-photo-small" ng-if="::dogCurrentHomeTile.currentHome.constituent.profile_picture" bark-photo-url="dogCurrentHomeTile.currentHome.constituent.profile_picture.thumbnail_url"></bark-photo>\n' +
        '                <bark-photo class="bark-photo-small" ng-if="::!dogCurrentHomeTile.currentHome.constituent.profile_picture" bark-photo-gravatar-email="dogCurrentHomeTile.currentHome.constituent.email.address"></bark-photo>\n' +
        '              </div>\n' +
        '              <div class="col-sm-9 col-xs-8">\n' +
        '                <h4>\n' +
        '                  <a ng-href="{{dogCurrentHomeTile.currentHome.constituentId | barkConstituentUrl}}" target="_blank">\n' +
        '                    {{:: dogCurrentHomeTile.currentHome.constituent.first }}\n' +
        '                    {{:: dogCurrentHomeTile.currentHome.constituent.last }}\n' +
        '                  </a>\n' +
        '                </h4>\n' +
        '                <h5>{{:: dogCurrentHomeTile.getTimeInHome(dogCurrentHomeTile.currentHome.fromDate) }}</h5>\n' +
        '                <p class="bark-home-address" ng-show="dogCurrentHomeTile.currentHome.constituent.address.address">{{:: dogCurrentHomeTile.currentHome.constituent.address.address }}</p>\n' +
        '                <p ng-show="dogCurrentHomeTile.currentHome.constituent.phone.number">\n' +
        '                  {{:: dogCurrentHomeTile.currentHome.constituent.phone.number }}\n' +
        '                </p>\n' +
        '                <p ng-show="dogCurrentHomeTile.currentHome.constituent.email.address">\n' +
        '                  <a ng-href="mailto:{{:: dogCurrentHomeTile.currentHome.constituent.email.address }}">{{:: dogCurrentHomeTile.currentHome.constituent.email.address }}</a>\n' +
        '                </p>\n' +
        '              </div>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div bb-tile-section class="text-danger" ng-show="dogCurrentHomeTile.error">\n' +
        '    Error loading current home.\n' +
        '  </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('dogs/currenthome/findhome.html',
        '<bb-modal>\n' +
        '  <form name="findHome.formFind" ng-submit="findHome.saveData()">\n' +
        '    <div class="modal-form">\n' +
        '      <bb-modal-header>Find a home</bb-modal-header>\n' +
        '      <div bb-modal-body>\n' +
        '        <div class="form-group">\n' +
        '          <bb-checklist\n' +
        '            bb-checklist-items="findHome.results"\n' +
        '            bb-checklist-selected-items="findHome.selectedResult"\n' +
        '            bb-checklist-include-search="true"\n' +
        '            bb-checklist-search-placeholder="Search by name"\n' +
        '            bb-checklist-filter-callback="findHome.onSearch"\n' +
        '            bb-checklist-no-items-message="No home found. Search above."\n' +
        '            bb-checklist-mode="list"\n' +
        '            bb-checklist-select-style="single"\n' +
        '            bb-checklist-search-debounce="250"\n' +
        '            bb-checklist-is-loading="findHome.searchCancelers.length">\n' +
        '          </bb-checklist>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '      <bb-modal-footer>\n' +
        '        <bb-modal-footer-button-primary ng-disabled="!findHome.selectedResult.length"></bb-modal-footer-button-primary>\n' +
        '        <bb-modal-footer-button-cancel></bb-modal-footer-button-cancel>\n' +
        '        <span ng-show="findHome.error" class="text-danger">\n' +
        '            <span ng-show="findHome.error.message">{{ findHome.error.message }}</span>\n' +
        '            <span ng-hide="findHome.error.message">Unknown error occured.</span>\n' +
        '          </span>\n' +
        '      </bb-modal-footer>\n' +
        '    </div>\n' +
        '  </form>\n' +
        '</bb-modal>\n' +
        '');
    $templateCache.put('dogs/dogpage.html',
        '<div class="bb-page-header">\n' +
        '    <div class="container-fluid">\n' +
        '        <div class="row">\n' +
        '            <div class="col-md-3 col-lg-2">\n' +
        '                <bark-photo bark-photo-base64="dogPage.dog.image.data"></bark-photo>\n' +
        '            </div>\n' +
        '            <div class="col-md-9 col-lg-10">\n' +
        '                <h1>\n' +
        '                  {{ dogPage.dog.name }}\n' +
        '                </h1>\n' +
        '                <h4>{{ dogPage.dog.breed }} &middot; {{ dogPage.dog.gender }}</h4>\n' +
        '                <p></p>\n' +
        '                <p class="bb-text-block bark-dog-bio">{{ dogPage.dog.bio }}</p>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="container-fluid">\n' +
        '    <bb-tile-dashboard bb-layout="dogPage.layout" bb-tiles="dogPage.tiles"></bb-tile-dashboard>\n' +
        '</div>\n' +
        '');
    $templateCache.put('dogs/notes/noteadd.html',
        '<bb-modal>\n' +
        '  <form name="noteAdd.formAdd" ng-submit="noteAdd.saveData()">\n' +
        '    <div class="modal-form">\n' +
        '      <bb-modal-header>Add medical history</bb-modal-header>\n' +
        '      <div bb-modal-body>\n' +
        '        <div class="row">\n' +
        '          <div class="col-sm-6">\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">Title</label>\n' +
        '              <input type="text" class="form-control" ng-model="noteAdd.note.title" />\n' +
        '            </div>\n' +
        '          </div>\n' +
        '          <div class="col-sm-6">\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">Note Type</label>\n' +
        '              <select class="form-control" ng-model="noteAdd.note.type">\n' +
        '                <option ng-repeat="option in ::noteAdd.noteTypes" ng-bind="option" value="{{::option}}"></option>\n' +
        '              </select>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '        <div class="row">\n' +
        '          <div class="col-sm-12">\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">Description</label>\n' +
        '              <textarea class="form-control" ng-model="noteAdd.note.description"></textarea>\n' +
        '            </div>\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">\n' +
        '                <input type="checkbox" bb-check ng-model="noteAdd.note.addConstituentNote" />\n' +
        '                Add as note on current owner\'s Raisers Edge NXT record.\n' +
        '              </label>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '      <bb-modal-footer>\n' +
        '        <bb-modal-footer-button-primary></bb-modal-footer-button-primary>\n' +
        '        <bb-modal-footer-button-cancel></bb-modal-footer-button-cancel>\n' +
        '        <span ng-show="noteAdd.error" class="text-danger">\n' +
        '          <span ng-show="noteAdd.error.message">{{ noteAdd.error.message }}</span>\n' +
        '          <span ng-hide="noteAdd.error.message">Unknown error occured.</span>\n' +
        '        </span>\n' +
        '      </bb-modal-footer>\n' +
        '    </div>\n' +
        '  </form>\n' +
        '</bb-modal>\n' +
        '');
    $templateCache.put('dogs/notes/notestile.html',
        '<bb-tile bb-tile-header="\'Medical history\'">\n' +
        '  <bb-tile-header-content ng-show="dogNotesTile.notes.length">\n' +
        '      {{ dogNotesTile.notes.length }}\n' +
        '  </bb-tile-header-content>\n' +
        '  <div>\n' +
        '    <div class="toolbar bb-tile-toolbar">\n' +
        '      <button type="button" class="btn bb-btn-secondary" ng-click="dogNotesTile.addNote()"><i class="fa fa-plus-circle"></i> Add History</button>\n' +
        '    </div>\n' +
        '    <div ng-show="dogNotesTile.notes">\n' +
        '      <div ng-switch="dogNotesTile.notes.length || 0">\n' +
        '        <div bb-tile-section ng-switch-when="0" class="bb-no-records">\n' +
        '          This dog has no medical history.\n' +
        '        </div>\n' +
        '        <div ng-switch-default class="bb-repeater">\n' +
        '          <div ng-repeat="note in ::dogNotesTile.notes.slice().reverse() track by $index" class="bb-repeater-item">\n' +
        '            <h4 class="bb-repeater-item-title">{{:: note.title }}</h4>\n' +
        '            <h5>{{:: dogNotesTile.getNoteDate(note.date) }}</h5>\n' +
        '            <p>{{:: note.description }}</p>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div bb-tile-section class="text-danger" ng-show="dogNotesTile.error">\n' +
        '    Error loading notes\n' +
        '  </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('dogs/previoushomes/previoushomestile.html',
        '<bb-tile bb-tile-header="\'Previous homes\'">\n' +
        '  <bb-tile-header-content ng-show="dogPreviousHomesTile.previousHomes.length">\n' +
        '      {{ dogPreviousHomesTile.previousHomes.length }}\n' +
        '  </bb-tile-header-content>\n' +
        '  <div>\n' +
        '    <div ng-show="dogPreviousHomesTile.previousHomes">\n' +
        '      <div ng-switch="dogPreviousHomesTile.previousHomes.length || 0">\n' +
        '        <div bb-tile-section ng-switch-when="0" class="bb-no-records">\n' +
        '          This dog has no previous homes.\n' +
        '        </div>\n' +
        '        <div ng-switch-default class="bb-repeater">\n' +
        '          <div ng-repeat="previousHome in dogPreviousHomesTile.previousHomes" class="clearfix bb-repeater-item">\n' +
        '            <h4 class="pull-left">\n' +
        '              <a ng-href="{{ previousHome.constituentId | barkConstituentUrl }}" target="_blank">\n' +
        '                {{ previousHome.constituent.name }}\n' +
        '              </a>\n' +
        '            </h4>\n' +
        '            <h5 class="pull-right">\n' +
        '              {{ dogPreviousHomesTile.getSummaryDate(previousHome.fromDate) }}\n' +
        '              <span ng-show="previousHome.toDate">\n' +
        '                to {{ dogPreviousHomesTile.getSummaryDate(previousHome.toDate) }}\n' +
        '              </span>\n' +
        '            </h5>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div bb-tile-section class="text-danger" ng-show="dogPreviousHomesTile.error">\n' +
        '    Error loading previous homes.\n' +
        '  </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('index.html',
        '<!DOCTYPE html>\n' +
        '<html xmlns="http://www.w3.org/1999/xhtml" ng-app="barkbaud">\n' +
        '\n' +
        '<head>\n' +
        '  <title>Barkbaud</title>\n' +
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">\n' +
        '  <link rel="icon" type="image/png" href="images/favicon.ico">\n' +
        '  <link rel="stylesheet" type="text/css" href="https://sky.blackbaudcdn.net/skyux/1.19.1/css/sky-bundle.css">\n' +
        '  <link rel="stylesheet" type="text/css" href="css/app.css">\n' +
        '</head>\n' +
        '\n' +
        '<body ng-controller="MainController as mainController">\n' +
        '  <bb-navbar>\n' +
        '    <div class="container-fluid">\n' +
        '      <ul class="nav navbar-nav navbar-left">\n' +
        '        <li ui-sref-active="bb-navbar-active">\n' +
        '          <a ui-sref="dashboard">Dashboard</a>\n' +
        '        </li>\n' +
        '      </ul>\n' +
        '      <ul class="nav navbar-nav navbar-right">\n' +
        '        <li>\n' +
        '          <a ng-click="mainController.logout()">Logout</a>\n' +
        '        </li>\n' +
        '      </ul>\n' +
        '    </div>\n' +
        '  </bb-navbar>\n' +
        '  <div ui-view></div>\n' +
        '  <script src="https://sky.blackbaudcdn.net/skyux/1.19.1/js/sky-bundle.min.js"></script>\n' +
        '  <script src="js/app.min.js"></script>\n' +
        '</body>\n' +
        '</html>\n' +
        '');
    $templateCache.put('login/loginpage.html',
        '<bb-modal>\n' +
        '  <div class="modal-form modal-authorize">\n' +
        '    <bb-modal-header>Barkbaud</bb-modal-header>\n' +
        '    <div bb-modal-body>\n' +
        '      <p class="alert alert-danger" ng-if="loginPage.error" ng-switch="loginPage.error">\n' +
        '        <span ng-switch-when="access_denied">\n' +
        '          Barkbaud requires access to RENXT.\n' +
        '        </span>\n' +
        '        <span ng-switch-default>\n' +
        '          An unknown error has occurred.\n' +
        '        </span>\n' +
        '      </p>\n' +
        '      <p>Welcome to the Barkbaud Sample App.  This demo was built to showcase the Blackbaud SKY API and Blackbaud Sky UX.</p>\n' +
        '      <p>Click the Login button below to view the demo, or click the Learn More button below to visit the GitHub repo.</p>\n' +
        '    </div>\n' +
        '    <bb-modal-footer>\n' +
        '      <div ng-show="loginPage.waitingForAuth">\n' +
        '        <i class="fa fa-2x fa-spin fa-spinner" ></i> Checking authentication...\n' +
        '      </div>\n' +
        '      <div ng-hide="loginPage.waitingForAuth">\n' +
        '        <bb-modal-footer-button-primary  ng-click="loginPage.login()">\n' +
        '          Login with Blackbaud\n' +
        '        </bb-modal-footer-button-primary>\n' +
        '        <a href="https://github.com/blackbaud/barkbaud" target="_blank" class="btn bb-btn-secondary">\n' +
        '          Learn More\n' +
        '        </a>\n' +
        '      </div>\n' +
        '    </bb-modal-footer>\n' +
        '  </div>\n' +
        '</bb-modal>\n' +
        '');
}]);

//# sourceMappingURL=app.js.map