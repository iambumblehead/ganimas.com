// Filename: ganimas.js  
// Timestamp: 2017.03.20-01:49:36 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  

const gani = require('gani'),

      ganimas_cfg = require('./ganimas_cfg');

gani.init(ganimas_cfg, {
  baseurl : window.location.origin,
  
  iso_getfn : (sess, cfg, isoname, fn) => {
    //fn(null, '');
    fn(null, {
      //name : "/main",
      name : "main",
      page : "pglabel",
      subject : [{
        label : 'hello world'
      }]
    });
  }

  //sess_initfn : (sessopts, cfg, fn) => {
    // initialize session
  //  fn(null, sessopts);
  //},
      
  //cache_set : (sess, cfg, key, val) => 
  //  val,

  //cache_get : (sess, cfg, key, val) => 
  //  val      
});

  

//console.log('hello world');
