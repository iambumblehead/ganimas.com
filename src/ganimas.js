// Filename: ganimas.js  
// Timestamp: 2017.03.23-15:54:36 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

const gani = require('gani'),

      ganimas_cfg = require('./ganimas_cfg');

gani.init(ganimas_cfg, {
  baseurl : window.location.origin,
  
  iso_getfn : (sess, cfg, isoname, fn) => {
    var request = new XMLHttpRequest();

    request.open('GET', cfg.iso_getonpath(isoname), true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        fn(null, JSON.parse(request.responseText));
      }
    };
    request.send();
  }
});


