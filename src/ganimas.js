// Filename: ganimas.js  
// Timestamp: 2017.03.20-10:57:02 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

const gani = require('gani'),

      ganimas_cfg = require('./ganimas_cfg');

gani.init(ganimas_cfg, {
  baseurl : window.location.origin,
  
  iso_getfn : (sess, cfg, isoname, fn) => {
    fn(null, {
      page : "pgls",
      name : "main",
      child : [{
        page : "pglabel",
        name : "statictitle",
        subject : [{
          label : 'hello world'
        }]
      },{
        page : "pglabel",
        name : "date",
        subject : [{
          type : "fn",
          fnname : "getdate",
          options : { type : 'now' },
          name : "label"
        }]
      },{
        page : "pglabel",
        name : "width",
        subject : [{          
          type : "fn",
          fnname : "getclientwidth",
          name : "label"
        }]
      }]
    });
  }
});


