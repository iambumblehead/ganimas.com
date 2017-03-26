// Filename: ganimas_cfg.js  
// Timestamp: 2017.03.26-02:01:01 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>


const pglabel = require('gani/src/basic/pglabel'),
      pgtext = require('gani/src/basic/pgtext'),
      pgls = require('gani/src/basic/pgls'),

      ganimas_cb = require('./ganimas_cb'),
      ganimas_fn = require('./ganimas_fn');

module.exports = {
  lang : 'eng',
  locale : 'US',
  //specpath : './spec/view/',
  specpath : '',
  
  specfn : ganimas_fn,
  speccb : ganimas_cb,  
  
  pages : [
    pglabel,
    pgtext,
    pgls
  ],
  canvas : [
    //'root'
    '/spec/view/main'
  ]
};
