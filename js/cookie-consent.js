(function() {
  'use strict';

  var CONSENT_KEY = 'graund_cookie_consent';
  var METRIKA_ID = 107083651;

  function getConsent() {
    return localStorage.getItem(CONSENT_KEY);
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
  }

  function loadMetrika() {
    if (window.yaCounterLoaded) return;
    window.yaCounterLoaded = true;

    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) return;
      }
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],
      k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=" + METRIKA_ID, "ym");

    ym(METRIKA_ID, "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true
    });
  }

  function showBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.add('cookie-consent--visible');
    }
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('cookie-consent--visible');
      banner.classList.add('cookie-consent--hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var consent = getConsent();

    if (consent === 'accepted') {
      loadMetrika();
    } else if (!consent) {
      showBanner();
    }

    var acceptBtn = document.getElementById('cookie-accept');
    var rejectBtn = document.getElementById('cookie-reject');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        setConsent('accepted');
        hideBanner();
        loadMetrika();
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', function() {
        setConsent('rejected');
        hideBanner();
      });
    }
  });
})();
