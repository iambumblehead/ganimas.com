// Filename: ganimas.js  
// Timestamp: 2017.03.20-02:30:26 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

const gani = require('gani'),

      ganimas_cfg = require('./ganimas_cfg');

gani.init(ganimas_cfg, {
  baseurl : window.location.origin,
  
  iso_getfn : (sess, cfg, isoname, fn) => {
    fn(null, {
      name : "main",
      page : "pglabel",
      subject : [{
        label : 'hello world'
      }]
    });
  }
});


