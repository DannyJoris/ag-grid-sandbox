(function() {
  if (window.fin) {
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://cdn.openfin.co/release/runtime/stable/openfin-runtime.js';
  script.async = true;
  script.onload = function() {
    window.fin = window.OpenFin;
  };
  document.head.appendChild(script);
})();